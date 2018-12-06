import CONSTANTS from '../config/constants';
import { handleError, ERROR_TYPE } from '../helpers/manager';

module.exports = (app, db) => {
	
	app.get(CONSTANTS.ROUTES.LATHE, (req, res) => {
		let step = req.query.step || -1;

		db.collection(CONSTANTS.COLLECTION.MODULES).findOne({
			name: 'lathe',
		}, (err, doc) => {
			if (err) handleError(ERROR_TYPE.DATABASE, 'Cannot find lathe module', res);
			else {
				let courses = doc['courses'];
				let data;
				switch(step) {
					case -1:
						let course = courses[0];
						data = {
							pagetitle: 'Lathe',
							videourl: null,
							coversrc: '/public/imgs/cover.jpg',
							title: CONSTANTS.TEXT.DF_TITLE,
							description: CONSTANTS.TEXT.DF_DESCRIPTION,
						};
						break;
					default:
				}
				
				res.render('lathe', data);
			}
		});
	});

};
