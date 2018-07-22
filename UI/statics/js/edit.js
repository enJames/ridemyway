document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            // if user is logged in
            if (res.status === 'fail' && res.message === 'Not authenticated') {
                return location.replace('https://enjames.github.io/ridemyway/UI/login.html?auth=false');
            }

            // activate logout functionality
            PageFunctions.enableLogout();

            if (res.status === 'success') {
                const {
                    firstname, lastname, email, gender, phone, city, state, imgUrl, completeness
                } = res.data;
                const formBody = document.getElementById('formBody');
                const editFormHTML = `<form method="POST">
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="firstname">First Name</label>
                            <input type="text" id="firstname" value="${firstname}" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="lastname">Last Name</label>
                            <input type="text" id="lastname" value="${(lastname)?lastname:''}" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="gender">Gender</label>
                            <select id="gender" required>
                                <option value="" hidden>--Select--</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                        </div>
                        <div class="input-wrapper">
                            <label for="email">Email address</label>
                            <input type="email" id="email" value="${email}" readonly>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="phone">Mobile Number</label>
                            <input type="tel" id="phone" value="${(phone)?phone:''}" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="city">City</label>
                            <input type="text" id="city" value="${${(city)?city:''}}" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="input-wrapper">
                            <label for="state">State</label>
                            <input type="text" id="state" value="${${(state)?state:''}}" required>
                        </div>
                        <div class="input-wrapper">
                            <label for="country">Country</label>
                            <input type="text" id="country" value="Nigeria">
                        </div>
                    </div>
                    <div class="btn-wrapper">
                        <button type="submit" class="form-btn" id="submit">
                            Save
                            <i class="fa fa-spinner fa-spin" id="spinner"></i>
                        </button>
                    </div>
                </form>`;

                // Append to DOM
                formBody.innerHTML = editFormHTML;

                PageFunctions.toggleProfileIndicatorText(res.data.completeness);
            }

            // put request: update user's information
            const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/users/profile/edit';

            submit.addEventListener('click', (e) => {
                e.preventDefault();

                const firstname = document.getElementById('firstname').value;
                const lastname = document.getElementById('lastname').value;
                const gender = document.getElementById('gender').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const city = document.getElementById('city').value;
                const state = document.getElementById('state').value;
                const submit = document.getElementById('submit');

                // message and spinner
                const messageEl = document.getElementById('message');
                const spinner = document.getElementById('spinner');

                // Display spinner while systems sends request
                spinner.style.opacity = '1';

                const userData = {
                    firstname,
                    lastname,
                    gender,
                    email,
                    phone,
                    city,
                    state
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
                        PageFunctions.toggleProfileIndicatorText(res.data.completeness);
                        return PageFunctions.showMessage(res.status, res.message);
                    })
                    .catch(error => PageFunctions.showMessage(res.status, res.message));
            }, false);
        })
        .catch((err) => console.error('There was a problem', err));

}, false);
