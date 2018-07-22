const PageFunctions = {
    changeNavigation: (resStatus, currentPage) => {
        const navigationId = document.getElementById('navigationId');

        if (resStatus === 'success') {
            if (currentPage === 'index') {
                return navigationId.innerHTML = `<ul class="navigation-ul">
                    <li class="navigation-li"> <a href="dashboard.html">Dashboard</a></li>
                    <li class="navigation-li" id="logout">Log out</li>
                </ul>`;

            }
            if (currentPage === 'all-offers') {
                return navigationId.innerHTML = `<div class="navigation-items-wrapper">
                    <form class="navigation-form" method="POST">
                        <input type="search" id="searchInput" placeholder="Search a ride">
                        <button type="submit" id="submit">Search</button>
                    </form>
                    <ul class="navigation-ul">
                        <li class="navigation-li"> <a href="dashboard.html">Dashboard</a></li>
                        <li class="navigation-li"><a href="all-offers.html">Ride Offers</a></li>
                        <li class="navigation-li" id="logout">Log out</li>
                    </ul>
                </div>`;
            }
            return navigationId.innerHTML = `<div class="navigation-items-wrapper">
                <ul class="navigation-ul">
                    <li class="navigation-li"> <a href="dashboard.html">Dashboard</a></li>
                    <li class="navigation-li"><a href="all-offers.html">Ride Offers</a></li>
                    <li class="navigation-li" id="logout">Log out</li>
                </ul>
            </div>`;
        }
        // else
        if (currentPage === 'index') {
            return navigationId.innerHTML = `<ul class="navigation-ul">
                                                <li class="navigation-li"><a href="login.html">Login</a></li>
                                                <li class="navigation-li"><a href="sign-up.html">Sign Up</a></li>
                                            </ul>`;
        }
        if (currentPage === 'all-offers') {
            return navigationId.innerHTML = `<div class="navigation-items-wrapper">
                <form class="navigation-form" method="POST">
                    <input type="search" id="searchInput" placeholder="Search a ride">
                    <button type="submit" id="submit">Search</button>
                </form>
                <ul class="navigation-ul">
                    <li class="navigation-li"><a href="all-offers.html">Ride Offers</a></li>
                    <li class="navigation-li"><a href="login.html">Login</a></li>
                    <li class="navigation-li"><a href="sign-up.html">Sign Up</a></li>
                </ul>
            </div>`;
        }
        return navigationId.innerHTML = `<div class="navigation-items-wrapper">
            <ul class="navigation-ul">
                <li class="navigation-li"><a href="all-offers.html">Ride Offers</a></li>
                <li class="navigation-li"><a href="login.html">Login</a></li>
                <li class="navigation-li"><a href="sign-up.html">Sign Up</a></li>
            </ul>
        </div>`;
    },
    displayUserNavigation: () => {
        const userNavigation = document.getElementById('userNavigation');
        return userNavigation.style.display = 'flex';
    },
    collapseToggle: (toggler, collapsible, collapsibleContent) => {
        if (collapsible.clientHeight === 0) {
            collapsible.style.height = collapsibleContent.clientHeight + 20 + 'px';
            toggler.setAttribute('aria-expanded', true);
        } else {
            collapsible.style.height = '0';
            toggler.setAttribute('aria-expanded', false);
        }
    },
    displayToggle: (e, element) => {
        if (e.target.offsetParent.className === 'user-wrapper' || e.target.offsetParent.className === 'dropdown') {
            if (element.style.display === 'none' || element.style.display === '') {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        } else {
            element.style.display = 'none';
        }
    },
    toggleProfileIndicatorText: (profileCompleteness) => {
        if (profileCompleteness !== '100%') {
            const profileCompletenessDiv = document.getElementsByClassName('profile-completeness')[0];
            const profileCompletenessIndicator = document.getElementById('profileCompletenessIndicator');
            const description = document.getElementById('description');

            // display profileCompletenessIndicator
            profileCompletenessDiv.style.display = 'block';
            profileCompletenessDiv.style.opacity = '1';
            profileCompletenessIndicator.innerHTML = profileCompleteness;

            profileCompletenessIndicator.addEventListener('click', () => {
                if (profileCompletenessDiv.clientWidth < 200) {
                    profileCompletenessDiv.style.width = '232px';

                    setTimeout(() => {
                        description.style.display = 'inline-block';
                        setTimeout(() => {
                            description.style.opacity = '1';
                        },50)
                    },400)
                } else {
                    description.style.opacity = '0';

                    setTimeout(() => {
                        description.style.display = 'none';
                        profileCompletenessDiv.style.width = '75px';
                    },400)
                }
            },false);
        }
    },
    showMessage: (status, message) => {
        // message and spinner
        const messageEl = document.getElementById('message');
        const spinner = document.getElementById('spinner');

        messageEl.innerHTML = message;
        messageEl.style.opacity = '1'; // reveals message

        if (status === 'success') {
            messageEl.style.backgroundColor = 'rgb(80,220,80)';
        }
        if (status === 'fail') {
            messageEl.style.backgroundColor = 'rgb(220,80,80)';
        }
        if (status === 'error') {
            messageEl.style.backgroundColor = 'rgb(240,240,0)';
        }

        // stops spinner once a response is displayed
        spinner.style.opacity = '0';

        setTimeout(() => {
            messageEl.style.opacity = '0'; // hides message again
        },4000);
    },
    enableLogout: () => {
        // logout element
        const logout = document.getElementById('logout');

        // logout
        logout.addEventListener('click', (e) => {
            e.preventDefault();

            const fetchDataObject = {
                method: 'POST',
                credentials: 'include'
            }

            fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/logout', fetchDataObject)
                .then(res => res.json())
                .then((res) => {
                    if (res.status === 'success') {
                        return location.replace('https://enjames.github.io/ridemyway/UI/login.html');
                    }
                })
                .catch(error => PageFunctions.showMessage(res.status, res.message));
        }, false);
    },
    dateToWords: (dateToConvert) => {
        const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dateArray = dateToConvert.split('T')[0].split('-');
        const [year, month, day] = dateArray;

        const dateInWords = `${monthsArray[month - 1]} ${day}, ${year}`;

        return dateInWords;
    },
    to12hrFormat: (timeToConvert) => {
        let amOrpm;
        let hour;
        const timeArray = timeToConvert.split(':');
        const [splittedHour, minute] = timeArray;

        if (splittedHour === '00') {
            hour = '12';
            amOrpm = 'AM';
        } else if (splittedHour === '12') {
            hour = splittedHour;
            amOrpm = 'PM';
        } else if (splittedHour > '12') {
            hour = splittedHour - 12;
            amOrpm = 'PM';
        } else {
            hour = splittedHour
            amOrpm = 'AM'
        }

        const timeIn12hrFormat = `${hour}: ${minute} ${amOrpm}`;

        return timeIn12hrFormat;
    }
};
