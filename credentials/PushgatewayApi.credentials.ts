import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PushgatewayApi implements ICredentialType {
	name = 'pushgatewayApi';

	displayName = 'Pushgateway API';

	icon: Icon = 'file:../icons/prometheus.svg';

	documentationUrl = 'https://prometheus.io/docs/guides/basic-auth/';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'http://localhost:9091',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			typeOptions: { password: false },
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/api/v1/status',
			method: 'GET',
		},
	};
}
