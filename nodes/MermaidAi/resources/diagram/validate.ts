import type { INodeProperties } from 'n8n-workflow';
import {
	diagramCodeField,
	mermaidConfigOption,
	mermaidVersionOption,
} from '../../shared/descriptions';

const showOnlyForDiagramValidate = {
	resource: ['diagram'],
	operation: ['validate'],
};

export const diagramValidateDescription: INodeProperties[] = [
	diagramCodeField('validate', 'The Mermaid diagram code to check'),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDiagramValidate },
		options: [mermaidConfigOption, mermaidVersionOption],
	},
];
