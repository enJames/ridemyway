document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/dashboard', {
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
                const { runningOffer, runningJoinRequest } = res.data;
                const rideSummary = document.getElementById('rideSummary');
                const rideBooking = document.getElementById('rideBooking');

                const departureDate = PageFunctions.dateToWords(runningOffer.departureDate);
                const departureTime = PageFunctions.to12hrFormat(runningOffer.departureTime);

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
                        <p>Departure Time: <span>${PageFunctions.dateToWords(runningOffer.departureTime)}</span></p>
                    </div>
                    <div class="btn-container">
                        <a href="responses.html">See details</a>
                    </div>`
                } else {
                    runningOfferHTML = runningOffer;
                }

                if (typeof(runningJoinRequest) === 'object') {
                    runningJoinRequestHTML = `<div class="trip">
                        <span>${runningJoinRequest.fromState}</span>
                        <i class="fa fa-long-arrow-right"></i>
                        <span>${runningJoinRequest.toState}</span>
                    </div>
                    <div class="departure">
                        <p>Departure Date: <span>${PageFunctions.dateToWords(runningJoinRequest.departureDate)}</span></p>
                        <p>Departure Time: <span>${PageFunctions.dateToWords(runningJoinRequest.departureTime)}</span></p>
                    </div>
                    <div class="btn-container">
                        <a href="responses.html">See details</a>
                    </div>`
                } else {
                    runningJoinRequestHTML = runningJoinRequest;
                }

                // Append to DOM
                rideSummary.innerHTML = runningOfferHTML;
                rideBooking.innerHTML = runningJoinRequestHTML;

                return { rideSummary: rideSummary.innerHTML, rideBooking: rideBooking.innerHTML };
            }
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
