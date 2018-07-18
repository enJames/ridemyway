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
        })
        .catch((err) => console.error('There was a problem', err));
});
