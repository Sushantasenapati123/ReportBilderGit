 $(document).ready(function () {
Highcharts.getJSON('/ReportBuilderUI/TableDetail?DataSource=DevelpmentalStrength', function (response) {
            var xaxis = [];
            var yaxis = [];
            for (var j = 0; j < response.tbody.length; j++) {
                for (var i = 0; i < response.thead.length; i++) {
                    if ('Department' == response.thead[i]) {
                        xaxis.push(response.tbody[j][response.thead[i]]);
                    }
                    else if ('NOOfEmployeeWorking' == response.thead[i]) {
                        yaxis.push(response.tbody[j][response.thead[i]]);
                    }
                }
            }
            Highcharts.chart('container_3', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Medals',
                    align: 'center'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                   categories: xaxis,
                    type: xaxis,
                    title: {
                        text: 'Count'
                    }
                },
                yAxis: {
                    allowDecimals: false,
                    type: yaxis,
                    title: {
                        text: 'Girls&Boys'
                    }
                },
                series: [{
                    name: 'NOOfEmployeeWorking',
                    data: yaxis
                }]
        });
    });
  });