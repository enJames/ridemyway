import express from 'express';
import RidesController from '../controllers/RidesController';

const Rides = express.Router();

Rides.get('/', RidesController.getAllRideOffers);

const Routes = { Rides };

export default Routes;
