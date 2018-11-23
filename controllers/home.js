import CONSTANTS from '../config/constants';
import manager from '../helpers/manager';

module.exports = (app, db) => {
	
	app.get(CONSTANTS.ROUTES.INDEX, (req, res, next) => {
		db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
			name: 'status',
		}, (err, doc) => {
			if (err) manager.handleError(err, res);
			else {
				res.status(200).json({
					error: '',
					status: doc['running'],
				});
			}
		});
	});

}