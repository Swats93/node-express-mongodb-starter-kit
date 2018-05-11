import mongoose from 'mongoose';
import {isString} from 'lodash';

const commentSchema = new mongoose.Schema({
	postId: {type: String},
	content: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

commentSchema.path('postId').validate(postId => isString(postId), 'postId should be valid.');
commentSchema.path('content').validate(content => isString(content),'content should be a stting');


export default mongoose.model('Comments', commentSchema);