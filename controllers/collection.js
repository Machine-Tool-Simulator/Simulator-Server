import CONSTANTS from '../config/constants';
import { handleError } from '../helpers/manager';
import csvWriter from 'csv-writer';
import config from '../config/config';
import fs from 'fs';

const NUM_PAGES = 16;

module.exports = (app) => {
	
	app.post(CONSTANTS.ROUTES.BEGIN, (req, res) => {
		if (!req.body) handleError('No data submitted', res);

		let id = req.body.id;
		let output = [];
		if (fs.existsSync(config.beginPath)) {
			let beginners = fs.readFileSync(config.beginPath).toString().split(',');
			beginners.forEach(b => {
				output.push(b);
			});
		}
		
		if (!output.includes(id)) {
			output.push(id);
		}

		fs.writeFile(config.beginPath, output, () => {});

		res.status(200).json({
			error: null,
		});
	});
	
	app.post(CONSTANTS.ROUTES.SUBMIT, (req, res) => {
		if (!req.body) handleError('No data submitted', res);

		let id = req.body.id;
		let results = req.body.results;
		
		if (results.length != NUM_PAGES) handleError('Incorrect data length', res);

		// formulate header
		let header = [
			{ id: 'id', title: 'id' },
		];
		for (let i = 1; i <= results.length; i++) {
			header.push({
				id: i,
				title: i,
			});
		}
		header.push({
			id: 'timestamp',
			title: 'timestamp',
		});

		// compose individual record
		let record = {
			id: id,
		};
		results.map((val, index) => {
			record[index + 1] = val;
		});
		record['timestamp'] = new Date();

		let writer = csvWriter.createObjectCsvWriter({
			path: config.dataPath,
			header: header,
			append: true,
		});

		writer.writeRecords([record]).then(() => {
			res.status(200).json({
				error: '',
			});
		});
	});

};
