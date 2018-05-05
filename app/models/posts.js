import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	userId: {type: String},
	content: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model('Posts', postSchema);