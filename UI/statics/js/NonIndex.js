document.addEventListener('DOMContentLoaded', () => {
    const navigationToggler = document.getElementById('navigationToggler');
    const navigationDiv = document.getElementById('navigationId');
    const navigationUl = document.getElementsByClassName('navigation-ul')[0];
    const userNavToggler = document.getElementById('userNavToggler');
    const userNav = document.getElementById('userNav');

    // Toggle collapse
    navigationToggler.addEventListener('click', () => {
        collapseToggle(navigationToggler, navigationDiv, navigationUl)
    }, false);

    // Toggle User nav display
    userNavToggler.addEventListener('click', () => {
        displayToggle(userNav);
    }, false);
});
