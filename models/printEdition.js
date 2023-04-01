const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PrintEditionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    frontPage: {
        type: String,
        required: true
    },
    newsletterPDF: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
});

PrintEditionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('PrintEdition', PrintEditionSchema);
