const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const VenueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

VenueSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Venue', VenueSchema);