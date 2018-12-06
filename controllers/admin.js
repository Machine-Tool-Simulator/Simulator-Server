import CONSTANTS from '../config/constants';
import SECRETS from '../secret';
import config from '../config/config';
import fs, { readFileSync } from 'fs';
import glob from 'glob';
import manager from '../helpers/manager';

module.exports = (app, db) => {

	app.post(CONSTANTS.ROUTES.DEPLOY, (req, res, next) => {
		if (req.body.adminPassword !== SECRETS.ADMIN_PASSWORD) {
			manager.handleError(manager.ERROR_TYPE.AUTHENTICATION, null, res);
			return;
		}

		db.collection(CONSTANTS.COLLECTION.MODULES).drop((err, _) => {
			const modules = glob.sync(config.root + '/public/modules/*.json');
			modules.forEach(module => {
				let jsonArray = JSON.parse(fs.readFileSync(module));
				db.collection(CONSTANTS.COLLECTION.MODULES).insertOne({
					steps: jsonArray,
				}, err => {
					if (err) manager.handleError(manager.ERROR_TYPE.DATABASE, 'Failed to insert modules into database', res);
					else {
						res.status(200).json({
							msg: "Deploy Succesful",
							error: null,
						});
					}
				});
			});
		}); 
	});

}
