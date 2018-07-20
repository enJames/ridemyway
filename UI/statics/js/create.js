document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/check', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            // if user is logged in
            PageFunctions.changeNavigation(res.status, 'create');

            if (res.status === 'success') {
                PageFunctions.enableLogout();
                PageFunctions.displayUserNavigation();
            }

            // if user is not logged in
            const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/users/rides';

            // Submit button
            const submit = document.getElementById('submit');

            submit.addEventListener('click', (e) => {
                e.preventDefault();

                const fromState = document.getElementById('fromState').value;
                const fromCity = document.getElementById('fromCity').value;
                const toState = document.getElementById('toState').value;
                const toCity = document.getElementById('toCity').value;
                const price = document.getElementById('price').value;
                const pickupLocation = document.getElementById('pickupLocation').value;
                const departureDate = document.getElementById('departureDate').value;
                const departureTime = document.getElementById('departureTime').value;

                // message and spinner
                // const messageEl = document.getElementById('message');
                const spinner = document.getElementById('spinner');

                // Display spinner while systems sends request
                spinner.style.opacity = '1';

                const userData = {
                    fromState,
                    fromCity,
                    toState,
                    toCity,
                    price,
                    pickupLocation,
                    departureDate,
                    departureTime
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
