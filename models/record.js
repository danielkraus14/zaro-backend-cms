const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const operationType = ['create', 'update', 'delete'];
const collectionNames = ['category', 'event', 'file', 'fileFolder', 'funeralNotice', 'post', 'printEdition', 'section', 'venue'];

const RecordSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    operation: {
        type: String,
        enum: operationType,
        required: true
    },
    collectionName: {
        type: String,
        enum: collectionNames,
        required: true
    },
    objectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

RecordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Record', RecordSchema);
