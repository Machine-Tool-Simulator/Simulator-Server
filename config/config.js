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
		port: 3000,
	},

	test: {
		root: rootPath,
		app: {
			name: 'mts-server'
		},
		dataPath: rootPath + '/data/results.csv',
		port: 3000,
	},

	production: {
		root: rootPath,
		app: {
			name: 'mts-server'
		},
		dataPath: rootPath + '/data/results.csv',
		port: 3000,
	}
};

module.exports = config[env];
