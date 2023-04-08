const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileFolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: false
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
    ]
});

module.exports = mongoose.model('FileFolder', FileFolderSchema);
