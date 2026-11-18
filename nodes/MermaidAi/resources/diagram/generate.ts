import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

const showOnlyForDiagramGenerate = {
	resource: ['diagram'],
	operation: ['generate'],
};

const diagramTypes: INodePropertyOptions[] = [
	{ name: 'Architecture', value: 'architecture' },
	{ name: 'Block', value: 'block' },
	{ name: 'C4', value: 'c4' },
	{ name: 'Class', value: 'class' },
	{ name: 'Cynefin', value: 'cynefin' },
	{ name: 'Entity Relationship', value: 'er' },
	{ name: 'Event Modeling', value: 'eventmodeling' },
	{ name: 'Flowchart', value: 'flowchart' },
	{ name: 'Gantt', value: 'gantt' },
	{ name: 'Git Graph', value: 'gitgraph' },
	{ name: 'Ishikawa', value: 'ishikawa' },
	{ name: 'Kanban', value: 'kanban' },
	{ name: 'Mindmap', value: 'mindmap' },
	{ name: 'Packet', value: 'packet' },
	{ name: 'Pie', value: 'pie' },
	{ name: 'Quadrant', value: 'quadrant' },
	{ name: 'Radar', value: 'radar' },
	{ name: 'Requirement', value: 'requirement' },
	{ name: 'Sankey', value: 'sankey' },
	{ name: 'Sequence', value: 'sequence' },
	{ name: 'State', value: 'state' },
	{ name: 'Swimlanes', value: 'swimlanes' },
	{ name: 'Timeline', value: 'timeline' },
	{ name: 'Treemap', value: 'treemap' },
	{ name: 'Treeview', value: 'treeview' },
	{ name: 'User Journey', value: 'journey' },
	{ name: 'Venn', value: 'venn' },
	{ name: 'Wardley', value: 'wardley' },
	{ name: 'XY Chart', value: 'xychart' },
];

export const diagramGenerateDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		placeholder: 'e.g. Alice says hello to Bob, as a sequence diagram',
		description: 'What the diagram should show, in plain language, up to 10,000 characters',
		displayOptions: { show: showOnlyForDiagramGenerate },
		routing: { send: { type: 'body', property: 'prompt' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDiagramGenerate },
		options: [
			{
				displayName: 'Diagram Type',
				name: 'diagramType',
				type: 'options',
				options: diagramTypes,
				default: 'flowchart',
				description: 'The type of diagram to draw. If not set, Mermaid AI picks one.',
				routing: { send: { type: 'body', property: 'diagramType' } },
			},
			{
				displayName: 'Semantic Coloring',
				name: 'semanticColoring',
				type: 'boolean',
				default: false,
				description:
					'Whether to group the nodes by role and color each role from the Mermaid palette',
				routing: { send: { type: 'body', property: 'semanticColoring' } },
			},
		],
	},
];
