import mongoose from 'mongoose';
import {isString} from 'lodash';
import {isEmail} from 'app/util';

const userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {type: String, required: true},
	password: {type: String, required: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// userSchema.statics = {
//   async all() {
//     return this.find().exec();
//   },

//   async get(id) {
//     return this
//     	.findById(id)
//       .exec()
//       .then((user) => {
//         if (user) {
//           return user;
//         }
//         return Promise.reject();
//       })
//     ;
//   },
// };

userSchema.path('email').validate(email => isEmail(email), 'Email should be valid.');
userSchema.path('password').validate(password => isString(password) && password.length > 5,
 'Password should be a string and length greater than 5');

export default mongoose.model('users', userSchema);