import CONSTANTS from '../config/constants';
import { handleError } from '../helpers/manager';
import csvWriter from 'csv-writer';
import config from '../config/config';

const NUM_PAGES = 16;

module.exports = (app) => {
	
	app.post(CONSTANTS.ROUTES.SUBMIT, (req, res) => {
		if (!req.body) handleError('No data submitted', res);

		let id = req.body.id;
		let results = JSON.parse(req.body.results);
		
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
		};

		// compose individual record
		let record = {
			id: id,
		};
		results.map((val, index) => {
			record[index + 1] = val;
		});

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