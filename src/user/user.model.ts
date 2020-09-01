import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: {
            type: String,
            get: (): undefined => undefined
        }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

userSchema.virtual('tags', {
    ref: 'Tag',
    localField: '_id',
    foreignField: 'author'
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
