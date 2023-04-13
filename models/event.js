const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    billboard: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    dateStarts: {
        type: Date,
        default: Date.now
    },
    dateEnds: {
        type: Date,
        default: Date.now
    },
    venue: {
        type: Schema.Types.ObjectId,
        ref: 'Venue',
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

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema);
