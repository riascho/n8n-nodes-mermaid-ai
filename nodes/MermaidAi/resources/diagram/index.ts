import type { INodeProperties } from 'n8n-workflow';
import { pinAsciiVersion, renderToBinary, throwOnApiError } from '../../shared/transport';
import { diagramGenerateDescription } from './generate';
import { diagramRenderDescription } from './render';
import { diagramRepairDescription } from './repair';
import { diagramValidateDescription } from './validate';

const showOnlyForDiagram = {
	resource: ['diagram'],
};

export const diagramDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForDiagram,
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				action: 'Generate a diagram from a description',
				description: 'Use Mermaid AI to write diagram code from a description (25 credits)',
				routing: {
					request: {
						method: 'POST',
						url: '/generate',
					},
					output: {
						postReceive: [throwOnApiError],
					},
				},
			},
			{
				name: 'Render',
				value: 'render',
				action: 'Render a diagram',
				description: 'Render diagram code to an SVG, PNG, PDF or text file (5 credits)',
				routing: {
					request: {
						method: 'POST',
						url: '/render',
					},
					send: {
						preSend: [pinAsciiVersion],
					},
					output: {
						postReceive: [throwOnApiError, renderToBinary],
					},
				},
			},
			{
				name: 'Repair',
				value: 'repair',
				action: 'Repair a diagram',
				description: 'Use Mermaid AI to fix invalid diagram code (25 credits)',
				routing: {
					request: {
						method: 'POST',
						url: '/repair',
					},
					output: {
						postReceive: [throwOnApiError],
					},
				},
			},
			{
				name: 'Validate',
				value: 'validate',
				action: 'Validate a diagram',
				description: 'Check whether diagram code is valid and where it breaks (1 credit)',
				routing: {
					request: {
						method: 'POST',
						url: '/validate',
					},
					output: {
						postReceive: [throwOnApiError],
					},
				},
			},
		],
		default: 'render',
	},
	...diagramGenerateDescription,
	...diagramRenderDescription,
	...diagramRepairDescription,
	...diagramValidateDescription,
];
