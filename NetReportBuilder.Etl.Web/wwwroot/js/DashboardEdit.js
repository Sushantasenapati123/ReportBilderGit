//Dynamically Add Potlate
$('#addprt').click(function () {
    let grid = GridStack.init({
        cellHeight: 70,
        acceptWidgets: true,
        removable: '#trash',
    });
    // Attach event handlers for drag and resize stop events
    grid.on('dragstop', function (event, el) {
        resizeChart(el);
    });
    grid.on('resizestop', function (event, el) {
        
        resizeChart(el);
    });
    let divCount = parseFloat($('#hdnDivId').val() + 1);
    let item = {
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        content: '<div class="card' + divCount + '"></div>' +
            '<input type="hidden" value="" id="hdnDataSourceName' + divCount + '" />' +
            '<input type="hidden" value="" id="hdnTableType' + divCount + '" />' +
            '<input type="hidden" value="" id="hdnGridTitle' + divCount + '" />' +
            '<input type="hidden" value="" id="hdnApexchart' + divCount + '" />' +
            '<div class="grid_bodyblock output" id="colorDiv' + divCount + '" style="background-color: white;">' +
            '<div class="row">' +
            '<div>' +
            '<img id="uploadedImage' + divCount + '" class="hidden" src="" style="max-width: 50px; height: 45px;" alt="Uploaded Image">' +
            '<div id="iconDiv' + divCount + '"></div>' +
            '<div id="textdiv' + divCount + '"></div>' +
            '</div>' +
            '<div id="btn' + divCount + '">' +
            '<button id="' + divCount + '" data-toggle="modal" data-target="#yourModalId" style="margin-top: 14%;" class="btnadd">' +
            '<i class="fa fa-plus"></i> Add' +
            '</button>' +
            '</div>' +
            //Chart
            '<div id="ChartFinalReport">' +
            '<figure class="highcharts-figure">' +
            '<div id="container' + divCount + '"></div>' +
            '</figure>' +
            '</div>' +
            //Gauge
            '<div id="GaugeFinalReport">' +
            '<figure class="highcharts-figure">' +
            '<div id="containers' + divCount + '"></div>' +
            '</figure>' +
            '</div>' +
            // Added ApexChart Section
            '<div id="ApexChartSection">' +
            '<figure class="apexcharts-figure">' +
            '<div id="apexChartContainer' + divCount + '"></div>' +
            '</figure>' +
            '</div>' +
            //Table
            '<div  id="BindTable' + divCount + '">' +
            '<div class="table-responsive">' +
            '<table id="dataGrid' + divCount + '" class="table table-bordered bg-white">' +
            '<thead></thead>' +
            '<tbody></tbody>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
    };

    grid.addWidget(item)
    // Update item.content with dynamic data-id
    item.content = '<div class="grid_bodyblock" id="colorDiv' + divCount + '" data-id="id_' + divCount + '"></div>';
    grid.engine.nodes.forEach(node => {
        
        let checkitem = node.el.firstElementChild.className;
        if (checkitem != 'handle-config') {
            node.el.insertAdjacentHTML('afterbegin', '<div class="handle-config" id="' + divCount + '"><input  id="hdncolordivjson' + divCount + '" value="" type="hidden" /><i class="glyphicon glyphicon-edit" data-toggle="modal" data-target="#yourModalId" ></i><input type="hidden" id="hdnCntDetails_' + divCount + '" /></div><div class="crush_icon" title="Delete"><i class="bi bi-trash"></i></div>');
        }
    });
    divCount += 1;
    $('#hdnDivId').val(divCount);
    // Delete icon functionality
    $(document).on('click', '.crush_icon', function () {
        let gridItem = $(this).closest('.grid-stack-item');
        grid.removeWidget(gridItem[0]);
        grid.compact();
        // clearConfigPreview();

    });
    grid.compact();
    return divCount;
});
//Clear the data after save
function clearConfigPreview() {
    //$("#ddlDataSource").val("Select");
    $("#txtTitle").val("");
    $("#ddlXAxis").val("Select");
    $("#txtXAxisTitle").val("");
    $("#ddlYAxis").val("Select");
    $("#txtYAxisTitle").val("");
    $("#txtTitleWiz").val("");
    $("#ddlDataColumn").val("Select");
    $("#ddlPercentage").val("Select");
    $("#txtGridTitle").val("");
    $('#container').empty();

}
//Edit Button Click
$(document).on('click', '.btnedit', function () {
    clearConfigPreview();
    clearActiveList();
    let portletId = $(this).attr('id');
    let portlet = $('#colorDiv' + portletId);
    let height = portlet.outerHeight();
    let width = portlet.outerWidth();
    $('#portletHeight').val(height + 'px');
    $('#portletWidth').val(width + 'px');
    $('#hdnDivModifyId').val($(this).attr("id"));
    $('.dashboard-nav').toggle();
    clear();
});
//Add Button Click
$(document).on('click', '.btnadd', function () {
    clearConfigPreview();
    clearActiveList();
    let portletId = $(this).attr('id');
    let portlet = $('#colorDiv' + portletId);
    let height = portlet.outerHeight();
    let width = portlet.outerWidth();
    $('#portletHeight').val(height + 'px');
    $('#portletWidth').val(width + 'px');
    $('#hdnDivModifyId').val($(this).attr("id"));
    $('.dashboard-nav').toggle();
    clear();
});
function clear() {
    $("#dataGrid tr").remove();
    $("#ddlDataSourceForGrid").val('0');
    $("#ddlDataSource").val('0');
}
//Hide Modal
function hideModal() {
    var modal = document.getElementById('yourModalId');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop').remove();

}
//Clear Selected List After Save
function clearActiveList() {
    document.querySelectorAll('.grid__list').forEach(item => {
        item.classList.remove('active');
    });
}
function resizeChart(el) {
    
    let portletId = $(el).find('.grid_bodyblock').attr('id').replace('colorDiv', '');
    let portlet = $('#colorDiv' + portletId);
    let width = portlet.width();
    let height = portlet.height();
    apply1(portletId, width, height, portlet);
    // // Resize table if it exists in the portlet
    //let table = $("#BindTable" + portletId);
    //if (table.length > 0) {
    //    table.css({
    //        width: width + 'px',
    //        height: height + 'px',
    //    });
    //}
}
//Active Tab Count
var activeTabId = '';
$('#tabMenu a').on('shown.bs.tab', function (e) {
    // Get the id of the currently active tab
    activeTabId = $(e.target).attr('href');
});
//Change Color Of A Selected Chart
function LiClick(event) {
    const listItems = document.querySelectorAll('.grid__list');
    listItems.forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}
document.querySelectorAll('.grid__list').forEach(item => {
    item.addEventListener('click', LiClick);
});
//Apply Button To Show The Report(Chart)
$("#btnApply").click(function () {
    apply(0);
})
//Apply Button To Show The Report(Widget)
$("#btnApplyWizard").click(function () {
    
    apply(0);
})
//Apply(Show the Output In Preview)
function apply(containerid) {
    
    $("#btn" + $('#hdnDivModifyId').val()).css('display', 'none');
    let chartType = SelectedChartType;

    switch (activeTabId) {

        case '#tab2':
            var yaxis = [];
            var yaxistitle = [];
            yaxis.push($('#ddlYAxis :selected').text());
            yaxistitle.push($('#txtYAxisTitle').val());

            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else {
                genericchart(chartType, document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value, containerid, 0, 0, $('#ddlDataSource option:selected').text());
            }
            break;
        case '#tab1':
            var datacolumnwinz = [];
            var datacolumnwinzpercentage = [];
            var titlewinz = [];

            datacolumnwinz.push($('#ddlDataColumn :selected').val());
            datacolumnwinzpercentage.push($('#ddlPercentage :selected').val());
            titlewinz.push($('#txtTitleWiz').val());

            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else {

                if (chartType == 'Widget1') {

                    var widgetHtml = `
                                    <div class="" id="apexWidget${containerid}">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <div class="circle-icon">
                                                    <div class="icon">
                                                        <i class="fa fa-user" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div class="widget-data">
                                                    <div class="font-18">${datacolumnwinz || '2020'}</div>
                                                    <div class="weight-500">${titlewinz || 'Contact'}</div>
                                                </div>
                                            </div>
                                            <div class="progress-data">
                                                <div id="chart${containerid}"></div>
                                            </div>
                                        </div>
                                    </div>`;
                }
                else {
                    var widgetHtml = `
                                            <div class="" id="apexWidget${containerid}">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center">

                                                    <div class="widget-data">
                                                            <div class="weight-800 font-24">${datacolumnwinz || '11,020'}</div>
                                                            <div class="weight-500 font-18">${titlewinz || 'Online Signups'}</div>
                                                    </div>
                                                </div>
                                                <div class="progress-data">
                                                    <div id="chart${containerid}"></div>
                                                </div>
                                            </div>
                                        </div>`;
                }
                // Add the widget HTML to the portlet
                document.getElementById("apexChartWidget1").innerHTML = "";
                // Set the HTML content of the apexChartWidget1 container
                document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
                genericApexChart(chartType, document.getElementById("txtTitleWiz").value, $('#ddlDataColumn :selected').val(), $('#ddlPercentage :selected').val(), containerid, 70, 100, $('#ddlDataSourceForWizget option:selected').text());
            }

            break;
        case '#tab4':
            for (var k = 0; k < $("#hdnYaxiscount").val().length; k++) {
                yaxis.push($('#ddlYAxis-' + $("#hdnYaxiscount").val() + ' :selected').text());
                yaxistitle.push($('#txtYAxisTitle-' + $("#hdnYaxiscount").val() + '').val());
            }
            break;
        default:
            break;
    }
}
//Apply1(Show the Output In Potlate)
function apply1(containerid, width, height, portlet) {
    
    let dataSource = portlet.data('dataSource');
    let chartType = portlet.data('chartType');
    let GaugeType = portlet.data('GaugeType');
    let activeTabId = portlet.data('activeTabId');
    switch (activeTabId) {
        case '#tab2':
            let chartTitle = portlet.data('title');
            let xAxisName = portlet.data('xaxis');
            let xAxisTitle = portlet.data('xtitle');
            let yAxisName = portlet.data('yaxis');
            let yAxisTitle = portlet.data('ytitle');
            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else {
                genericchart(chartType, chartTitle, xAxisName, xAxisTitle, yAxisName, yAxisTitle, containerid, width, height, dataSource);
            }
            break;
        case '#tab3':
            let GaugeTitle = portlet.data('GaugeTitle');
            if (!GaugeType || GaugeType === "") {
                console.log("Unknown gauge type");
                return;
            }
            else {
                genericgauge(GaugeType, GaugeTitle, containerid, width, height, dataSource)
            }
            break;
        case '#tab1':
            let titlewinz = portlet.data('titlewidget');
            let datacolumnwinz = portlet.data('datacolumnwidget');
            let percentagewidget = portlet.data('percentagewidget');
            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else {
                if (chartType == 'Widget1') {

                    var widgetHtml = `
                                        <div class="" id="apexWidget${containerid}">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center">
                                                    <div class="circle-icon">
                                                        <div class="icon">
                                                            <i class="fa fa-user" aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                    <div class="widget-data">
                                                        <div class="font-18">${datacolumnwinz || '2020'}</div>
                                                        <div class="weight-500">${titlewinz || 'Contact'}</div>
                                                    </div>
                                                </div>
                                                <div class="progress-data">
                                                    <div id="chart${containerid}"></div>
                                                </div>
                                            </div>
                                        </div>`;
                }
                else {
                    var widgetHtml = `
                                                <div class="" id="apexWidget${containerid}">
                                                <div class="d-flex align-items-center justify-content-between">
                                                    <div class="d-flex align-items-center">

                                                        <div class="widget-data">
                                                                <div class="weight-800 font-24">${datacolumnwinz || '11,020'}</div>
                                                                <div class="weight-500 font-18">${titlewinz || 'Online Signups'}</div>
                                                        </div>
                                                    </div>
                                                    <div class="progress-data">
                                                        <div id="chart${containerid}"></div>
                                                    </div>
                                                </div>
                                            </div>`;
                }
                // Add the widget HTML to the portlet
                portlet.html(widgetHtml);
                genericApexChart(chartType, titlewinz, datacolumnwinz, percentagewidget, containerid, width, height, dataSource);
            }
            break;
        case '#tab4':
            let titleTable = portlet.data('titleTable');
            // Bind Grid--table
            if ($('#dataGrid tr').length > 0) {
                $("#BindTable" + containerid).empty();
                $("#BindTable" + containerid).append($('#dataGrid')[0].innerHTML);
            }
            break;
        default:
            break;
    }
}
//Save The Chart,Table In A Potlate
$("#btnsavepotlate").click(function () {
    
    $("#hdnGridTitle" + $('#hdnDivModifyId').val()).val($('#txtGridTitle').val());
    let portletId = $('#hdnDivModifyId').val();
    let portlet = $('#colorDiv' + portletId);
    let chartType = SelectedChartType;
    let TableType = SelectedTableType;
    // let GaugeType = SelectedGaugeType;
    let height = '';
    let width = '';
    switch (activeTabId) {
        case '#tab2':
            portlet.data('chartType', chartType);
            portlet.data('title', $("#txtTitle").val());
            portlet.data('xaxis', $('#ddlXAxis :selected').text());
            portlet.data('xtitle', $("#txtXAxisTitle").val());
            portlet.data('yaxis', $('#ddlYAxis :selected').text());
            portlet.data('ytitle', $("#txtYAxisTitle").val());
            portlet.data('dsname', $('#ddlDataSource :selected').text());
            portlet.data('dataSource', $('#ddlDataSource :selected').text());
            portlet.data('portletId', portletId);
            portlet.data('activeTabId', activeTabId);
            // Clear the SelectedChartType
            // SelectedChartType = "";
            height = portlet.outerHeight();
            width = portlet.outerWidth();
            // Apply chart with portlet size adjustments
            // apply(portletId, width, height);
            apply1(portletId, width, height, portlet);
            break;
        case '#tab1':
            portlet.data('chartType', chartType);
            portlet.data('dataSource', $('#ddlDataSourceForWizget :selected').text());
            portlet.data('titlewidget', $("#txtTitleWiz").val());
            portlet.data('datacolumnwidget', $('#ddlDataColumn :selected').val());
            portlet.data('percentagewidget', $('#ddlPercentage :selected').val());
            portlet.data('portletId', portletId);
            portlet.data('activeTabId', activeTabId);
            // Clear the SelectedChartType
            SelectedChartType = "";
            height = portlet.outerHeight();
            width = portlet.outerWidth();
            // Apply chart with portlet size adjustments
            // apply(portletId, width, height);
            apply1(portletId, width, height, portlet);
            break;
        //case '#tab3':
        //    portlet.data('GaugeType', GaugeType);
        //    portlet.data('GaugeTitle', $("#txtGaugeTitle").val());
        //    portlet.data('portletId', portletId);
        //    portlet.data('activeTabId', activeTabId);
        //    // Clear the SelectedGaugeType
        //    SelectedGaugeType = "";
        //    height = portlet.outerHeight();
        //    width = portlet.outerWidth();
        //    // Apply gauge with portlet size adjustments
        //    apply1(portletId, width, height, portlet);
        //    break;
        case '#tab4':
            portlet.data('chartType', TableType);
            portlet.data('tableTitle', $("#txtGridTitle").val());
            portlet.data('dataSource', $('#ddlDataSourceForGrid :selected').text());
            portlet.data('portletId', portletId);
            portlet.data('activeTabId', activeTabId);
            // Clear the SelectedChartType
            //SelectedTableType = "";
            height = portlet.outerHeight();
            width = portlet.outerWidth();
            title = portlet.tableTitle;
            // Apply chart with portlet size adjustments
            // apply(portletId, width, height);
            apply1(portletId, width, height, portlet);
            break;
        default:
            break;
    }
    // Hide the button inside the portlet
    $("#btn" + portletId).css('display', 'none');
    // Hide the modal and clear fields
    hideModal();
    clearActiveList();
    // resizeChart(portlet);  // Uncomment if needed
});
//Save Both Chart & Table Configuration
$('#btnsavedesign').click(function () {
    
    var dashboardName = $('#txtDashboardName').val();
    let data = new FormData();
    let items = new Array();
    let dashconfigitems = new Array();
    GridStack.init().engine.nodes.forEach(node => {
        items.push({ x: node.x, y: node.y, w: node.w, h: node.h, content: node.content, prtid: node._id, datasource: $("#hdnDataSourceName" + node._id).val(), tabletype: $("#hdnTableType" + node._id).val(), title: $("#hdnGridTitle" + node._id).val(), Widgettype: $("#hdnApexchart" + node._id).val() })
        // Save widget-specific static data
        let SavePotlateData = $('#hdnCntDetails_' + node._id).data() || {}; // Ensure it's initialized
        let portlet = $('#colorDiv' + node._id);
        SavePotlateData['activeTabId'] = portlet.data('activeTabId');
        SavePotlateData['title'] = portlet.data('title');
        SavePotlateData['chartType'] = portlet.data('chartType');
        SavePotlateData['dataSource'] = portlet.data('dataSource');
        SavePotlateData['portletId'] = portlet.data('portletId');
        SavePotlateData['xaxis'] = portlet.data('xaxis');
        SavePotlateData['xtitle'] = portlet.data('xtitle');
        SavePotlateData['yaxis'] = portlet.data('yaxis');
        SavePotlateData['ytitle'] = portlet.data('ytitle');
        SavePotlateData['titlewidget'] = portlet.data('titlewidget');
        SavePotlateData['datacolumnwidget'] = portlet.data('datacolumnwidget');
        SavePotlateData['percentagewidget'] = portlet.data('percentagewidget');
        SavePotlateData['tableTitle'] = portlet.data('tableTitle');
        SavePotlateData['height'] = portlet.outerHeight();
        SavePotlateData['width'] = portlet.outerWidth();
        SavePotlateData['dataSource'] = portlet.data('dataSource');
        let activeTabId = portlet.data('activeTabId');
        if (activeTabId) {
            SavePotlateData['designtype'] = activeTabId.replace('#', '');
        }
        else {
            SavePotlateData['designtype'] = portlet.data('designtype');
        }
        //Push SavePotlateData to dashconfigitems for saving
        dashconfigitems.push(SavePotlateData);
    });
    //GridStack.init().engine.nodes.forEach(node => {
    //    dashconfigitems.push($('#hdnCntDetails_' + node._id).data());
    //});
    data.append("PageName", dashboardName);
    data.append("PageLayout", JSON.stringify(items));
    data.append("PageContent", JSON.stringify(dashconfigitems));
    //// Get the current URL and split to extract query parameters
    //let urlParams = new URLSearchParams(window.location.search);
    //let id = urlParams.get('Id'); // Extract the Id parameter from the URL
    //// If the Id exists, treat it as an update operation
    //if (id) {
    //    data.append("Id", id); // Pass the Id to the server
    //}
    //var EncId = getUrlVars()["EncId"];
    //if (EncId != undefined) {
    //    data.append("EncId", id);
    //}
    data.append("Id", "@ViewBag.Id");

    $.ajax({

        url: '/ReportBuilderUI/InsertPageDetails',
        type: "POST",
        contentType: false,
        processData: false,
        data: data,
        success: function (response) {
            response = JSON.parse(response);
            if (response.data != -1) {
                alert(response.message);
                showpreview();
                prevencid = response.encid;
            }
        },
        error: function (error) {
        }
    });
});
function getUrlVars() {
    var vars = {};
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}
//Preview Button
function PreviewUpdate() {
    var prevencidupdate = getUrlVars()["EncId"]
    if (prevencidupdate != undefined) {
        prevencid = prevencidupdate;
    }
    window.open("/ReportBuilderUI/DashboardPreview?EncId=" + prevencid + "", "_blank")
}
//-----------------------------------------Bind Chart---------------------------------------------------------//
function genericchart(charttype, charttitle, xaxisname, xaxistitle, yaxisname, yaxistitle, containerid, width, height, dataSource) {

    Highcharts.getJSON('/ReportBuilderUI/TableDetail?DataSource=' + dataSource, function (response) {
        var xaxis = [];
        var yaxis = [];
        var yaxisdata = {};
        for (var j = 0; j < response.tbody.length; j++) {
            for (var i = 0; i < response.thead.length; i++) {
                if (xaxisname == response.thead[i]) {
                    xaxis.push(response.tbody[j][response.thead[i]]);
                }
                if (yaxisname == response.thead[i]) {
                    yaxisdata.name = yaxistitle;
                    yaxis.push(response.tbody[j][response.thead[i]]);
                }
            }
            yaxisdata.data = yaxis;
        }
        let chartOptions = {
            chart: {
                type: charttype,
                width: width ? parseInt(width) : null,
                height: height ? parseInt(height) : null
            },
            title: {
                text: charttitle,
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
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [yaxisdata]
        };

        if (containerid == 0) {
            $('#container').empty();  // Clear the existing chart
            Highcharts.chart('container', chartOptions);
        } else {
            $('#container' + containerid).empty();  // Clear the existing chart
            Highcharts.chart('container' + containerid, chartOptions);
        }


    });
}
//-----------------------------------------Bind Chart---------------------------------------------------------//
//-----------------------------------------Load Dashboard---------------------------------------------------------//
$(document).ready(function () {

    let grid = GridStack.init({
        cellHeight: 70,
    });
    LoadDashboard();
});
function LoadDashboard() {
    
    let Data = new FormData();
    Data.append("EncId", "@ViewBag.EncId");
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
                    acceptWidgets: true,
                    removable: '#trash', // drag-out delete class
                });
                // Attach event handlers for drag and resize stop events
                grid.on('dragstop', function (event, el) {
                    resizeChart(el);
                });
                grid.on('resizestop', function (event, el) {
                    resizeChart(el);
                });
                let data = response.data;
                let items = new Array();
                $('#lbl_dashname').html(data.PageName);
                let layouts = JSON.parse(data.PageLayout);
                layouts.map(function (i) {
                    items.push({ x: i.x, y: parseFloat(i.y), w: i.w, h: i.h, content: i.content + '<input type="hidden" value="" id="hdnDataSourceName' + i.prtid + '" /><input type="hidden" value="" id="hdnTableType' + i.prtid + '" /><input type="hidden" value="" id="hdnGridTitle' + i.prtid + '" />' });
                });
                grid.load(items);
                divCount = 0;
                grid.engine.nodes.forEach(node => {
                    let checkitem = node.el.firstElementChild.className;
                    if (checkitem != 'handle-config') {
                        node.el.insertAdjacentHTML('afterbegin', '<div class="handle-config" id="' + layouts[divCount].prtid + '"><input  id="hdncolordivjson' + layouts[divCount].prtid + '" value="" type="hidden" /><i title="Edit" id="' + layouts[divCount].prtid + '" class="bi bi-pencil-square btnedit" data-toggle="modal" data-target="#yourModalId" ></i><input type="hidden" id="hdnCntDetails_' + layouts[divCount].prtid + '" /></div><div class="crush_icon" title="Delete"><i class="bi bi-trash"></i></div>');
                    }
                    divCount += 1;
                });
                // Handle click event for the delete(For Edit)
                document.querySelectorAll('.crush_icon').forEach(function (deleteIcon) {
                    deleteIcon.addEventListener('click', function () {
                        let portlet = this.closest('.grid-stack-item');
                        if (portlet) {
                            grid.removeWidget(portlet);
                        }
                    });
                });
                let contents = JSON.parse(data.PageContent);
                
                for (var i = 0; i < contents.length; i++) {
                    layouts[i].datasource = contents[i].datasource;
                }
                let sortedconts = contents.sort(i => i.dsid);
                for (var i = 0; i < sortedconts.length; i++) {
                    let designtype = sortedconts[i].designtype;
                    if (designtype === 'tab2') //for chart
                    {
                        BindChart(sortedconts[i], items[i].h);
                        let portlet = $('#colorDiv' + sortedconts[i].portletid);
                        portlet.data('chartType', sortedconts[i].charttype);
                        portlet.data('title', sortedconts[i].title);
                        portlet.data('xaxis', sortedconts[i].xaxis);
                        portlet.data('xtitle', sortedconts[i].xtitle);
                        portlet.data('yaxis', sortedconts[i].yaxis);
                        portlet.data('ytitle', sortedconts[i].ytitle);
                        portlet.data('dataSource', sortedconts[i].datasource);
                        portlet.data('portletId', sortedconts[i].portletid);
                        portlet.data('activeTabId', sortedconts[i].activeTabId);
                        portlet.data('designtype', designtype);
                    }
                    else if (designtype === 'tab1') //for widget//
                    {
                        
                        let chartType = sortedconts[i].charttype; // Get chartType from contents
                        let titlewidget = sortedconts[i].title;
                        let datacolumnwidget = sortedconts[i].datacolumnwidget;
                        let percentagewidget = sortedconts[i].percentagewidget;
                        let portletId = sortedconts[i].portletid;
                        let layout = layouts[i];
                        let height = sortedconts[i].height;
                        let width = sortedconts[i].width;
                        let dataSource = sortedconts[i].datasource;
                        let activeTabId = sortedconts[i].designtype;


                        let portlet = $('#colorDiv' + sortedconts[i].portletid);
                        portlet.data('chartType', chartType);
                        portlet.data('dataSource', dataSource);
                        portlet.data('titlewidget', titlewidget);
                        portlet.data('datacolumnwidget', datacolumnwidget);
                        portlet.data('percentagewidget', percentagewidget);
                        portlet.data('portletId', portletId);
                        portlet.data('activeTabId', activeTabId);
                        portlet.data('designtype', designtype);

                        // Check if chartType is not null or empty
                        if (chartType && chartType.trim() !== "") {
                            renderWidgetByType(chartType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout, width, height, dataSource);
                        } else {
                            console.log("ChartType is empty or null. Skipping rendering for portlet: " + portletId);
                        }
                    }
                    else if (designtype === 'tab4') //for Table-Grid//
                    {
                        let charttype = sortedconts[i].charttype; // Get chartType from contents
                        let tabletitle = sortedconts[i].title;
                        let portletid = sortedconts[i].portletid;
                        let layout = layouts[i];
                        let height = items[i].h;
                        let width = items[i].w;
                        let datasource = sortedconts[i].datasource;
                        let activetabid = sortedconts[i].designtype;


                        let portlet = $('#colorDiv' + sortedconts[i].portletid);
                        portlet.data('chartType', charttype);
                        portlet.data('dataSource', datasource);
                        portlet.data('tableTitle', tabletitle);
                        portlet.data('portletId', portletid);
                        portlet.data('activeTabId', activetabid);
                        portlet.data('designtype', designtype);

                        // Check if chartType is not null or emptywidth
                        if (charttype && charttype.trim() !== "") {

                            BindGrid(datasource, portletid, charttype, height, tabletitle, width, activetabid);

                        } else {
                            console.log("ChartType is empty or null. Skipping rendering for portlet: " + portletId);
                        }
                    }
                }
                $('#txtDashboardName').val(data.PageName);
                $(".btnadd").hide();
                $('#hdnDivId').val(grid.engine.nodes.length)
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
//-----------------------------------------Load Dashboard---------------------------------------------------------//
//-----------------------------------------Table Render---------------------------------------------------------//
function BindChart(obj, height) {
    
    if (obj.datasource != undefined) {
        $.ajax({
            url: "/ReportBuilderUI/TableDetail?DataSource=" + obj.datasource,
            type: "GET",
            success: function (result) {
                var response = JSON.parse(result);
                var contentdetails = obj;
                console.log(response.tbody);
                var data = response.tbody;
                var xcat = data.map(i => i[contentdetails.xaxis]);
                var keys = Object.keys(data[0]);
                var sdata1 = convertToCommaArray(data, keys.filter(obj => obj.name !== contentdetails.xaxis));
                var sdata = data.map(i => i[contentdetails.yaxis]);
                genericchartLoad(contentdetails.charttype.toLowerCase(), contentdetails.title, contentdetails.xaxis, contentdetails.xtitle, contentdetails.yaxis, contentdetails.ytitle, sdata1, xcat, contentdetails.portletid, height);
                //var xcat = data.map(i => i[contentdetails.xAxisName]);
                //var keys = Object.keys(data[0]);
                //var sdata1 = convertToCommaArray(data, keys.filter(obj => obj.name !== contentdetails.xAxisName));
                //var sdata = data.map(i => i[contentdetails.yAxisName]);
                //genericchartLoad(contentdetails.chartType.toLowerCase(), contentdetails.chartTitle, contentdetails.xAxisName, contentdetails.xAxisTitle, contentdetails.yAxisName, contentdetails.yAxisTitle, sdata1, xcat, contentdetails.portletId, height);
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
function BindGrid(DataSource, id, tabletype, height, title, width, activeTabId) {
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
                if (response.tbody != null) {
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
            }
            else {
                var response = JSON.parse(result);
                var tablehead = $("#dataGrid" + id + " thead");
                tablehead.empty(); // Clear thead
                var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; color: white; background-color:darkblue;"><th></th>';

                if (response.tbody != null) {
                    for (var j = 0; j < response.tbody.length; j++) {
                        rowHeaderhtml += '<th>' + response.tbody[j][response.thead[0]] + '</th>';
                    }
                }
                rowHeaderhtml += '</tr>';
                tablehead.append(rowHeaderhtml);

                var tablebody = $("#dataGrid" + id + " tbody");
                tablebody.empty(); // Clear tbody
                if (response.thead != undefined && response.thead != null) {
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

            }

        },
        error: function (error) {
            jsonValue = jQuery.parseJSON(error.responseText);
            alert("Error : " + jsonValue);
        }
    });
}
//-----------------------------------------Table Render---------------------------------------------------------//
//-----------------------------------------Chart Render---------------------------------------------------------//
function genericchartLoad(charttype, charttitle, xaxis, xaxistitle, yaxis, yaxistitle, seriesData, Xcatagories, id, height) {
    
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
//-----------------------------------------Chart Render---------------------------------------------------------//
//-----------------------------------------Widget Render---------------------------------------------------------//
function renderWidgetByType(widgetType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout, width, height
    , dataSource) {
    
    let widgetHtml = '';
    if (widgetType === 'Widget1') {

        widgetHtml = `
                        <div class="" id="apexWidget${portletId}">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="circle-icon">
                                    <div class="icon">
                                        <i class="fa fa-user" aria-hidden="true"></i>
                                    </div>
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
    }
    else {
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
    }
    // Append the widget HTML to the grid container
    $("#apexChartContainer" + portletId).html(widgetHtml);

    // Render Apex chart for the widget (if applicable)
    if (widgetType !== "Widget3") {
        genericApexChart(widgetType, titlewidget, datacolumnwidget, percentagewidget, portletId, width, height, dataSource
        );
    }
}
function genericApexChart(widgetType, titlewidget, datacolumnwidget, percentagewidget, containerid, width, height, dataSource) {

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


    //// Create a new chart instance and store it
    //chartInstance = new ApexCharts(document.querySelector(chartContainer), options);
    //chartInstances[containerid] = chartInstance;  // Store the instance
    //chartInstance.render();


    // Create and render the Apex chart
    var chartContainer = `#chart${containerid}`;
    chartInstance = new ApexCharts(document.querySelector(chartContainer), options);
    chartInstance.render();
}
//-----------------------------------------Widget Render---------------------------------------------------------//
//------------------------------------------Table Configuration-----------------------------------//
var SelectedTableType = '';
//Table Type 1
function GetFirstTable() {
    SelectedTableType = 'FirstTable';
    $("#ddlDataSourceForGrid").change(function () {
        if ($('#ddlDataSourceForGrid').val() != "0") {
            $("#hdnDataSourceName" + $('#hdnDivModifyId').val()).val($('#ddlDataSourceForGrid option:selected').text());
            $("#hdnTableType" + $('#hdnDivModifyId').val()).val(SelectedTableType);
            $.ajax({
                url: "/ReportBuilderUI/TableDetail?DataSource=" + $('#ddlDataSourceForGrid option:selected').text(),
                type: "GET",
                success: function (result) {
                    var response = JSON.parse(result);
                    var tablehead = $('#dataGrid thead');
                    tablehead.empty(); // Clear  table head
                    var rowHeaderhtml = '<tr>';
                    for (var i = 0; i < response.thead.length; i++) {
                        rowHeaderhtml += '<th>' + response.thead[i] + '</th>';
                    }
                    var rowHeaderhtml = rowHeaderhtml + '</tr>';
                    tablehead.append(rowHeaderhtml);

                    var tablebody = $('#dataGrid tbody');
                    tablebody.empty(); // Clear  table body
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
                },
                error: function (error) {
                    jsonValue = jQuery.parseJSON(error.responseText);
                    alert("Error : " + jsonValue);
                }
            });
        }
    });
}
//Table Type 2
function GetSecondTable() {
    SelectedTableType = 'SecondTable';
    $("#ddlDataSourceForGrid").change(function () {
        if ($('#ddlDataSourceForGrid').val() != "0") {
            $("#hdnDataSourceName" + $('#hdnDivModifyId').val()).val($('#ddlDataSourceForGrid option:selected').text());
            $.ajax({
                url: "/ReportBuilderUI/TableDetail?DataSource=" + $('#ddlDataSourceForGrid option:selected').text(),
                type: "GET",
                success: function (result) {
                    var response = JSON.parse(result);

                    var tablehead = $('#dataGrid thead');
                    tablehead.empty(); // Clear thead
                    var rowHeaderhtml = '<tr><th></th>';

                    for (var j = 0; j < response.tbody.length; j++) {
                        rowHeaderhtml += '<th>' + response.tbody[j][response.thead[0]] + '</th>';
                    }
                    rowHeaderhtml += '</tr>';
                    tablehead.append(rowHeaderhtml);

                    var tablebody = $('#dataGrid tbody');
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
                },
                error: function (error) {
                    jsonValue = jQuery.parseJSON(error.responseText);
                    alert("Error : " + jsonValue);
                }
            });
        }
    });
}
//Table Type 3
function GetThirdTable() {
    $("#ddlDataSourceForGrid").change(function () {
        if ($('#ddlDataSourceForGrid').val() != "0") {
            $("#hdnDataSourceName" + $('#hdnDivModifyId').val()).val($('#ddlDataSourceForGrid option:selected').text());
            $.ajax({
                url: "/ReportBuilderUI/TableDetail?DataSource=" + $('#ddlDataSourceForGrid option:selected').text(),
                type: "GET",
                success: function (result) {
                    var response = JSON.parse(result);

                    var tablehead = $('#dataGrid thead');
                    tablehead.empty(); // Clear thead
                    var rowHeaderhtml = '<tr><th></th>';

                    for (var j = 0; j < response.tbody.length; j++) {
                        rowHeaderhtml += '<th>' + response.tbody[j][response.thead[0]] + '</th>';
                    }
                    rowHeaderhtml += '</tr>';
                    tablehead.append(rowHeaderhtml);

                    var tablebody = $('#dataGrid tbody');
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
                },
                error: function (error) {
                    jsonValue = jQuery.parseJSON(error.responseText);
                    alert("Error : " + jsonValue);
                }
            });
        }
    });
}
//Table Type 4
function GetForthTable() {
    $("#ddlDataSourceForGrid").change(function () {
        if ($('#ddlDataSourceForGrid').val() != "0") {
            $("#hdnDataSourceName" + $('#hdnDivModifyId').val()).val($('#ddlDataSourceForGrid option:selected').text());
            $.ajax({
                url: "/ReportBuilderUI/TableDetail?DataSource=" + $('#ddlDataSourceForGrid option:selected').text(),
                type: "GET",
                success: function (result) {
                    var response = JSON.parse(result);

                    var tablehead = $('#dataGrid thead');
                    tablehead.empty(); // Clear thead
                    var rowHeaderhtml = '<tr><th></th>';

                    for (var j = 0; j < response.tbody.length; j++) {
                        rowHeaderhtml += '<th>' + response.tbody[j][response.thead[0]] + '</th>';
                    }
                    rowHeaderhtml += '</tr>';
                    tablehead.append(rowHeaderhtml);

                    var tablebody = $('#dataGrid tbody');
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
                },
                error: function (error) {
                    jsonValue = jQuery.parseJSON(error.responseText);
                    alert("Error : " + jsonValue);
                }
            });
        }
    });
}

//------------------------------------------Table Configuration-----------------------------------//

//--------------------------------------Chart Configuration-------------------------------------------//
//Bind Y-Axis Dropdown Using Dynamic Id
function GetColumnsByTableById(id) {
    if ($('#ddlDataSource').val() != '') {
        $.ajax({
            url: "/ReportBuilderUI/Get_ColumnsByTable?order=" + $('#ddlDataSource').val(),
            type: "GET",
            success: function (result) {
                data = result;
                var v = "<option value='0'>--Select--</option>";
                $.each(data, function (i, item) {
                    v += "<option value=" + item.order + ">" + item.name + "</option>";
                });
                $("#" + id).html(v);

                //Selected Y-Axis
                var YAxis = getUrlVars()["YAxis"];
                if (YAxis != undefined) {
                    $("#ddlYAxis option").each(function () {
                        if ($(this).text() == YAxis) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                alert("Error : " + jsonValue);
            }
        });
    }
}
//BindTableAndTableColumn
function GetColumnsByTable() {
    if ($('#ddlDataSource').val() != '') {
        $.ajax({
            url: "/ReportBuilderUI/Get_ColumnsByTable?order=" + $('#ddlDataSource').val(),
            type: "GET",
            success: function (result) {
                data = result;
                var v = "<option value='0'>--Select--</option>";
                $.each(data, function (i, item) {
                    v += "<option value=" + item.order + ">" + item.name + "</option>";
                });
                $("#ddlXAxis").html(v);
                $("#ddlYAxis").html(v);

                //Selected X-Axis
                var XAxis = getUrlVars()["XAxis"];
                if (XAxis != undefined) {
                    $("#ddlXAxis option").each(function () {
                        if ($(this).text() == XAxis) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }
                //Selected Y-Axis
                var YAxis = getUrlVars()["YAxis"];
                if (YAxis != undefined) {
                    $("#ddlYAxis option").each(function () {
                        if ($(this).text() == YAxis) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }
                // Call the function to populate the dropdown
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                alert("Error : " + jsonValue);
            }
        });
        //BindTable();
    }
}
//Get  Chart Column Content
function getColumnContents(headerName) {
    var table = $('#dataGrid');
    var headerIndex = -1;

    // Find the index of the header
    table.find('th').each(function (index) {
        if ($(this).text() === headerName) {
            headerIndex = index;
            return false; // Exit the loop
        }
    });

    if (headerIndex === -1) {
        console.log('Header not found');
        return;
    }

    // Get the contents of the column
    var columnContents = [];
    table.find('tbody tr').each(function () {
        var cell = $(this).find('th').eq(headerIndex);
        columnContents.push(cell.text());
    });

    return columnContents;
}

//Global Variable for  Selected Chart Type from li(List)
var SelectedChartType = '';
//Column
function GetColumnChart() {
    SelectedChartType = 'column';
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Corn vs wheat production for 2023',
            align: 'left'
        },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '1000 metric tons (MT)'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
            }
        ]
    });
}
//Bar
function GetBarChart() {
    SelectedChartType = 'bar';
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Corn vs wheat estimated production for 2023',
            align: 'left'
        },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '1000 metric tons (MT)'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
            }
        ]
    });
}
//Pie
function GetPieChart() {
    SelectedChartType = 'pie';
    Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Egg Yolk Composition'
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: [{
                    enabled: true,
                    distance: 20
                }, {
                    enabled: true,
                    distance: -40,
                    format: '{point.percentage:.1f}%',
                    style: {
                        fontSize: '1.2em',
                        textOutline: 'none',
                        opacity: 0.7
                    },
                    filter: {
                        operator: '>',
                        property: 'percentage',
                        value: 10
                    }
                }]
            }
        },
        series: [
            {
                name: 'Percentage',
                colorByPoint: true,
                data: [
                    {
                        name: 'Water',
                        y: 55.02
                    },
                    {
                        name: 'Fat',
                        sliced: true,
                        selected: true,
                        y: 26.71
                    },
                    {
                        name: 'Carbohydrates',
                        y: 1.09
                    },
                    {
                        name: 'Protein',
                        y: 15.5
                    },
                    {
                        name: 'Ash',
                        y: 1.68
                    }
                ]
            }
        ]
    });
}
//Area
function GetAreaChart() {
    SelectedChartType = 'area';
    Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'US and USSR nuclear stockpiles'
        },
        xAxis: {
            allowDecimals: false,
            accessibility: {
                rangeDescription: 'Range: 1940 to 2024.'
            }
        },
        yAxis: {
            title: {
                text: 'Nuclear weapon states'
            }
        },
        tooltip: {
            pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>' +
                'warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'USA',
            data: [
                null, null, null, null, null, 2, 9, 13, 50, 170, 299, 438, 841,
                1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540,
                28133, 29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830,
                26516, 27835, 28537, 27519, 25914, 25542, 24418, 24138, 24104,
                23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217,
                21392, 19008, 13708, 11511, 10979, 10904, 11011, 10903, 10732,
                10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273,
                5113, 5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805,
                3750, 3708, 3708, 3708, 3708
            ]
        }, {
            name: 'USSR/Russia',
            data: [
                null, null, null, null, null, null, null, null, null,
                1, 5, 25, 50, 120, 150, 200, 426, 660, 863, 1048, 1627, 2492,
                3346, 4259, 5242, 6144, 7091, 8400, 9490, 10671, 11736, 13279,
                14600, 15878, 17286, 19235, 22165, 24281, 26169, 28258, 30665,
                32146, 33486, 35130, 36825, 38582, 40159, 38107, 36538, 35078,
                32980, 29154, 26734, 24403, 21339, 18179, 15942, 15442, 14368,
                13188, 12188, 11152, 10114, 9076, 8038, 7000, 6643, 6286, 5929,
                5527, 5215, 4858, 4750, 4650, 4600, 4500, 4490, 4300, 4350, 4330,
                4310, 4495, 4477, 4489, 4380
            ]
        }]
    });
}
//Line
function GetLineChart() {
    SelectedChartType = 'line';
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'U.S Solar Employment Growth',
            align: 'left'
        },
        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2022'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation & Developers',
            data: [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
            ]
        }, {
            name: 'Manufacturing',
            data: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
            ]
        }, {
            name: 'Sales & Distribution',
            data: [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
            ]
        }, {
            name: 'Operations & Maintenance',
            data: [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
            ]
        }, {
            name: 'Other',
            data: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}
//Scatter
function GetScatterChart() {
    SelectedChartType = 'scatter';
    Highcharts.chart('container', {
        chart: {
            type: 'scatter'
        },
        title: {
            text: 'U.S Solar Employment Growth',
            align: 'left'
        },
        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2022'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation & Developers',
            data: [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
            ]
        }, {
            name: 'Manufacturing',
            data: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
            ]
        }, {
            name: 'Sales & Distribution',
            data: [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
            ]
        }, {
            name: 'Operations & Maintenance',
            data: [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
            ]
        }, {
            name: 'Other',
            data: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}
//Bubble
function GetBubbleChart() {
    SelectedChartType = 'bubble';
    Highcharts.chart('container', {

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zooming: {
                type: 'xy'
            }
        },

        legend: {
            enabled: false
        },

        title: {
            text: 'Sugar and fat intake per country'
        },
        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, ' +
                    'sugar: {point.y}g, obesity: {point.z}%.'
            }
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: 'Daily fat intake'
            },
            labels: {
                format: '{value} gr'
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe fat intake 65g/day'
                },
                zIndex: 3
            }],
            accessibility: {
                rangeDescription: 'Range: 60 to 100 grams.'
            }
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'Daily sugar intake'
            },
            labels: {
                format: '{value} gr'
            },
            maxPadding: 0.2,
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe sugar intake 50g/day',
                    x: -10
                },
                zIndex: 3
            }],
            accessibility: {
                rangeDescription: 'Range: 0 to 160 grams.'
            }
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            data: [
                { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                {
                    x: 65.5,
                    y: 126.4,
                    z: 35.3,
                    name:
                        'US',
                    country: 'United States'
                },
                { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
            ],
            colorByPoint: true
        }]

    });
}
//Donut
function GetDonutChart() {
    SelectedChartType = 'pie';
    Highcharts.chart('container', {
        chart: {
            type: 'pie',
            custom: {},
            events: {
                render() {
                    const chart = this,
                        series = chart.series[0];
                    let customLabel = chart.options.chart.custom.label;

                    if (!customLabel) {
                        customLabel = chart.options.chart.custom.label =
                            chart.renderer.label(
                                'Total<br/>' +
                                '<strong>2 877 820</strong>'
                            )
                                .css({
                                    color: '#000',
                                    textAnchor: 'middle'
                                })
                                .add();
                    }

                    const x = series.center[0] + chart.plotLeft,
                        y = series.center[1] + chart.plotTop -
                            (customLabel.attr('height') / 2);

                    customLabel.attr({
                        x,
                        y
                    });
                    // Set font size based on chart diameter
                    customLabel.css({
                        fontSize: `${series.center[2] / 12}px`
                    });
                }
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        title: {
            text: '2023 Norway car registrations'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                cursor: 'pointer',
                borderRadius: 8,
                dataLabels: [{
                    enabled: true,
                    distance: 20,
                    format: '{point.name}'
                }, {
                    enabled: true,
                    distance: -15,
                    format: '{point.percentage:.0f}%',
                    style: {
                        fontSize: '0.9em'
                    }
                }],
                showInLegend: true
            }
        },
        series: [{
            name: 'Registrations',
            colorByPoint: true,
            innerSize: '75%',
            data: [{
                name: 'EV',
                y: 23.9
            }, {
                name: 'Hybrids',
                y: 12.6
            }, {
                name: 'Diesel',
                y: 37.0
            }, {
                name: 'Petrol',
                y: 26.4
            }]
        }]
    });
}
//Stacked Area
function GetStackedAreaChart() {
    SelectedChartType = 'area';
    Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Greenhouse gases from Norwegian economic activity',
            align: 'left'
        },
        yAxis: {
            title: {
                useHTML: true,
                text: 'Million tonnes CO<sub>2</sub>-equivalents'
            }
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span>' +
                '<br>'
        },
        plotOptions: {
            series: {
                pointStart: 2012
            },
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: [{
            name: 'Ocean transport',
            data: [
                13234, 12729, 11533, 17798, 10398, 12811,
                15483, 16196, 15060, 13365, 13301
            ]
        }, {
            name: 'Households',
            data: [
                6686, 6536, 6389, 6384, 6251, 5719,
                5611, 5040, 5079, 5088, 4988
            ]

        }, {
            name: 'Agriculture and hunting',
            data: [
                4812, 4872, 4961, 5001, 5070, 5035,
                5045, 5004, 5015, 5076, 4935
            ]
        }, {
            name: 'Air transport',
            data: [
                3502, 3844, 4139, 4351, 3802, 4020,
                4461, 5074, 1558, 1247, 2694
            ]

        }, {
            name: 'Construction',
            data: [
                2019, 2189, 2150, 2217, 2179, 2258,
                2348, 2196, 2018, 2180, 2127
            ]
        }]
    });
}
//Stacked Column
function GetStackedColumnChart() {
    SelectedChartType = 'column';
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Major trophies for some English teams',
            align: 'left'
        },
        xAxis: {
            categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count trophies'
            },
            stackLabels: {
                enabled: true
            }
        },
        legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'BPL',
            data: [3, 5, 1, 13]
        }, {
            name: 'FA Cup',
            data: [14, 8, 8, 12]
        }, {
            name: 'CL',
            data: [0, 2, 6, 3]
        }]
    });
}
//Stacked Bar
function GetStackedBarChart() {
    SelectedChartType = 'bar';
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Ferry passengers by vehicle type 2024'
        },
        xAxis: {
            categories: [
                'January', 'February', 'March', 'April', 'May'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Motorcycles',
            data: [74, 27, 52, 93, 1272]
        }, {
            name: 'Null-emission vehicles',
            data: [2106, 2398, 3046, 3195, 4916]
        }, {
            name: 'Conventional vehicles',
            data: [12213, 12721, 15242, 16518, 25037]
        }]
    });
}
//Range Column
function GetRangeColumnChart() {
    SelectedChartType = 'columnrange';
    Highcharts.chart('container', {
        chart: {
            type: 'columnrange',
            inverted: true
        },
        title: {
            text: 'Temperature variation by month'
        },
        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
        },

        yAxis: {
            title: {
                text: 'Temperature ( °C )'
            }
        },

        tooltip: {
            valueSuffix: '°C'
        },

        plotOptions: {
            columnrange: {
                borderRadius: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{y}°C'
                }
            }
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            data: [
                [-9.5, 8.0],
                [-7.8, 8.3],
                [-13.1, 9.2],
                [-4.4, 15.7],
                [-1.0, 20.8],
                [3.1, 28.4],
                [8.9, 27.0],
                [9.6, 23.0],
                [4.9, 19.3],
                [-5.2, 11.6],
                [-10.5, 12.0],
                [-12.1, 8.5]
            ]
        }]

    });
}
//Pyramid
function GetPyramidChart() {
    SelectedChartType = 'pyramid';
    Highcharts.chart('container', {
        chart: {
            type: 'pyramid'
        },
        title: {
            text: 'Sales pyramid',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['40%', '50%'],
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
    });
}
//Funnel
function GetFunnelChart() {
    SelectedChartType = 'funnel';
    Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        title: {
            text: 'Sales funnel'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['40%', '50%'],
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
    });
}
//--------------------------------------Chart Configuration-------------------------------------------//

//-------------------------------------------Widget Configuration--------------------------------------------//
//Bind Column using table name(DataSource) For Widget
function GetColumnsByTableforwiz() {

    if ($('#ddlDataSourceForWizget').val() != '') {
        $.ajax({
            url: "/ReportBuilderUI/Get_ColumnsByTable?order=" + $('#ddlDataSourceForWizget').val(),
            type: "GET",
            success: function (result) {
                data = result;
                var v = "<option value='0'>--Select--</option>";
                $.each(data, function (i, item) {
                    v += "<option value=" + item.value + ">" + item.name + "</option>";
                });
                $("#ddlDataColumn").html(v);
                $("#ddlPercentage").html(v);

                //Selected X-Axis
                var data = getUrlVars()["XAxis"];
                if (data != undefined) {
                    $("#ddlDataColumn option").each(function () {
                        if ($(this).val() == XAxis) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }

                var data = getUrlVars()["YAxis"];
                if (data != undefined) {
                    $("#ddlPercentage option").each(function () {
                        if ($(this).val() == YAxis) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                }

                // Call the function to populate the dropdown
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                alert("Error : " + jsonValue);
            }
        });
    }
}
//Widget 1
function showpreview1() {
    // Define the HTML structure for the widget
    SelectedChartType = "Widget1";

    $("#hdnApexchart" + $('#hdnDivModifyId').val()).val(SelectedChartType);
    var widgetHtml = `
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center">
                                                <div class="circle-icon">
                                                    <div class="icon">
                                                        <i class="fa fa-user" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div class="widget-data">
                                                    <div class="font-18"> '2020'</div>
                                                    <div class="weight-500">'Contact'</div>
                                                </div>
                                            </div>
                                            <div class="progress-data">
                                                <div id="chart"></div>
                                            </div>
                                        </div>`;
    document.getElementById("apexChartWidget1").innerHTML = "";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Display the widget container
    document.getElementById("apexChartWidget1").style.display = "block";

    document.getElementById("ddlPercentagedivid").style.display = "block";
    // Create chart options
    var options = {
        series: [80],
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

    // Create and render the Apex chart inside the #chart container
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widget 2
function showpreview2() {
    SelectedChartType = "Widget2";
    document.getElementById("ddlPercentagedivid").style.display = "none";
    var widgetHtml = `
                                                <div class="bg-white box-shadow border-radius-10 height-100-p widget-style2">
                                                    <div class="widget-data">
                                                           <div class="weight-800 font-24">11,020</div>
                                            <div class="weight-500 font-18">Online Signups</div>
                                                     </div>
                                                <div class="progress-data">
                                                    <div id="chart"></div>
                                            </div>`;
    // <div class="widget-container" id="apexChartWidget2" style="display:none;">
    //    <div class="d-flex align-items-center justify-content-between">
    //        <div class="bg-white box-shadow border-radius-10 height-100-p">
    //            <div class="widget-data">
    //                <div class="weight-800 font-24">11,020</div>
    //                <div class="weight-500 font-18">Online Signups</div>
    //            </div>
    //            <div class="progress-data">
    //                <div id="chart5"></div>
    //            </div>
    //        </div>
    //    </div>
    //</div>
    document.getElementById("apexChartWidget1").innerHTML = "";
    document.getElementById("apexChartWidget1").style.display = "block";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Create chart options
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

    // Create and render the Apex chart
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widget 4
function showpreview4() {
    SelectedChartType = "Widget4";
    document.getElementById("ddlPercentagedivid").style.display = "none";

    var widgetHtml = `
                                                    <div class="bg-white box-shadow border-radius-10 height-100-p widget-style2">


                                                        <div class="widget-data">
                                                               <div class="weight-800 font-24">11,020</div>
                                                <div class="weight-500 font-18">Online Signups</div>
                                                         </div>
                                                    <div class="progress-data">
                                                        <div id="chart"></div>


                                                </div>`;
    document.getElementById("apexChartWidget1").innerHTML = "";
    document.getElementById("apexChartWidget1").style.display = "block";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Create chart options
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

    // Create and render the Apex chart
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widge 5
function showpreview5() {
    SelectedChartType = "Widget5";
    document.getElementById("ddlPercentagedivid").style.display = "none";

    var widgetHtml = `
                                                  <div class="bg-white box-shadow border-radius-10 height-100-p widget-style2">


                                                      <div class="widget-data">
                                                             <div class="weight-800 font-24">11,020</div>
                                              <div class="weight-500 font-18">Online Signups</div>
                                                       </div>
                                                  <div class="progress-data">
                                                      <div id="chart"></div>


                                              </div>`;
    document.getElementById("apexChartWidget1").innerHTML = "";
    document.getElementById("apexChartWidget1").style.display = "block";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Create chart options
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

    // Create and render the Apex chart
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widget 6
function showpreview6() {
    SelectedChartType = "Widget6";
    document.getElementById("ddlPercentagedivid").style.display = "none";

    var widgetHtml = `
                                                      <div class="bg-white box-shadow border-radius-10 height-100-p widget-style2">


                                                          <div class="widget-data">
                                                                 <div class="weight-800 font-24">11,020</div>
                                                  <div class="weight-500 font-18">Online Signups</div>
                                                           </div>
                                                      <div class="progress-data">
                                                          <div id="chart"></div>


                                                  </div>`;
    document.getElementById("apexChartWidget1").innerHTML = "";
    document.getElementById("apexChartWidget1").style.display = "block";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Create chart options
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

    // Create and render the Apex chart
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widget 7
function showpreview7() {
    SelectedChartType = "Widget7";
    document.getElementById("ddlPercentagedivid").style.display = "none";

    var widgetHtml = `
                                                              <div class="bg-white box-shadow border-radius-10 height-100-p pd-20">
                                    <h2 class="font-weight-700 font-24 mb-20">Lead Target</h2>
                                    <div id="chart"></div>
                                </div>`;
    document.getElementById("apexChartWidget1").innerHTML = "";
    document.getElementById("apexChartWidget1").style.display = "block";
    // Set the HTML content of the apexChartWidget1 container
    document.getElementById("apexChartWidget1").innerHTML = widgetHtml;
    // Create chart options
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

    // Create and render the Apex chart
    var chartContainer = `#chart`;
    var chart = new ApexCharts(document.querySelector(chartContainer), options);
    chart.render();
}
//Widget 3
function showpreview3() {
    document.getElementById("ddlPercentagedivid").style.display = "none";

    SelectedChartType = "Widget3";

    // <div class="widget-container" id="apexChartWidget2" style="display:none;">
    //    <div class="d-flex align-items-center justify-content-between">
    //        <div class="bg-white box-shadow border-radius-10 height-100-p">
    //            <div class="widget-data">
    //                <div class="weight-800 font-24">11,020</div>
    //                <div class="weight-500 font-18">Online Signups</div>
    //            </div>
    //            <div class="progress-data">
    //                <div id="chart5"></div>
    //            </div>
    //        </div>
    //    </div>
    //</div>
}
//-------------------------------------------Widget Configuration--------------------------------------------//
//-------------------------------------------Gauge Configuration--------------------------------------------//
//Global Variable for  Selected Gauge Type from li(List)
var SelectedGaugeType = '';
//Clock
function GetClockGauge() {
    SelectedGaugeType = 'clock';
    //Get the current time
    const getNow = () => {
        const now = new Date();
        return {
            date: now,
            hours: now.getHours() + now.getMinutes() / 60,
            minutes: now.getMinutes() * 12 / 60 + now.getSeconds() * 12 / 3600,
            seconds: now.getSeconds() * 12 / 60
        };
    };
    let now = getNow();
    // Create the Clock  Gauge Chart
    Highcharts.chart('containers', {

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Clock'
        },
        pane: {
            background: [{
                // default background
            }, {
                // reflex for supported browsers
                backgroundColor: Highcharts.svg ? {
                    radialGradient: {
                        cx: 0.5,
                        cy: -0.4,
                        r: 1.9
                    },
                    stops: [
                        [0.5, 'rgba(255, 255, 255, 0.2)'],
                        [0.5, 'rgba(200, 200, 200, 0.2)']
                    ]
                } : null
            }]
        },
        yAxis: {
            labels: {
                distance: -23,
                style: {
                    fontSize: '18px'
                }
            },
            min: 0,
            max: 12,
            lineWidth: 0,
            showFirstLabel: false,
            minorTickInterval: 'auto',
            minorTickWidth: 3,
            minorTickLength: 5,
            minorTickPosition: 'inside',
            minorGridLineWidth: 0,
            minorTickColor: '#666',
            tickInterval: 1,
            tickWidth: 4,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            title: {
                text: 'Powered by<br/>Highcharts',
                style: {
                    color: '#BBB',
                    fontWeight: 'normal',
                    fontSize: '10px',
                    lineHeight: '10px'
                },
                y: 10
            }
        },
        tooltip: {
            format: '{series.chart.tooltipText}'
        },
        series: [{
            data: [{
                id: 'hour',
                y: now.hours,
                dial: {
                    radius: '60%',
                    baseWidth: 4,
                    baseLength: '95%',
                    rearLength: 0
                }
            }, {
                id: 'minute',
                y: now.minutes,
                dial: {
                    baseLength: '95%',
                    rearLength: 0
                }
            }, {
                id: 'second',
                y: now.seconds,
                dial: {
                    radius: '100%',
                    baseWidth: 1,
                    rearLength: '20%'
                }
            }],
            animation: false,
            dataLabels: {
                enabled: false
            }
        }]
    },
        // Move
        function (chart) {
            setInterval(function () {

                now = getNow();

                if (chart.axes) { // not destroyed
                    const hour = chart.get('hour'),
                        minute = chart.get('minute'),
                        second = chart.get('second');

                    // Cache the tooltip text
                    chart.tooltipText = Highcharts.dateFormat('%H:%M:%S', now.date);

                    hour.update(now.hours, true, false);
                    minute.update(now.minutes, true, false);

                    // Move to 59 sec without animation ...
                    if (now.seconds === 0) {
                        second.update(-0.2, true, false);
                    }
                    // ... then bounce to next second
                    second.update(now.seconds, true, {
                        easing: 'easeOutBounce'
                    });
                }

            }, 1000);

        });
    Math.easeOutBounce = function (pos) {
        if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        }
        if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        }
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
    };
}
//UV  Meter
function GetUVGauge() {
    SelectedGaugeType = 'uvmeter';
    Highcharts.chart('containers', {
        chart: {
            type: 'gauge',
            plotBorderWidth: 1,
            plotBackgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF4C6'],
                    [0.3, '#FFFFFF'],
                    [1, '#FFF4C6']
                ]
            },
            plotBackgroundImage: null,
            height: 200
        },

        title: {
            text: 'VU Meter'
        },

        pane: [{
            startAngle: -45,
            endAngle: 45,
            background: null,
            center: ['25%', '145%'],
            size: 300
        }, {
            startAngle: -45,
            endAngle: 45,
            background: null,
            center: ['75%', '145%'],
            size: 300
        }],

        exporting: {
            enabled: false
        },

        tooltip: {
            enabled: false
        },

        yAxis: [{
            min: -20,
            max: 6,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: 20
            },
            plotBands: [{
                from: 0,
                to: 6,
                color: '#C02316',
                innerRadius: '100%',
                outerRadius: '105%'
            }],
            pane: 0,
            title: {
                text: 'VU<br/><span style="font-size:8px">Channel A</span>',
                y: -40
            }
        }, {
            min: -20,
            max: 6,
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            labels: {
                rotation: 'auto',
                distance: 20
            },
            plotBands: [{
                from: 0,
                to: 6,
                color: '#C02316',
                innerRadius: '100%',
                outerRadius: '105%'
            }],
            pane: 1,
            title: {
                text: 'VU<br/><span style="font-size:8px">Channel B</span>',
                y: -40
            }
        }],

        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: false
                },
                dial: {
                    radius: '100%'
                }
            }
        },

        series: [{
            name: 'Channel A',
            data: [-20],
            yAxis: 0
        }, {
            name: 'Channel B',
            data: [-20],
            yAxis: 1
        }]

    },

        // Let the music play
        function (chart) {
            setInterval(function () {
                if (chart.series) { // the chart may be destroyed

                    const left = chart.series[0].points[0],
                        right = chart.series[1].points[0],
                        inc = (Math.random() - 0.5) * 3;

                    let leftVal,
                        rightVal;

                    leftVal = left.y + inc;
                    rightVal = leftVal + inc / 3;
                    if (leftVal < -20 || leftVal > 6) {
                        leftVal = left.y - inc;
                    }
                    if (rightVal < -20 || rightVal > 6) {
                        rightVal = leftVal;
                    }

                    left.update(leftVal, false);
                    right.update(rightVal, false);
                    chart.redraw();
                }
            }, 500);

        });
}
//Speedometer
function GetSpeedometerGauge() {
    SelectedGaugeType = 'speedometer';
    Highcharts.chart('containers', {
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },
        title: {
            text: 'Speedometer'
        },
        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '75%'],
            size: '110%'
        },
        // the value axis
        yAxis: {
            min: 0,
            max: 200,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
                distance: 20,
                style: {
                    fontSize: '14px'
                }
            },
            lineWidth: 0,
            plotBands: [{
                from: 0,
                to: 130,
                color: '#55BF3B', // green
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 150,
                to: 200,
                color: '#DF5353', // red
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D', // yellow
                thickness: 20
            }]
        },

        series: [{
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            },
            dataLabels: {
                format: '{y} km/h',
                borderWidth: 0,
                color: (
                    Highcharts.defaultOptions.title &&
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || '#333333',
                style: {
                    fontSize: '16px'
                }
            },
            dial: {
                radius: '80%',
                backgroundColor: 'gray',
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: {
                backgroundColor: 'gray',
                radius: 6
            }
        }]
    });
    // Add some life
    setInterval(() => {
        const chart = Highcharts.charts[0];
        if (chart && !chart.renderer.forExport) {
            const point = chart.series[0].points[0],
                inc = Math.round((Math.random() - 0.5) * 20);
            let newVal = point.y + inc;
            if (newVal < 0 || newVal > 200) {
                newVal = point.y - inc;
            }
            point.update(newVal);
        }
    }, 3000);
}
//-------------------------------------------Gauge Configuration--------------------------------------------//

