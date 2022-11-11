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
    }
});

module.exports = mongoose.model('Post', PostSchema);
