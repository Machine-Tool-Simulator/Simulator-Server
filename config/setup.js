import bodyParser from 'body-parser';
import logger from 'morgan';
import glob from 'glob';
import favicon from 'serve-favicon';
import fs from 'fs';
import mongodb from 'mongodb';
let MongoClient = mongodb.MongoClient;

const CONSTANTS = require('../config/constants');

let client, server;

module.exports = function (app, config) {
	app.use(logger('dev'));

	// connect to databse
	let url = config.db;
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, database) {
		if (err) {
			console.error(err.message);
			return;
		} else {
			const env = process.env.NODE_ENV || 'development';
			client = database;
			const db = client.db(env);

			// insert status collection
			db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
				name: 'status'
			}, function (err, doc) {
				if (err) {
					console.error(err);
				} else if (!doc) {
					db.collection(CONSTANTS.COLLECTION.STATUS).insertOne({
						name: 'status',
						running: true
					}, (err) => {
						if (err) {
							console.error(err);
							client.close();
							server.close();
							process.exit(0);
						}
					});
				}
			});

			const controllers = glob.sync(config.root + '/controllers/*.js');
			controllers.forEach(controller => {
				require(controller)(app, db);
				// import {default as func} from controller

				console.log('\n' + '>> Deployed controller: ' + controller);		// eslint-disable-line no-console
				// This means "for each controller file, load that file using require, then
				// call the default function that's exported, with app as a parameter.
				// Those default functions just say 'hey app, use these routes.'"
			});

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({
				extended: true
			}));

			// external module for handling favourite icon
			app.use(favicon(__dirname + '/../public/img/favicon.ico'));

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
				console.error(err);
				res.status(err.status || 500);
				res.json({ error: err.message });
				next(err);
			});


			// listening on port 3000
			server = app.listen(3000, function () {
				console.log('\nServer listening on port 3000...\n');		// eslint-disable-line no-console
			});
		}
	});

	// when ^C is pressed
	process.on('SIGINT', function () {
		const readline = require('readline');
		readline.clearLine(process.stdout, 0);

		console.log('\nDisconnecting from database...');	// eslint-disable-line no-console
		client.close();

		console.log('Killing server...');	// eslint-disable-line no-console
		server.close();

		console.log('Bye!');	// eslint-disable-line no-console
		process.exit(0);
	});
};
