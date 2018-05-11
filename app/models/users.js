import mongoose from 'mongoose';
import {isString} from 'lodash';
import {isEmail} from 'app/util';

const userSchema = new mongoose.Schema({
	email: {type: String},
	password: {type: String},
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
 'Password should be a stting and length greater than 5');

export default mongoose.model('users', userSchema);