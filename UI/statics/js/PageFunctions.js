const PageFunctions = {
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

        if (status === 'success') {
            messageEl.style.backgroundColor = 'rgb(80,220,80)';
            return location.replace('https://enjames.github.io/ridemyway/UI/dashboard.html');
        }
        if (status === 'fail') {
            messageEl.style.backgroundColor = 'rgb(220,80,80)';
        }
        if (status === 'error') {
            messageEl.style.backgroundColor = 'rgb(240,240,0)';
        }

        messageEl.style.opacity = '1'; // reveals message
        spinner.style.opacity = '0'; // stops spinner once a response is displayed

        setTimeout(() => {
            messageEl.style.opacity = '0'; // hides message again
        },4000);
    }
};
