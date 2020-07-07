Plotly.d3.csv('mooc-server/geo.lg.csv', function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) { return row[key]; });
    }

    scl = [[0, 'rgb(150,0,90)'], [0.125, 'rgb(0, 0, 200)'], [0.25, 'rgb(0, 25, 255)'], [0.375, 'rgb(0, 152, 255)'], [0.5, 'rgb(44, 255, 150)'], [0.625, 'rgb(151, 255, 0)'], [0.75, 'rgb(255, 234, 0)'], [0.875, 'rgb(255, 111, 0)'], [1, 'rgb(255, 0, 0)']];

    var data = [{
        type: 'scattergeo',
        mode: 'markers',
        text: unpack(rows, 'NW_provider'),
        lon: unpack(rows, 'Longitude'),
        lat: unpack(rows, 'Latitude'),
        marker: {
            color: unpack(rows, 'Globvalue'),
            colorscale: scl,
            cmin: 0,
            cmax: 1.4,
            reversescale: true,
            opacity: 0.2,
            size: 2,
            colorbar: {
                thickness: 10,
                titleside: 'right',
                outlinecolor: 'rgba(68,68,68,0)',
                ticks: 'outside',
                ticklen: 3,
                shoticksuffix: 'last',
                ticksuffix: 'inches',
                dtick: 0.1
            }
        },
        name: 'NA Precipitation'
    }];

    var layout = {
        width: 1300,
        height: 700,
        mapbox: {
            // style: 'streets'
            // style: 'open-street-map'
            // style: 'white-bg'
            // style: 'carto-positron'
            // style: 'carto-darkmatter'
            style: 'stamen-terrain'
            // style: 'stamen-toner'
            // style: 'stamen-watercolor '
        },
        title: {
            text: "SIH Demo",
            side: "top left"
        }
    };
    Plotly.newPlot('myDiv', data, layout);
});