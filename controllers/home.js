import CONSTANTS from '../config/constants';

module.exports = (app) => {
	
	app.get(CONSTANTS.ROUTES.INDEX, (req, res) => {
		res.status(200).json({
			error: '',
		});
	});

};
