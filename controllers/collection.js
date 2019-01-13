import CONSTANTS from '../config/constants';
import { handleError } from '../helpers/manager';

module.exports = (app) => {
	
	app.post(CONSTANTS.ROUTES.SUBMIT, (req, res) => {
		if (!req.body) handleError('No data submitted', res);
		
		res.status(200).json({
			error: '',
			msg: 'Hello World',
		});
	});

};
