document.addEventListener('DOMContentLoaded', () => {
    fetch('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then((res) => {
            if (res.status === 'fail') {
                return location.replace('https://enjames.github.io/ridemyway/UI/login.html');
            }
            // Get image element and set src to current user image
            const imagePreview = document.getElementById('imagePreview');
            const { imgUrl } = res.data;

            if (imgUrl !== null) {
                imagePreview.src = res.data.imgUrl;
            }

            // Show image preview before upload, replace current image
            const uploader = document.getElementById('uploader');

            uploader.addEventListener('change', (e) => {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);

                reader.addEventListener('load', () => {
                    imagePreview.src = reader.result;
                }, false);
            }, false);

            // Process image sending to server
            const submit = document.getElementById('submit');

            submit.addEventListener('click', (e) => {
                e.preventDefault();

                // Get spinner
                const spinner = document.getElementById('spinner');

                // Display spinner while systems processes request
                spinner.style.opacity = '1';

                const url = 'https://enjames-ridemyway.herokuapp.com/api/v1/users/profile/upload';
                const formData = new FormData();
                formData.append(uploader.name, uploader.files[0]);

                fetch(url, {
                    method: 'PUT',
                    body: formData,
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then((res) => {
                        PageFunctions.showMessage(res.status, res.message);
                        if (res.status === 'success') {
                            return location.replace('https://enjames-ridemyway.herokuapp.com/api/v1/users/profile');
                        }
                    })
            }, false);
        });
}, false);
