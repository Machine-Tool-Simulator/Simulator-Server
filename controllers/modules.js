import CONSTANTS from '../config/constants';
import { handleError, ERROR_TYPE } from '../helpers/manager';

module.exports = (app, db) => {
	
	app.get(CONSTANTS.ROUTES.LATHE, (req, res) => {
		db.collection(CONSTANTS.COLLECTION.MODULES).findOne({
			name: 'lathe',
		}, (err, doc) => {
			if (err) handleError(ERROR_TYPE.DATABASE, 'Cannot find lathe module', res);
			else {
				let courses = doc['courses'];
				res.status(200).json({
					courses: courses,
				});
			}
		});
	});

};
