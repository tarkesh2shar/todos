const jwt = require('jsonwebtoken')

module.exports = {
	generateToken: dataToSign => {
		let token = jwt.sign(
			{
				data: dataToSign,
			},
			process.env.SUPER_SECRET_JSON_KEY,
			{ expiresIn: '1h' },
		)
		return token
	},
}
