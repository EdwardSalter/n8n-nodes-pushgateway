/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { expect, test } from 'vitest';
import { createPrometheusText } from '../nodes/Pushgateway/utils';
import { Label, Metric } from '../nodes/Pushgateway/types';

test('metrics without help or labels are formatted correctly', () => {
	const metrics: Metric[] = [
		{
			name: 'metric_1',
			value: 1,
			type: 'gauge',
			help: undefined,
		},
	];

	const output = createPrometheusText(metrics);
	expect(output).toBe(`# TYPE metric_1 gauge
metric_1 1
`);
});

test('metrics with help and no labels are formatted correctly', () => {
	const metrics: Metric[] = [
		{
			name: 'metric_1',
			value: 1,
			type: 'gauge',
			help: 'Metric 1',
		},
	];

	const output = createPrometheusText(metrics);
	expect(output).toBe(`# HELP metric_1 Metric 1
# TYPE metric_1 gauge
metric_1 1
`);
});

test('metrics with help and labels are formatted correctly', () => {
	const metrics: Metric[] = [
		{
			name: 'metric_1',
			value: 1,
			type: 'gauge',
			help: 'Metric 1',
			labels: { label: [{ name: 'label', value: 'value' }] },
		},
	];

	const output = createPrometheusText(metrics);
	expect(output).toBe(`# HELP metric_1 Metric 1
# TYPE metric_1 gauge
metric_1{label="value"} 1
`);
});

test('global labels should be included in all metrics', () => {
	const metrics: Metric[] = [
		{
			name: 'metric_1',
			value: 1,
			type: 'gauge',
			help: 'Metric 1',
			labels: { label: [{ name: 'local_label_1', value: 'one' }] },
		},
		{
			name: 'metric_2',
			value: 2,
			type: 'counter',
			help: 'Metric 2',
			labels: { label: [{ name: 'local_label_2', value: 'two' }] },
		},
	];
	const globalLabels: Label[] = [
		{ name: 'global_label1', value: 'g1' },
		{ name: 'global_label2', value: 'g2' },
	];

	const output = createPrometheusText(metrics, globalLabels);
	expect(output).toBe(`# HELP metric_1 Metric 1
# TYPE metric_1 gauge
metric_1{global_label1="g1",global_label2="g2",local_label_1="one"} 1
# HELP metric_2 Metric 2
# TYPE metric_2 counter
metric_2{global_label1="g1",global_label2="g2",local_label_2="two"} 2
`);
});

test('local labels should on a metric should override a global metric with the same name', () => {
	const metrics: Metric[] = [
		{
			name: 'metric_1',
			value: 1,
			type: 'gauge',
			help: 'Metric 1',
			labels: { label: [{ name: 'label', value: 'local' }] },
		},
	];
	const globalLabels: Label[] = [{ name: 'label', value: 'global' }];

	const output = createPrometheusText(metrics, globalLabels);
	expect(output).toBe(`# HELP metric_1 Metric 1
# TYPE metric_1 gauge
metric_1{label="local"} 1
`);
});
