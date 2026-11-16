import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserGet = {
	operation: ['get'],
	resource: ['user'],
};

export const balanceGetDescription: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: { show: showOnlyForUserGet },
		default: '',
		description: "The user's ID to retrieve",
	},
];
