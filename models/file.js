const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    fileFolder: {
        type: Schema.Types.ObjectId,
        ref: 'FileFolder',
        required: true
    },
    epigraph: {
        type: String,
        required: false
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    },
    printEditionFP: {
        type: Schema.Types.ObjectId,
        ref: 'PrintEdition',
        required: false
    },
    printEditionPDF: {
        type: Schema.Types.ObjectId,
        ref: 'PrintEdition',
        required: false
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

module.exports = mongoose.model('File', FileSchema);
