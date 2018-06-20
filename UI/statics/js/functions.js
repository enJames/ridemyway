const collapseToggle = (toggler, collapsible, collapsibleContent) => {
    if (collapsible.clientHeight === 0) {
        collapsible.style.height = collapsibleContent.clientHeight + 'px';
        toggler.setAttribute('aria-expanded', true);
    } else {
        collapsible.style.height = '0';
        toggler.setAttribute('aria-expanded', false);
    }
};

const displayToggle = (e, element) => {
    if (e.target.offsetParent.className === 'user-wrapper' || e.target.offsetParent.className === 'dropdown') {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    } else {
        element.style.display = 'none';
    }
};
