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

            enableLogout();
        })
        .catch((err) => console.error('There was a problem', err));
}, false);
