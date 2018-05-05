import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {type: String},
	password: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model('users', userSchema);