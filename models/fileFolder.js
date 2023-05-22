const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionNames = ['post', 'printEdition', 'event', 'section', 'adServer'];

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
    collectionName: {
        type: String,
        enum: collectionNames,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
