var bcrypt = require('bcryptjs')
let keyLength = 10
module.exports = {
	hashPassword: password => {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(keyLength, function (err, salt) {
				if (err) {
					reject(err)
				} else {
					bcrypt.hash(password, salt, function (err, hash) {
						if (err) {
							reject(err)
						}
						resolve(hash)
					})
				}
			})
		})
	},
	comparePassword: (password, hash) => {
		return bcrypt.compare(password, hash)
	},
}
