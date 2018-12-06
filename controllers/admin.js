import CONSTANTS from '../config/constants';
import SECRETS from '../secret';
import config from '../config/config';
import fs from 'fs';
import glob from 'glob';
import { handleError, ERROR_TYPE } from '../helpers/manager';

function extractModuleNameFromPath(path) {
	let splitted = path.split('/');
	return splitted[splitted.length - 1].slice(0, -5);
}

module.exports = (app, db) => {

	app.post(CONSTANTS.ROUTES.DEPLOY, (req, res) => {
		if (req.body.adminPassword !== SECRETS.ADMIN_PASSWORD) {
			handleError(ERROR_TYPE.AUTHENTICATION, null, res);
			return;
		}

		db.collection(CONSTANTS.COLLECTION.MODULES).drop((err, _) => {	// eslint-disable-line no-unused-vars
			const modules = glob.sync(config.root + '/public/modules/*.json');
			modules.forEach(path => {
				let jsonArray = JSON.parse(fs.readFileSync(path));

				db.collection(CONSTANTS.COLLECTION.MODULES).insertOne({
					name: extractModuleNameFromPath(path),
					courses: jsonArray,
				}, err => {
					if (err) handleError(ERROR_TYPE.DATABASE, 'Failed to insert modules into database', res);
					else {
						res.status(200).json({
							msg: 'Deploy Succesful',
							error: null,
						});
					}
				});
			});
		}); 
	});

};
