document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/check', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            // if user is logged in
            if (res.status === 'fail') {
                return location.replace('https://enjames.github.io/ridemyway/UI/login.html?auth=false');
            }

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
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
