import type { INodeProperties } from 'n8n-workflow';
import { sendMermaidConfig } from './transport';

export function diagramCodeField(operation: string, description: string): INodeProperties {
	return {
		displayName: 'Code',
		name: 'code',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		placeholder: 'e.g. flowchart TD\n  A[Start] --> B[Done]',
		description,
		displayOptions: { show: { resource: ['diagram'], operation: [operation] } },
		routing: { send: { type: 'body', property: 'code' } },
	};
}

export const mermaidConfigOption: INodeProperties = {
	displayName: 'Mermaid Config',
	name: 'mermaidConfig',
	type: 'json',
	default: '{}',
	description:
		'A standard Mermaid config object, such as theme, look or layout. The keys secure, securityLevel, startOnLoad, suppressErrorRendering and dompurifyConfig are not allowed.',
	routing: { send: { preSend: [sendMermaidConfig] } },
};

export const mermaidVersionOption: INodeProperties = {
	displayName: 'Mermaid Version',
	name: 'mermaidVersion',
	type: 'string',
	default: '',
	placeholder: 'e.g. 11.17.2',
	description:
		'The Mermaid version to use, such as 12.1.0, 11.17.2 or 13.0.0-alpha. Leave empty for the latest version.',
	routing: {
		send: {
			type: 'body',
			property: 'mermaidVersion',
			value: '={{ String($value).trim() || undefined }}',
		},
	},
};
