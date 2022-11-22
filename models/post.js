const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    secretaryship: {
        type: Schema.Types.ObjectId,
        ref: 'Secretaryship',
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
    },
});

module.exports = mongoose.model('Post', PostSchema);
