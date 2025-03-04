import mongoose, { Schema } from "mongoose";

const RecentSearchModel = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    search: {type: Schema.Types.Mixed, required: true},
    createdAt: {type: Date, default: Date.now}
});

export const RecentSeachModel = mongoose.model('RecentSearch', RecentSearchModel);