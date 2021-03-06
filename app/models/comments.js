import mongoose from 'mongoose';
import {isString} from 'lodash';

const commentSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Posts'},
	content: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

//commentSchema.path('postId').validate(postId => isString(postId), 'postId should be valid.');
commentSchema.path('content').validate(content => isString(content),'content should be a stting');


export default mongoose.model('Comments', commentSchema);