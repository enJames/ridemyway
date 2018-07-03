const Reusables = {
    sendResponse: (response, statusCode, status, message, data=null) => {
        response.status(statusCode).json({
            status,
            message,
            data
        });
    },
    sendErrors: (response, collatedErrors, status, next) => {
        if (collatedErrors) {
            const errors = collatedErrors.map(eachError => eachError.msg);
            return response.status(400).json({
                status: 'fail',
                errors
            });
        }
        return next();
    }
};

export default Reusables;
