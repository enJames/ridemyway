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

            if (res.status === 'success') {
                // activate logout functionality
                PageFunctions.enableLogout();

                // Get image element and set src to current user image
                const userAvatar = document.getElementById('userAvatar');

                if (res.data.imgUrl !== null) {
                    userAvatar.src = res.data.imgUrl;
                }


                // Fetch ride owner's profile information
                const rideOwnerId = window.location.search.substr(1).split('=')[1]; //
                fetch(`https://enjames-ridemyway.herokuapp.com/api/v1/users/${rideOwnerId}`)
                    .then(resp => resp.json())
                    .then((resp) => {
                        const profileBody = document.getElementById('profileBody');
                        const {
                            id, firstname, lastname, email, gender, phone, city, state, imgUrl
                        } = res.data;

                        if (resp.status === 'success') {
                            const profileBodyHTML = `<div class="profile-section left">
                                <div class="profile-image">
                                    <div class="image">
                                        <img src="${imgUrl}" alt="User avatar">
                                    </div>
                                </div>
                            </div>
                            <div class="in-between"></div>
                            <div class="profile-section right">
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>First Name</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${firstname}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>Last Name</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${lastname}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>Gender</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${gender}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>Email address</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${email}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>Mobile Number</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${phone}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>City</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${city}</span>
                                    </div>
                                </div>
                                <div class="profile-item-wrapper">
                                    <div class="profile-item">
                                        <span>State</span>
                                    </div>
                                    <div class="item-details">
                                        <span>${state}</span>
                                    </div>
                                </div>
                            </div>`;

                            // Append to DOM
                            profileBody.innerHTML = profileBodyHTML;
                            return;
                        }

                        profileBody.innerHTML = `<div class="no-running">Unable to fetch user's information at the moment. Please reload the page.</div>.`
                    })
            }
        })
        .catch(() => PageFunctions.showMessage('error', 'An error occurred. Please try reloading the page.'));
}, false);
