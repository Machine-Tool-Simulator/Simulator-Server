function handleError(err, res) {
	if (!res) return;	// response object doesn't exist, halt

	let msg = err || 'Internal Server Error';

	res.status(500).json({
		error: msg,
	});
}

module.exports = {
	handleError,
};
