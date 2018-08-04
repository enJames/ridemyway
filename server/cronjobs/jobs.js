import cron from 'node-cron';
import request from 'request';
import connectionPool from '../models/connectionPool';

const expired = 'Expired';

const jobs = () => {
    // Update status column to Expire for every expired ride
    cron.schedule('*/2 * * * *', () => {
        connectionPool.query(
            `UPDATE "RideOffers" SET "status" = '${expired}'
            WHERE "departureDate" <= NOW()::date AND "departureTime" <= date_trunc('hour', NOW()::time)`
        );
    });

    // Make HTTP request every 20 minutes to keep server awake
    cron.schedule('*/20 * * * *', () => {
        request('https://enjames-ridemyway.herokuapp.com');
    });
};

export default jobs;
