import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { balanceDescription } from './resources/balance';
import { diagramDescription } from './resources/diagram';

export class MermaidAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mermaid Ai',
		name: 'mermaidAi',
		icon: { light: 'file:mermaidAi.svg', dark: 'file:mermaidAi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Mermaid Ai API',
		defaults: {
			name: 'Mermaid Ai',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mermaidAiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.mermaid.ai/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Diagram',
						value: 'diagram',
					},
					{
						name: 'Balance',
						value: 'balance',
					},
				],
				default: 'diagram',
			},
			...balanceDescription,
			...diagramDescription,
		],
	};
}
