import Rides from '../models/Rides';
import SendResponse from '../SendResponse';

const RidesController = {
    getAllRides: (req, res) => SendResponse(
        res,
        200,
        `Found ${Rides.length} ride offers`,
        Rides
    )
};

export default RidesController;
