document.addEventListener('DOMContentLoaded', () => {
    // Check logged in status
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/auth/check', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            PageFunctions.changeNavigation(res.status, 'ride-offer');

            if (res.status === 'success') {
                PageFunctions.enableLogout();
            }
        })
        .catch((err) => console.error('There was a problem', err));
});
