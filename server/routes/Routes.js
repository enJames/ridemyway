import express from 'express';
import RidesController from '../controllers/RidesController';

const Rides = express.Router();

Rides.get('/', RidesController.getAllRideOffers);
Rides.get('/:rideId', RidesController.getARideOffer);
Rides.post('/', RidesController.createRideOffer);

const Routes = { Rides };

export default Routes;
