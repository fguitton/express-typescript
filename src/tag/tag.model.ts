import * as mongoose from 'mongoose';
import Tag from './tag.interface';

const tagSchema = new mongoose.Schema({
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    content: String,
    name: String
});

const tagModel = mongoose.model<Tag & mongoose.Document>('Tag', tagSchema);

export default tagModel;
