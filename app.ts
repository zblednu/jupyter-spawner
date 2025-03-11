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
		},
		AutoRemove: true
	},
	Cmd: ['start-notebook.py', '--NotebookApp.token=\'mytoken\'']
};

async function createJupyterSession() {
	const container = await docker.createContainer(containerOptions)
	await container.start();
	console.log('live!');

	process.on('SIGINT', async () => {
		await container.stop();
		console.log('boom');
		process.exit(0)
	});
}


app.get('/', async (_, res) => {
	await createJupyterSession();
	setTimeout(() => res.redirect('http://localhost:8888/?token=mytoken'), 2000);
})

app.listen(3000, () => console.log('listenng'));
