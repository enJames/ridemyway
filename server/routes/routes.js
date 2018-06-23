import express from 'express';
import ridesController from '../controllers/ridesController';

const rides = express.Router();

rides.get('/', ridesController.getAllRideOffers);
rides.get('/:rideId', ridesController.getARideOffer);
rides.post('/', ridesController.createRideOffer);

const routes = { rides };

export default routes;
