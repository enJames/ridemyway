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
    },
    checkProfileCompleteness: (columns) => {
        let columnsWithNullValues = 0;

        Object.values(columns).forEach((column) => {
            if (column === null) {
                columnsWithNullValues += 1;
            }
        });

        // calculate table completeness percentage
        const percentageCompleteness = Math.floor(100 * (9 - columnsWithNullValues) / 9);

        return `${percentageCompleteness}%`;
    }
};

export default Reusables;
