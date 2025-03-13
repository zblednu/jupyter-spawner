import Docker from 'dockerode'
const docker = new Docker();

const containers: Docker.Container[] = [];
let nextFreePort = 8888;

function generateOptions() {
	return {
		Image: 'quay.io/jupyter/base-notebook',
		ExposedPorts: {
			'8888/tcp': {}
		},
		HostConfig: {
			PortBindings: {
				'8888/tcp': [{ HostPort: `${nextFreePort}` }]
			},
			AutoRemove: true
		},
		Cmd: ['start-notebook.py', '--NotebookApp.token=\'token\'']
	};
}

export default async function spawnJupyter() {
	const options = generateOptions()
	const container = await docker.createContainer(options)
	containers.push(container);
	await container.start();
	return nextFreePort++;
}

process.on('SIGINT', async () => {
	const promiseQueue = containers.map(container => container.stop());

	Promise.all(promiseQueue)
		.then(() => process.exit(0))
});
