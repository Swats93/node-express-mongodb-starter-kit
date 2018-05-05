import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	postId: {type: String},
	content: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model('Comments', commentSchema);