const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
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
    }
});

module.exports = mongoose.model('Post', PostSchema);
