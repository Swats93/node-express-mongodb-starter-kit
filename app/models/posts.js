import mongoose from 'mongoose';
import {isString} from 'lodash';

const postSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
	title: {type: String},
	content: {type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

//postSchema.path('userId').validate(userId => isString(userId), 'UserId should be valid.');
postSchema.path('title').validate(title => isString(title) && title.length > 5,
	'title should be a string and length should be greater than 5');
postSchema.path('content').validate(content => isString(content),'content should be a stting');


export default mongoose.model('Posts', postSchema);