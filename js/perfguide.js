function setD3D9Year() {
    var d3d9Year = document.getElementById("d3d9_year");
    var d3d9Date = new Date(2001, 8, 24); // Windows XP RTM date - API is finalized by then
    var today = new Date();
    var diff = today - d3d9Date;
    var years = Math.floor(diff / 31536000000);
    d3d9Year.innerHTML = years;
}

function disable(element) {
    element.style.display = "none";
}

function createImageHandlers() {
    const overlay = document.getElementById('image-overlay');
    const enlargedImage = document.getElementById('enlarged-image');

    if (!enlargedImage || !overlay)
        return;

    const images = document.querySelectorAll('.content-img');
    if (!images)
        return;

    images.forEach(image => {
        image.addEventListener('click', function () {
            overlay.style.display = "flex";
            enlargedImage.src = this.src;
        });
    });

    overlay.addEventListener('click', function () {
        overlay.style.display = "none";
        enlargedImage.src = '';
    });
}

function markActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar .pageLinks a');

    function setActiveSection() {
        let index = sections.length;
        while (--index && window.scrollY + 400 < sections[index].offsetTop) { }
        navLinks.forEach((link) => link.classList.remove('active'));
        navLinks[index].classList.add('active');
    }

    window.addEventListener('scroll', setActiveSection);
    setActiveSection();
}