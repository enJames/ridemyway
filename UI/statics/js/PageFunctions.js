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
    }
};
