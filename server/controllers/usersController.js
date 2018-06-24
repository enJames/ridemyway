import users from '../models/users';
import rides from '../models/rides';
import requests from '../models/requests';
import sendResponse from '../sendResponse';

const usersController = {
    createUser: (req, res) => {
        const {
            firstname,
            lastname,
            email,
            password,
            repassword,
            state
        } = req.body;

        // validation
        if (!firstname || !lastname || !email || !password || !repassword || !state) {
            return sendResponse(res, 400, 'Please fill out all fields');
        }

        // check that password and retyped password match
        if (password !== repassword) {
            return sendResponse(res, 400, 'Passwords do not match');
        }

        // user to create
        const user = {
            id: users.length + 1,
            firstname,
            lastname,
            email,
            password,
            state
        };

        // create user
        users.push(user);

        return sendResponse(res, 201, 'Sign up successful', user);
    },
    login: (req, res) => {
        const { email, password } = req.body;
        let exists;

        // validation
        if (!email || !password) {
            return sendResponse(res, 400, 'Please fill out all fields');
        }

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
