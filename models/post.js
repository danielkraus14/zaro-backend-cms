const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const postTypes = ['digital', 'print'];
const positionTypes = ['urgent', 'super_highlight', 'highlight', 'top', 'front', 'video', 'photo_galery', 'section'];
const statusTypes = ['draft', 'published', 'programmed'];

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        required: false
    },
    flywheel: {
        type: String,
        required: false
    },
    excerpt: {
        type: String,
        required: false
    },
    liveSports: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: postTypes,
        required: true,
        default: 'digital'
    },
    position: {
        type: String,
        enum: positionTypes,
        required: true,
        default: 'section'
    },
    comments: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: String,
        enum: statusTypes,
        required: true,
        default: 'published'
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

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
