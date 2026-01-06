import {
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	LoggerProxy,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { Label, Metric, MetricParameter } from './types';
import { createPrometheusText } from './utils';

const labelCollection = {
	displayName: 'Metric Labels',
	name: 'labels',
	type: 'fixedCollection',
	placeholder: 'Add Label',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'label',
			displayName: 'Label',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
				},
			],
		},
	],
} satisfies INodeProperties;

// noinspection JSUnusedGlobalSymbols
export class Pushgateway implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pushgateway',
		name: 'pushgateway',
		icon: 'file:../../icons/prometheus.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{ "Job: " + $parameter["job"] }}',
		description: 'Push metrics to Prometheus Pushgateway',
		defaults: {
			name: 'Pushgateway',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'pushgatewayApi',
				required: true,
			},
		],

		requestDefaults: {
			baseURL: '={{$credentials?.domain}}',
			// baseURL: 'https://webhook.site/303cb656-33af-4ea4-951f-97f3f3594429',
			method: 'POST',
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'text/plain',
			},
		},
		properties: [
			{
				displayName: 'Job',
				name: 'job',
				type: 'string',
				default: '',
				required: true,
				routing: {
					request: {
						url: '=/metrics/job/{{$parameter.job}}',
					},
				},
			},
			{
				displayName: 'Instance',
				name: 'instance',
				type: 'string',
				default: '',
				description: 'Instance label for the job',
				routing: {
					request: {
						url: '={{$parameter.instance ? `/metrics/job/${$parameter.job}/instance/${$parameter.instance}` : `/metrics/job/${$parameter.job}`}}',
					},
				},
			},
			{
				displayName: 'Overwrite Entire Metrics',
				name: 'overwrite',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const overwrite = this.getNodeParameter('overwrite', 0) as boolean;
								requestOptions.method = overwrite ? 'PUT' : 'POST';
								return requestOptions;
							},
						],
					},
				},
			},
			{
				...labelCollection,
				displayName: 'Global Labels',
				name: 'globalLabels',
			},
			{
				displayName: 'Metrics',
				name: 'metrics',
				type: 'fixedCollection',
				placeholder: 'Add Metric',
				default: [],
				typeOptions: {
					multipleValues: true,
				},
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								LoggerProxy.info('Request Options: ' + JSON.stringify(requestOptions) + '!!!!!!!');
								const metrics = this.getNodeParameter('metrics', 0) as MetricParameter;
								const globalLabelsParam = this.getNodeParameter('globalLabels', 0) as {
									label: Array<Label>;
								};

								if (metrics && metrics.metric) {
									requestOptions.body = createPrometheusText(
										metrics.metric,
										globalLabelsParam?.label,
									);
								}

								return requestOptions;
							},
						],
					},
				},
				options: [
					{
						name: 'metric',
						displayName: 'Metric',
						values: [
							{
								displayName: 'Metric Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Help',
								name: 'help',
								type: 'string',
								default: '',
								description:
									'Help text for the metric. Will be added as a comment before the metric definition.',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'Gauge',
										value: 'gauge',
									},
									{
										name: 'Counter',
										value: 'counter',
									},
									// {
									// 	name: 'Histogram',
									// 	value: 'histogram',
									// },
									// {
									// 	name: 'Summary',
									// 	value: 'summary',
									// },
								],
								default: 'gauge',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'number',
								default: '',
							},
							labelCollection,
						],
					},
				],

				// TODO: ADD SUPPORT FOR TOP-LEVEL LABELS
			},
		],
		usableAsTool: true,
	};
}
