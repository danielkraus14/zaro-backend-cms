const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const bodyTypes = ['main', 'classified', 'sports', 'playtime', 'magazine', 'midweek', 'hera', 'lemon_green', 'cultural', 'motor', 'disability', 'our_stories']

const PrintEditionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    frontPage: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    newsletterPDF: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    body: {
        type: String,
        enum: bodyTypes,
        required: true,
        default: 'main'
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

PrintEditionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('PrintEdition', PrintEditionSchema);
