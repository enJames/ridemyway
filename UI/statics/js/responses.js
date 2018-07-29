document.addEventListener('DOMContentLoaded', () => {
    const navigationToggler = document.getElementById('navigationToggler');
    const navigationDiv = document.getElementById('navigationId');
    const navigationItemsWrapper = document.getElementsByClassName('navigation-items-wrapper')[0];
    const userNavToggler = document.getElementById('userNavToggler');
    const userNav = document.getElementById('userNav');

    // Elements in responses page
    const view = document.getElementById('view'); // View button
    const acceptedResponses = document.getElementById('acceptedResponses'); // Collapsible Div
    const acceptedResponsesContainer = document.getElementById('acceptedResponsesContainer'); // Child Div

    // Toggle collapse
    navigationToggler.addEventListener('click', () => {
        PageFunctions.collapseToggle(navigationToggler, navigationDiv, navigationItemsWrapper)
    }, false);

    //Accepted Responses toggler
    view.addEventListener('click', () => {
        PageFunctions.collapseToggle(view, acceptedResponses, acceptedResponsesContainer);
    }, false);

    // Toggle User nav display
    document.addEventListener('click', (e) => {
        PageFunctions.displayToggle(e, userNav);
    }, false);

    // Scroll element into view
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ------------- Fetch --------------------

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
            if (res.status === 'success') {
                PageFunctions.changeNavigation('success', 'responses');
                PageFunctions.displayUserNavigation();
                PageFunctions.enableLogout();

                // Get image element and set src to current user image
                const userAvatar = document.getElementById('userAvatar');

                if (imgUrl !== null) {
                    userAvatar.src = res.data.imgUrl;
                }

                const { firstname } = res.data;

                fetch(`https://enjames-ridemyway.herokuapp.com/api/v1/users/rides/${rideId}/requests`)
                    .then(resp.json())
                    .then((resp) => {
                        const rideOfferDetailsHook = document.getElementById('rideOfferDetailsHook');
                        const pendingRequestsHook = document.getElementById('pendingRequestsHook');
                        const { rideOffer, requestedUsers } = resp.data;
                        const {
                            fromState, fromCity, toState, toCity, price, seats, acceptedRequests, availableSeats
                        } = rideOffer;
                        const { requestId, status, firstname, lastname, phone, imgUrl } = requestedUsers;
                        let acceptedRequestsHTML = '';
                        let pendingRequestsHTML = '';

                        if (typeof(requestedUsers) === 'string') {
                            rideOfferDetailsHook.innerHTML = `<div class="no-running">${requestedUsers}</div>`;
                            pendingRequestsHook.innerHTML = `<div class="no-running">${requestedUsers}</div>`;
                            return;
                        }

                        // Get requests
                        requestedUsers.forEach((joinRequest) => {
                            if (status === 'accept') {
                                acceptedRequestsHTML += `<div class="responses-wrapper">
                                            <a href="requests.html?requestId=${requestId}">
                                                <div class="responses">
                                                    <div class="responses-user">
                                                        <div class="responses-user-name">
                                                            <div class="avatar">
                                                                <img src="${imgUrl}" alt="Avatar">
                                                            </div>
                                                            <div class="user-name">
                                                                <h3>${firstname} ${lastname}</h3>
                                                                <p>${phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="responses-btn">
                                                        <div class="responses-btn-decline-for-accepted">
                                                            <button type="button" class="btn-decline" value="decline" id="${requestId}">Decline</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`;
                            }
                            if (status === 'pending') {
                                pendingRequestsHTML += `<div class="responses-wrapper">
                                            <a href="requests.html?requestId=${requestId}">
                                                <div class="responses">
                                                    <div class="responses-user">
                                                        <div class="responses-user-name">
                                                            <div class="avatar">
                                                                <img src="${imgUrl}" alt="Avatar">
                                                            </div>
                                                            <div class="user-name">
                                                                <h3>${firstname} ${lastname}</h3>
                                                                <p>${phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="responses-btn">
                                                        <div class="responses-btn-accept">
                                                            <button type="button" class="btn-accept" value="accept" id="${requestId}">Accept</button>
                                                        </div>
                                                        <div class="responses-btn-reject">
                                                            <button type="button" class="btn-reject" value="decline" id="${requestId}">Reject</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`;
                            }
                        });

                        // If no accepted requests after looping
                        if (acceptedRequestsHTML.length === 0) {
                            acceptedRequestsHTML = `<div class="no-running">You have not accepted any rides yet.</div>`;
                        }

                        // If no pending requests after looping
                        if (acceptedRequestsHTML.length === 0) {
                            pendingRequestsHTML = `<div class="no-running">There are currently no pending requests for this ride.</div>`;
                        }
                        const rideOfferDetailsHTML = `<div class="ride-offer-wrapper">
                                <div class="ride-offer">
                                    <div class="offer-details">
                                        <div class="from">
                                            <h3 class="from-state">${fromState}</h3>
                                            <p class="from-city">${fromCity}</p>
                                        </div>
                                        <div class="arrow-icon">
                                            <span class="fa fa-long-arrow-right"></span>
                                        </div>
                                        <div class="to">
                                            <h3 class="to-state">${toState}</h3>
                                            <p class="to-city">${toCity}</p>
                                        </div>
                                    </div>
                                    <div class="offer-price">
                                        <h3>₦<span>${price}</span></h3>
                                    </div>
                                </div>
                            </div>
                            <div class="view-offer-details">
                                <div class="ride-info">
                                    <div class="ride-info-item">
                                        <h4>Seats Shared</h4>
                                        <p>${seats}</p>
                                    </div>
                                    <div class="ride-info-item">
                                        <h4>Available Seats</h4>
                                        <p>${availableSeats}</p>
                                    </div>
                                    <div class="ride-info-item">
                                        <h4>Accepted</h4>
                                        <p>${acceptedRequests}</p>
                                    </div>
                                </div>
                                <div class="accepted-responses" id="acceptedResponses">
                                    <div id="acceptedResponsesContainer">
                                        ${acceptedRequestsHTML}
                                    </div>
                                </div>
                                <div class="view-accepted">
                                    <button type="button" data-toggle="accepted-responses" data-target="#acceptedResponses" aria-controls="accepted-responses" aria-expanded="false" class="universal-btn" id="view">View Accepted</button>
                                </div>
                            </div>`;

                        // Append to DOM
                        rideOfferDetailsHook.innerHTML = rideOfferDetailsHTML;
                        pendingRequestsHook.innerHTML = pendingRequestsHTML;
                    })
                    .catch(error => PageFunctions.showMessage(resp.status, resp.message));
            }
        })
        .catch(error => PageFunctions.showMessage(res.status, res.message));
});
