window.addEventListener('resize', sizeChanged);

let settings = {
    grass: 0,
    light: 200,
    specularity: 200,
    objects: 2.5,
};

let selectedSettings = {
    grass: -1,
    light: -1,
    specularity: -1,
    objects: -1,
};
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
    if (rr > 24) {
        const rrVSync = rr - 1;
        if (rr < 90) {
            var rrVRR = Math.round((rr - (rr * 0.034)));
        }
        else {
            var rrVRR = Math.round((rr - (rr * 0.068)));
        }

        const fpsFixed = document.getElementsByClassName("fpsFixed");
        const fpsVSync = document.getElementsByClassName("fpsVSync");
        const fpsVRR = document.getElementsByClassName("fpsVRR");
        const iFpsFixed = document.getElementsByClassName("iFpsFixed");
        const iFpsVSync = document.getElementsByClassName("iFpsVSync");

        fpsFixed[0].innerHTML = rr;
        fpsVSync[0].innerHTML = rrVSync;

        for (const fpsVRRItem of fpsVRR) {
            fpsVRRItem.innerHTML = Math.round(rrVRR);
        }
        for (const iFpsFixedItem of iFpsFixed) {
            iFpsFixedItem.innerHTML = Math.round(rr);
        }
        for (const iFpsVSyncItem of iFpsVSync) {
            iFpsVSyncItem.innerHTML = Math.round(rrVSync);
        }
    }
}

function rotate(element, rotation = 180) {
    element.style.transform = 'rotatex(' + rotation + 'deg)';
  }
  

function expandCard(thisObj, $open) {
    const chevron =thisObj.getElementsByClassName("chevron")[0]
    if ($open.classList.contains('expander-opened')) {
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

function expandLimiterTutorials(thisObj, $open, $close) {
    const expanderTop = document.getElementById('api-expander');
    if ($open.classList.contains('expander-opened')) {
        thisObj.classList.remove('active');
        $open.classList.remove('expander-opened');
        setTimeout(() => $open.style.display = "none", 400)
        expanderTop.classList.remove('active');
    }
    else {
        if ($close.classList.contains('expander-opened')) {
            $close.style.display = "none";
            $close.classList.remove('expander-opened')
            for (const activeButton of activeButtons = document.getElementsByClassName("api-selection active")) {
                activeButton.classList.remove('active');
            }
        }
        thisObj.classList.add('active');
        $open.classList.add('expander-opened');
        $open.style.display = "block";
        expanderTop.classList.add('active');
    }
}