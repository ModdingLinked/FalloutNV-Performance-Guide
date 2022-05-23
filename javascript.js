window.addEventListener('resize', sizeChanged);

function sizeChanged() {
    if (document.documentElement.clientWidth > 760) {
        document.getElementById("header").style.marginLeft = "";
        document.getElementById("sidebar").style.width = "";
        document.getElementById("flippyHeader").textContent = "🙃"
    }
}

function toggleNav() {
    if (document.getElementById("sidebar").style.width == 0) {
        document.getElementById("header").style.marginLeft = "80%";
        document.getElementById("sidebar").style.width = "80%";
        document.getElementById("flippyHeader").textContent = "🙂";
    }
    else {
        document.getElementById("header").style.marginLeft = "";
        document.getElementById("sidebar").style.width = "";
        document.getElementById("flippyHeader").textContent = "🙃"
    }
}

function refreshRateCalculations() {
    var rr = document.getElementById("refreshRateInput").value;
    if (rr > 24) {
        var rrVSync = rr - 1;
        var rrVRR = Math.round((rr - (rr * 0.068)));

        var fpsFixed = document.getElementsByClassName("fpsFixed");
        var fpsVSync = document.getElementsByClassName("fpsVSync");
        var fpsVRR = document.getElementsByClassName("fpsVRR");
        var iFpsFixed = document.getElementsByClassName("iFpsFixed");
        var iFpsVSync = document.getElementsByClassName("iFpsVSync");

        fpsFixed[0].innerHTML = rr;
        fpsVSync[0].innerHTML = rrVSync

        for (var i = 0; i < fpsVRR.length; i++) {
            fpsVRR[i].innerHTML = rrVRR;
        }
        for (i = 0; i < iFpsFixed.length; i++) {
            iFpsFixed[i].innerHTML = Math.round(rr);
            iFpsVSync[i].innerHTML = Math.round(rrVSync);
        }


    }
}

function expandLimiterTutorials(thisObj, $open, $close) {
    var expanderTop = document.getElementsByClassName("expander-top");
    expanderTop[0].style.borderBottomLeftRadius = 0;
    expanderTop[0].style.borderBottomRightRadius = 0;
    $open.style.display = "block";
    $close.style.display = "";
}