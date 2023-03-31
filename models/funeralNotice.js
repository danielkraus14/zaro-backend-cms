const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const religionTypes = ['catholic', 'jewish', 'christian', 'muslim', 'buddhist', 'other']
const statusTypes = ['published', 'paid_counter', 'requested_counter', 'paid_mp', 'pending_mp', 'rejected_mp']

const FuneralNoticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    deceased: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    religion: {
        type: String,
        enum: religionTypes,
        required: true,
        default: 'catholic'
    },
    status: {
        type: String,
        enum: statusTypes,
        required: true,
        default: 'published'
    },
    content: {
        type: String,
        required: true
    },
});

FuneralNoticeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('FuneralNotice', FuneralNoticeSchema);
