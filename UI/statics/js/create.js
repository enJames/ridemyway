document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            // if user is not logged in
            if (res.status === 'fail' && res.message === 'Not authenticated') {
                return location.replace('https://enjames.github.io/ridemyway/UI/login.html?auth=false');
            }

            console.log(res);

            const { firstname, city, state } = res.data;

            PageFunctions.changeNavigation(res.status, 'create');
            PageFunctions.enableLogout();
            PageFunctions.displayUserNavigation();

            // Get form Hook
            const formBody = document.getElementById('formBody');

            if (res.data.completeness !== '100%') {
                formBody.innerHTML = `<div class="no-running">We are so sorry ${firstname}, you cannot create a ride yet because your profile is less than 100%. Please <a href="edit.html">update</a> your profile information and try again</div>`;
                return;
            }

            // Render form if profile is 100%
            const createRideFormHTML = `<form method="POST">
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="fromState">State</label>
                            <input type="text" id="fromState" value="${state}" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="fromCity">City</label>
                            <input type="text" id="fromCity" value="${city}" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="toState">State</label>
                            <input type="text" id="toState" placeholder="Destination State" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="toCity">City</label>
                            <input type="text" id="toCity" placeholder="Destination City" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="departure">Departure Date</label>
                            <input type="date" id="departureDate" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="departure">Departure Time</label>
                            <input type="time" id="departureTime" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="price">Price (₦)</label>
                            <input type="number" id="price" placeholder="eg 2500" min="0" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="seats">Seats</label>
                            <input type="number" id="seats" placeholder="eg 4" min="1" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="pickupLocation">Pick up location</label>
                            <input type="text" id="pickupLocation" required>
                        </div>
                    </div>
                    <div class="payment-information">
                        <p>Please note that RideMyWay does not handle payments for rides.</p>
                    </div>
                    <div class="btn-wrapper">
                        <button type="submit" class="form-btn" id="submit">Create ride offer <i class="fa fa-spinner fa-spin" id="spinner"></i> </button>
                    </div>
                </form>`;

                // Append to DOM
                formBody.innerHTML = createRideFormHTML;

            // Get Submit button
            const submit = document.getElementById('submit');

            // create ride url
            const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/users/rides';

            // onclick
            submit.addEventListener('click', (e) => {
                e.preventDefault();

                const fromState = document.getElementById('fromState').value;
                const fromCity = document.getElementById('fromCity').value;
                const toState = document.getElementById('toState').value;
                const toCity = document.getElementById('toCity').value;
                const price = document.getElementById('price').value;
                const seats = document.getElementById('seats').value;
                const pickupLocation = document.getElementById('pickupLocation').value;
                const departureDate = document.getElementById('departureDate').value;
                const departureTime = document.getElementById('departureTime').value;

                // message and spinner
                const messageEl = document.getElementById('message');
                const spinner = document.getElementById('spinner');

                // Display spinner while systems processes request
                spinner.style.opacity = '1';

                // prevent abrupt ride Offers

                const now = new Date();
                const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
                if (departureDate <= today) {
                    return PageFunctions.showMessage('fail', 'Departure date is too abrupt, tomorrow would be just fine.');
                }

                const userData = {
                    fromState,
                    fromCity,
                    toState,
                    toCity,
                    price,
                    seats,
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
