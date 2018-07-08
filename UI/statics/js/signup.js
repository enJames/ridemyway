document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://enjames-ridemyway.herokuapp.com/api/v1/auth/signup';

    const firstname = document.getElementById('firstname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submit = document.getElementById('submit');

    const userData = new FormData({
        firstname,
        email,
        password,
        confirmPassword
    })

    const fetchDataObject = {
        method: 'POST',
        body: userData,
        headers: new Headers()
    }

    submit.addEventListener('click', (e) => {
        e.preventDefault();

        fetch(url, fetchDataObject)
            .then(res => res)
            .then(res => console.log(res))
            .catch(error => console.error('There was an error', error));
    }, false);
}, false);
