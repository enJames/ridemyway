document.addEventListener('DOMContentLoaded', () => {
    // Check logged in status
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/check', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            PageFunctions.changeNavigation(res.status, 'all-offers');

            if (res.status === 'success') {
                PageFunctions.enableLogout();
                PageFunctions.displayUserNavigation();
            }

            fetch('https://enjames-ridemyway.herokuapp.com/api/v1/rides')
                .then(res => res.json())
                .then((res) => {
                    const allRidesHook = document.getElementById('allRidesHook');

                    let ridesHTML = '<h1>All ride offers</h1>';
                    res.data.forEach((ride) => {
                        ridesHTML += `<a class="ride-offer-wrapper" href="#">
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
                                    <h3>₦<span>${ride.price.toLocaleString()}</span></h3>
                                </div>
                            </div>
                        </a>`
                    });

                    // Append rides to div for viewing
                    allRidesHook.innerHTML = ridesHTML;
                })
        })
        .catch((err) => console.error('There was a problem', err));
});
