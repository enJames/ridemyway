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

                const {
                    firstname, lastname, email, gender, phone, city, state, imgUrl, completeness
                } = res.data;
                // Get image element and set src to current user image
                const userAvatar = document.getElementById('userAvatar');

                if (imgUrl !== null) {
                    userAvatar.src = res.data.imgUrl;
                }
                
                const profileBody = document.getElementById('profileBody');
                const profileBodyHTML = `<div class="profile-section left">
                    <div class="profile-image">
                        <div class="image">
                            <img src="${(imgUrl)?imgUrl:'statics/img/user-avatar.jpg'}" alt="User avatar">
                        </div>
                        <div class="btn-container">
                            <a href="upload.html">Change image</a>
                        </div>
                    </div>
                    <div class="profile-completeness-profile">
                        <h4>Profile completeness</h4>
                        <div class="profile-percentage">
                            <div id="percentageBar">
                                <div id="percentage">${completeness}</div>
                            </div>
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
                            <span>${(lastname)?lastname:''}</span>
                        </div>
                    </div>
                    <div class="profile-item-wrapper">
                        <div class="profile-item">
                            <span>Gender</span>
                        </div>
                        <div class="item-details">
                            <span>${(gender)?gender:''}</span>
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
                    <div class="btn-container">
                        <a href="edit.html">Edit</a>
                    </div>
                </div>`;

                // Append to DOM
                profileBody.innerHTML = profileBodyHTML;

                // Update profile completeness after DOM is updated
                setTimeout(() => {
                    const percentageBar = document.getElementById('percentageBar');

                    percentageBar.style.width = completeness;
                    if (completeness === '33%') {
                        percentageBar.style.backgroundColor = 'rgb(180,20,0)';
                    }
                    if (completeness === '88%') {
                        percentageBar.style.backgroundColor = 'rgb(120,170,0)';
                    }
                    if (completeness === '100%') {
                        percentageBar.style.backgroundColor = 'rgb(10,120,0)';
                    }
                },300);


                PageFunctions.toggleProfileIndicatorText(res.data.completeness);
            }
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
