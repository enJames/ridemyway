document.addEventListener('DOMContentLoaded', () => {
    const rideId = window.location.search.substr(1).split('=')[1];
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    // Enable buttons
    updateBtn.disabled = false;
    deleteBtn.disabled = false;



        // scroll to top
    let lockScrolling = () => {
        if (document.documentElement.scrollTop >= 0) {
            document.documentElement.scrollTop = 0;
        }
    };

    document.querySelectorAll('.btn-action').forEach((button) => {
        button.addEventListener('click', () => {
            document.documentElement.scrollTop = 0;

            if (button.id === 'updateBtn') {
                return location.href = 'https://enjames.github.io/ridemyway/UI/update-ride.html';
            }
            if (button.id === 'deleteBtn') {
                const alertDiv = document.getElementById('alertDiv');
                const dimmer = document.getElementById('dimmer');

                window.addEventListener('scroll', lockScrolling);

                dimmer.style.display = 'block';
                alertDiv.style.top = '50%';
            }
            if (button.id === 'negative') {
                window.removeEventListener('scroll', lockScrolling);
                dimmer.style.display = 'none';
                alertDiv.style.top = '-50%';
            }
            if (button.id === 'positive') {
                const spinner =  document.getElementById('spinner').style.opacity = '1';

                const url =

                fetch(`https://enjames-ridemyway.herokuapp.com/api/v1/users/rides/${rideId}`, {
                    method: 'PUT',
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then((res) => {
                        PageFunctions.showMessage(res.status, res.message);
                        if (res.status === 'success') {
                            return location.replace('https://enjames-ridemyway.herokuapp.com/api/v1/users/dashboard');
                        }
                    });
            }
        });
    })

}, false);
