document.addEventListener('DOMContentLoaded', () => {
    // Get profile completeness
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(resp => resp.json())
        .then(resp => {
            // if user is logged in
            if (resp.status === 'fail' && resp.message === 'Not authenticated') {
                return location.replace('https://enjames.github.io/ridemyway/UI/login.html?auth=false');
            }

            // Get image element and set src to current user image
            const userAvatar = document.getElementById('userAvatar');
            const { imgUrl, completeness } = resp.data;

            if (imgUrl !== null) {
                userAvatar.src = imgUrl;
            }

            PageFunctions.toggleProfileIndicatorText(completeness);

            fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/dashboard', {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then((res) => {

                    // activate logout functionality
                    PageFunctions.enableLogout();

                    if (res.status === 'success') {
                        const { runningOffer, runningJoinRequest } = res.data;
                        const rideSummary = document.getElementById('rideSummary');
                        const rideBooking = document.getElementById('rideBooking');
                        let runningOfferHTML = '';
                        let runningJoinRequestHTML = '';

                        // Check if an object is returned
                        if (typeof(runningOffer) === 'object') {
                            runningOfferHTML = `<div class="trip">
                                <span>${runningOffer.fromState}</span>
                                <i class="fa fa-long-arrow-right"></i>
                                <span>${runningOffer.toState}</span>
                            </div>
                            <div class="departure">
                                <p>Departure Date: <span>${PageFunctions.dateToWords(runningOffer.departureDate)}</span></p>
                                <p>Departure Time: <span>${PageFunctions.to12hrFormat(runningOffer.departureTime)}</span></p>
                            </div>
                            <div class="btn-container">
                                <a href="responses.html?rideId=${runningOffer.id}">See details</a>
                            </div>`
                        } else {
                            runningOfferHTML = `<p class="no-running">${runningOffer}. <a class="no-running-ref" href="create.html">Create a ride</a></p>`;
                        }

                        if (typeof(runningJoinRequest) === 'object') {
                            runningJoinRequestHTML = `<div class="trip">
                                <span>${runningJoinRequest.fromState}</span>
                                <i class="fa fa-long-arrow-right"></i>
                                <span>${runningJoinRequest.toState}</span>
                            </div>
                            <div class="departure">
                                <p>Departure Date: <span>${PageFunctions.dateToWords(runningJoinRequest.departureDate)}</span></p>
                                <p>Departure Time: <span>${PageFunctions.to12hrFormat(runningJoinRequest.departureTime)}</span></p>
                            </div>
                            <div class="btn-container">
                                <a href="ride-offer.html?rideId=${runningJoinRequest.id}">See details</a>
                            </div>`
                        } else {
                            runningJoinRequestHTML = `<p class="no-running">${runningJoinRequest}. <a class="no-running-ref" href="all-offers.html">Join a ride</a></p>`;
                        }

                        // Append to DOM
                        rideSummary.innerHTML = runningOfferHTML;
                        rideBooking.innerHTML = runningJoinRequestHTML;
                    }
                })
                .catch(err => PageFunctions.showMessage('error', 'Unable to load dashboard at the moment'));
        })
        .catch(err => PageFunctions.showMessage('error', 'There was a problem'));


}, false);
