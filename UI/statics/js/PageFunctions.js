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
    showMessage: (elementMessage, elementSpinner, messageType, message) => {
        elementMessage.innerHTML = message;

        if (messageType === 'success') {
            elementMessage.style.backgroundColor = 'rgba(80,220,80,.6)';
        }
        if (messageType === 'fail') {
            elementMessage.style.backgroundColor = 'rgba(220,80,80,.6)';
        }
        if (messageType === 'error') {
            elementMessage.style.backgroundColor = 'rgba(240,240,0,.6)';
        }

        elementMessage.style.opacity = '1'; // reveals message
        elementSpinner.style.opacity = '0'; // stops spinner once a response is displayed

        setTimeout(() => {
            elementMessage.style.opacity = '0'; // hides message again
        },3000);
    }
};
