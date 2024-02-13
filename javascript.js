window.addEventListener('resize', sizeChanged);
window.addEventListener('DOMContentLoaded', updateProgressBarAndFadeIn);
window.onscroll = function () { updateProgressBarAndFadeIn() };

window.onload = function () {
    DarkReader.disable();
}

function sizeChanged() {
    if (document.documentElement.clientWidth > 760) {
        document.getElementById("header").style.marginLeft = "";
        document.getElementById("sidebar").style.width = "";
        document.getElementById("flippyHeader").innerText = "🙃"
    }
}

function toggleNav() {
    if (document.getElementById("sidebar").style.width == 0) {
        document.getElementById("header").style.marginLeft = "80%";
        document.getElementById("sidebar").style.width = "80%";
        document.getElementById("flippyHeader").innerText = "🙂";
    }
    else {
        document.getElementById("header").style.marginLeft = "";
        document.getElementById("sidebar").style.width = "";
        document.getElementById("flippyHeader").innerText = "🙃"
    }
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

    for (var i = 0; i < sections.length; i++) {
        var sectionTop = sections[i].getBoundingClientRect().top;
        var sectionHeight = sections[i].clientHeight;

        if (sectionTop < height && sectionTop + sectionHeight > 0) {
            sections[i].classList.add("fade-in");
        }
    }


    height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById("myBar").style.width = (winScroll / height) * 100 + "%";
}
