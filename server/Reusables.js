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
    },
    getDateString: (day = 0) => {
        const monthArray = [
            'Nil', 'Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        let formDateFormat;

        const requiredDate = new Date(new Date().getTime() + (day * 86400000));
        const [weekDay, month, date, year] = requiredDate.toDateString().split(' ');

        weekDay.toString(); // Just to avoid eslint error

        const monthIndex = monthArray.indexOf(month);

        if (monthIndex > 9) {
            formDateFormat = `${year}-${monthIndex}-${date}`;
        } else {
            formDateFormat = `${year}-0${monthIndex}-${date}`;
        }
        return formDateFormat;
    }
};

export default Reusables;
