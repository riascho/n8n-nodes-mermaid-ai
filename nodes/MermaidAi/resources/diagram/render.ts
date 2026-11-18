import type { INodeProperties } from 'n8n-workflow';
import {
	diagramCodeField,
	mermaidConfigOption,
	mermaidVersionOption,
} from '../../shared/descriptions';

const showOnlyForDiagramRender = {
	resource: ['diagram'],
	operation: ['render'],
};

export const diagramRenderDescription: INodeProperties[] = [
	diagramCodeField('render', 'The Mermaid diagram code to render'),
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		required: true,
		options: [
			{
				name: 'ASCII (Experimental)',
				value: 'ascii',
				description:
					'The diagram as plain text. Uses Mermaid 13.0.0-alpha, which cannot draw every diagram type as text.',
			},
			{ name: 'PDF', value: 'pdf' },
			{ name: 'PNG', value: 'png' },
			{ name: 'SVG', value: 'svg' },
		],
		default: 'svg',
		description: 'The file format to render the diagram in',
		displayOptions: { show: showOnlyForDiagramRender },
		routing: { send: { type: 'body', property: 'format' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForDiagramRender },
		options: [
			{
				displayName: 'Background',
				name: 'background',
				type: 'string',
				default: 'white',
				placeholder: 'e.g. transparent',
				description:
					'The color behind the diagram: transparent, a CSS color name, a hex value, or an rgb() or hsl() value',
				displayOptions: { show: { '/format': ['png'] } },
				routing: { send: { type: 'body', property: 'png.background' } },
			},
			{
				displayName: 'Character Set',
				name: 'charset',
				type: 'options',
				options: [
					{ name: 'ASCII', value: 'ascii', description: '7-bit characters only' },
					{ name: 'Unicode', value: 'unicode', description: 'Box-drawing characters' },
				],
				default: 'unicode',
				description: 'The characters to draw the diagram with',
				displayOptions: { show: { '/format': ['ascii'] } },
				routing: { send: { type: 'body', property: 'ascii.charset' } },
			},
			{
				displayName: 'Fit Page to Diagram',
				name: 'fit',
				type: 'boolean',
				default: true,
				description:
					'Whether to size the page to the diagram. If off, the diagram is scaled down to fit one A4 page.',
				displayOptions: { show: { '/format': ['pdf'] } },
				routing: { send: { type: 'body', property: 'pdf.fit' } },
			},
			{
				displayName: 'Max Width',
				name: 'maxWidth',
				type: 'number',
				typeOptions: { minValue: 20, maxValue: 1000 },
				default: 80,
				description: 'The number of columns the text should fit in, from 20 to 1000',
				displayOptions: { show: { '/format': ['ascii'] } },
				routing: { send: { type: 'body', property: 'ascii.maxWidth' } },
			},
			mermaidConfigOption,
			{
				...mermaidVersionOption,
				description:
					'The Mermaid version to use, such as 12.1.0 or 11.17.2. Leave empty for the latest version.',
				displayOptions: { hide: { '/format': ['ascii'] } },
			},
			{
				displayName: 'Padding',
				name: 'padding',
				type: 'options',
				options: [
					{ name: 'Compact', value: 'compact' },
					{ name: 'Roomy', value: 'roomy' },
				],
				default: 'compact',
				description: 'The space around labels and between nodes',
				displayOptions: { show: { '/format': ['ascii'] } },
				routing: { send: { type: 'body', property: 'ascii.padding' } },
			},
			{
				displayName: 'Put Output File in Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				hint: 'The name of the output binary field to put the file in',
			},
			{
				displayName: 'Scale',
				name: 'scale',
				type: 'number',
				typeOptions: { minValue: 0.5, maxValue: 4, numberPrecision: 2 },
				default: 2,
				description: 'Device pixels per CSS pixel, from 0.5 to 4',
				displayOptions: { show: { '/format': ['png'] } },
				routing: { send: { type: 'body', property: 'png.scale' } },
			},
			{
				displayName: 'Use Cache',
				name: 'cache',
				type: 'boolean',
				default: true,
				description:
					'Whether to use the shared 24-hour render cache. A cached render costs the same credits.',
				routing: { send: { type: 'body', property: 'cache' } },
			},
		],
	},
];
