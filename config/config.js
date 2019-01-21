import path from 'path';

const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		root: rootPath,
		app: {
			name: 'mts-server'
		},
		dataPath: rootPath + '/../data/results.csv',
		beginPath: rootPath + '/../data/begin.txt',
		port: 3001,
	},

	test: {
		root: rootPath,
		app: {
			name: 'mts-server'
		},
		dataPath: rootPath + '/data/results.csv',
		beginPath: rootPath + '/../data/begin.txt',
		port: 3001,
	},

	production: {
		root: rootPath,
		app: {
			name: 'mts-server'
		},
		dataPath: rootPath + '/data/results.csv',
		beginPath: rootPath + '/../data/begin.txt',
		port: 3001,
	}
};

module.exports = config[env];
