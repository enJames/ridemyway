document.addEventListener('DOMContentLoaded', () => {
    const navigationToggler = document.getElementById('navigationToggler');



    // Toggle collapse
    navigationToggler.addEventListener('click', () => {
        const navigationDiv = document.getElementById('navigationId');
        const navigationItemsWrapper = document.getElementsByClassName('navigation-items-wrapper')[0];
        const userNavToggler = document.getElementById('userNavToggler');

        PageFunctions
            .collapseToggle(
                navigationToggler,
                navigationDiv,
                navigationItemsWrapper
            );
    }, false);

    // Toggle User nav display
    document.addEventListener('click', (e) => {
        const userNav = document.getElementById('userNav');
        
        PageFunctions.displayToggle(e, userNav);
    }, false);

    // Scroll element into view
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
