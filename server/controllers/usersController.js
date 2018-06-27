import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const usersController = {
    createUser: (req, res) => {
        // user to create
        const user = {
            id: users.length + 1,
            ...req.body
        };

        // create user
        users.push(user);

        return sendResponse(res, 201, 'Sign up successful', user);
    },
    login: (req, res) => {
        const { email, password } = req.body;
        let exists;

        for (let i = 0; i < users.length; i += 1) {
            if (users[i].email === email && users[i].password === password) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            return sendResponse(res, 401, 'Credentials do not match');
        }
        return sendResponse(res, 200, 'You are logged in');
    }
};

export default usersController;
