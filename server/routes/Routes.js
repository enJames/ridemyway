import express from 'express';
import ridesController from '../controllers/RidesController';

const rides = express.Router();

rides.get('/', ridesController.getAllRideOffers);
rides.get('/:rideId', ridesController.getARideOffer);

const routes = { rides };

export default routes;
