const reusables = {
    sendResponse: (response, statusCode, message, responseObject) => {
        if (!responseObject) {
            return response.status(statusCode).json({
                message
            });
        }
        return response.status(statusCode).json({
            message,
            responseObject
        });
    },
    sendErrors: (collatedErrors, response, next) => {
        if (collatedErrors) {
            const errors = collatedErrors.map(eachError => eachError.msg);
            return response.status(401).json({ errors });
        }

        return next();
    }
};

export default reusables;
