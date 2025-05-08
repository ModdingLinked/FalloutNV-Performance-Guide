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

function largestCommonFactor(rate) {
    for (let i = 120; i > 0; i--) {
        if (rate % i === 0) {
            return i;
        }
    }
    return 1;
}

function handleRRConfirmation(rr) {
    if (rr > 120) {
        const errorMsg = document.getElementsByClassName("applyError");
    }
    else if (rr >= 60) {
        const confirmation = document.getElementsByClassName("applyConfirmation");
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