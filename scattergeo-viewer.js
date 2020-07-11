var NW_PROVIDER_NAMES = null;
var SCALE = null;
var DEBUG = null;
var MAX_VALUE = null;
var scl = null;
var color = null,
    signalSize = null,
    hoverText = null,
    markerColor = null,
    NWProvider = null,
    signalStrength = null,
    signalLat = null,
    signalLon = null;

$(document).ready(function () {
    initialize();
    $.ajax({
        type: "GET",
        url: "mooc-server/geo.md.csv",
        dataType: "text",
        success: function (data) {
            if (DEBUG) {
                testData();
            } else {
                populateData(data);
            }
        }
    });
});

function initialize() {
    scl = [
        [0, '#57bb8a'],
        [0.5, '#63b682'],
        [0.10, '#73b87e'],
        [0.15, '#84bb7b'],
        [0.20, '#94bd77'],
        [0.25, '#a4c073'],
        [0.30, '#b0be6e'],
        [0.35, '#c4c56d'],
        [0.40, '#d4c86a'],
        [0.45, '#e2c965'],
        [0.50, '#f5ce62'],
        [0.55, '#f3c563'],
        [0.60, '#e9b861'],
        [0.65, '#e6ad61'],
        [0.70, '#ecac67'],
        [0.75, '#e9a268'],
        [0.80, '#e79a69'],
        [0.85, '#e5926b'],
        [0.90, '#e2886c'],
        [0.95, '#e0816d'],
        [1, '#dd776e'],
    ];

    NW_PROVIDER_NAMES = ["Jio", "Vodafone", "Airtel", "BSNL"];
    SCALE = 10;
    DEBUG = false;
    color = [];
    signalSize = [];
    hoverText = [];
    markerColor = [];
    NWProvider = [];
    signalStrength = [];
    signalLat = [];
    signalLon = [];
    MAX_VALUE = 200000;
}
function populateData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var truncatedData = allTextLines.slice(0, MAX_VALUE)
    for (var i = 1; i < truncatedData.length; i++) {
        var csvData = truncatedData[i].split(',');
        if (csvData.length == headers.length) {
            signalLat.push(csvData[0]);
            signalLon.push(csvData[1]);
            signalStrength.push(csvData[2]);
            NWProvider.push(csvData[3]);
        }
    }
    processData();
}



function testData() {

    signalLat.push(17.722042)
    signalLon.push(32.447383)
    signalStrength.push(4)
    NWProvider.push(0)

    signalLat.push(17.778285)
    signalLon.push(44.107614)
    signalStrength.push(22)
    NWProvider.push(2)

    signalLat.push(17.848523)
    signalLon.push(37.779535)
    signalStrength.push(43)
    NWProvider.push(3)

    signalLat.push(17.852888)
    signalLon.push(52.968512)
    signalStrength.push(27)
    NWProvider.push(3)

    signalLat.push(17.865568)
    signalLon.push(33.512103)
    signalStrength.push(45)
    NWProvider.push(0)

    signalLat.push(17.869672)
    signalLon.push(63.898682)
    signalStrength.push(65)
    NWProvider.push(2)

    signalLat.push(17.899919)
    signalLon.push(76.453163)
    signalStrength.push(35)
    NWProvider.push(3)

    processData();
}

function processData() {
    for (var i = 0; i < signalStrength.length; i++) {
        var signalSizeMarker = signalStrength[i] / SCALE;
        var currentText = NW_PROVIDER_NAMES[NWProvider[i]] + " Signal Strength: " + signalStrength[i];
        signalSize.push(signalSizeMarker);
        hoverText.push(currentText);
    }
    plot();
}

function plot() {
    var data = [{
        type: 'scattergeo',
        mode: 'markers',
        text: hoverText,
        lon: signalLat,
        lat: signalLon,
        marker: {
            color: "#000000",
            colorscale: scl,
            cmin: 0,
            cmax: 1.0,
            reversescale: true,
            opacity: 0.90,
            size: signalSize,
            colorbar: {
                thickness: 10,
                titleside: 'right',
                outlinecolor: 'rgba(0,0,0,255)',
                ticks: 'outside',
                ticklen: 3,
                shoticksuffix: 'last',
                ticksuffix: ' Signal Strength',
                dtick: 0.1
            }
        },
        name: 'europe data'
    }];

    ///////////////////

    // var data = [{
    //     type: 'scattermapbox',
    //     mode: 'markers',
    //     text: hoverText,
    //     lon: signalLat,
    //     lat: signalLon,
    //     marker: {
    //         color: signalSize,
    //         colorscale: scl,
    //         cmin: 0,
    //         cmax: 1.0,
    //         reversescale: false,
    //         opacity: 0.90,
    //         size: 5,
    //         colorbar: {
    //             thickness: 10,
    //             titleside: 'right',
    //             outlinecolor: 'rgba(0,0,0,255)',
    //             ticks: 'outside',
    //             ticklen: 3,
    //             shoticksuffix: 'last',
    //             ticksuffix: ' Signal Strength',
    //             dtick: 0.1
    //         }
    //     },
    //     name: 'Signal Strength Chart'
    // }];

    var layout = {
        width: 1300,
        height: 700,
        mapbox: {
            // style: 'streets'
            style: 'open-street-map'
            // style: 'white-bg'
            // style: 'carto-positron'
            // style: 'carto-darkmatter'
            // style: 'stamen-terrain'
            // style: 'stamen-toner'
            // style: 'stamen-watercolor '
        },
        title: {
            text: "SIH Demo",
            side: "top left"
        },
        geo: {
            scope: "asia"
        }
    };

    Plotly.newPlot('myDiv', data, layout);

    handler()
}


function handler() {

    document.getElementById("myDiv")
        .on('plotly_relayout', function (eventdata) {
            $.post("http://localhost:5000/", {
                data: JSON.stringify(
                    eventdata["mapbox._derived"]["coordinates"]
                )
            },
                function (data, status) {
                    alert("Data: " + data + "\nStatus: " + status);
                });
        });

    // var gd = document.getElementById('graph')
    // var xRange = gd.layout.xaxis.range
    // var yRange = gd.layout.yaxis.range

    // gd.data.forEach(trace => {
    // var len = Math.min(trace.x.length, trace.y.length)
    // var xInside = []
    // var yInside = []

    // for (var i = 0; i < len; i++) {
    //     var x = trace.x[i]
    //     var y = trace.y[i]

    //     if(x > xRange[0] && x < xRange[1] && y > yRange[0] && y < yRange[1]) {
    //     xInside.push(x)
    //     yInside.push(y)
    //     }
    // }});
}