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
    }
};

export default reusables;
