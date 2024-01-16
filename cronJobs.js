const fs = require('fs');
const cron = require('node-cron');

const { adServerService } = require('./services');
const { uploadFileS3 } = require('./s3');

const adServerCronTask = cron.schedule('0 6 * * *', async () => {
    try {
        console.log('schedule started');
        const adServers = await adServerService.publicGetAdServers();
        const filename = 'adServers.json';
        await uploadFileS3(JSON.stringify(adServers, null, 2), filename);
    } catch(error) {
        console.log(error);
    }
}, {
    scheduled: false
});

module.exports = {
    adServerCronTask,
};
