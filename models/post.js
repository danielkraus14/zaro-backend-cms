const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
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

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
