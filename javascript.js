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

function getFilesInDirectory(directory, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', directory);
    xhr.onload = function () {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
        const links = htmlDoc.getElementsByTagName('a');
        const files = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href.endsWith('.json')) {
                files.push(href);
            }
        }
        callback(files);
    };
    xhr.send();
}

function readJSONFile(filePath) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open("GET", filePath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                //console.log(json);
                var length = json.Runs[0].CaptureData.MsBetweenPresents.length;
                var sum = json.Runs[0].CaptureData.MsBetweenPresents.reduce((accumulator, currentValue) => accumulator + currentValue);
                var data = {
                    ApiInfo: json.Info.ApiInfo,
                    GameName: json.Info.GameName,
                    PresentationMode: json.Info.PresentationMode,
                    GPU: json.Info.GPU,
                    AvgFPS: 1000 / (sum / length),
                    FrametimeData: json.Runs[0].CaptureData.MsBetweenPresents,
                    Comment: json.Info.Comment,
                };
                resolve(data);
            } else if (xhr.status === 404) {
                reject(new Error('File not found'));
            }
        };
        xhr.send(null);
    });
}

function test(filePath) {
    const fpsPromises = [];
    getFilesInDirectory(filePath, function (files) {
        files.forEach(function (file) {
            fpsPromises.push(readJSONFile(file));
        });

        Promise.all(fpsPromises)
            .then(function (fpsData) {
                createBarChart(fpsData);
            })
            .catch(function (error) {
                console.error(error);
            });
    });
}

function calculate1Percentile(array) {
    const sortedArray = array.sort((a, b) => b - a);
    const n = sortedArray.length;
    const p = 1;
    const index = (n + 1) * p / 100;
    if (Number.isInteger(index)) {
        return sortedArray[index - 1];
    } else {
        const floorIndex = Math.floor(index) - 1;
        const ceilingIndex = Math.ceil(index) - 1;
        const floorValue = sortedArray[floorIndex];
        const ceilingValue = sortedArray[ceilingIndex];
        return (floorValue + ceilingValue) / 2;
    }
}




function createBarChart(data) {
    const chart = document.createElement('div');
    chart.style.display = 'flex';
    chart.style.flexDirection = 'column';
    const chartTitle = document.createElement('h3');
    chartTitle.innerText = data[0].GameName;
    chart.appendChild(chartTitle);
    data.sort((a, b) => b.AvgFPS - a.AvgFPS);
    data.forEach(function (dataItem) {
        const chartContainer = document.createElement('div');
        chartContainer.style.display = 'flex';
        chartContainer.style.flexDirection = 'row';
        chartContainer.style.alignItems = 'center';


        const barName = document.createElement('h3');
        barName.innerText = dataItem.Comment ? dataItem.Comment : 'No comment';
        chartContainer.appendChild(barName);

        console.log();
        const chartItem = document.createElement('div');
        chartItem.style.height = '20pt';
        chartItem.style.width = `${dataItem.AvgFPS}pt`;
        chartItem.style.backgroundColor = `#2297f3`;
        chartItem.textContent = dataItem.AvgFPS.toFixed(2);
        chartContainer.appendChild(chartItem);


        var percentile = 1000/calculate1Percentile(dataItem.FrametimeData);
        const percentileChart = document.createElement('div');
        percentileChart.style.height = '20pt';
        percentileChart.style.width = `${percentile}pt`;
        percentileChart.style.backgroundColor = `#f17d20`;
        percentileChart.textContent = percentile.toFixed(2);
        chartContainer.appendChild(percentileChart);

        percentile = 1000/calculate1Percentile(dataItem.FrametimeData);
        const percentileChart2 = document.createElement('div');
        percentileChart2.style.height = '20pt';
        percentileChart2.style.width = `${percentile}pt`;
        percentileChart2.style.backgroundColor = `#ffb400`;
        percentileChart2.textContent = percentile.toFixed(2);
        chartContainer.appendChild(percentileChart2);
        
        chart.appendChild(chartContainer);
    });

    document.getElementById('testlmao').appendChild(chart);
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