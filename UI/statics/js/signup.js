document.addEventListener('DOMContentLoaded', () => {

    const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/auth/signup';

    submit.addEventListener('click', (e) => {
        e.preventDefault();

        const firstname = document.getElementById('firstname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submit = document.getElementById('submit');

        // message and spinner
        const messageDiv = document.getElementById('message');
        const spinner = document.getElementById('spinner');

        // Display spinner while systems sends request
        spinner.style.opacity = '1';

        const userData = {
            firstname,
            email,
            password,
            confirmPassword
        };

        const fetchDataObject = {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        fetch(url, fetchDataObject)
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === 'success') {
                    return PageFunctions.showMessage(messageDiv, spinner, 'sucess', 'Sign up success!');
                }
                if (res.status === 'fail') {
                    return PageFunctions.showMessage(messageDiv, spinner, 'fail', res.message);
                }
                if (res.status === 'error') {
                    return PageFunctions.showMessage(messageDiv, spinner, 'fail', 'Email already exists');
                }
            })
            .catch(error => PageFunctions.showMessage(messageDiv, spinner, 'error', 'It seems you are offline.'));
    }, false);
}, false);
