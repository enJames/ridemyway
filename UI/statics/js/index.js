document.addEventListener('DOMContentLoaded', () => {
    const navigationToggler = document.getElementById('navigationToggler');
    const navigationDiv = document.getElementById('navigationId');
    const navigationUl = document.getElementsByClassName('navigation-ul')[0];
    
    // Toggle collapse
    navigationToggler.addEventListener('click', () => {
        collapseToggle(navigationToggler, navigationDiv, navigationUl)
    }, false);
});
