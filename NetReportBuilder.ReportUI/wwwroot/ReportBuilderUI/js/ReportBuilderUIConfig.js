/*< !--Chart Configuration-- >*/

//Adding Add More Option In Y-Axis and Y-Axis Title
$("#rowAdder").click(function () {
    $("#hdnYaxiscount").val(parseFloat($("#hdnYaxiscount").val() + 1));//Dynamic Id for Dynamic Dropdown
    newRowAdd =
        '<div class="form-group row" id="row">'
        + '<div class="col-xs-12 col-md-4 col-xl-4">'
        + '<label class="control-label">Y-Axis<span class="text-danger">*</span></label>'
        + '<select id="ddlYAxis-' + $(" #hdnYaxiscount").val() + '" class="form-control">'
        + '    <option value="0" selected>Select Y-Axis</option>'
        + '</select>'
        + '</div >'
        + '<div class="col-xs-12 col-md-8 col-xl-8">'
        + '      <label class="control-label">Y-Axis Title<span class="text-danger">*</span></label>'
        + '      <div class="row">'
        + '          <div class="col-xs-12 col-md-4 col-xl-4">'
        + '              <input type="text" id="txtYAxisTitle-' + $(" #hdnYaxiscount").val() + '" class="form-control">'
        + '          </div>'
        + '          <div class="col-xs-12 col-md-4 col-xl-4">'
        + '<button class="btn btn-danger" id="DeleteRow" type="button">'
        + '<i class="fa fa-trash-o"></i></button>'
        + '          </div>'
        + '      </div>'
        + '  </div>'
        + '</div> ';
    $('#newinput').append(newRowAdd);
    alert("ReortBuilderUIConfigjs");
    GetColumnsByTableById('ddlYAxis-' + $("#hdnYaxiscount").val());
});
$("body").on("click", "#DeleteRow", function () {
    $("#hdnYaxiscount").val(parseFloat($("#hdnYaxiscount").val() - 1))
    $(this).parents("#row").remove();
})

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
        BindTable();
    }
}

//Bind Table Using DataBase
function BindTable() {
    if ($('#ddlDataSource').val() != "0") {
        $.ajax({
            url: "/ReportBuilderUI/TableDetail?DataSource=" + $('#ddlDataSource option:selected').text(),
            type: "GET",
            success: function (result) {
                var response = JSON.parse(result);
                var tablehead = $('#dataGrid thead');
                tablehead.empty(); // Clear the table head
                var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; background-color: #EEE;">';
                for (var i = 0; i < response.thead.length; i++) {
                    rowHeaderhtml += '<th>' + response.thead[i] + '</th>';
                }
                var rowHeaderhtml = rowHeaderhtml + '</tr>';
                tablehead.append(rowHeaderhtml);

                var tablebody = $('#dataGrid tbody');
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
            },
            error: function (error) {
                jsonValue = jQuery.parseJSON(error.responseText);
                alert("Error : " + jsonValue);
            }
        });
    }
}

//Bind Images  Using Report Type
function displayBlocks(reportType) {
    var blockHtml = '<div class="report-group"><div class="report-block">';

    if (reportType.SubReports && reportType.SubReports.SubReport.length > 0) {
        reportType.SubReports.SubReport.forEach(function (subReport) {
            blockHtml += '<div class="report-item" onclick="changeBackgroundColor(this)" id="' + subReport.Name + '" >';
            blockHtml += '<img src="/Image/' + subReport.Icon + '" alt="' + subReport.Name + '">';
            blockHtml += '<h3>' + subReport.Name + '</h3>';
            blockHtml += '</div>';
        });
    } else if (reportType.SubReport) {
        blockHtml += '<div class="report-item" onclick="changeBackgroundColor(this)">';
        blockHtml += '<img src="/Image/' + reportType.SubReport.Icon + '" alt="' + reportType.SubReport.Name + '">';
        blockHtml += '<h3>' + reportType.SubReport.Name + '</h3>';
        blockHtml += '</div>';
    }
    blockHtml += '</div></div>';
    // Clear previous blocks and add the new ones
    var reportDetailsDiv = document.getElementById("reportDetails");
    reportDetailsDiv.innerHTML = blockHtml;
}

// Global variable to store the selected div
var selectedDiv = null;
var prevencid = null;
// Change Background Color Of Image While Select
function changeBackgroundColor(element) {
    // Reset background color for all report-item divs
    var reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(function (item) {
        item.style.backgroundColor = ''; // Reset to default
    });
    // Set background color to green for the selected div
    element.style.backgroundColor = 'lightgreen';
    // Store the selected div reference
    selectedDiv = element;
}

//Apply Button To Show The Report
$("#btnApply").click(function () {

    var yaxis = [];
    var yaxistitle = [];
    yaxis.push($('#ddlYAxis :selected').text());
    yaxistitle.push($('#txtYAxisTitle').val());
    for (var k = 0; k < $("#hdnYaxiscount").val().length; k++) {
        yaxis.push($('#ddlYAxis-' + $("#hdnYaxiscount").val() + ' :selected').text());
        yaxistitle.push($('#txtYAxisTitle-' + $("#hdnYaxiscount").val() + '').val());
    }

    var chartType = SelectedChartType; /*selectedDiv.querySelector('h3').textContent;*/ // Assuming the h3 contains the chart type
    let divId = $('#hdnDivModifyId').val();
    $('#hdnCntDetails_' + divId).attr({
        'data-dsid': divId,
        'data-dsname': $('#ddlDataSource :selected').text(),
        'data-reporttype': $('#reportType :selected').text(),
        'data-charttype': chartType,
        'data-title': $('#txtTitle').val().trim(),
        'data-xaxis': $('#ddlXAxis :selected').text().trim(),
        'data-xtitle': $('#txtXAxisTitle').val().trim(),
        'data-yaxis': $('#ddlYAxis :selected').text().trim(),
        'data-ytitle': $('#txtYAxisTitle').val().trim(),
    });
    switch (chartType) {
        case "line":
            genericchart('line', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, yaxis, yaxistitle);
            break;
        case "area":
            genericchart('area', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "column":
            genericchart('column', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "bar":
            genericchart('bar', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "pie":
            genericchart('pie', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "bubble":
            genericchart('bubble', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "scatter":
            genericchart('scatter', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "columnrange":
            genericchart('columnrange', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        case "funnel":
            genericchart('funnel', document.getElementById("txtTitle").value, $('#ddlXAxis :selected').text(), document.getElementById("txtXAxisTitle").value, $('#ddlYAxis :selected').text(), document.getElementById("txtYAxisTitle").value);
            break;
        default:
            alert("Unknown chart type");
    }

});
//JsonSave
function saveJson() {
    var fileData = new FormData();
    fileData.append("PortletId", $('#hdnDivModifyId').val());
    fileData.append("DataSourceText", $('#ddlDataSource option:selected').text());
    fileData.append("DataSourceValue", $('#ddlDataSource option:selected').val());
    fileData.append("ReportTypeText", $('#reportType option:selected').text());
    fileData.append("ReportTypeValue", $('#reportType option:selected').val());
    if (selectedDiv != null) {
        fileData.append("ReportDetails", selectedDiv.textContent.toString());
    }
    fileData.append("Title", $('#txtTitle').val());
    fileData.append("XAxisText", $('#ddlXAxis option:selected').text());
    fileData.append("XAxisValue", $('#ddlXAxis option:selected').val());
    fileData.append("XAxisTitle", $('#txtXAxisTitle').val());
    fileData.append("YAxisText", $('#ddlYAxis option:selected').text());
    fileData.append("YAxisValue", $('#ddlYAxis option:selected').val());
    fileData.append("YAxisTitle", $('#txtYAxisTitle').val());
    fileData.append("BackgroundColor", $('#txtBackgroundColor').val());
    fileData.append("FontColor", $('#txtFontColor').val());
    fileData.append("FontStyleText", $('#ddlFontStyle option:selected').text());
    fileData.append("FontStyleValue", $('#ddlFontStyle option:selected').val());
    var files = $('#myFile').prop("files");
    fileData.append("ImageFile", files[0]);
    fileData.append("Icon", $('#iconText').val());
    fileData.append("BorderWidth", $('#txtBorderWidth').val());
    fileData.append("BorderStyleText", $('#ddlBorderStyle option:selected').text());
    fileData.append("BorderStyleValue", $('#ddlBorderStyle option:selected').val());
    fileData.append("BorderRadius", $('#txtBorderRadius').val());
    fileData.append("BorderHeight", $('#txtBorderHeight').val());
    fileData.append("TextMarginLeft", $('#txtleftmargin').val());
    fileData.append("TextMarginRight", $('#txtrightmargin').val());
    fileData.append("TextMarginTop", $('#txttopmargin').val());
    fileData.append("TextMarginBottom", $('#txtbottommargin').val());
    var bgfiles = $('#bgImageInput').prop("files");
    fileData.append("BackgroundImageFile", bgfiles[0]);
    fileData.append("CSSInlineCode", $('#txtInclineCSS').val());
    $.ajax({
        url: '/ReportBuilderUI/ThemeConfigurationSave',
        type: 'POST',
        data: fileData,
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        success: function (response) {
            $.ajax({
                url: '/ReportBuilderUI/AddDashboardConfigurationDetails',
                type: 'POST',
                data: fileData,
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                success: function (response) {
                    alert('Configuration Data Save Successfully ');
                },
                error: function (xhr, status, error) {
                    alert('Error: ' + xhr.responseText);
                }
            });
        },
        error: function (xhr, status, error) {
            alert('Error: ' + xhr.responseText);
        }
    });
}
//Bind Chart
function genericchart(charttype, charttitle, xaxisname, xaxistitle, yaxisname, yaxistitle) {
    Highcharts.getJSON('/ReportBuilderUI/TableDetail?DataSource=' + $('#ddlDataSource option:selected').text(), function (response) {
        var xaxis = [];
        var yaxis = [];
        var yaxisdata = {};
        for (var j = 0; j < response.tbody.length; j++) {
            for (var i = 0; i < response.thead.length; i++) {
                if (xaxisname == response.thead[i]) {
                    xaxis.push(response.tbody[j][response.thead[i]]);
                }
                /*for (var k = 0; k <= yaxisname.length; k++) {*/
                if (yaxisname == response.thead[i]) {
                    yaxisdata.name = yaxistitle;
                    yaxis.push(response.tbody[j][response.thead[i]]);
                }
                /*  }*/
            }
            yaxisdata.data = yaxis;
        }
        Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
            chart: {
                type: charttype,
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
            //series: [{
            //    name: yaxisname,
            //    data: yaxis
            //}]
        });
    });
}

//Multiple Data Series Chart
function genericcharttt(charttype, charttitle, xaxis, xaxistitle, yaxis, yaxistitle) {
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
        data: {
            table: 'dataGrid'
        },
        chart: {
            type: charttype
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
        yAxis: [{
            title: {
                text: yaxistitle,
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true
        }, { // Secondary yAxis
            title: {
                text: yaxistitle,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }

        }, { // Tertiary yAxis
            title: {
                text: yaxistitle,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} mb',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true

        }],
        tooltip: {
            shared: true
        },

        series: [{
            name: yaxis,
            type: charttype,
            yAxis: 1,
            tooltip: {
                valueSuffix: ' mm'
            }
        }, {
            name: 'Sea-Level Pressure',
            type: 'spline',
            yAxis: 2,
            marker: {
                enabled: true
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' mb'
            }
        }, {
            name: 'Temperature',
            type: 'spline',
            dashStyle: 'line',
            tooltip: {
                valueSuffix: ' °C'
            }
        }]
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

//< !--Theme Modal-- >

//Background Color Preview
document.getElementById('txtBackgroundColor').addEventListener('input', function () {
    $("#myFile").val('');
    /* $("#imagePreview").hide();*/
    $("#colorDiv" + $('#hdnDivModifyId').val()).show();
    var color = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.backgroundColor = color;
});

//Font Color Preview
document.getElementById('txtFontColor').addEventListener('input', function () {
    $("#myFile").val('');
    //$("#imagePreview").hide();
    $("#colorDiv" + $('#hdnDivModifyId').val()).show();
    var color = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.color = color;
});

//Font Style Preview
document.getElementById('ddlFontStyle').addEventListener('change', function () {
    var selectedStyle = this.value.toLowerCase();
    var colorDiv = document.getElementById('colorDiv' + $('#hdnDivModifyId').val());

    // Remove all existing classes
    //colorDiv.className = 'output';

    // Add the class corresponding to the selected font style
    if (selectedStyle === '0') {
        colorDiv.classList.add('serif');
    } else if (selectedStyle === '1') {
        colorDiv.classList.add('sans-serif');
    } else if (selectedStyle === '2') {
        colorDiv.classList.add('monospace');
    } else if (selectedStyle === '3') {
        colorDiv.classList.add('cursive');
    } else if (selectedStyle === '4') {
        colorDiv.classList.add('fantasy');
    }
});

//Font Size Preview
document.getElementById('txtFontSize').addEventListener('input', function () {
    var fontSize = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.fontSize = fontSize + 'px';
});

//Header
document.getElementById('txtInputText').addEventListener('input', function () {
    var headerText = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).textContent = headerText;
});

//Image Upload Preview
document.getElementById('myFile').addEventListener('change', function (event) {
    $("#colorDiv" + $('#hdnDivModifyId').val()).show();
    $("#uploadedImage" + $('#hdnDivModifyId').val()).show();
    $("#iconDiv" + $('#hdnDivModifyId').val()).hide();
    $("#iconText").val('');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            //const imagePreview = document.getElementById('imagePreview');
            const uploadedImage = document.getElementById('uploadedImage' + $('#hdnDivModifyId').val());
            uploadedImage.src = e.target.result;
            uploadedImage.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

//Icon Preview
function showIcon() {
    $("#myFile").val('');
    $("#uploadedImage" + $('#hdnDivModifyId').val()).hide();
    $("#colorDiv" + $('#hdnDivModifyId').val()).show();
    $("#iconDiv" + $('#hdnDivModifyId').val()).show();
    const iconText = document.getElementById('iconText').value.toLowerCase();
    const iconDisplay = document.getElementById('iconDiv' + $('#hdnDivModifyId').val());
    iconDisplay.innerHTML = iconText ? `<i class="${iconText} fa-2xl"></i>` : '';
}

//Border Preview
document.getElementById('ddlBorderStyle').addEventListener('change', function () {
    var selectedStyle = this.value;
    var targetDiv = document.getElementById('colorDiv' + $('#hdnDivModifyId').val());
    if (selectedStyle !== '0') {
        targetDiv.style.borderStyle = selectedStyle;
    }
    else {
        targetDiv.style.borderStyle = 'solid';
    }
});

//Border Width Preview
document.getElementById('txtBorderWidth').addEventListener('input', function () {
    var value = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.borderWidth = value + 'px';
});

//Border Radius Preview
document.getElementById('txtBorderRadius').addEventListener('input', function () {
    var borderRadiusValue = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.borderRadius = borderRadiusValue + 'px';
})

//Height Preview
document.getElementById('txtBorderHeight').addEventListener('input', function () {
    var borderHeight = this.value;
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.borderTopWidth = borderHeight + 'px';
    document.getElementById('colorDiv' + $('#hdnDivModifyId').val()).style.borderBottomWidth = borderHeight + 'px';
});

//Background Image Preview
document.getElementById('bgImageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const bgImageDiv = document.getElementById('colorDiv' + $('#hdnDivModifyId').val());
            bgImageDiv.style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    }
});

//Text Left Preview
document.getElementById('txtrightmargin').addEventListener('input', function () {
    var marginValue = this.value;
    document.getElementById('textdiv' + $('#hdnDivModifyId').val()).style.marginLeft = marginValue + 'px';
});

//Text right Preview
document.getElementById('txtleftmargin').addEventListener('input', function () {
    var marginValue = this.value;
    document.getElementById('textdiv' + $('#hdnDivModifyId').val()).style.marginRight = marginValue + 'px';
});

//Text Top Preview
document.getElementById('txtbottommargin').addEventListener('input', function () {
    var marginValue = this.value;
    document.getElementById('textdiv' + $('#hdnDivModifyId').val()).style.marginTop = marginValue + 'px';
});

//Text bottom Preview
document.getElementById('txttopmargin').addEventListener('input', function () {
    var marginValue = this.value;
    document.getElementById('textdiv' + $('#hdnDivModifyId').val()).style.marginBottom = marginValue + 'px';
});

//Upload image And Icon Textbox hide show
function toggleUpload(option) {
    const uploadSection = document.getElementById('uploadSection');
    const textboxSection = document.getElementById('textboxSection');
    if (option === 'image') {
        uploadSection.classList.remove('hidden');
        textboxSection.classList.add('hidden');
    } else {
        uploadSection.classList.add('hidden');
        textboxSection.classList.remove('hidden');
    }

}

//CSS(InlineCSS)
function updateStylesInlineCode() {
    var bgColor = document.getElementById('txtBackgroundColor').value;
    var fontColor = document.getElementById('txtFontColor').value;
    var selectedFontStyle = document.getElementById('ddlFontStyle').options[document.getElementById('ddlFontStyle').selectedIndex].text;
    if (selectedFontStyle === 'Select') {
        selectedFontStyle = '';
    }
    var FontSizeInputValue = document.getElementById('txtFontSize').value;
    var TitleInputValue = document.getElementById('txtInputText').value;
    var selectedIcon = document.getElementById('iconText').value;
    var borderWidthValue = document.getElementById('txtBorderWidth').value;
    var selectedBorderStyle = document.getElementById('ddlBorderStyle').options[document.getElementById('ddlBorderStyle').selectedIndex].text;
    if (selectedBorderStyle === 'Select') {
        selectedBorderStyle = '';
    }
    var borderRadiusValue = document.getElementById('txtBorderRadius').value;
    var HeightInputValue = document.getElementById('txtBorderHeight').value;
    var marginLeftInputValue = document.getElementById('txtrightmargin').value;
    var marginRightInputValue = document.getElementById('txtleftmargin').value;
    var marginTopInputValue = document.getElementById('txtbottommargin').value;
    var marginBottomInputValue = document.getElementById('txttopmargin').value;

    var bgfiles = $('#bgImageInput').prop("files");
    var filePath = "";
    if (bgfiles.length > 0) {
        filePath = bgfiles[0].name;
    }

    var inlineCSS = `{
                        background-color: ${bgColor};
                        font-color: ${fontColor};
                        font-family: ${selectedFontStyle};
                        font-size:${FontSizeInputValue};
                        input-text:${TitleInputValue};
                        icon:<i class="${selectedIcon}"></i>;
                        border-style: ${selectedBorderStyle};
                        border-width: ${borderWidthValue}px;
                        border-radius: ${borderRadiusValue}px;
                        border-height: ${HeightInputValue}px;
                        margin-left: ${marginLeftInputValue}px;
                        margin-right: ${marginRightInputValue}px;
                        margin-top: ${marginTopInputValue}px;
                        margin-bottom: ${marginBottomInputValue}px;
                        background-image: url(${filePath});
                        }`;
    document.getElementById('txtInclineCSS').innerHTML = inlineCSS;
}
// Adding event listeners for each input to update inline CSS
const inputs = [
    'txtBackgroundColor', 'txtFontColor', 'ddlFontStyle', 'txtFontSize', 'txtInputText', 'iconText', 'ddlBorderStyle',
    'txtBorderWidth', 'txtBorderRadius', 'txtBorderHeight',
    'txtrightmargin', 'txtleftmargin', 'txtbottommargin', 'txttopmargin', 'bgImageInput'
];

inputs.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.addEventListener('input', updateStylesInlineCode);
    }
});

/*<!--Dynamic Add Grid-- >*/
$(document).ready(function () {
    let grid = GridStack.init({
        cellHeight: 70,
        acceptWidgets: true,
        removable: '#trash', // drag-out delete class
    });
    GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
    grid.on('added removed change', function (e, items) {
        let str = '';
        items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        console.log(e.type + ' ' + items.length + ' items:' + str);
    });
});

let items = [
    // {x: 0, y: 0, w: 4, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_1"></i></div>' },
    // {x: 4, y: 0, w: 4, h: 4,  content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_2"></i></div>' },
    // {x: 8, y: 0, w: 2, h: 2,  content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_3"></i></div>' },
    // {x: 10, y: 0, w: 2, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_4"></i></div>' },
    // {x: 0, y: 2, w: 2, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_5"></i></div>' },
    // {x: 2, y: 2, w: 2, h: 4, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_6"></i></div>' },
    // {x: 8, y: 2, w: 4, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_7"></i></div>' },
    // {x: 0, y: 4, w: 2, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_8"></i></div>' },
    // {x: 4, y: 4, w: 4, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_9"></i></div>' },
    // {x: 8, y: 4, w: 2, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_10"></i></div>' },
    // {x: 10, y: 4, w: 2, h: 2, content: '<div><i class="fa fa-paint-brush text-white"></i><i class="fa fa-gears text-white" data-toggle="modal" data-target="#pipelineModal" data-id="id_11"></i></div>' },
];
//grid.load(items);

$('#addprt').click(function () {
    return AddPortlet();
});

function AddPortlet() {

    let grid = GridStack.init({
        cellHeight: 70,
        acceptWidgets: true,
        removable: '#trash', // drag-out delete class
    });
    let divCount = parseFloat($('#hdnDivId').val());
    let item = {
        x: 0, y: 0, w: 4, h: 2, content: '<div class="grid_bodyblock  output" id="colorDiv' + divCount + '"><div class="row"><div><img id="uploadedImage' + divCount + '" class="hidden" src="" style="max-width: 50px;height: 45px;" alt="Uploaded Image"><div id="iconDiv' + divCount + '"></div><div id="textdiv' + divCount + '">Preview Style</div></div><div id="ChartFinalReport"> <figure class="highcharts-figure" > <div id="container' + divCount + '"></div></figure ></div ><div><figure class="highcharts-figure" ><div id="container" ></div></figure ></div></div>'

        //BackUp
        /* x: 0, y: 0, w: 4, h: 2, content: '<div class="grid_bodyblock  output" id="colorDiv' + divCount + '"><div class="row"><div><img id="uploadedImage' + divCount + '" class="hidden" src="" style="max-width: 50px;height: 45px;" alt="Uploaded Image"><div id="iconDiv' + divCount + '"></div><div id="textdiv' + divCount + '">Preview Style</div></div><div id="ChartFinalReport"> <figure class="highcharts-figure" > <div id="container' + divCount + '"></div></figure ></div ></div>'*/
    };
    grid.addWidget(item)
    // Update item.content with dynamic data-id
    item.content = '<div class="grid_bodyblock" id="colorDiv' + divCount + '" data-id="id_' + divCount + '"></div>';
    grid.engine.nodes.forEach(node => {
        let checkitem = node.el.firstElementChild.className;
        if (checkitem != 'handle-config') {
            node.el.insertAdjacentHTML('afterbegin', '<div class="handle-config" id="' + divCount + '"><input  id="hdncolordivjson' + divCount + '" value="" type="hidden" /><i class="bi bi-gear" title="Settings" data-toggle="modal" data-target="#pipelineModal" data-id="id_' + divCount + '"></i><input type="hidden" id="hdnCntDetails_' + divCount + '" /></div><div class="crush_icon" title="Delete"><i class="bi bi-trash"></i></div>');
        }
    });
    divCount += 1;
    $('#hdnDivId').val(divCount);
    // Delete icon functionality
    $(document).on('click', '.crush_icon', function () {
        let gridItem = $(this).closest('.grid-stack-item');
        grid.removeWidget(gridItem[0]);
        grid.compact();
    });
    grid.compact();
    return divCount;
}

//Setting icon click work ( Store Dynamic PotlateId)
$(document).on('click', '.handle-config', function () {
    $('#hdnDivModifyId').val($(this).attr("id"));
    $('.dashboard-nav').toggle();
    $('.dashboard-bg').toggleClass('margin_right');
    clear();
});
//Show Preview Btn And Redirect to Render Page

function showpreview() {
    // Show the Preview button
    document.getElementById('btnPreview').style.display = 'inline-block';

}
$("#btnPreview").click(function () {
    window.location.href = "/ReportBuilderUI/DashboardPreview?EncId=" + prevencid;
})

//Clear the data after save
function clear() {
    $("#ddlDataSource").val("Select");
    $("#reportType").val("Select");
    $("#reportDetails").val("");
    $("#txtTitle").val("");
    $("#ddlXAxis").val("Select");
    $("#txtXAxisTitle").val("");
    $("#ddlYAxis").val("Select");
    $("#txtYAxisTitle").val("");
    $("#dataGrid").val("");
    $("#txtBackgroundColor").val("");
    $("#txtFontColor").val("");
    $("#imageOption").val("");
    $("#iconOption").val("");
    $("#myFile").val("");
    $("#iconText").val("");
    $("#ddlFontStyle").val("0");
    $("#txtFontSize").val("");
    $("#txtInputText").val("");
    $("#txtBorderWidth").val("");
    $("#ddlBorderStyle").val("0");
    $("#txtBackgroundColor").val("");
    $("#txtFontColor").val("");
    $("#txtBorderRadius").val("");
    $("#txtBorderHeight").val("");
    $("#txtleftmargin").val("");
    $("#txtrightmargin").val("");
    $("#txttopmargin").val("");
    $("#txtbottommargin").val("");
    $("#bgImageInput").val("");
}

//< !--Save Both Chart & Theme Configuration-- >
$('#btnsavedesign').click(function () {
    let data = new FormData();
    let items = new Array();
    let dashconfigitems = new Array();
    GridStack.init().engine.nodes.forEach(node => {
        items.push({ x: node.x, y: node.y, w: node.w, h: node.h, content: node.content })
    });
    GridStack.init().engine.nodes.forEach(node => {
        dashconfigitems.push($('#hdnCntDetails_' + node._id).data());
    });
    /*  data.append("PageName", $('#txtDashBoardName').val().trim());*/
    data.append("PageName", "Test Dashboard");
    data.append("PageLayout", JSON.stringify(items));
    data.append("PageContent", JSON.stringify(dashconfigitems));
    $.ajax({
/*        url: @Url.Action("InsertPageDetails", "ReportBuilderUI"),*/
        url: '/ReportBuilderUI/InsertPageDetails',
        type: "POST",
        contentType: false,
        processData: false,
        data: data,
        success: function (response) {
            response = JSON.parse(response);
            if (response.data != -1) {
                //Swal.fire({
                //    icon: 'success',
                //    title: 'success',
                //    text: response.message
                //}).then(() => {
                //    window.location.reload();
                //});
                alert(response.message);
                showpreview();
                prevencid = response.encid;
               /* window.location.reload();*/
            }
        },
        error: function (error) {
            //Swal.fire({
            //    icon: 'error',
            //    title: 'Error!!',
            //    text: error
            //});
        }
    });
});



var SelectedChartType = '';
//Column
function GetColumnChart() {
    SelectedChartType = 'column';
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {

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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
function GetPyramidChart() {
    SelectedChartType = 'pyramid';
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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
function GetFunnelChart() {
    SelectedChartType = 'funnel';
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {
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

function GetPolarChart() {
    Highcharts.chart('container' + $('#hdnDivModifyId').val() + '', {

        chart: {
            polar: true
        },

        title: {
            text: ' Polar Chart'
        },

        subtitle: {
            text: 'Also known as Radar Chart'
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        xAxis: {
            tickInterval: 45,
            min: 0,
            max: 360,
            labels: {
                format: '{value}°'
            }
        },

        yAxis: {
            min: 0
        },

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [{
            type: 'column',
            name: 'Column',
            data: [8, 7, 6, 5, 4, 3, 2, 1],
            pointPlacement: 'between'
        }, {
            type: 'line',
            name: 'Line',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }, {
            type: 'area',
            name: 'Area',
            data: [1, 8, 2, 7, 3, 6, 4, 5]
        }]
    });
}





//Donut chart
Highcharts.chart('container', {
    chart: {
        type: 'pie',
    },
    plotOptions: {
        pie: {
            innerSize: '60%',
            dataLabels: {
                //
                formatter: function () {

                    if (this.point.name === 'Your Contribution') {
                        return '<b>' + this.point.name + '</b><br><span style="font-size:2em">' + this.point.y + '</div>';
                    }

                    return '<b>' + this.point.name + '</b><br>' + this.point.y;
                }
            }
        }
    },
    series: [{
        name: 'X',

        data: [{
            name: 'Your Contribution',
            y: 200
        }, {
            name: 'Taxes',
            y: 44
        }, {
            name: 'Insurance',
            y: 50
        }, {
            name: 'Extras',
            y: 26
        }]
    }]
});
Highcharts.chart('container', {
    chart: {
        type: 'pie',
    },
    title: {
        text: '2023 Norway car registrations'
    },
    plotOptions: {
        series: {
            dataLabels: [{
                format: '{point.name}'
            },
            {
                distance: -15,
                format: '{point.percentage:.0f}%',
            }],
            showInLegend: true
        }
    },
    series: [{
        name: 'Registrations',
        innerSize: '55%',
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

//Column  Range
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
    plotOptions: {
        columnrange: {
            dataLabels: {
                enabled: true,
                format: '{y}°C'
            }
        }
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

//Stacked Bar
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
        title: {
            text: ''
        }
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

//Stacked Column
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

//Stacked Area
Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Greenhouse gases from Norwegian economic activity',
    },
    yAxis: {
        title: {
            text: 'Million tonnes CO<sub>2</sub>-equivalents'
        }
    },
    plotOptions: {
        area: {
            stacking: 'normal',
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



//Ashutosh

//Apply Button To Show The Report
//$("#btnApply").click(function () {
//    let divId = $('#hdnDivModifyId').val();
//    if (selectedDiv) {
//        $('#hdnCntDetails_' + divId).attr({
//            'data-dsid': divId,
//            'data-dsname': $('#ddlDataSource :selected').text(),
//            'data-reporttype': $('#reportType :selected').text(),
//            'data-charttype': selectedDiv.querySelector('h3').textContent,
//            'data-title': $('#txtTitle').val().trim(),
//            'data-xaxis': $('#ddlXAxis :selected').text().trim(),
//            'data-xtitle': $('#txtXAxisTitle').val().trim(),
//            'data-yaxis': $('#ddlYAxis :selected').text().trim(),
//            'data-ytitle': $('#txtYAxisTitle').val().trim(),
//        });
//        var chartType = SelectedChartType; /*selectedDiv.querySelector('h3').textContent;*/ // Assuming the h3 contains the chart type
//        switch (chartType) {
//            case "Line":
//                genericchart('line', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Area":
//                genericchart('area', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Column":
//                genericchart('column', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Bar":
//                genericchart('bar', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Pie":
//                genericchart('pie', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Bubble":
//                genericchart('bubble', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            case "Scatter":
//                genericchart('scatter', document.getElementById("txtTitle").value, getColumnContents($('#ddlXAxis :selected').text()), document.getElementById("txtXAxisTitle").value, getColumnContents($('#ddlYAxis :selected').text()), document.getElementById("txtYAxisTitle").value);
//                break;
//            default:
//                alert("Unknown chart type");
//        }
//    }
//    else {
//        alert("Please select a chart type.");
//    }
//});
//$('#btnsavedesign').click(function () {
//    let data = new FormData();
//    let items = new Array();
//    let dashconfigitems = new Array();
//    GridStack.init().engine.nodes.forEach(node => {
//        items.push({ x: node.x, y: node.y, w: node.w, h: node.h, content: node.content })
//    });
//    GridStack.init().engine.nodes.forEach(node => {
//        dashconfigitems.push($('#hdnCntDetails_' + node._id).data());
//    });
//    data.append("PageName", $('#txtDashBoardName').val().trim());
//    data.append("PageLayout", JSON.stringify(items));
//    data.append("PageContent", JSON.stringify(dashconfigitems));
//    $.ajax({
//        url: '@Url.Action("InsertPageDetails", "ReportBuilderUI")',
//        type: "POST",
//        contentType: false,
//        processData: false,
//        data: data,
//        success: function (response) {
//            response = JSON.parse(response);
//            if (response.data == 1) {
//                Swal.fire({
//                    icon: 'success',
//                    title: 'success',
//                    text: response.message
//                }).then(() => {
//                    window.location.reload();
//                });
//            }
//        },
//        error: function (error) {
//            Swal.fire({
//                icon: 'error',
//                title: 'Error!!',
//                text: error
//            });
//        }
//    });
//});

