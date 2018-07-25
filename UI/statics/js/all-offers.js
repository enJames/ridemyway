document.addEventListener('DOMContentLoaded', () => {
    // Check logged in status
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            PageFunctions.changeNavigation(res.status, 'all-offers');

            if (res.status === 'success') {
                PageFunctions.enableLogout();
                PageFunctions.displayUserNavigation();

                // Get image element and set src to current user image
                const userAvatar = document.getElementById('userAvatar');
                const { imgUrl } = res.data;

                if (imgUrl !== null) {
                    userAvatar.src = imgUrl;
                }
            }

            fetch('https://enjames-ridemyway.herokuapp.com/api/v1/rides')
                .then(resp => resp.json())
                .then((resp) => {
                    const allRidesHook = document.getElementById('allRidesHook');
                    let ridesHTML = '<h1>All ride offers</h1>';

                    if (resp.data.length === 0) {
                        ridesHTML += '<p class="text-center">No ride offers yet</p>';

                        // Append rides to div for viewing
                        allRidesHook.innerHTML = ridesHTML;
                        return allRidesHook.innerHTML;
                    }

                    resp.data.forEach((ride) => {
                        const { price } = ride;
                        let thePrice = parseInt(price, 10).toLocaleString();
                        let location;

                        // Check if ride belongs to logged in user
                        if (res.data.userId === ride.userId) {
                            location = 'responses.html';
                        } else {
                            location = `ride-offer.html?rideId=${ride.id}`
                        }
                        console.log(location);
                        ridesHTML += `<a class="ride-offer-wrapper" href="${location}">
                            <div class="ride-offer">
                                <div class="offer-details">
                                    <div class="from">
                                        <h3 class="from-state">${ride.fromState}</h3>
                                        <p class="from-city">${ride.fromCity}</p>
                                    </div>
                                    <div class="arrow-icon">
                                        <span class="fa fa-long-arrow-right"></span>
                                    </div>
                                    <div class="to">
                                        <h3 class="to-state">${ride.toState}</h3>
                                        <p class="to-city">${ride.toCity}</p>
                                    </div>
                                </div>
                                <div class="offer-price">
                                    <h3>₦<span>${thePrice}</span></h3>
                                </div>
                            </div>
                        </a>`
                    });

                    // Append rides to div for viewing
                    allRidesHook.innerHTML = ridesHTML;
                })
        })
        .catch((err) => PageFunctions.showMessage('error', 'There was a problem fetching rides'));
});
