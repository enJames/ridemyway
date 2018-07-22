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
                const profileBody = document.getElementById('profileBody');
                const profileBodyHTML = `<div class="profile-item-wrapper">
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
                            <span>${(lastname)?lastname:''}</span>
                        </div>
                    </div>
                    <div class="profile-item-wrapper">
                        <div class="profile-item">
                            <span>Gender</span>
                        </div>
                        <div class="item-details">
                            <span>${(gender)?lastname:''}</span>
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
                            <span>${(phone)?phone:''}</span>
                        </div>
                    </div>
                    <div class="profile-item-wrapper">
                        <div class="profile-item">
                            <span>City</span>
                        </div>
                        <div class="item-details">
                            <span>${(city)?city:''}</span>
                        </div>
                    </div>
                    <div class="profile-item-wrapper">
                        <div class="profile-item">
                            <span>State</span>
                        </div>
                        <div class="item-details">
                            <span>${(state)?state:''}</span>
                        </div>
                    </div>
                </div>
                <div class="btn-container">
                    <a href="edit.html">Edit</a>
                </div>`;

                // Append to DOM
                profileBody.innerHTML = profileBodyHTML;

                return profileBody.innerHTML;
            }
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
