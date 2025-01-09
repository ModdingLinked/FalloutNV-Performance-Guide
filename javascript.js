window.addEventListener('resize', sizeChanged);
document.addEventListener('DOMContentLoaded', function () {
    setD3D9Year();
    updateProgressBarAndFadeIn();
    createImageHandlers();
    markActiveSection();
    refreshRateCalculations(document.getElementById("rrRTSS"));
});
window.onscroll = updateProgressBarAndFadeIn;

function setD3D9Year(){
    var d3d9Year = document.getElementById("d3d9_year");
    var d3d9Date = new Date(2001, 8, 24); // Windows XP RTM date - API is finalized by then
    var today = new Date();
    var diff = today - d3d9Date;
    var years = Math.floor(diff / 31536000000);
    d3d9Year.innerHTML = years;
}

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

function disable(element) {
    element.style.display = "none";
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

function largestCommonFactor(rate) {
    for (let i = 120; i > 0; i--) {
        if (rate % i === 0) {
            return i;
        }
    }
    return 1;
}

function handleRRConfirmation(rr){
    if (rr > 120) {
        const errorMsg = document.getElementsByClassName("applyError");

        for (let i = 0; i < errorMsg.length; i++) {
            errorMsg[i].style.display = "inline-block";
            errorMsg[i].style.opacity = "100%";
            setTimeout(fadeOut, 5500, errorMsg[i]);
            setTimeout(disable, 5550, errorMsg[i]);
        }
    }
    else if (rr >= 60) {
        const confirmation = document.getElementsByClassName("applyConfirmation");
        for (let i = 0; i < confirmation.length; i++) {
            confirmation[i].style.display = "inline-block";
            confirmation[i].style.opacity = "100%";
            setTimeout(fadeOut, 2500, confirmation[i]);
            setTimeout(disable, 2550, confirmation[i]);
        }
    }
}

function refreshRateCalculations(thisObj) {
    const inputField = thisObj;
    rr = inputField.value;

    handleRRConfirmation(rr);

    if (rr >= 60) {
        var rrVRR = Math.round(rr * (1 - rr * 0.00028));
        const fpsFixed = document.getElementsByClassName("fpsFixed");
        const fpsVSync = document.getElementsByClassName("fpsVSync");
        const fpsVRR = document.getElementsByClassName("fpsVRR");

        let valueVRR = rrVRR;
        let valueVSync = rr - 0.05;
        let valueFixed = rr;

        let divider = 0;

        if (rr > 120) {
            valueVRR = 120;
            valueVSync = largestCommonFactor(rr);
            if (valueVSync < 60) {
                valueVSync = "Invalid refresh rate - can't be cleanly divided!";
            }

            valueFixed = valueVSync;
            divider = rr / valueVSync;

            if (divider > 1) {
                let scanModeSetup = document.getElementsByClassName("scanModeSetup");
                for (let i = 0; i < scanModeSetup.length; i++) {
                    scanModeSetup[i].style.display = "block";
                }

                let scanModeDivider = document.getElementsByClassName("scanModeDivider");
                for (let i = 0; i < scanModeDivider.length; i++) {
                    scanModeDivider[i].innerHTML = "1/" + divider;
                }
            }
        }
        else {
            let scanModeSetup = document.getElementsByClassName("scanModeSetup");
            for (let i = 0; i < scanModeSetup.length; i++) {
                scanModeSetup[i].style.display = "none";
            }
        }

        for (let i = 0; i < fpsFixed.length; i++) {
            fpsFixed[i].innerHTML = valueFixed;
        }

        for (let i = 0; i < fpsVSync.length; i++) {
            fpsVSync[i].innerHTML = valueVSync;
        }

        for (let i = 0; i < fpsVRR.length; i++) {
            fpsVRR[i].innerHTML = valueVRR;
        }
    }
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