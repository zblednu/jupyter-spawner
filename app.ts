import express from 'express';
import Docker from 'dockerode';

const app = express();
const docker = new Docker();

let nextFreePort = 8888;
const containers: Docker.Container[] = [];

process.on('SIGINT', async () => {
	const promiseQueue = [];
	for (const container of containers) {
		promiseQueue.push(container.stop());
	}
	Promise.all(promiseQueue)
		.then(() => {
			console.log('boom');
			process.exit(0)
		})
});

function createOptions() {
	return {
		Image: 'quay.io/jupyter/base-notebook',
		ExposedPorts: {
			'8888/tcp': {}
		},
		HostConfig: {
			PortBindings: {
				'8888/tcp': [{ HostPort: `${nextFreePort++}` }]
			},
			AutoRemove: true
		},
		Cmd: ['start-notebook.py', '--NotebookApp.token=\'token\'']
	};
}

async function createJupyterSession() {
	const options = createOptions()
	const container = await docker.createContainer(options)
	containers.push(container);
	await container.start();
}


app.get('/', async (_, res) => {
	const redirectTo = `http://localhost:${nextFreePort}/?token=token`;
	await createJupyterSession();
	setTimeout(() => res.redirect(redirectTo), 3000);
})

app.listen(3000, () => console.log('listenng'));
