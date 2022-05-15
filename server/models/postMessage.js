import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
 message: String,
 createdAt: {
  type: Date,
  default: Date.now
 },
 depressionVideo: {
  type: Number,
  default: 0.0
 } ,
 depressionText: {
  type: Number,
  default: 0.0
 },
 depression: {
  type: Boolean,
  default: false
 }
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;