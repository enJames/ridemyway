import cron from 'node-cron';
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
};

export default jobs;
