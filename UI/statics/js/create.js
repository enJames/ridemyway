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

            const { id, firstname, city, state, imgUrl, completeness } = res.data;

            PageFunctions.enableLogout();
            PageFunctions.displayUserNavigation();

            // Get image element and set src to current user image
            const userAvatar = document.getElementById('userAvatar');

            if (imgUrl !== null) {
                userAvatar.src = imgUrl;
            }

            // Get form Hook
            const formBody = document.getElementById('formBody');

            if (completeness !== '100%') {
                formBody.innerHTML = `<div class="no-running">We are so sorry ${firstname}, you cannot create a ride yet because your profile is less than 100%. Please <a href="edit.html">update</a> your profile information and try again</div>`;
                return;
            }


            // Check if user has a pending ride
            fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/dashboard', {
                method: 'GET',
                credentials: 'include'
            })
                .then(resp => resp.json())
                .then((resp) => {
                    if (resp.status === 'success') {
                        const { runningOffer } = resp.data;

                        if (typeof(runningOffer) === 'object') {
                            formBody.innerHTML = `<div class="no-running">${firstname}, you still have a pending ride offer. You can create a new ride only when the current ride offer has expired.</div>`;
                            return;
                        }

                        // Render form
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

                        // Get spinner
                        const spinner = document.getElementById('spinner');

                        // create ride url
                        const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/users/rides';

                        // onclick
                        submit.addEventListener('click', (e) => {
                            e.preventDefault();

                            // Display spinner while systems processes request
                            spinner.style.opacity = '1';

                            const fromState = document.getElementById('fromState').value;
                            const fromCity = document.getElementById('fromCity').value;
                            const toState = document.getElementById('toState').value;
                            const toCity = document.getElementById('toCity').value;
                            const price = document.getElementById('price').value;
                            const seats = document.getElementById('seats').value;
                            const pickupLocation = document.getElementById('pickupLocation').value;
                            const departureDate = document.getElementById('departureDate').value;
                            const departureTime = document.getElementById('departureTime').value;


                            // Get today in user's entry format for comparison
                            const now = new Date();
                            let month = now.getMonth() + 1;
                            let today;
                            if (month > 9) {
                                today = `${now.getFullYear()}-${month}-${now.getDate()}`;
                            } else {
                                today = `${now.getFullYear()}-0${month}-${now.getDate()}`;
                            }

                            // prevent abrupt ride Offers
                            if (departureDate === today) {
                                return PageFunctions.showMessage('fail', 'Departure date is too abrupt, tomorrow would be just fine.');
                            }
                            if (departureDate < today) {
                                return PageFunctions.showMessage('fail', 'Departure date is in the past, please set a date in the future. Tomorrow would be just fine.');
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
                                    PageFunctions.showMessage(res.status, res.message);
                                    if (res.status === 'success') {
                                        return location.replace('https://enjames.github.io/ridemyway/UI/dashboard.html');
                                    }
                                })
                                .catch(error => PageFunctions.showMessage(res.status, res.message));
                        }, false);
                    } else {
                        PageFunctions.showMessage(resp.status, resp.message);
                    }
                })
                .catch(err => PageFunctions.showMessage('error', 'There was a problem while fetching rides'));
        })
        .catch(err => PageFunctions.showMessage('error', 'There was a problem while fetching profile'));
}, false);
