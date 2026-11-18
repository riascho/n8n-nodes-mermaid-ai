import type { INodeProperties } from 'n8n-workflow';
import { throwOnApiError } from '../../shared/transport';

const showOnlyForBalance = {
	resource: ['balance'],
};

export const balanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForBalance,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get the credit balance',
				description: 'Get the API credits left this month and what each operation costs',
				routing: {
					request: {
						method: 'GET',
						url: '/balance',
					},
					output: {
						postReceive: [throwOnApiError],
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: {
			show: { ...showOnlyForBalance, operation: ['get'] },
		},
		routing: {
			output: {
				postReceive: [
					{
						type: 'setKeyValue',
						enabled: '={{ $value }}',
						properties: {
							ownerType: '={{ $responseItem.ownerType }}',
							month: '={{ $responseItem.month }}',
							allowance: '={{ $responseItem.allowance }}',
							spent: '={{ $responseItem.spent }}',
							remaining: '={{ $responseItem.remaining }}',
							purchasedRemaining: '={{ $responseItem.purchased?.remaining ?? 0 }}',
							resetAt: '={{ $responseItem.resetAt }}',
						},
					},
				],
			},
		},
	},
];
