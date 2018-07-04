const Reusables = {
    sendResponse: (response, statusCode, status, message, data) => {
        if (!data) {
            return response.status(statusCode).json({
                status,
                message
            });
        }
        return response.status(statusCode).json({
            status,
            message,
            data
        });
    }
};

export default Reusables;
