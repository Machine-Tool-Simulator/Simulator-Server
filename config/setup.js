import bodyParser from 'body-parser';
import logger from 'morgan';
import glob from 'glob';
import favicon from 'serve-favicon';
import fs from 'fs';
import { handleError } from '../helpers/manager';

let server;

module.exports = function (app, config) {
	app.use(logger('dev'));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.options("/*", function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
		res.send(200);
	});

	const controllers = glob.sync(config.root + '/controllers/*.js');
	controllers.forEach(controller => {
		require(controller)(app);
		// import {default as func} from controller

		console.log('\n' + '>> Deployed controller: ' + controller);		// eslint-disable-line no-console
		// This means "for each controller file, load that file using require, then
		// call the default function that's exported, with app as a parameter.
		// Those default functions just say 'hey app, use these routes.'"
	});

	// external module for handling favourite icon
	app.use(favicon(__dirname + '/../public/imgs/favicon.ico'));

	// view engine
	app.set('views', config.root + '/public/views');
	app.set('view engine', 'pug');

	// middleware for handling file downloads
	app.get('*', function (req, res, next) {
		if (fs.existsSync(config.root + req.url)) {
			let file = config.root + req.url;
			res.download(file);
		} else {
			const err = new Error('Not Found');
			res.status(404);
			next(err);
		}
	});

	// middlewares for handling uncaught errors
	app.use((req, res, next) => {
		const err = new Error('Not Found');
		res.status(404);
		next(err);
	});

	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({ error: err.message });
		next(err);
	});


	server = app.listen(config.port, function () {
		console.log(`\nServer listening on port ${config.port}...\n`);		// eslint-disable-line no-console
	});

	// when ^C is pressed
	process.on('SIGINT', function () {
		const readline = require('readline');
		readline.clearLine(process.stdout, 0);

		console.log('Killing server...');	// eslint-disable-line no-console
		server.close();

		console.log('Bye!');	// eslint-disable-line no-console
		process.exit(0);
	});
};
