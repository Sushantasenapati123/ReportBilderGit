//ConfigureApi



function bindTableEvents() {
    const tbody = document.getElementById('tbody');

    // Event delegation to handle add and remove button clicks
    tbody.addEventListener('click', (event) => {
        if (event.target.classList.contains('add') || event.target.closest('.add')) {
            addRow();
        } else if (event.target.classList.contains('remove') || event.target.closest('.remove')) {
            removeRow(event);
        }
    });
}

function removeRow(event) {
    var currentRow = $(event.target).closest('tr');

    // Check if the current row is the first row
    if (currentRow.is(':first-child')) {
        Swal.fire({
            icon: "warning",
            text: "The first row cannot be removed!",
        });
        // alert("The first row cannot be removed.");
        return;
    }

    var child = currentRow.nextAll();

    // Iterating across all the rows obtained to change the index
    child.each(function () {
        var id = $(this).attr('id');
        var idx = $(this).children('.row-index').children('input'); // Assuming the index is displayed in an input element
        var dig = parseInt(id.substring(1));
        idx.attr('id', `txtKeyParam${dig - 1}`);
        $(this).attr('id', `R${dig - 1}`);
    });
    // Removing the current row.
    currentRow.remove();
}
//-------------------------------------------------------
var rowIdx = 0;
// Function to add a row
function addRow() {


    $('#tbody').append(`
            <tr id="R${++rowIdx}">
                <td class="row-index text-center" style="text-align: center; vertical-align: middle;">
                    <input id="txtKeyParam${rowIdx}" style="width:150px;display: block; margin: 0 auto;" class="inputs form-control m-input">
                </td>
                <td class="row-index text-center" style="text-align: center; vertical-align: middle;">
                    <input id="txtValueParam${rowIdx}" style="width:150px;display: block; margin: 0 auto;" class="inputs form-control m-input">
                </td>
                <td class="text-center" style="text-align: center; vertical-align: middle;">
                   <button class="btn btn-outline-success add" type="button"><i class="bi bi-plus"></i></button>

                    <button class="btn btn-outline-danger remove" type="button"><i class="bi bi-dash"></i></button>
                </td>
            </tr>
     `);
}


var EntityName = "";
function Send() {
    currentPage = 1;
    if ($('#ddlMethodtype').val() == "Select") {
        Swal.fire({
            icon: "warning",
            text: "Please select Method Type!",
        });
        $('#ddlMethodtype').addClass('highlight');
        return;
    } else {
        $('#ddlMethodtype').removeClass('highlight');
    }

    if ($('#txtendpoint').val() == "") {
        Swal.fire({
            icon: "warning",
            text: "Please provide the API endpoint",
        });
        $('#txtendpoint').addClass('highlight');
        return;
    } else {
        $('#txtendpoint').removeClass('highlight');
    }

    if ($('#ddlaitype').val() == "Select") {
        Swal.fire({
            icon: "warning",
            text: "Please select the Parameter type.",
        });
        $('#ddlaitype').addClass('highlight');
        return;
    } else {
        $('#ddlaitype').removeClass('highlight');
    }

    if (document.getElementById('tbody') == null ||
        document.getElementById('tbody').rows == null ||
        document.getElementById('tbody').rows.length === 0) {
        Swal.fire({
            icon: "warning",
            text: "Table data is required.",
        });
        return;
    }

    if ($('#ddlaitype').val() == "Raw" && $('#textareaParameters').val() == "") {
        Swal.fire({
            icon: "warning",
            text: "Send parameters as JSON are required.",
        });
        $('#textareaParameters').addClass('highlight');
        return;
    } else {
        $('#textareaParameters').removeClass('highlight');
    }


    var apiUrl = $('#txtendpoint').val();
    var selectedMethod = $('#ddlMethodtype').val();
    var apiType = $('#ddlaitype').val();
    var tableData = [];
    var tbl = document.getElementById('tbody');
    var rawparams = $('#textareaParameters').val();

    for (var i = 0; i < tbl.rows.length; i++) {
        var item1 = {};
        item1.key = tbl.rows[i].cells[0].querySelector('input').value;
        item1.value = tbl.rows[i].cells[1].querySelector('input').value;
        tableData.push(item1);
    }
    $('#overlay').show();
    $.ajax({
        url: '/APIConnector/Invoke',
        type: 'POST',
        data: {
            DataTableName: document.getElementById(CurrentAPIDivId).innerHTML,
            apiUrl: apiUrl,
            selectedMethod: selectedMethod,
            apiType: apiType,
            tableData: JSON.stringify(tableData),
            rawparam: rawparams
        },
        success: function (data) {
          
            $('#apiresult').val(JSON.stringify(JSON.parse(data.ApiResponse), null, 2));
            $('#codeEditor').val(data.Code);
           
           // bindDataGridView(JSON.parse(data.ApiResponse));

            SToreResultData = JSON.parse(data.ApiResponse);
            bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
            setupPagination(SToreResultData.length);

            $('#APIresults').css('display', 'block');
            EntityName = data.EntiyName;
            $('#overlay').hide();
        },
        error: function (xhr, status, error) {
            // $('#apiresult').val('Error: ' + xhr.responseText);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: xhr.responseText,
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            $('#overlay').hide();

            // alert('Error: ' + xhr.responseText);
        }
    });
}
function getLastVariableName(code) {
    // Use a regular expression to match variable declarations
    let variableMatches = code.match(/var\s+(\w+)\s*=/g);
    if (variableMatches && variableMatches.length > 0) {
        // Get the last match and extract the variable name
        let lastVariableDeclaration = variableMatches[variableMatches.length - 1];
        let lastVariableNameMatch = lastVariableDeclaration.match(/var\s+(\w+)\s*=/);
        if (lastVariableNameMatch && lastVariableNameMatch.length > 1) {
            return lastVariableNameMatch[1];
        }
    }
    return null;
}

function SaveAPI(SaveMode) {
    
    let test = JSON.stringify(editor.export(), null, 4);
    var entity = {
        EntityName: EntityName,
        Configuration: {
            SaveModeType: SaveMode,
            DataPipeLineName: $('#datasrcnm').val(),
            MethodType: $('#ddlMethodtype').val(),
            EndPoint: $('#txtendpoint').val(),
            ParameterType: $('#ddlaitype').val(),
            Parameters: [],
            Response: $('#apiresult').val(),
            DynamicAPICode: $('#codeEditor').val(),
            RawBody: $('textareaParameters').val()
        }
    };
    var apitype = $('#ddlaitype').val();
    if (apitype == "Raw") {
        var rawJson = $('#textareaParameters').val();

        if (rawJson.trim() !== "") {
            try {
                var parsedParameters = JSON.parse(rawJson);

                for (var key in parsedParameters) {
                    if (parsedParameters.hasOwnProperty(key)) {
                        entity.Configuration.Parameters.push({ Pkey: key, Pvalue: parsedParameters[key] });
                    }
                }
            } catch (e) {

                return;
            }
        }

    }
    else {
        var tbl = document.getElementById('tbody');
        for (var i = 0; i < tbl.rows.length; i++) {
            var item = {};
            item.Pkey = tbl.rows[i].cells[0].querySelector('input').value;
            item.Pvalue = tbl.rows[i].cells[1].querySelector('input').value;
            if (item.Pkey != "" && item.Pvalue != "") {
                entity.Configuration.Parameters.push(item);
            }

        }

    }
    if ($('#apiresult').val() == "") {

        Swal.fire({
            icon: "warning",
            text: "Click the send button to get response!",
        });
        return;
    }
    else if ($('#dataGridview tbody tr').length === 0) {
        Swal.fire({
            icon: "warning",
            text: "Please add at least one parameter to the data grid!",
        });
        // alert("Please add at least one parameter to the data grid.");
        return;
    }
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#overlay').show();
            $.ajax({
                url: '/APIConnector/SubmitApi', // Your endpoint for the Submit action
                type: 'POST',
                data: entity,
                success: function (response) {
                    
                    //parent.ClosePopupFromChild("The Api was successfully configured");
                    Swal.fire({
                        title: 'Success',
                        text: response.message.result,
                        icon: "success"
                    });
                   
                    $(`#${CurrentAPIDivId}`).html(EntityName);

                  
                    $('#APIModal').modal('hide');
                    ExportJson();//To store Convax template
                    $('#overlay').hide();
                   
                },
                error: function (xhr, status, error) {
                    // $('#apiresult').val('Error: ' + xhr.responseText);
                    //alert('Error: ' + xhr.responseText);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: xhr.responseText,
                        footer: '<a href="#">Why do I have this issue?</a>'
                    });
                    $('#overlay').hide();
                    //parent.ClosePopupFromChild("There was an issue while connecting to the API");
                }
            });
        }
    });





}

//datagrid bind


function bindDataGridView(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data structure or empty data array");
        return;
    }

    var tablehead = $('#dataGridview thead');
    tablehead.empty(); // Clear the table head

    // Extract the header from the first data item
    var headers = Object.keys(data[0]);
    var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; background-color: #EEE;">';
    headers.forEach(header => {
        rowHeaderhtml += '<td>' + header + '</td>';
    });
    rowHeaderhtml += '</tr>';
    tablehead.append(rowHeaderhtml);

    var tablebody = $('#dataGridview tbody');
    tablebody.empty(); // Clear the table body
    data.forEach(row => {
        var rowBodyhtml = '<tr>';
        headers.forEach(header => {
            rowBodyhtml += '<td>' + (row[header] !== undefined ? row[header] : '') + '</td>';
        });
        rowBodyhtml += '</tr>';
        tablebody.append(rowBodyhtml);
    });
}

function toggleParameterGridView() {
    var selectedApiType = $('#ddlaitype').val();
    if (selectedApiType === "Select" || selectedApiType === "NoParameters") {
        // Clear the data in the input fields
        $('#bindparameters').find('input').val('');
        $('#textareaParameters').val('');
        $('#bindparameters').find('input').attr('disabled', 'disabled');
        $('#bindparameters').find('.add, .remove').attr('disabled', 'disabled');
        $('#tblParameters').show();
        $('#textareaParameters').hide();
    } else if (selectedApiType === "Raw") {
        $('#bindparameters').find('input').val('');
        $('#tblParameters').hide();
        $('#textareaParameters').show();
    } else {
        $('#tblParameters').show();
        $('#textareaParameters').val('');
        $('#textareaParameters').hide();
        $('#bindparameters').find('input').removeAttr('disabled');
        $('#bindparameters').find('.add, .remove').removeAttr('disabled');
    }
}
//-------------------------------------------------------------------------

function ParamTypeChange() {
    lblbind();
}

function lblbind() {
    
    let ParameterSection = document.getElementById('ParameterSection');
    let RequestSection = document.getElementById('RequestSection');
    let BodySection = document.getElementById('BodySection');
    ParameterSection.classList.add('hidden');
    RequestSection.classList.add('hidden');
    BodySection.classList.add('hidden');


    var apitype = $('#ddlaitype').val();
    if (apitype == "Raw") {
        RequestSection.classList.remove('hidden');
        BodySection.classList.remove('hidden');
    }

    if (apitype === "QueryParams" || apitype === "UrlParams" || apitype === 'x_www_form_urlencoded') {
        RequestSection.classList.remove('hidden');
        ParameterSection.classList.remove('hidden');
    }
}