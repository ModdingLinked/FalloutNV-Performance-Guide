window.addEventListener('resize', sizeChanged);
document.addEventListener('DOMContentLoaded', function () {
    updateProgressBarAndFadeIn();
    createImageHandlers();
    markActiveSection();
});
window.onscroll = updateProgressBarAndFadeIn;

function sizeChanged() {
    var sidebar = document.getElementsByClassName("left-sidebar");
    if (sidebar && sidebar.length > 0) {
        if (document.documentElement.clientWidth > 760) {
            document.getElementsByClassName("left-sidebar")[0].style.width = "";
        }
    }
}

function toggleNav() {
    var sidbear = document.getElementsByClassName("sidebar left-sidebar")[0];
    if (sidbear.style.width == 0) {
        sidbear.style.width = "75%";
        globalThis.menuIsOpen = true;
    }
    else {
        sidbear.style.width = "";
        globalThis.menuIsOpen = false;
    }
}

function fadeOut(element) {
    element.style.opacity = "0%";
}

function rotate(element, rotation = 180) {
    element.style.transform = 'rotatex(' + rotation + 'deg)';
}

function expandCard(thisObj, $open, $dontReset) {
    const chevron = thisObj.getElementsByClassName("chevron")[0]
    if ($open.classList.contains('expander-opened') && !$dontReset) {
        rotate(chevron, 0)
        $open.classList.remove('expander-opened');
        setTimeout(() => $open.style.display = "none", 400);
        thisObj.classList.remove('active');
    }
    else {
        $open.classList.add('expander-opened');
        rotate(chevron, 180);
        $open.style.display = "block";
        thisObj.classList.add('active');
    }
}

function updateProgressBarAndFadeIn() {
    var sections = document.getElementsByClassName("section");
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = window.innerHeight;

    if (sections) {
        for (var i = 0; i < sections.length; i++) {
            var sectionTop = sections[i].getBoundingClientRect().top;
            var sectionHeight = sections[i].clientHeight;

            if (sectionTop < height && sectionTop + sectionHeight > 0) {
                sections[i].classList.add("fade-in");
            }
        }
    }

    var progressBar = document.getElementsByClassName("progress-bar")[0];
    if (progressBar) {
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scroll = (winScroll / height);
        var bottomMargin = (height - 25) / height;
        progressBar.style.width = scroll * 100 + "%";
    }

    var sidebars = document.getElementsByClassName("sidebar");
    if (sidebars) {
        var styleVal = "calc(100vh - 6.25em)";

        if (document.documentElement.clientHeight > 900 && scroll > bottomMargin) {
            styleVal = "calc(100vh - 8.5em)";
        }

        for (var i = 0; i < sidebars.length; i++) {
            sidebars[i].style.height = styleVal;
        }
    }
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

function refreshRateCalculations() {
    const rr = document.getElementById("refreshRateInput").value;
    const confirmation = document.getElementById("applyConfirmation");
    confirmation.style.opacity = "100%";
    if (rr > 24) {
        var rrVRR = Math.round(rr * (1 - rr * 0.00028));
        const fpsFixed = document.getElementsByClassName("fpsFixed");
        const fpsVSync = document.getElementsByClassName("fpsVSync");
        const fpsVRR = document.getElementsByClassName("fpsVRR");
        const iFpsFixed = document.getElementsByClassName("iFpsFixed");
        const iFpsVSync = document.getElementsByClassName("iFpsVSync");

        fpsFixed[0].innerHTML = rr;
        fpsVSync[0].innerHTML = rr - 0.05;

        for (const fpsVRRItem of fpsVRR) {
            fpsVRRItem.innerHTML = rrVRR;
        }
        for (const iFpsFixedItem of iFpsFixed) {
            iFpsFixedItem.innerHTML = rr;
        }
        for (const iFpsVSyncItem of iFpsVSync) {
            iFpsVSyncItem.innerHTML = rr - 1;
        }
    }
    setTimeout(fadeOut, 2500, confirmation);
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