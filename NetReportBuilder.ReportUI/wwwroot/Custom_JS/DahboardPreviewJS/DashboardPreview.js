
//Load Dashboard
$(document).ready(function () {
    
    let grid = GridStack.init({
        cellHeight: 70,
    });
    LoadDashboard();
});
function LoadDashboard() {
    
    let Data = new FormData();
    Data.append("EncId", "@ViewBag.ID");
    $.ajax({
        url: '@Url.Action("GetPageDetails", "ReportBuilderUI")',
        type: "POST",
        contentType: false,
        processData: false,
        data: Data,
        success: function (response) {
            // response = JSON.parse(response);
            if (response.status == 'success') {
                let grid = GridStack.init({
                    cellHeight: 70,
                });
                let data = response.data;
                let items = new Array();
                $('#lbl_dashname').html(data.PageName);
                let layouts = JSON.parse(data.PageLayout);
                layouts.map(function (i) {
                    items.push({ x: i.x, y: parseFloat(i.y), w: i.w, h: i.h, noMove: true, noResize: true, locked: true, content: i.content });
                });
                grid.load(items);
                let contents = JSON.parse(data.PageContent);
                let sortedconts = contents.sort(i => i.dsid);

                for (var i = 0; i < sortedconts.length; i++) {
                    BindTable(sortedconts[i], items[i].h);
                }
                for (var i = 0; i < layouts.length; i++) {
                    if (layouts[i].datasource != "") {
                        BindGrid(layouts[i].datasource, layouts[i].prtid, layouts[i].tabletype, items[i].h, layouts[i].title);
                    }
                }
                //for widget//
                for (let i = 0; i < sortedconts.length; i++) {
                    let chartType = sortedconts[i].chartType; // Get chartType from contents
                    let titlewidget = sortedconts[i].titlewidget;
                    let datacolumnwidget = sortedconts[i].datacolumnwidget;
                    let percentagewidget = sortedconts[i].percentagewidget;
                    let portletId = sortedconts[i].portletId;
                    let layout = layouts[i];
                    renderWidgetByType(chartType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout);
                }
                $(".btnadd").hide();
            }
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!!',
                text: error
            });
        }
    });
}

//Table Render
function BindTable(obj, height) {
    if (obj.dsname != undefined) {
        $.ajax({
            url: "/ReportBuilderUI/TableDetail?DataSource=" + obj.dsname,
            type: "GET",
            success: function (result) {
                var response = JSON.parse(result);
                let contentdetails = obj;
                console.log(response.tbody);
                let data = response.tbody;
                let xcat = data.map(i => i[contentdetails.xaxis]);
                let keys = Object.keys(data[0]);
                let sdata1 = convertToCommaArray(data, keys.filter(obj => obj.name !== contentdetails.xaxis));
                let sdata = data.map(i => i[contentdetails.yaxis]);
                genericchart(contentdetails.charttype.toLowerCase(), contentdetails.title, contentdetails.xaxis, contentdetails.xtitle, contentdetails.yaxis, contentdetails.ytitle, sdata1, xcat, contentdetails.dsid, height);
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                alert("Error : " + jsonValue);
            }
        });
    }
}
function convertToCommaArray(jsonArray, properties) {
    return jsonArray.map(obj => properties.map(prop => obj[prop]));
}
function BindGrid(DataSource, id, tabletype, height, title) {
    $("#BindTable" + id).css("height", parseFloat(height * 70) - 80)
    $("#BindTable" + id).css("overflow", "auto")
    $(".card" + id).append("<div class='card-header card_new' style='height:50px' >" + title + "</div>");
    $.ajax({
        url: "/ReportBuilderUI/TableDetail?DataSource=" + DataSource,
        type: "GET",
        success: function (result) {
            if (tabletype == "FirstTable") {
                var response = JSON.parse(result);
                var tablehead = $("#dataGrid" + id + " thead");
                tablehead.empty(); // Clear the table head
                var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; background-color: #EEE;">';
                for (var i = 0; i < response.thead.length; i++) {
                    rowHeaderhtml += '<th>' + response.thead[i] + '</th>';
                }
                var rowHeaderhtml = rowHeaderhtml + '</tr>';
                tablehead.append(rowHeaderhtml);

                var tablebody = $("#dataGrid" + id + " tbody");
                tablebody.empty(); // Clear the table head
                for (var j = 0; j < response.tbody.length; j++) {
                    var rowBodyhtml = '<tr>';
                    for (var i = 0; i < response.thead.length; i++) {
                        if (i == 0) {
                            rowBodyhtml += '<th>' + response.tbody[j][response.thead[i]] + '</th>';
                        }
                        else {
                            rowBodyhtml += '<td>' + response.tbody[j][response.thead[i]] + '</td>';
                        }
                    }
                    var rowBodyhtml = rowBodyhtml + '</tr>';
                    tablebody.append(rowBodyhtml);
                }
            }
            else {
                var response = JSON.parse(result);
                var tablehead = $("#dataGrid" + id + " thead");
                tablehead.empty(); // Clear thead
                var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; color: white; background-color:darkblue;"><th></th>';


                for (var j = 0; j < response.tbody.length; j++) {
                    rowHeaderhtml += '<th>' + response.tbody[j][response.thead[0]] + '</th>';
                }
                rowHeaderhtml += '</tr>';
                tablehead.append(rowHeaderhtml);

                var tablebody = $("#dataGrid" + id + " tbody");
                tablebody.empty(); // Clear tbody
                for (var i = 1; i < response.thead.length; i++) {
                    var rowBodyhtml = '<tr>';
                    rowBodyhtml += '<th>' + response.thead[i] + '</th>';

                    for (var j = 0; j < response.tbody.length; j++) {
                        rowBodyhtml += '<td>' + response.tbody[j][response.thead[i]] + '</td>';
                    }
                    rowBodyhtml += '</tr>';
                    tablebody.append(rowBodyhtml);
                }
            }

        },
        error: function (error) {
            jsonValue = jQuery.parseJSON(error.responseText);
            alert("Error : " + jsonValue);
        }
    });
}

//Chart Render
function genericchart(charttype, charttitle, xaxis, xaxistitle, yaxis, yaxistitle, seriesData, Xcatagories, id, height) {
    $("#container" + id).css("height", parseFloat(height * 70) - 80)
    $(".card" + id).append("<div class='card-header card_new' style='height:50px' >" + charttitle + "</div>");
    let chart = Highcharts.chart('container' + id, {
        chart: {
            type: charttype
        },
        credits: {
            enabled: false
        },
        title: {
            text: "",
            align: 'center'
        },
        subtitle: {
            text: ''
        },


        xAxis: {
            categories: xaxis,
            type: xaxis,
            title: {
                text: xaxistitle
            }
        },
        yAxis: {
            allowDecimals: false,
            type: yaxis,
            title: {
                text: yaxistitle
            }
        },


        series: [{
            name: xaxis,
            data: seriesData
        },
        ]
    });
}

//Widget Render
function renderWidgetByType(widgetType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout) {
    
    let widgetHtml;

    switch (widgetType) {
        case "Widget1":
            widgetHtml = `
                    <div id="apexWidget${portletId}">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="circle-icon">
                                    <div class="icon"><i class="fa fa-user" aria-hidden="true"></i></div>
                                </div>
                                <div class="widget-data">
                                    <div class="font-18">${datacolumnwidget || '2020'}</div>
                                    <div class="weight-500">${titlewidget || 'Contact'}</div>
                                </div>
                            </div>
                            <div class="progress-data">
                                <div id="chart${portletId}"></div>
                            </div>
                        </div>
                    </div>`;
            break;
        case "Widget2":
            widgetHtml = `
                                    <div class="" id="apexWidget${portletId}">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center">

                                            <div class="widget-data">
                                                    <div class="weight-800 font-24">${datacolumnwidget || '11,020'}</div>
                                                    <div class="weight-500 font-18">${titlewidget || 'Online Signups'}</div>
                                            </div>
                                        </div>
                                        <div class="progress-data">
                                            <div id="chart${portletId}"></div>
                                        </div>
                                    </div>
                                </div>`;
        case "Widget4":
            widgetHtml = `
                                        <div class="" id="apexWidget${portletId}">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">

                                                <div class="widget-data">
                                                        <div class="weight-800 font-24">${datacolumnwidget || '11,020'}</div>
                                                        <div class="weight-500 font-18">${titlewidget || 'Online Signups'}</div>
                                                </div>
                                            </div>
                                            <div class="progress-data">
                                                <div id="chart${portletId}"></div>
                                            </div>
                                        </div>
                                    </div>`;
        case "Widget5":
            widgetHtml = `
                                        <div class="" id="apexWidget${portletId}">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">

                                                <div class="widget-data">
                                                        <div class="weight-800 font-24">${datacolumnwidget || '11,020'}</div>
                                                        <div class="weight-500 font-18">${titlewidget || 'Online Signups'}</div>
                                                </div>
                                            </div>
                                            <div class="progress-data">
                                                <div id="chart${portletId}"></div>
                                            </div>
                                        </div>
                                    </div>`;
        case "Widget6":
            widgetHtml = `
                    <div id="apexWidget${portletId}">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="widget-data">
                                    <div class="weight-800 font-24">${datacolumnwidget || '11,020'}</div>
                                    <div class="weight-500 font-18">${titlewidget || 'Online Signups'}</div>
                                </div>
                            </div>
                            <div class="progress-data">
                                <div id="chart${portletId}"></div>
                            </div>
                        </div>
                    </div>`;
            break;
        //case "Widget3":
        //    widgetHtml = `
        //            <div class="gradient-style1 text-white box-shadow border-radius-10 height-100-p widget-style3">
        //                <div class="d-flex flex-wrap align-items-center">
        //                    <div class="widget-data">
        //                        <div class="weight-400 font-20">Server</div>
        //                        <div class="weight-300 font-30">75%</div>
        //                    </div>
        //                    <div class="widget-icon">
        //                        <div class="icon"><i class="fa fa-server" aria-hidden="true"></i></div>
        //                    </div>
        //                </div>
        //            </div>`;
        //    break;
        //case "Widget7":
        //    widgetHtml = `
        //            <div id="apexWidget${widgetDetails.prtid}">
        //                <div class="d-flex align-items-center justify-content-between">
        //                    <div class="d-flex align-items-center">
        //                        <h2 class="font-weight-700 font-24 mb-20">Lead Target</h2>
        //                        <div id="chart${widgetDetails.prtid}"></div>
        //                    </div>
        //                </div>
        //            </div>`;
        //    break;
        default:
            console.log("Unknown widget type");
            return;
    }

    // Append the widget HTML to the grid container
    $("#apexChartContainer" + portletId).html(widgetHtml);

    // Render Apex chart for the widget (if applicable)
    if (widgetType !== "Widget3") {
        genericApexChart(widgetType, titlewidget, datacolumnwidget, percentagewidget, portletId);
    }
}
function genericApexChart(widgetType, titlewidget, datacolumnwidget, percentagewidget, containerid) {
    
    let chartInstance;

    // Before rendering a new chart, destroy the existing one (if any)
    if (chartInstance) {
        chartInstance.destroy();
    }
    // If dataSource is null or empty, use the selected value from #ddlDataSource
    // dataSource = dataSource || $('#ddlDataSource option:selected').text();
    // Create chart options
    switch (widgetType) {
        case 'Widget1':
            var options = {
                series: [percentagewidget],
                grid: {
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                },
                chart: {
                    height: 100,
                    width: 70,
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '50%',
                        },
                        dataLabels: {
                            name: {
                                show: false,
                                color: '#fff'
                            },
                            value: {
                                show: true,
                                color: '#333',
                                offsetY: 5,
                                fontSize: '15px'
                            }
                        }
                    }
                },
                colors: ['#ecf0f4'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        type: 'diagonal1',
                        shadeIntensity: 0.8,
                        gradientToColors: ['#1b00ff'],
                        inverseColors: false,
                        opacityFrom: [1, 0.2],
                        opacityTo: 1,
                        stops: [0, 100],
                    }
                },
                states: {
                    normal: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    hover: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    active: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                }
            };
            break;
        case 'Widget2':
            var options = {
                series: [{
                    name: 'series1',
                    data: [30, 50, 70, 65, 80, 90]
                }],
                chart: {
                    height: 110,
                    type: 'area',
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: true
                    }
                },
                grid: {
                    show: false,
                    padding: {
                        left: 0,
                        right: 0
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'numeric',
                    lines: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        show: false,
                    },
                    padding: {
                        left: 0,
                        right: 0
                    },
                },
                tooltip: {
                    x: {
                        show: false,
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            };
            break;
        case 'Widget4':
            var options = {
                series: [{
                    name: 'series1',
                    data: [150, 650, 450, 650, 350, 480, 900]
                }],
                chart: {
                    height: 110,
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: true
                    }
                },
                grid: {
                    show: false,
                    padding: {
                        left: 0,
                        right: 0
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'numeric',
                    lines: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    },
                },
                yaxis: [{
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    labels: {
                        show: false,
                    },
                    padding: {
                        left: 0,
                        right: 0
                    },
                }],
                tooltip: {
                    x: {
                        show: false,
                        format: 'dd/MM/yy HH:mm'
                    },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        colorStops: [
                            {
                                offset: 0,
                                color: "#EB656F",
                                opacity: 1
                            },
                            {
                                offset: 20,
                                color: "#FAD375",
                                opacity: 1
                            },
                            {
                                offset: 60,
                                color: "#61DBC3",
                                opacity: 1
                            },
                            {
                                offset: 100,
                                color: "#95DA74",
                                opacity: 1
                            }
                        ]
                    }
                },
            };
            break;
        case 'Widget5':
            var options = {
                series: [{
                    data: [21, 22, 10, 28, 16, 21, 13, 30]
                }],
                chart: {
                    height: 110,
                    type: 'bar',
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: true
                    },
                    events: {
                        click: function (chart, w, e) {
                        }
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '20px',
                        distributed: true,
                        endingShape: 'rounded',
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    type: 'numeric',
                    lines: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    },
                },
                yaxis: [{
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    labels: {
                        show: false,
                    },
                    padding: {
                        left: 0,
                        right: 0
                    },
                }],
            };
            break;
        case 'Widget6':
            var options = {
                series: [{
                    name: 'series1',
                    data: [41, 50, 38, 61, 42, 70, 100]
                }, {
                    name: 'series2',
                    data: [21, 42, 55, 32, 34, 92, 41]
                }],
                chart: {
                    height: 110,
                    type: 'area',
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: true
                    }
                },
                grid: {
                    show: false,
                    padding: {
                        left: 0,
                        right: 0
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: false,
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'numeric',
                    lines: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    },
                },
                yaxis: [{
                    y: 0,
                    offsetX: 0,
                    offsetY: 0,
                    labels: {
                        show: false,
                    },
                    padding: {
                        left: 0,
                        right: 0
                    },
                }],
                tooltip: {
                    x: {
                        show: false,
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            };
            break;
        case 'Widget7':
            var options = {
                series: [73],
                chart: {
                    height: 350,
                    type: 'radialBar',
                    offsetY: 0
                },
                colors: ['#0B132B', '#222222'],
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: '16px',
                                color: undefined,
                                offsetY: 120
                            },
                            value: {
                                offsetY: 76,
                                fontSize: '22px',
                                color: undefined,
                                formatter: function (val) {
                                    return val + "%";
                                }
                            }
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        shadeIntensity: 0.15,
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 65, 91]
                    },
                },
                stroke: {
                    dashArray: 4
                },
                labels: ['Achieve Goals'],
            };
            break;
    }
    // Create and render the Apex chart
    var chartContainer = `#chart${containerid}`;
    chartInstance = new ApexCharts(document.querySelector(chartContainer), options);
    chartInstance.render();
}