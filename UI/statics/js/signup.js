document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            // if user is logged in
            if (res.status === 'success') {
                return location.replace('https://enjames.github.io/ridemyway/UI/dashboard.html');
            }

            // if user is not logged in
            const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/auth/signup';

            submit.addEventListener('click', (e) => {
                e.preventDefault();

                const firstname = document.getElementById('firstname').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const submit = document.getElementById('submit');

                // message and spinner
                const messageEl = document.getElementById('message');
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
                    },
                    credentials: 'include'
                }

                fetch(url, fetchDataObject)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.status === 'success') {
                            PageFunctions.showMessage(res.status, res.message);
                            return location.replace('https://enjames.github.io/ridemyway/UI/dashboard.html');
                        }
                        return PageFunctions.showMessage(res.status, res.message);
                    })
                    .catch(error => PageFunctions.showMessage(res.status, res.message));
            }, false);
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
