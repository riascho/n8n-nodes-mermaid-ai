import type { INodeProperties } from 'n8n-workflow';
import { balanceGetDescription } from './get';

const showOnlyForUsers = {
	resource: ['user'],
};

export const balanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
				routing: {
					request: {
						method: 'GET',
						url: '=/users/{{ toPathSegment($parameter.userId) }}',
					},
				},
			},
		],
		default: 'get',
	},
	...balanceGetDescription,
];
