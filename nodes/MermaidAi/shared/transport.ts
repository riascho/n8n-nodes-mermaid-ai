import {
	jsonParse,
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type IExecuteSingleFunctions,
	type IHttpRequestOptions,
	type IN8nHttpFullResponse,
	type INodeExecutionData,
	type JsonObject,
} from 'n8n-workflow';

/** The only Mermaid version the API can render as ASCII text. */
export const ASCII_MERMAID_VERSION = '13.0.0-alpha';

interface MermaidApiError {
	code?: string;
	message?: string;
	details?: unknown;
}

function describeDetails(code: string | undefined, details: unknown): string | undefined {
	if (code === 'ERR_REQUEST_FORBIDDEN_CONFIG') {
		const keys = (details as { keys?: string[] } | undefined)?.keys;
		return `Remove these keys from Mermaid Config: ${(keys ?? []).join(', ')}`;
	}
	if (code === 'ERR_REQUEST_INVALID' && Array.isArray(details)) {
		return details
			.map((issue: { path?: unknown; message?: string }) => {
				const path = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? '');
				return path ? `${path}: ${issue.message}` : issue.message;
			})
			.join('\n');
	}
	if (code === 'ERR_LIMIT_BALANCE') {
		const { cause, resetAt } = (details ?? {}) as { cause?: string; resetAt?: string };
		const reason =
			cause === 'spend_limit'
				? 'The monthly spend limit set in the Mermaid API console is reached.'
				: 'The API credit balance is spent.';
		return resetAt ? `${reason} The monthly allowance resets at ${resetAt}.` : reason;
	}
	return undefined;
}

function hintFor(code: string | undefined, retryAfter: string | undefined): string | undefined {
	if (!code) return undefined;
	if (code === 'ERR_DIAGRAM_INVALID') {
		return 'Fix the diagram code, or use the Repair operation. Render still charges credits for invalid code.';
	}
	if (code === 'ERR_RENDER_FORMAT_UNSUPPORTED') {
		return 'Mermaid cannot draw this diagram type as ASCII yet. Choose another format.';
	}
	if (code.startsWith('ERR_KEY_')) {
		return 'Check the API key in the Mermaid AI API credential. You can create keys at https://api.mermaid.ai/console.';
	}
	if (code === 'ERR_LIMIT_BURST') {
		const wait = retryAfter ? `Wait ${retryAfter} seconds` : 'Wait a minute';
		return `${wait} and try again, or turn on Retry On Fail in the node settings.`;
	}
	if (/^ERR_(SERVICE|RENDER|AI)_/.test(code)) {
		return 'A retry may succeed.';
	}
	return undefined;
}

/**
 * Requests are sent with `ignoreHttpStatusErrors`, so this runs first on every
 * operation and turns a Mermaid API error body into an n8n error that shows the
 * API's own message and its stable error code.
 */
export async function throwOnApiError(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (response.statusCode < 400) return items;

	const body =
		typeof response.body === 'object' && response.body !== null && !Buffer.isBuffer(response.body)
			? (response.body as JsonObject)
			: {};
	const apiError = (body.error ?? {}) as MermaidApiError;
	const code = typeof apiError.code === 'string' ? apiError.code : undefined;
	const apiMessage =
		typeof apiError.message === 'string' && apiError.message.trim() !== ''
			? apiError.message.trim()
			: `The Mermaid API answered with status ${response.statusCode}`;

	const [firstLine, ...moreLines] = apiMessage.split('\n');
	const retryAfter = response.headers['retry-after'] as string | undefined;
	const requestId = response.headers['x-request-id'] as string | undefined;

	const description = [
		moreLines.length ? apiMessage : undefined,
		describeDetails(code, apiError.details),
		hintFor(code, retryAfter),
		requestId && response.statusCode >= 500 ? `Request ID: ${requestId}` : undefined,
	]
		.filter(Boolean)
		.join('\n\n');

	throw new NodeApiError(this.getNode(), body, {
		message: code ? `${firstLine.replace(/:$/, '')} [${code}]` : firstLine,
		description: description || undefined,
		httpCode: String(response.statusCode),
		itemIndex: this.getItemIndex(),
	});
}

function getBody(requestOptions: IHttpRequestOptions): IDataObject {
	if (typeof requestOptions.body !== 'object' || requestOptions.body === null) {
		requestOptions.body = {};
	}
	return requestOptions.body as IDataObject;
}

/**
 * Parses the "Mermaid Config" option (a JSON field) and sends it as `config`.
 * An empty object is not sent, so Mermaid's defaults apply.
 */
export async function sendMermaidConfig(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const raw = this.getNodeParameter('options.mermaidConfig', '{}') as string | IDataObject;

	let config: unknown = raw;
	if (typeof raw === 'string') {
		if (raw.trim() === '') return requestOptions;
		config = jsonParse(raw, {
			errorMessage: 'Mermaid Config is not valid JSON',
		});
	}

	if (typeof config !== 'object' || config === null || Array.isArray(config)) {
		throw new NodeOperationError(this.getNode(), 'Mermaid Config must be a JSON object', {
			description: 'For example: {"theme": "forest"}',
			itemIndex: this.getItemIndex(),
		});
	}

	if (Object.keys(config).length > 0) {
		getBody(requestOptions).config = config as IDataObject;
	}
	return requestOptions;
}

/** ASCII output only works with the Mermaid 13 alpha, so pin it whatever the user set. */
export async function pinAsciiVersion(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = getBody(requestOptions);
	if (body.format === 'ascii') {
		body.mermaidVersion = ASCII_MERMAID_VERSION;
	}
	return requestOptions;
}

/**
 * Turns the Render JSON envelope into a binary file. The base64 `content` becomes
 * the file and the rest of the envelope stays as the item's JSON.
 */
export async function renderToBinary(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const { content, ...envelope } = response.body as IDataObject;

	if (typeof content !== 'string') {
		throw new NodeOperationError(this.getNode(), 'The Mermaid API returned no file content', {
			description: 'The response did not contain the rendered diagram',
			itemIndex: this.getItemIndex(),
		});
	}

	const format = String(envelope.format ?? 'svg');
	const extension = format === 'ascii' ? 'txt' : format;
	const binaryPropertyName = this.getNodeParameter('options.binaryPropertyName', 'data') as string;

	const file = await this.helpers.prepareBinaryData(
		Buffer.from(content, 'base64'),
		`diagram.${extension}`,
		typeof envelope.contentType === 'string' ? envelope.contentType : undefined,
	);

	return items.map((item) => ({
		...item,
		json: envelope,
		binary: { ...item.binary, [binaryPropertyName]: file },
	}));
}
