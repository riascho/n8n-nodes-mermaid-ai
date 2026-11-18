import type { INodeProperties } from 'n8n-workflow';
import { diagramCodeField, mermaidConfigOption } from '../../shared/descriptions';

const showOnlyForDiagramRepair = {
	resource: ['diagram'],
	operation: ['repair'],
};

export const diagramRepairDescription: INodeProperties[] = [
	diagramCodeField(
		'repair',
		'The Mermaid diagram code to repair, up to 20,000 characters. Code that is already valid comes back unchanged.',
	),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDiagramRepair },
		options: [mermaidConfigOption],
	},
];
