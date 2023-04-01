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
    image: {
        type: String,
        required: true
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
});

EventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', EventSchema);
