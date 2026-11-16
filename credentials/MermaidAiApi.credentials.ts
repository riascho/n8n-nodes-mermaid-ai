import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MermaidAiApi implements ICredentialType {
	name = 'mermaidAiApi';

	displayName = 'Mermaid Ai API';

	// Link to your community node's README
	documentationUrl =
		'https://github.com/riascho/n8n-nodes-mermaid-ai?tab=readme-ov-file#credentials';
	icon = 'file:mermaidAi.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.mermaid.ai/v1',
			url: '/balance',
		},
	};
}
