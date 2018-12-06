const ERROR_TYPE = {
	GENERAL: 0,
	AUTHENTICATION: 1,
	DATABASE: 2,
};
Object.freeze(ERROR_TYPE);

function handleError(type, err, res) {
	if (!res) return;	// response object doesn't exist, halt

	let msg, status;
	switch(type) {
	case ERROR_TYPE.AUTHENTICATION:
		msg = err || 'Authentication Error';
		status = 401;
		break;
	case ERROR_TYPE.DATABASE:
		msg = err || 'Database Error';
		status = 500;
		break;
	default:
		msg = err || 'Internal Server Error';
		status = 500;
	}

	res.status(status).json({
		error: msg,
	});
}

module.exports = {
	handleError,
	ERROR_TYPE,
};
