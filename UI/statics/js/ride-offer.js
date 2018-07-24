document.addEventListener('DOMContentLoaded', () => {
    // Check logged in status
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/check', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            if (res.status === 'success') {
                PageFunctions.changeNavigation(res.status, 'ride-offer');
                PageFunctions.enableLogout();
                PageFunctions.displayUserNavigation();

                // Get image element and set src to current user image
                const userAvatar = document.getElementById('userAvatar');
                const { imgUrl } = res.data;

                if (imgUrl !== null) {
                    userAvatar.src = imgUrl;
                }
            }

            // Get ride id from params
            const rideId = window.location.search.substr(1).split('=')[1];
            const getRideUrl = `https://enjames-ridemyway.herokuapp.com/api/v1/rides/${rideId}`;

            fetch(getRideUrl)
                .then(res => res.json())
                .then((res) => {
                    const viewRideHook = document.getElementById('viewRideHook');
                    const { rideDetails, driver } = res.data;

                    const ridesHTML = `<div class="ride-offer-wrapper">
                        <div class="ride-offer">
                            <div class="offer-details">
                                <div class="from">
                                    <h3 class="from-state">${rideDetails.fromState}</h3>
                                    <p class="from-city">${rideDetails.fromCity}</p>
                                </div>
                                <div class="arrow-icon">
                                    <span class="fa fa-long-arrow-right"></span>
                                </div>
                                <div class="to">
                                    <h3 class="to-state">${rideDetails.toState}</h3>
                                    <p class="to-city">${rideDetails.toCity}</p>
                                </div>
                            </div>
                            <div class="offer-price">
                                <h3>₦<span>${rideDetails.price.toLocaleString()}</span></h3>
                            </div>
                        </div>
                    </div>
                    <div class="view-offer-details">
                        <div class="offer-items-container">
                            <div class="offer-item-wrapper">
                                <div class="offer-item">
                                    <span>Driver</span>
                                </div>
                                <div class="item-details">
                                    <a href="profile.html?driver=${driver.id}"
                                        <span>${driver.firstname} ${driver.lastname}</span>
                                    </a>
                                </div>
                            </div>
                            <div class="offer-item-wrapper">
                                <div class="offer-item">
                                    <span>Seats shared</span>
                                </div>
                                <div class="item-details">
                                    <span>${rideDetails.seats}</span>
                                </div>
                            </div>
                            <div class="offer-item-wrapper">
                                <div class="offer-item">
                                    <span>Seats available</span>
                                </div>
                                <div class="item-details">
                                    <span>${rideDetails.seats}</span>
                                </div>
                            </div>
                            <div class="offer-item-wrapper">
                                <div class="offer-item">
                                    <span>Pickup location</span>
                                </div>
                                <div class="item-details">
                                    <span>${rideDetails.pickupLocation}</span>
                                </div>
                            </div>
                            <div class="offer-item-wrapper">
                                <div class="offer-item">
                                    <span>Departure Time</span>
                                </div>
                                <div class="item-details">
                                    <span>${rideDetails.departureTime}, ${rideDetails.departureDate.split('T')[0]}</span>
                                </div>
                            </div>
                            <div class="offer-item-wrapper">
                                <div class="payment-information">
                                    <p>Please note that RideMyWay does not handle payments for rides.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn-container">
                        <a href="all-offers.html">Join this ride</a>
                    </div>`

                    // Append rides to div for viewing
                    viewRideHook.innerHTML = ridesHTML;
                })

        })
        .catch((err) => console.error('There was a problem', err));
});
