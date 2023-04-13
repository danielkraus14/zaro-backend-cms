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
    slug: {
        type: String,
        required: true,
        unique: true
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
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

VenueSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Venue', VenueSchema);