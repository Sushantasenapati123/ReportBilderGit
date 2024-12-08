var PrimaryAPIEntityName = "";
var ForeignFilterDivId= "";
function OpenConditionModal(APIModelName, ForeignFilterDvId, CurrentFilterDivId) {

    if (APIModelName == "") {
        Swal.fire({
            icon: "warning",
            text: "Please Add Source For Filter!",
        });
        return;
    }

    if (ForeignFilterDvId == "") {
        ForeignFilterDivId = CurrentFilterDivId;////while Click
    }
    else {
        ForeignFilterDivId = ForeignFilterDvId;//while connection Create
    }
   


    PrimaryAPIEntityName = APIModelName;
    var isClick = false;
    var dynamicSourceDtName = '';
    if (!APIModelName.startsWith("dT_")) {

        //to check wheather it call through div click(APIModelName like='blockydivFilter_1') or Connection Create(APIModelName='dT_32752')
        isClick = true;
        dynamicSourceDtName = $('#SourceDT_' + APIModelName.split('-')[1]).html(); // Use jQuery's .html() to get the inner HTML
       // alert("dynamicSourceDtName " + dynamicSourceDtName)
    }


    if (dynamicSourceDtName != '') {
        APIModelName = dynamicSourceDtName;
    }

   // alert("isClick " + isClick);//while connection establish  ::   isClick false
                                //While click :: isClick true
    $('#APIModal').modal('show');
   // if (!isClick) {

      //  alert("Load the Conditional Modal");
        $.ajax({
            url: '/ETLDashboard/OpenConditionModal',
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("APIModalBody");

                // Clear existing rows in the table body
                $('#APIModalBody tbody').empty();

                modalBody.innerHTML = result;
                $('#exampleModalLabel').html('<b>Add Condition</b>');
               

                AddRowAsPerSourceTableColumn(APIModelName, ForeignFilterDvId);
               
                if (typeof APIModelName !== "undefined" && APIModelName !== "")  {
                    $("#btnSaveCondition").removeAttr("hidden");


                    $("#btnResultCondition").removeAttr("hidden");
                }
              

            },
            error: function (xhr, status, error) {
                alert('Error loading partial view:', error);
                console.error('Error loading partial view:', error);
            }
        });
   // }
}
let globalDataSource = null;

function AddRowAsPerSourceTableColumn(tableName, ForeignFilterDvId) {
    currentPage = 1;
    var SaveType = "Insert";
    var ConfigureMessage = "PipeLine was successfully configured";
    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update
        ConfigureMessage = "PipeLine was Updated successfully";
        SaveType = "Update";
    }

    $('#overlay').show();
    $.ajax({
        url: '/ETLDashboard/GetOutputResultData', // Replace with your actual endpoint
        type: 'GET',
        data: { entityName: tableName, CurrentModel: ForeignFilterDvId, SaveType: SaveType },          // Pass the table name in the URL
        success: function (response) {
            let parentModelData = JSON.parse(response); // Parse the JSON string into an object
            if (parentModelData.IsSuccess != undefined) {
                if (!parentModelData.IsSuccess) {
                    const errorMsg = parentModelData.ErrorMsg.replace(/\n/g, '<br/>');

                    Swal.fire({
                        icon: "error",
                        /*text: JSON.parse(response1).ErrorMsg,*/
                        html: errorMsg,

                    });
                    if (!parentModelData || !parentModelData.ListOfOutputColumn || parentModelData.ListOfOutputColumn.length === 0) {
                        console.error('No columns found for the entity:', tableName);
                        $('#overlay').hide();
                        return;
                    }

                    // Set the globalDataSource to the ListOfOutputColumn array
                    globalDataSource = parentModelData.ListOfOutputColumn;
                    AddRowCondition(globalDataSource);
                    $('#overlay').hide();
                    return;
                }
            }
            if (!parentModelData || !parentModelData.ListOfOutputColumn || parentModelData.ListOfOutputColumn.length === 0) {
                console.error('No columns found for the entity:', tableName);
                $('#overlay').hide();
                return;
            }

            // Set the globalDataSource to the ListOfOutputColumn array
            globalDataSource = parentModelData.ListOfOutputColumn;
            AddRowCondition(globalDataSource);
            $('#codeEditorFilter').html("");
            $('#codeEditorFilter').html(parentModelData.SourceCode);

            if (parentModelData.Output.length == 0) {
                var tablebody = $('#dataGridview tbody');
                tablebody.empty(); // Clear the table body
            }


            else {
                // Handle the response data and bind it to the HTML table   
                SToreResultData = JSON.parse(parentModelData.Output);
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);


                //bindDataGridView(JSON.parse(parentModelData.Output));

                $('#Filteresults').removeAttr('hidden');
            }

            $('#overlay').hide();
        },
        error: function (xhr, status, error) {
            $('#overlay').hide();
            alert('Error fetching data sources:', error);
            console.error('Error fetching data sources:', error);
        }
    });
}
function removeRowCondition(button) {

    $(button).closest('tr').remove();
}

function moreConceptCondition() {

    AddRowCondition(globalDataSource);
}
function AddRowCondition(dataSource) {
    let newRow = `
        <tr>
            <td>
                <select class="form-control column-select">
                    <option value="">Select Column</option>
                    ${dataSource.map(column => `<option value="${column}">${column}</option>`).join('')}
                </select>
            </td>
            <td>
                <select class="form-control">
                    <option value="equals">equals</option>
                    <option value="contains">contains</option>
                    <option value="startswith">startswith</option>
                    <option value="endswith">endswith</option>
                    <option value="greaterthan">greaterthan</option>
                    <option value="lessthan">lessthan</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control" placeholder="Enter value">
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeRowCondition(this)">Remove</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="moreConceptCondition()">More</button>
            </td>
        </tr>
    `;

    $('#Conditiontable tbody').append(newRow);
}



function Call_AddDiv_and_BindColumn_By_FilterDiv(FilterEntityName,SourceAPIEntityName, Foreignblockydiv) {

    if ($('#SourceListEntity-' + Foreignblockydiv.split('-')[1]).text() == '') {
       
        $.ajax({
            url: '/ETLDashboard/JoinTransformData', // Replace with your controller and action
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("JoinTransformDataModalBody");
                modalBody.innerHTML = result;


                $('#JoinDataTransformationStatusId').html('Join DataTransformation');
                AddDiv(FilterEntityName);

                bindColumns(FilterEntityName, "chkleftcolumns_" + FilterEntityName);
            },
            error: function (xhr, status, error) {
                alert('Error loading partial view:', error);
                console.error('Error loading partial view:', error);
            }
        });
    }
    else {
        AddDiv(FilterEntityName);

        bindColumns(FilterEntityName, "chkleftcolumns_" + FilterEntityName);
    }


    
}


var currentEntityName = "";
function ApplyCondition() {

    var SaveType = "Insert";

    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update

        SaveType = "Update";
    }


    currentPage = 1;
   // alert(ForeignFilterDivId);
    // Initialize DataFilterModel
    var entityName = "NoEntity";
    if (ForeignFilterDivId.includes('dT_')) {
        entityName = ForeignFilterDivId;
    }

    var dataFilterModel = {
        SourceEntityName: PrimaryAPIEntityName, // Replace with the actual entity name
        //EntityName: 'NoEntity',
        EntityName: entityName,
        Filters: [],

        SaveType: SaveType
    };

    // Iterate through each row in the Conditiontable
    $('#overlay').show();
    $('#Conditiontable tbody tr').each(function () {
        var fieldName = $(this).find('.column-select').val();
        var condition = $(this).find('select').eq(1).val();
        var conditionValue = $(this).find('input[type="text"]').val();

        // Add the filter model to the filters array
        if (fieldName && condition && conditionValue) { // Ensure values are not empty
            dataFilterModel.Filters.push({
                FieldName: fieldName,
                Condition: condition,
                ConditionValue: conditionValue
            });
        }
    });
    // Send data to the server
    fetch('/DataTransformation/CheckFilter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFilterModel)
    })
        .then(response => response.json())
        .then(data => {

            if (data.isSuccess) {


                if (data.resultTable.length == 0) {
                    var tablebody = $('#dataGridview tbody');
                    tablebody.empty(); // Clear the table body

                }


                else {
                    // Handle the response data and bind it to the HTML table    
                    //bindDataGridView(data.resultTable);
                    SToreResultData = data.resultTable;
                    bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                    setupPagination(SToreResultData.length);
                   
                }

                $('#codeEditorFilter').val(data.code
                    .split('\n') // Split the code into an array of lines
                    .map(line => line.trimStart()) // Trim leading spaces from each line
                    .join('\n'));

                //$(`#${ForeignFilterDivId}`).html(EntityName);

                currentEntityName = data.entiyName;
                $('#Filteresults').removeAttr('hidden');
                
                $("#btnSaveCondition").prop("disabled", false); // Enable the button
                $("#btnSaveConditionIncode").prop("disabled", false); // Enable the button

                $('#overlay').hide();
                console.log(data);
            }
            else {//


                const errorMsg = data.code.replace(/\n/g, '<br/>');

                Swal.fire({
                    icon: "error",
                    /*text: JSON.parse(response1).ErrorMsg,*/
                    html: errorMsg,

                });

                $("#btnSaveCondition").prop("disabled", true); // Enable the button
                $("#btnSaveConditionIncode").prop("disabled", true); // Enable the button

                $('#overlay').hide();

                return;




            }

        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Error:', error,
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            $("#btnSaveCondition").prop("disabled", true); // Enable the button
            $("#btnSaveConditionIncode").prop("disabled", true); // Enable the button

            $('#overlay').hide();
        });
}

function SaveConditionData() {
    if ($('#dataGridview tbody tr').length === 0) {
        Swal.fire({
            icon: "warning",
            text: "Please Click On Apply Button!",
        });
        // alert("Please add at least one parameter to the data grid.");
        return;
    }





    var entityName = "NoEntity";
    if (ForeignFilterDivId.includes('dT_')) {
        entityName = ForeignFilterDivId;
    }
    //if (ForeignFilterDivId.includes('dT_')) {
    //    entityName = ForeignFilterDivId;
    //}
    // Initialize DataFilterModel
    var dataFilterModel = {
        SourceEntityName: PrimaryAPIEntityName, // Replace with the actual entity name
        EntityName: entityName,
        SourceCode: $('#codeEditorFilter').val(),
        Filters: []
    };

    // Iterate through each row in the Conditiontable
    $('#Conditiontable tbody tr').each(function () {
        var fieldName = $(this).find('.column-select').val();
        var condition = $(this).find('select').eq(1).val();
        var conditionValue = $(this).find('input[type="text"]').val();

        // Add the filter model to the filters array
        if (fieldName && condition && conditionValue) { // Ensure values are not empty
            dataFilterModel.Filters.push({
                FieldName: fieldName,
                Condition: condition,
                ConditionValue: conditionValue
            });
        }
    });
    // Send data to the server
    $('#overlay').show();
    fetch('/DataTransformation/SaveFilterCondition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFilterModel)
    })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: "success",
                text: data.message,
            });


            $(`#blockydivFilter-` + ForeignFilterDivId.split('-')[1]).html(currentEntityName);

            $('#APIModal').modal('hide');
            ExportJson();//To store Convax template
            $('#overlay').hide();

        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Error:', error,
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            $('#overlay').hide();
        });
  
}

