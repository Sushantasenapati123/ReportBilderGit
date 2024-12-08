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
    let divCount = parseFloat($('#hdnDivId').val());
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
// Function to remove all charts from a container
function removeCharts(containerId) {
    let container = $('#container' + containerId);
    if (container.length) {
        Highcharts.charts.forEach(function (chart) {
            if (chart && chart.renderTo.id === 'container' + containerId) {
                chart.destroy(); // Destroy the chart instance
            }
        });
    }
}
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
//Clear Selected List After Save
function clearActiveList() {
    document.querySelectorAll('.grid__list').forEach(item => {
        item.classList.remove('active');
    });
}
//Apply Button To Show The Report(Chart)
$("#btnApply").click(function () {
    
    apply(0);
})
//Apply Button To Show The Report(Widget)
$("#btnApplyWizard").click(function () {

    
    apply(0);
})
//Save The Chart,Table In A Potlate
$("#btnsavepotlate").click(function () {
    debugger;
    $("#hdnGridTitle" + $('#hdnDivModifyId').val()).val($('#txtGridTitle').val());
    let portletId = $('#hdnDivModifyId').val();
    let portlet = $('#colorDiv' + portletId);
    let chartType = SelectedChartType;
    let GaugeType = SelectedGaugeType;
    let TableType = SelectedTableType;
    let height = '';
    let width = '';
    switch (activeTabId) {
        case 'tab2':
            portlet.data('chartType', chartType);
            portlet.data('chartTitle', $("#txtTitle").val());
            portlet.data('xAxisName', $('#ddlXAxis :selected').text());
            portlet.data('xAxisTitle', $("#txtXAxisTitle").val());
            portlet.data('yAxisName', $('#ddlYAxis :selected').text());
            portlet.data('yAxisTitle', $("#txtYAxisTitle").val());
            portlet.data('dataSource', $('#ddlDataSource :selected').text());
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
        case 'tab1':
            portlet.data('chartType', chartType);
            portlet.data('dataSource', $('#ddlDataSourceForWizget :selected').text());
            portlet.data('titlewidget', $("#txtTitleWiz").val());
            portlet.data('datacolumnwidget', $('#ddlDataColumn :selected').val());
            portlet.data('percentagewidget', $('#ddlPercentage :selected').val());
            portlet.data('faicon', $('#ddlIconSelection :selected').val());
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
        case 'tab3':
            debugger;
            portlet.data('chartType', GaugeType);
            portlet.data('GaugeTitle', $("#txtGaugeTitle").val());
            portlet.data('portletId', portletId);
            portlet.data('activeTabId', activeTabId);
            // Clear the SelectedGaugeType
            SelectedGaugeType = "";
            height = portlet.outerHeight();
            width = portlet.outerWidth();
            // Apply gauge with portlet size adjustments
            apply1(portletId, width, height, portlet);
            break;
        case 'tab4':
            portlet.data('chartType', TableType);
            portlet.data('tableTitle', $("#txtGridTitle").val());
            portlet.data('dataSource', $('#ddlDataSourceForGrid :selected').text());
            portlet.data('portletId', portletId);
            portlet.data('activeTabId', activeTabId);
            // Clear the SelectedChartType
            //SelectedTableType = "";
            height = portlet.outerHeight();
            width = portlet.outerWidth();
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
    debugger;
    var dashboardName = $('#txtDashboardName').val();
    let data = new FormData();
    let items = new Array();
    let dashconfigitems = new Array();
    GridStack.init().engine.nodes.forEach(node => {
        items.push({ x: node.x, y: node.y, w: node.w, h: node.h, content: node.content, prtid: node._id, datasource: $("#hdnDataSourceName" + node._id).val(), tabletype: $("#hdnTableType" + node._id).val(), title: $("#hdnGridTitle" + node._id).val(), Widgettype: $("#hdnApexchart" + node._id).val(), GaugeType: $("#hdnGaugechart" + node._id).val() })

        // Save widget-specific static data
        let SavePotlateData = $('#hdnCntDetails_' + node._id).data() || {}; // Ensure it's initialized
        let portlet = $('#colorDiv' + node._id);

        SavePotlateData['chartType'] = portlet.data('chartType');
        SavePotlateData['titlewidget'] = portlet.data('titlewidget');
        SavePotlateData['GaugeTitle'] = portlet.data('GaugeTitle');
        SavePotlateData['tableTitle'] = portlet.data('tableTitle');
        SavePotlateData['datacolumnwidget'] = portlet.data('datacolumnwidget');
        SavePotlateData['percentagewidget'] = portlet.data('percentagewidget');
        SavePotlateData['faicon'] = portlet.data('faicon');
        SavePotlateData['portletId'] = portlet.data('portletId');
        SavePotlateData['height'] = portlet.outerHeight();
        SavePotlateData['width'] = portlet.outerWidth();
        SavePotlateData['dataSource'] = portlet.data('dataSource');
        let activeTabId = portlet.data('activeTabId');
        if (activeTabId) {
            SavePotlateData['designtype'] = activeTabId.replace('#', '');
        }
        // Push SavePotlateData to dashconfigitems for saving
        //dashconfigitems.push(SavePotlateData);
    });
    GridStack.init().engine.nodes.forEach(node => {
        dashconfigitems.push($('#hdnCntDetails_' + node._id).data());
    });
    data.append("PageName", dashboardName);
    data.append("PageLayout", JSON.stringify(items));
    data.append("PageContent", JSON.stringify(dashconfigitems));
    data.append("Id", $("#hdnId").val());

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
//Preview Button
function PreviewUpdate() {
    var prevencidupdate = getUrlVars()["EncId"]
    if (prevencidupdate != undefined) {
        prevencid = prevencidupdate;
    }
    window.open("/ReportBuilderUI/DashboardPreview?EncId=" + prevencid + "", "_blank")
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
//Apply
function apply(containerid) {   
    $("#btn" + $('#hdnDivModifyId').val()).css('display', 'none');
    let chartType = SelectedChartType;
    switch (activeTabId) {
        //Widget
        case 'tab1':
            var datacolumnwinz = [];
            var datacolumnwinzpercentage = [];
            var titlewinz = [];
            var faicon = [];

            datacolumnwinz.push($('#ddlDataColumn :selected').val());
            datacolumnwinzpercentage.push($('#ddlPercentage :selected').val());
            titlewinz.push($('#txtTitleWiz').val());
            faicon.push($('#ddlIconSelection :selected').val());

            if (!chartType || chartType === "") {
                console.log("Unknown Widget type");
                return;
            }
            else if ($('#ddlDataSourceForWizget').val() == "0") {
                alert("Please Select DataSource !");
                return;
            }
            else if ($('#txtTitleWiz').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            else if ($('#ddlDataColumn').val() == "0") {
                alert("Please  Select Data Column !");
                return;
            }
            else if (chartType == "Widget1" && $('#ddlPercentage').val() == "0") {
                alert("Please Select Percentage Column !");
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
                                                   <i class="${faicon}" aria-hidden="true"></i>
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
                genericApexChart(chartType, document.getElementById("txtTitleWiz").value, $('#ddlDataColumn :selected').val(), $('#ddlPercentage :selected').val(), containerid, 70, 100, $('#ddlDataSourceForWizget option:selected').text(), $('#ddlIconSelection :selected').val());
            }

            break;
        //Chart
        case 'tab2':
            var yaxis = [];
            var yaxistitle = [];
            yaxis.push($('#ddlYAxis :selected').text());
            yaxistitle.push($('#txtYAxisTitle').val());

            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else if ($('#ddlDataSource').val() == "0") {
                alert("Please Select DataSource !");
                return;
            }
            else if ($('#txtTitle').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            else if ($('#ddlXAxis').val() == "0") {
                alert("Please Select X-Axis !");
                return;
            }
            else if ($('#txtXAxisTitle').val() == "") {
                alert("Please Enter X-Axis Title  !");
                return;
            }
            else if ($('#ddlYAxis').val() == "0") {
                alert("Please Select Y-Axis !");
                return;
            }
            else if ($('#txtYAxisTitle').val() == "") {
                alert("Enter Enter Y-Axis Title !");
                return;
            }
            else {
                genericchart(chartType, document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value, containerid, 0, 0, $('#ddlDataSource option:selected').text());
            }
            break;
        //Table
        case 'tab4':
            for (var k = 0; k < $("#hdnYaxiscount").val().length; k++) {
                yaxis.push($('#ddlYAxis-' + $("#hdnYaxiscount").val() + ' :selected').text());
                yaxistitle.push($('#txtYAxisTitle-' + $("#hdnYaxiscount").val() + '').val());
            }
            break;
        default:
            break;
    }
}
//Apply1
function apply1(containerid, width, height, portlet) {
    debugger;
    let dataSource = portlet.data('dataSource');
    //chart,widget,gauge,table
    let chartType = portlet.data('chartType');
    let activeTabId = portlet.data('activeTabId');
    switch (activeTabId) {
        //Widget
        case 'tab1':
            let titlewinz = portlet.data('titlewidget');
            let datacolumnwinz = portlet.data('datacolumnwidget');
            let percentagewidget = portlet.data('percentagewidget');
            let faicon = portlet.data('faicon');
            if (!chartType || chartType === "") {
                console.log("Unknown Widget Type");
                return;
            }
            else if ($('#ddlDataSourceForWizget').val() == "0") {
                alert("Please Select DataSource !");
                return;
            }
            else if ($('#txtTitleWiz').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            else if ($('#ddlDataColumn').val() == "0") {
                alert("Please  Select Data Column !");
                return;
            }
            else if (chartType == "Widget1" && $('#ddlPercentage').val() == "0") {
                alert("Please Select Percentage Column !");
                return;
            }
            else {
                if (chartType === 'Widget1') {

                    var widgetHtml = `
                                <div class="" id="apexWidget${containerid}">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <div class="circle-icon">
                                                <div class="icon">
                                                    <i class="${faicon}" aria-hidden="true"></i>
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
                genericApexChart(chartType, titlewinz, datacolumnwinz, percentagewidget, containerid, width, height, dataSource, faicon);

            }
            break;
        //Chart
        case 'tab2':
            let chartTitle = portlet.data('chartTitle');
            let xAxisName = portlet.data('xAxisName');
            let xAxisTitle = portlet.data('xAxisTitle');
            let yAxisName = portlet.data('yAxisName');
            let yAxisTitle = portlet.data('yAxisTitle');
            if (!chartType || chartType === "") {
                console.log("Unknown chart type");
                return;
            }
            else if ($('#ddlDataSource').val() == "0") {
                alert("Please Select DataSource !");
                return;
            }
            else if ($('#txtTitle').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            else if ($('#ddlXAxis').val() == "0") {
                alert("Please Select X-Axis !");
                return;
            }
            else if ($('#txtXAxisTitle').val() == "") {
                alert("Please Enter X-Axis Title  !");
                return;
            }
            else if ($('#ddlYAxis').val() == "0") {
                alert("Please Select Y-Axis !");
                return;
            }
            else if ($('#txtYAxisTitle').val() == "") {
                alert("Enter Enter Y-Axis Title !");
                return;
            }
            else {
                genericchart(chartType, chartTitle, xAxisName, xAxisTitle, yAxisName, yAxisTitle, containerid, width, height, dataSource);
            }
            break;
        //Gauge
        case 'tab3':
            debugger;
            let GaugeTitle = portlet.data('GaugeTitle');
            if (!chartType || chartType === "") {
                console.log("Unknown gauge type");
                return;
            }
            else if ($('#txtGaugeTitle').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            else {
                genericgauge(chartType, GaugeTitle, containerid, width, height, dataSource)
            }
            break;
        //Table
        case 'tab4':
            if (!chartType || chartType === "") {
                console.log("Unknown Table type");
                return;
            }
            else if ($('#ddlDataSourceForGrid').val() == "0") {
                alert("Please Select DataSource !");
                return;
            }
            else if ($('#txtGridTitle').val() == "") {
                alert("Please Enter Title !");
                return;
            }
            // Bind Grid--table
            if ($('#dataGrid tr').length > 0)
            {
                $("#BindTable" + containerid).empty();
                $("#BindTable" + containerid).append($('#dataGrid')[0].innerHTML);
            }

            break;
        default:
            break;
    }
}
//Update Modal Height And Width After Save
function updateModalDimensions() {
    let portletId = $('#hdnDivModifyId').val();
    let portlet = $('#colorDiv' + portletId);
    let height = portlet.outerHeight();
    let width = portlet.outerWidth();
    // Set the retrieved dimensions in the modal's read-only fields
    $('#portletHeight').val(height + 'px');
    $('#portletWidth').val(width + 'px');
}
// Function to resize chart based on portlet size
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
//--------------------------------------Bind Chart----------------------------------------------------------------//
function genericchart(charttype, charttitle, xaxisname, xaxistitle, yaxisname, yaxistitle, containerid, width, height, dataSource) {
    Highcharts.getJSON('/ReportBuilderUI/TableDetail2?DataSource=' + dataSource, function (response) {
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
        let chartOptions;
        if (charttype === 'donut') {
            chartOptions = {
                chart: {
                    type: 'pie',
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
                tooltip: {
                    valueSuffix: '%'
                },
                plotOptions: {
                    series: {
                        innerSize: '75%',
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
                series: [yaxisdata]
            };
        }
        else if (charttype === 'pie') {
            chartOptions = {
                chart: {
                    type: 'pie',
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
                series: [yaxisdata]
            };
        }
        else {
            chartOptions = {
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
        }

        //let chartOptions = {
        //    chart: {
        //        type: charttype,
        //        width: width ? parseInt(width) : null,
        //        height: height ? parseInt(height) : null
        //    },
        //    title: {
        //        text: charttitle,
        //        align: 'center'
        //    },
        //    subtitle: {
        //        text: ''
        //    },
        //    xAxis: {
        //        categories: xaxis,
        //        type: xaxis,
        //        title: {
        //            text: xaxistitle
        //        }
        //    },
        //    yAxis: {
        //        allowDecimals: false,
        //        type: yaxis,
        //        title: {
        //            text: yaxistitle
        //        }
        //    },
        //    plotOptions: {
        //        column: {
        //            stacking: 'normal',
        //            dataLabels: {
        //                enabled: true
        //            }
        //        }
        //    },
        //    series: [yaxisdata]
        //};

        if (containerid == 0) {
            Highcharts.chart('container', chartOptions);
        } else {
            Highcharts.chart('container' + containerid, chartOptions);
        }

    });
}
//-------------------------------------Bind Chart----------------------------------------------------------------//
//-------------------------------------Bind Gauge----------------------------------------------------------------//
function genericgauge(GaugeType, GaugeTitle, containerid, width, height, dataSource) {
    let gaugeOptions;
    //Gauge Chart
    switch (GaugeType) {
        case 'clock':
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
            gaugeOptions = {
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
                    text: GaugeTitle
                },
                pane: {
                    background: [{
                        // default background
                    }, {
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
            };
            setInterval(function () {
                now = getNow();
                if (Highcharts.charts.length) { // check if chart exists
                    const chart = Highcharts.charts[0]; // assuming it's the first chart
                    const hour = chart.get('hour'),
                        minute = chart.get('minute'),
                        second = chart.get('second');

                    // Cache the tooltip text
                    chart.tooltipText = Highcharts.dateFormat('%H:%M:%S', now.date);

                    hour.update(now.hours, true, false);
                    minute.update(now.minutes, true, false);

                    if (now.seconds === 0) {
                        second.update(-0.2, true, false); // Move to 59 sec without animation
                    }
                    second.update(now.seconds, true, { easing: 'easeOutBounce' }); // Bounce to next second
                }
            }, 1000);
            break;
        case 'speedometer':
            gaugeOptions = {
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
                        thickness: 20
                    }, {
                        from: 150,
                        to: 200,
                        color: '#DF5353', // red
                        thickness: 20
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
                        color: Highcharts.defaultOptions.title?.style?.color || '#333333',
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
            };
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
            break;
        case 'solidgauge':
            gaugeOptions = {
                chart: {
                    type: 'solidgauge'
                },
                title: {
                    text: ''
                },
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor:
                            Highcharts.defaultOptions.legend.backgroundColor || '#fafafa',
                        borderRadius: 5,
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    enabled: false
                },
                // the value axis
                yAxis: {
                    stops: [
                        [0.1, '#55BF3B'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ],
                    lineWidth: 0,
                    tickWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                },
                plotOptions: {
                    solidgauge: {
                        borderRadius: 3,
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                }
            };
            // The speed gauge
            const chartSpeed = Highcharts.chart(
                'containers', Highcharts.merge(gaugeOptions, {
                    yAxis: {
                        min: 0,
                        max: 200,
                        title: {
                            text: 'Speed'
                        }
                    },

                    credits: {
                        enabled: false
                    },

                    series: [{
                        name: 'Speed',
                        data: [80],
                        dataLabels: {
                            format:
                                '<div style="text-align:center">' +
                                '<span style="font-size:25px">{y}</span><br/>' +
                                '<span style="font-size:12px;opacity:0.4">km/h</span>' +
                                '</div>'
                        },
                        tooltip: {
                            valueSuffix: ' km/h'
                        }
                    }]

                }));
            // Bring life to the dials
            setInterval(function () {
                // Speed
                let point,
                    newVal,
                    inc;
                if (chartSpeed) {
                    point = chartSpeed.series[0].points[0];
                    inc = Math.round((Math.random() - 0.5) * 100);
                    newVal = point.y + inc;

                    if (newVal < 0 || newVal > 200) {
                        newVal = point.y - inc;
                    }

                    point.update(newVal);
                }
            }, 2000);
            break;
        case 'solidgaugekpi':
            function renderIcons() {
                this.series.forEach(series => {
                    if (!series.icon) {
                        series.icon = this.renderer
                            .text(
                                `<i class="fa fa-${series.options.custom.icon}"></i>`,
                                0,
                                0,
                                true
                            )
                            .attr({
                                zIndex: 10
                            })
                            .css({
                                color: series.options.custom.iconColor,
                                fontSize: '1.5em'
                            })
                            .add(this.series[2].group);
                    }
                    series.icon.attr({
                        x: this.chartWidth / 2 - 15,
                        y: this.plotHeight / 2 -
                            series.points[0].shapeArgs.innerR -
                            (
                                series.points[0].shapeArgs.r -
                                series.points[0].shapeArgs.innerR
                            ) / 2 +
                            8
                    });
                });
            }
            const trackColors = Highcharts.getOptions().colors.map(color =>
                new Highcharts.Color(color).setOpacity(0.3).get()
            );
            gaugeOptions = {
                chart: {
                    type: 'solidgauge',
                    events: {
                        render: renderIcons
                    }
                },
                title: {
                    text: ''
                },
                tooltip: {
                    borderWidth: 0,
                    backgroundColor: 'none',
                    shadow: false,
                    style: {
                        fontSize: '16px'
                    },
                    valueSuffix: '%',
                    pointFormat: '{series.name}<br>' +
                        '<span style="font-size: 2em; color: {point.color}; ' +
                        'font-weight: bold">{point.y}</span>',
                    positioner: function (labelWidth) {
                        return {
                            x: (this.chart.chartWidth - labelWidth) / 2,
                            y: (this.chart.plotHeight / 2) + 15
                        };
                    }
                },
                pane: {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Conversion
                        outerRadius: '112%',
                        innerRadius: '88%',
                        backgroundColor: trackColors[0],
                        borderWidth: 0
                    }, { // Track for Engagement
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: trackColors[1],
                        borderWidth: 0
                    }, { // Track for Feedback
                        outerRadius: '62%',
                        innerRadius: '38%',
                        backgroundColor: trackColors[2],
                        borderWidth: 0
                    }]
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    lineWidth: 0,
                    tickPositions: []
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false,
                        rounded: true
                    }
                },
                series: [{
                    name: 'Conversion',
                    data: [{
                        color: Highcharts.getOptions().colors[0],
                        radius: '112%',
                        innerRadius: '88%',
                        y: 80
                    }],
                    custom: {
                        icon: 'filter',
                        iconColor: '#303030'
                    }
                }, {
                    name: 'Engagement',
                    data: [{
                        color: Highcharts.getOptions().colors[1],
                        radius: '87%',
                        innerRadius: '63%',
                        y: 65
                    }],
                    custom: {
                        icon: 'comments-o',
                        iconColor: '#ffffff'
                    }
                }, {
                    name: 'Feedback',
                    data: [{
                        color: Highcharts.getOptions().colors[2],
                        radius: '62%',
                        innerRadius: '38%',
                        y: 50
                    }],
                    custom: {
                        icon: 'commenting-o',
                        iconColor: '#303030'
                    }
                }]
            };
            //Highcharts.chart(getContainerId(containerid), gaugeOptions);
            break;
    }
    const targetContainer = containerid ? `containers${containerid}` : 'containers';
    Highcharts.chart(targetContainer, gaugeOptions); // append to the correct container
}
//--------------------------------------Bind Gauge---------------------------------------------------------------//
//------------------Bind  Table For View Dashboard And Auto - Fill Search-------------------------------------------//
//Search using Dashboard Name 
function InputChangeEvent(value) {
    BindViewDashboardReport(value);
}
$(document).ready(function () {
    $('#tblDashboard tbody').empty();
    BindViewDashboardReport("");

});
//Bind View Dashboard Table 
function BindViewDashboardReport(PageName = "") {
    $.ajax({
        url: '/ReportBuilderUI/BindReportWithSearch',
        type: 'POST',
        data: { PageName: PageName },
        success: function (response) {
            $('#tblDashboard tbody').empty();
            $.each(response, function (index, item) {
                var row = '<tr>' +
                    '<td class="align-top text-center">' + (index + 1) + '</td>' +
                    '<td class="align-top">' + item.pageName + '<br><br>' + item.createdOn + '</td>' +
                    '<td>' +
                    '<a onclick="updateDashboard(\'' + item.encId + '\');" class="btn btn-outline-secondary btn-sm me-2" data-toggle="tooltip" data-placement="top" title="Edit">' +
                    '<i class="bi bi-pencil-square"></i>' +
                    '</a>' +
                    '<a onclick="Preview(\'' + item.encId + '\');" class="btn btn-outline-primary btn-sm me-2" data-toggle="tooltip" data-placement="top" title="Preview" id="btnPreview">' +
                    '<i class="bi bi-eye"></i>' +
                    '</a>' +
                    '<a onclick="deleteDashboard(\'' + item.id + '\');" class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Delete">' +
                    '<i class="bi bi-trash3"></i>' +
                    '</a>' +
                    '</td>' +
                    '</tr>';
                $('#tblDashboard tbody').append(row);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}
//------------------------Bind  Table For View Dashboard And Auto - Fill Search --------------------------//

//----------------------------------Create New Dashbaoard -------------------------------------------//
$(document).ready(function () {
    $('#createDashboardBtn').on('click', function () {
        $('#modalDashboardName').modal('show');
    });

    // Save Dashboard Name
    $(document).ready(function () {
        $('#createDashboardBtn').on('click', function () {
            
            $('#modalDashboardName').modal('show');
        });


        $("#btnsavedashboardname").click(function () {
            
            var dashboardName = $('#txttDashboardName').val(); // Use the correct ID for the input field

            if (dashboardName === "") {
                alert("Please enter a dashboard name.");
                return;
            } else {
                // Switch to the tab with id="tab11"
                $('.nav-item a[href="#tab11"]').tab('show');

                // Update the readonly input field with the dashboard name
                $('#txtDashboardName').val(dashboardName);

                // Hide the modal and remove the backdrop
                $('#modalDashboardName').modal('hide').on('hidden.bs.modal', function () {
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                });
            }
        });
        $("#btnclosedashboardname").click(function () {
            
            $('#modalDashboardName').modal('hide');
            //$('.nav-item a[href="#tab10"]').tab('show');
        });

    });

});
//----------------------------------Create New Dashbaoard-------------------------------------------//

//-------------------Bind View Dashboard,Edit Dashboard Design,Delete Dashboard Design-----------------//
$(document).ready(function () {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Get the EncId and tab from the URL
    var EncId = getUrlVars()["EncId"];
    var tab = getUrlVars()["tab"];

    // Check if EncId or 'tab=design' is defined and show the appropriate tab
    if (EncId !== undefined) {
        // If EncId is present, show the Dashboard Design tab
        $('.nav-item a[href="#tab11"]').tab('show');
        LoadDashboard(EncId); // Load dashboard based on the EncId
    } else if (tab === "design") {
        // If tab=design is present, show the Dashboard Design tab
        $('.nav-item a[href="#tab11"]').tab('show');
    }
});
// Function to get URL parameters
function getUrlVars() {
    var vars = {};
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}
// Update Dashboard function
function updateDashboard(encid) {
    if (confirm("Are you sure you want to update?")) {
        //var newUrl = "/ReportBuilderUI/ReportPotlate?EncId=" + encid +"&tab=design";
        //location.href = newUrl;
        //$("#txtDashboardName").val(result.PageName);
        location.href = "/ReportBuilderUI/DashboardEdit?EncId=" + encid + "";
    }
}
//Preview Button
function Preview(id) {
    window.open("/ReportBuilderUI/DashboardPreview?EncId=" + id + "", "_blank")
}
//Delete
function deleteDashboard(id) {
    
    if (confirm("Are you sure you want to delete ?")) {
        $.ajax({
            url: "/ReportBuilderUI/DeleteDashboard?id=" + id,
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (data) {
                if (data == "1") {
                    alert("Dashboard Deleted Successfully");
                    window.location.reload();
                }
                else if (data == "4") {
                    alert("Dashboard Already In Use!");
                    window.location.reload();
                }
                else { }
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                bootbox.alert("Error : " + jsonValue);
            }
        });
    }
}
//Pagination And Search
function getDashboardDetails() {
    $('#tblDashboard').DataTable({
        "searching": true,
        //"bStateSave": true,
        "dom": 'Bfrtip',
        "autoWidth": false,
        "buttons": [
            ,
            {
                extend: 'pageLength'
            }
        ],
        "lengthMenu": [
            [10, 25, 50, 100, 1000 - 1],
            ['10 rows', '25 rows', '50 rows', '100 rows', '1000 rows', 'Show all']
        ]
    });
}
//----------------------------------Bind View Dashboard,Edit Dashboard Design,Delete Dashboard Design--------------//

//------------------------------------------Load Dashboard-----------------------------------//
function LoadDashboard(EncId) {    
    //let Data = new FormData();
    //Data.append("EncId", EncId);
    $.ajax({
        url: '/ReportBuilderUI/GetPageDetails?EncId=' + EncId,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        /*        data: Data,*/
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
                    items.push({ x: i.x, y: parseFloat(i.y), w: i.w, h: i.h, content: '<input type="hidden" value="" id="hdnDataSourceName' + i.prtid + '" /><input type="hidden" value="" id="hdnTableType' + i.prtid + '" /><input type="hidden" value="" id="hdnGridTitle' + i.prtid + '" />' + i.content });
                });
                grid.load(items);
                divCount = 0;
                grid.engine.nodes.forEach(node => {
                    let checkitem = node.el.firstElementChild.className;
                    if (checkitem != 'handle-config') {
                        node.el.insertAdjacentHTML('afterbegin', '<div class="handle-config" id="' + layouts[divCount].prtid + '"><input  id="hdncolordivjson' + layouts[divCount].prtid + '" value="" type="hidden" /><i title="Edit" class="bi bi-pencil-square" data-toggle="modal" data-target="#yourModalId" ></i><input type="hidden" id="hdnCntDetails_' + layouts[divCount].prtid + '" /></div><div class="crush_icon" title="Delete"><i class="bi bi-trash"></i></div>');
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
                let sortedconts = contents.sort(i => i.dsid);
                for (var i = 0; i < sortedconts.length; i++) {
                    let designtype = sortedconts[i].designtype;
                    //Chart
                    if (designtype === 'tab2') {
                        BindTable(sortedconts[i], items[i].h);
                        let portlet = $('#colorDiv' + sortedconts[i].portletId);
                        portlet.data('chartType', sortedconts[i].chartType);
                        portlet.data('chartTitle', sortedconts[i].title);
                        portlet.data('xAxisName', sortedconts[i].xaxis);
                        portlet.data('xAxisTitle', sortedconts[i].xtitle);
                        portlet.data('yAxisName', sortedconts[i].yaxis);
                        portlet.data('yAxisTitle', sortedconts[i].ytitle);
                        portlet.data('dataSource', sortedconts[i].dataSource);
                        portlet.data('portletId', sortedconts[i].portletId);
                        portlet.data('activeTabId', sortedconts[i].designtype);
                    }
                    //Widget
                    else if (designtype === 'tab1') {
                        let chartType = sortedconts[i].chartType; // Get chartType from contents
                        let titlewidget = sortedconts[i].titlewidget;
                        let datacolumnwidget = sortedconts[i].datacolumnwidget;
                        let percentagewidget = sortedconts[i].percentagewidget;
                        let portletId = sortedconts[i].portletId;
                        let layout = layouts[i];
                        let height = sortedconts[i].height;
                        let width = sortedconts[i].width;
                        let dataSource = sortedconts[i].dataSource;
                        let activeTabId = sortedconts[i].designtype;

                        let portlet = $('#colorDiv' + sortedconts[i].portletId);
                        portlet.data('chartType', chartType);
                        portlet.data('dataSource', $('#ddlDataSourceForWizget :selected').text());
                        portlet.data('titlewidget', titlewidget);
                        portlet.data('datacolumnwidget', datacolumnwidget);
                        portlet.data('percentagewidget', percentagewidget);
                        portlet.data('portletId', portletId);
                        portlet.data('activeTabId', activeTabId);

                        // Check if chartType is not null or empty
                        if (chartType && chartType.trim() !== "") {
                            renderWidgetByType(chartType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout, width, height, dataSource);
                        } else {
                            console.log("ChartType is empty or null. Skipping rendering for portlet: " + portletId);
                        }
                    }
                    //Gauge
                    else if (designtype === 'tab3') {
                        debugger;
                        let GaugeType = sortedconts[i].GaugeType; // Get gaugeType from contents
                        let GaugeTitle = sortedconts[i].GaugeTitle;
                        let portletId = sortedconts[i].portletId;
                        let layout = layouts[i];
                        let height = sortedconts[i].height;
                        let width = sortedconts[i].width;
                        let activeTabId = sortedconts[i].designtype;

                        let portlet = $('#colorDiv' + sortedconts[i].portletId);
                        portlet.data('GaugeType', GaugeType);
                        portlet.data('GaugeTitle', GaugeTitle);
                        portlet.data('portletId', portletId);
                        portlet.data('activeTabId', activeTabId);

                        // Check if gaugeType is not null or empty
                        if (GaugeType && GaugeType.trim() !== "") {
                            renderGaugeByType(GaugeType, GaugeTitle,portletId, layout, width, height, dataSource);
                        } else {
                            console.log("GaugeType is empty or null. Skipping rendering for portlet: " + portletId);
                        }
                    }
                }
                //Bind Grid(Table)
                for (var i = 0; i < layouts.length; i++) {
                    if (layouts[i].datasource != "") {
                        BindGrid(layouts[i].datasource, layouts[i].prtid, layouts[i].tabletype, items[i].h, layouts[i].title);
                    }
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
//------------------------------------------Load Dashboard-----------------------------------//

//------------------------------------------Table Render-----------------------------------//
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
                genericchartedit(contentdetails.charttype.toLowerCase(), contentdetails.title, contentdetails.xaxis, contentdetails.xtitle, contentdetails.yaxis, contentdetails.ytitle, sdata1, xcat, contentdetails.dsid, height);
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
//------------------------------------------Table Render-----------------------------------//

//------------------------------------------Chart Render-----------------------------------//
function genericchartedit(charttype, charttitle, xaxis, xaxistitle, yaxis, yaxistitle, seriesData, Xcatagories, id, height) {
    debugger;
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
//------------------------------------------Chart Render-----------------------------------//

//------------------------------------------Widget Render-----------------------------------//
function renderWidgetByType(widgetType, titlewidget, datacolumnwidget, percentagewidget, portletId, layout, width, height
    , dataSource) {
    
    let widgetHtml = '';
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
                    height: height,
                    width: width,
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
                    height: height,
                    width: width,
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
                    height: height,
                    width: width,
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
                    height: height,
                    width: width,
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
                    height: height,
                    width: width,
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
                    height: height || 350,
                    width: width,
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
//------------------------------------------Widget Render-----------------------------------//
//------------------------------------------Gauge Render-----------------------------------//
function renderGaugeByType(GaugeType, GaugeTitle, seriesData, Xcatagories, id, height, width) {
    $("#containers" + id).css("height", parseFloat(height * 70) - 80)
    $(".card" + id).append("<div class='card-header card_new' style='height:50px' >" + GaugeTitle + "</div>");
    switch (GaugeType) {
        case 'clock':
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
            gaugeOptions = {
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
                    text: GaugeTitle
                },
                pane: {
                    background: [{
                        // default background
                    }, {
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
            };
            setInterval(function () {
                now = getNow();
                if (Highcharts.charts.length) { // check if chart exists
                    const chart = Highcharts.charts[0]; // assuming it's the first chart
                    const hour = chart.get('hour'),
                        minute = chart.get('minute'),
                        second = chart.get('second');

                    // Cache the tooltip text
                    chart.tooltipText = Highcharts.dateFormat('%H:%M:%S', now.date);

                    hour.update(now.hours, true, false);
                    minute.update(now.minutes, true, false);

                    if (now.seconds === 0) {
                        second.update(-0.2, true, false); // Move to 59 sec without animation
                    }
                    second.update(now.seconds, true, { easing: 'easeOutBounce' }); // Bounce to next second
                }
            }, 1000);
            break;
        case 'speedometer':
            gaugeOptions = {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: '80%'
                },
                title: {
                    text: ''
                },
                pane: {
                    startAngle: -90,
                    endAngle: 89.9,
                    background: null,
                    center: ['50%', '75%'],
                    size: '110%'
                },
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
                        thickness: 20
                    }, {
                        from: 150,
                        to: 200,
                        color: '#DF5353', // red
                        thickness: 20
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
                        color: Highcharts.defaultOptions.title?.style?.color || '#333333',
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
            };
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
            break;
        case 'solidgaugekpi':
            debugger;
            function renderIcons() {
                this.series.forEach(series => {
                    if (!series.icon) {
                        series.icon = this.renderer
                            .text(
                                `<i class="fa fa-${series.options.custom.icon}"></i>`,
                                0,
                                0,
                                true
                            )
                            .attr({
                                zIndex: 10
                            })
                            .css({
                                color: series.options.custom.iconColor,
                                fontSize: '1.5em'
                            })
                            .add(this.series[2].group);
                    }
                    series.icon.attr({
                        x: this.chartWidth / 2 - 15,
                        y: this.plotHeight / 2 -
                            series.points[0].shapeArgs.innerR -
                            (
                                series.points[0].shapeArgs.r -
                                series.points[0].shapeArgs.innerR
                            ) / 2 +
                            8
                    });
                });
            }
            const trackColors = Highcharts.getOptions().colors.map(color =>
                new Highcharts.Color(color).setOpacity(0.3).get()
            );
            gaugeOptions = {
                chart: {
                    type: 'solidgauge',
                    events: {
                        render: renderIcons
                    }
                },
                title: {
                    text: ''
                },
                tooltip: {
                    borderWidth: 0,
                    backgroundColor: 'none',
                    shadow: false,
                    style: {
                        fontSize: '16px'
                    },
                    valueSuffix: '%',
                    pointFormat: '{series.name}<br>' +
                        '<span style="font-size: 2em; color: {point.color}; ' +
                        'font-weight: bold">{point.y}</span>',
                    positioner: function (labelWidth) {
                        return {
                            x: (this.chart.chartWidth - labelWidth) / 2,
                            y: (this.chart.plotHeight / 2) + 15
                        };
                    }
                },
                pane: {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Conversion
                        outerRadius: '112%',
                        innerRadius: '88%',
                        backgroundColor: trackColors[0],
                        borderWidth: 0
                    }, { // Track for Engagement
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: trackColors[1],
                        borderWidth: 0
                    }, { // Track for Feedback
                        outerRadius: '62%',
                        innerRadius: '38%',
                        backgroundColor: trackColors[2],
                        borderWidth: 0
                    }]
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    lineWidth: 0,
                    tickPositions: []
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false,
                        rounded: true
                    }
                },
                series: [{
                    name: 'Conversion',
                    data: [{
                        color: Highcharts.getOptions().colors[0],
                        radius: '112%',
                        innerRadius: '88%',
                        y: 80
                    }],
                    custom: {
                        icon: 'filter',
                        iconColor: '#303030'
                    }
                }, {
                    name: 'Engagement',
                    data: [{
                        color: Highcharts.getOptions().colors[1],
                        radius: '87%',
                        innerRadius: '63%',
                        y: 65
                    }],
                    custom: {
                        icon: 'comments-o',
                        iconColor: '#ffffff'
                    }
                }, {
                    name: 'Feedback',
                    data: [{
                        color: Highcharts.getOptions().colors[2],
                        radius: '62%',
                        innerRadius: '38%',
                        y: 50
                    }],
                    custom: {
                        icon: 'commenting-o',
                        iconColor: '#303030'
                    }
                }]
            };
            //Highcharts.chart(getContainerId(containerid), gaugeOptions);
            break;
    }
}
//------------------------------------------Gauge Render-----------------------------------//
//------------------------------------------Refresh Page After Save-----------------------------------//
$(document).ready(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        if (target === "#tab10") {
            // Refresh the page
            location.reload();
        }
    });
});
//------------------------------------------Refresh Page After Save-----------------------------------//
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
    SelectedTableType = 'ThirdTable';
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
    SelectedTableType = 'ForthTable';
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
function GetColumnsByDatasource() {
    
    // Get the selected value from the dropdown
    var selectedDataSourceId = $('#ddlDataSource').val();

    if (selectedDataSourceId === "0") {
        // If "Select Data Source" is chosen, do nothing or clear any dependent UI
        alert("Please select a valid data source.");
        return;
    }

    // Make the AJAX call to fetch columns by data source ID
    $.ajax({
        // url: '@Url.Action("GetColumnsByDataSource","ReportBuilderUI")', // Ensure this URL is correct
        url: "/ReportBuilderUI/GetColumnsByDataSource",
        type: 'GET',
        data: { dataSourceId: selectedDataSourceId }, // Pass the selected ID as a parameter
        success: function (data) {
            var options = "<option value='0'>--Select--</option>";

            // Loop through the received data to create options
            $.each(data.headers, function (i, header) {
                // Bind the header as both value and text of the option
                options += "<option value='" + header + "'>" + header + "</option>";
            });

            // Bind the options to both dropdowns
            $("#ddlXAxis").html(options);
            $("#ddlYAxis").html(options);
        },
        error: function (xhr, status, error) {
            console.error("Error loading columns: " + error); // Use console.error for error logging
        }
    });
}
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
//Get Widget Column Content
function GetColumnsByTableforwizfromdatasourcequery() {   
    // Get the selected value from the dropdown
    var selectedDataSourceId = $('#ddlDataSourceForWizget').val();

    if (selectedDataSourceId === "0") {
        // If "Select Data Source" is chosen, do nothing or clear any dependent UI
        alert("Please select a valid data source.");
        return;
    }

    // Make the AJAX call to fetch columns by data source ID
    $.ajax({
        // url: '@Url.Action("GetColumnsByDataSource","ReportBuilderUI")', // Ensure this URL is correct
        url: "/ReportBuilderUI/GetColumnsByDataSource",
        type: 'GET',
        data: { dataSourceId: selectedDataSourceId }, // Pass the selected ID as a parameter
        success: function (data) {
            var options = "<option value='0'>--Select--</option>";

            $.each(data.mappedResults, function (index, item) {
                // Loop through the properties (key-value pairs) of each object in MappedResults
                $.each(item, function (key, value) {
                    // Bind the value to the option's value and the key (column name) as the displayed text
                    options += "<option value='" + value + "'>" + key + "</option>";
                });
            });

            // Bind the options to both dropdowns
            $("#ddlDataColumn").html(options);
            $("#ddlPercentage").html(options);
        },
        error: function (xhr, status, error) {
            console.error("Error loading columns: " + error); // Use console.error for error logging
        }
    });

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
                                            <div class="font-18"> 2020</div>
                                            <div class="weight-500">Contact</div>
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
    document.getElementById("ddlIconSelectiondiv").style.display = "block";
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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";
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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";

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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";

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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";

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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";

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
    document.getElementById("ddlIconSelectiondiv").style.display = "none";

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
var activeTabId = '';
$('#tabMenu a').on('shown.bs.tab', function (e) {

    
    // Get the id of the currently active tab
    activeTabId = $(e.target).attr('href');
    activeTabId = activeTabId.replace('#', '');

});