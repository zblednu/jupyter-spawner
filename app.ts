import express from 'express';
import Docker from 'dockerode';

const app = express();
const docker = new Docker();

const containerOptions: Docker.ContainerCreateOptions = {
	Image: 'quay.io/jupyter/base-notebook',
	ExposedPorts: {
		'8888/tcp': {}
	},
	HostConfig: {
		PortBindings: {
			'8888/tcp': [{ HostPort: '8888' }]
		}
	},
	Cmd: ['start-notebook.py', '--NotebookApp.token=\'mytoken\'']
};

async function createJupyterSession() {
	const container = await docker.createContainer(containerOptions)
	await container.start();
	console.log('live!');
}

createJupyterSession();

