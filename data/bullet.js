const mongoose = require("mongoose");
const promisify = require("es6-promisify");
mongoose.connect('mongodb://127.0.0.1:27017/test');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let Bullet = mongoose.model('Bullet', new Schema({
	id: ObjectId,
	time: Number,
	content: String,
	vid: String
}));
// let bullet = new Bullet;
// bullet.time = 1;
// bullet.content = 'haha';
// bullet.save(function () {
//     console.log(arguments);
// });

let find = promisify(Bullet.find.bind(Bullet));

module.exports = {
	get: async function (vid) {
		if (!vid) {
			return await find({})
		} else {
			return await find({vid})
		}
	},
	set: async function (vid, time, content) {
		let bullet = new Bullet;
		bullet.time = time;
		bullet.vid = vid;
		bullet.content = content;
		
		return await new Promise((resolve, reject)=> {
			bullet.save(function (err, res) {
			    err ? reject(err) : resolve(res);
			});
		});
	}
};