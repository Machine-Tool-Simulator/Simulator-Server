function handleError(err, res) {
	if (res) {
		let msg = err.message || "Internal Server Error";
		res.status(500).json({
			error: msg,
		});
	}
}

module.exports = {
	handleError,
}