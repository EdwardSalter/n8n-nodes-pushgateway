export interface Label {
	name: string;
	value: string;
}

export interface Metric {
	name: string;
	help?: string;
	type: string;
	value: number;
	labels?: {
		label: Array<Label>;
	};
}

export interface MetricParameter {
	metric: Array<Metric>;
}
