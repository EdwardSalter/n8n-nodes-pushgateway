import { Label, Metric } from './types';
import { LoggerProxy } from 'n8n-workflow';

export function createPrometheusText(metrics: Metric[], globalLabels: Label[] = []) {
	let body = '';
	for (const m of metrics) {
		if (m.name && m.value !== undefined) {
			if (m.help) {
				body += `# HELP ${m.name} ${m.help}\n`;
			}

			body += `# TYPE ${m.name} ${m.type}\n`;


			let labelsString = '';
			const localLabels = m.labels?.label ?? [];

			const labels = new Map();
			globalLabels.forEach((l) => labels.set(l.name, l.value));
			localLabels.forEach((l) => labels.set(l.name, l.value));

			const labelsArray = Array.from(labels.entries());
			const labelsPart = labelsArray.map(([name, value]) => `${name}="${value}"`).join(',');
			if (labelsPart) {
				labelsString = `{${labelsPart}}`;
			}

			body += `${m.name}${labelsString} ${m.value}\n`;
		}
	}
	LoggerProxy.info('Request Body: ' + body + '!!!!!!!');
	return body;
}