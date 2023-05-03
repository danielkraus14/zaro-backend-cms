const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    printEditions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'PrintEdition'
        }
    ]
});

module.exports = mongoose.model('Tag', TagSchema);