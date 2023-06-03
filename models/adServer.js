const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const positionTypes = [
    'full_screen',
    'footer',
    'right',
    'sticky_1',
    'sticky_2',
    'sticky_3',
    'sticky_4',
    'sticky_5',
    'netblock_1',
    'netblock_2',
    'netblock_3',
    'netblock_4',
    'netblock_5',
    'netblock_6',
    'netblock_7',
    'netblock_8',
    'netblock_9',
    'netblock_10',
    'netblock_11',
    'horizontal_1',
    'horizontal_2',
    'horizontal_3',
    'horizontal_4',
    'horizontal_5',
    'horizontal_6',
    'horizontal_7',
    'horizontal_8',
    'horizontal_9',
    'horizontal_10',
    'horizontal_11'
];
const siteTypes = ['el_heraldo', 'other'];
const statusTypes = ['expired', 'published', 'programmed'];

const AdServerSchema = new Schema({
    position: {
        type: String,
        enum: positionTypes,
        required: true,
        default: 'full_screen'
    },
    site: {
        type: String,
        enum: siteTypes,
        required: true,
        default: 'el_heraldo'
    },
    dateStarts: {
        type: Date,
        default: Date.now
    },
    dateEnds: {
        type: Date,
        required: false
    },
    unlimited: {
        type: Boolean,
        required: true,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    htmlContent: {
        type: String,
        required: false
    },
    desktopImage: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'File'
    },
    mobileImage: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'File'
    },
    url: {
        type: String,
        required: false
    },
    client: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: statusTypes,
        required: true,
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
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

AdServerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('AdServer', AdServerSchema);
