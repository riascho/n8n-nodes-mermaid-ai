import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { balanceDescription } from './resources/balance';
import { diagramDescription } from './resources/diagram';

export class MermaidAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mermaid AI',
		name: 'mermaidAi',
		icon: { light: 'file:mermaidAi.svg', dark: 'file:mermaidAi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Validate, render, generate and repair Mermaid diagrams with the Mermaid API',
		defaults: {
			name: 'Mermaid AI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mermaidAiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.mermaid.ai/v1',
			headers: {
				// Makes Render answer with a JSON envelope instead of raw bytes
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// Every operation runs throwOnApiError to surface the API's own error message
			ignoreHttpStatusErrors: true,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Balance',
						value: 'balance',
					},
					{
						name: 'Diagram',
						value: 'diagram',
					},
				],
				default: 'diagram',
			},
			...balanceDescription,
			...diagramDescription,
		],
	};
}
