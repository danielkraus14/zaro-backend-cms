const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileFolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: false
    },
    files: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('FileFolder', FileFolderSchema);
