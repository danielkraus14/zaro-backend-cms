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
    }
});

module.exports = mongoose.model('File', FileSchema);
