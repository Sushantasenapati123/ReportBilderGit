var PrimaryAPIEntityName = "";
var ForeignFilterDivId = "";
function OpenGroupModal(APIModelName, ForeignFilterDvId, CurrentFilterDivId) {




    if (APIModelName == "") {
        Swal.fire({
            icon: "warning",
            text: "Please Add Source For GroupBy!",
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

    

    // alert("isClick " + isClick);//while connection establish  ::   isClick false
    //While click :: isClick true
    $('#APIModal').modal('show');
    // if (!isClick) {

    //  alert("Load the Conditional Modal");
    
    $.ajax({
        url: '/ETLDashboard/OpenGroupByModal',
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");

            // Clear existing rows in the table body
            $('#APIModalBody tbody').empty();

            modalBody.innerHTML = result;
            $('#exampleModalLabel').html('<b>Add GroupBy</b>');


            AddRowAsPerSourceTableColumnForGroupFilter(APIModelName, ForeignFilterDvId);

            if (ForeignFilterDvId.startsWith("dT_") )//ForeignFilterDvId != '')//Only Open Group By Modal
            {
                //BindGroupBy_Modal(ForeignFilterDivId);
                ClickedDataBaseEntity = ForeignFilterDivId;
            }

            
            

        },
        error: function (xhr, status, error) {
            console.error('Error loading partial view:', error);
            $('#overlay').hide();
        }
    });

}

function AddRowAsPerSourceTableColumnForGroupFilter(tableName, ForeignFilterDvId) {
    currentPage = 1;
    var SaveType = "Insert";

    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update

        SaveType = "Update";

    }
    $('#overlay').show();

    $.ajax({
        url: '/ETLDashboard/GetOutputResultData', // Replace with your actual endpoint
        type: 'GET',
        data: { entityName: tableName, CurrentModel: ForeignFilterDvId, SaveType: SaveType },          // Pass the table name in the URL
        success: function (response) {

            let ResultData = JSON.parse(response); // Parse the JSON string into an object

            if (ResultData.IsSuccess != undefined) {
                if (!ResultData.IsSuccess) {
                    const errorMsg = ResultData.ErrorMsg.replace(/\n/g, '<br/>');

                    Swal.fire({
                        icon: "error",
                        /*text: JSON.parse(response1).ErrorMsg,*/
                        html: errorMsg,

                    });

                   
                    if (!ResultData || !ResultData.ListOfOutputColumn || ResultData.ListOfOutputColumn.length === 0) {
                        console.error('No columns found for the entity:', tableName);
                        return;
                    }

                    // Set the globalDataSource to the ListOfOutputColumn array
                    globalDataSource = ResultData.ListOfOutputColumn;
                    var datatype = "";
                    ResultData.ListOfOutputColumn.forEach(column => {
                        // Convert column to lowercase for case-insensitive checks
                        const lowerCaseColumn = column.toLowerCase();

                        if (lowerCaseColumn.startsWith("id") || lowerCaseColumn.endsWith("id")) {
                            datatype = "int";
                        }
                        else if (lowerCaseColumn.includes("date")) {
                            datatype = "DateTime";
                        }
                        else {
                            datatype = "string";
                        }

                        // Create the new row with template literals
                        let newRow = `
                <tr>
                    <td>
                      <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${column}" id="${column}" checked>
                      <label class="form-check-label" for="${column}">
                        ${column}
                      </label>
                    </div>
                    </td>
                     <td>

                      <input class="form-control" type="textbox" value="${datatype}">
                    
                    </td>
                    <td>
                     
                      <input class="form-control" type="textbox" value="${column}">
                    
                    </td>
                   
                    <td>
                        <select class="form-control">
                        <option value="Expression">Expression</option>
                            <option value="Group By">Group By</option>
                            
                            <option value="Count">Count</option>
                            <option value="Min">Min</option>
                            <option value="Max">Max</option>
               
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control" placeholder="Enter value">
                    </td>
                </tr>
                `;



                        // Append the new row to the table body
                        $('#GroupBytable tbody').append(newRow);
                    });

                    $('#overlay').hide();
                    return;
                }
            }


            if (SaveType == "Update" && ForeignFilterDvId.startsWith("dT_")) {//Bind TableData For Enity

               // bindDataGridView(JSON.parse(JSON.parse(response).Output));
                SToreResultData = JSON.parse(JSON.parse(response).Output);
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);

             



                $('#FilterGroupByresults').removeAttr('hidden');
            }
           

            let parentModelData = JSON.parse(response); // Parse the JSON string into an object

            if (!parentModelData || !parentModelData.ListOfOutputColumn || parentModelData.ListOfOutputColumn.length === 0) {
                console.error('No columns found for the entity:', tableName);
                return;
            }

            // Set the globalDataSource to the ListOfOutputColumn array
            globalDataSource = parentModelData.ListOfOutputColumn;
            // Iterate over each column in the list
            var datatype = "";
            parentModelData.ListOfOutputColumn.forEach(column => {
                // Convert column to lowercase for case-insensitive checks
                const lowerCaseColumn = column.toLowerCase();

                if (lowerCaseColumn.startsWith("id") || lowerCaseColumn.endsWith("id")) {
                    datatype = "int";
                }
                else if (lowerCaseColumn.includes("date")) {
                    datatype = "DateTime";
                }
                else {
                    datatype = "string";
                }

                // Create the new row with template literals
                let newRow = `
                <tr>
                    <td>
                      <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${column}" id="${column}" checked>
                      <label class="form-check-label" for="${column}">
                        ${column}
                      </label>
                    </div>
                    </td>
                     <td>

                      <input class="form-control" type="textbox" value="${datatype}">
                    
                    </td>
                    <td>
                     
                      <input class="form-control" type="textbox" value="${column}">
                    
                    </td>
                   
                    <td>
                        <select class="form-control">
                        <option value="Expression">Expression</option>
                            <option value="Group By">Group By</option>
                            
                            <option value="Count">Count</option>
                            <option value="Min">Min</option>
                            <option value="Max">Max</option>
               
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control" placeholder="Enter value">
                    </td>
                </tr>
                `;


               
                // Append the new row to the table body
                $('#GroupBytable tbody').append(newRow);
            });


            $('#codeEditorFilter').val(JSON.parse(response).SourceCode
                .split('\n') // Split the code into an array of lines
                .map(line => line.trimStart()) // Trim leading spaces from each line
                .join('\n'));


            $('#overlay').hide();

        },
        error: function (xhr, status, error) {
            console.error('Error fetching data sources:', error);
            alert('Error fetching data sources:', error);
            $('#overlay').hide();
        }
    });
}
function BindGroupBy_Modal(EntityName) {
    var SaveType = "Insert";

    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update

        SaveType = "Update";
    }

    $('#overlay').show();
    $.ajax({
        url: '/ETLDashboard/FetchConfigurationByTableName', // Replace with your actual endpoint
        type: 'GET',
        data: {
            entityName: EntityName,
            SaveType: SaveType }, // Pass the table name in the URL
        success: function (response1) {
            if (response1.IsSuccess != undefined) {
                if (!response1.IsSuccess) {
                    const errorMsg = response1.ErrorMsg.replace(/\n/g, '<br/>');

                    Swal.fire({
                        icon: "error",
                        /*text: JSON.parse(response1).ErrorMsg,*/
                        html: errorMsg,

                    });
                    $('#overlay').hide();

                    return;
                }
            }
            if (!response1) {
                alert('No Configuration Found');
                $('#overlay').hide();
                return;
            }
            else {

                $('#codeEditorFilter').val(response1.sourceCode);
                    //.split('\n') // Split the code into an array of lines
                    //.map(line => line.trimStart()) // Trim leading spaces from each line
                    //.join('\n'));
               
                bindDataGridView(JSON.parse(response1.output));
                $('#FilterGroupByresults').removeAttr('hidden');
                $('#overlay').hide();
                
            }
           



           
           


        },
        error: function (xhr, status, error) {
            alert('Error fetching data sources:', error);
            console.error('Error fetching data sources:', error);
            $('#overlay').hide();
        }
    });
}
var currentEntityName = "";
function ApplyConditionGroupBy() {
    currentPage = 1;
    // alert(ForeignFilterDivId);
    // Initialize DataFilterModel
    var entityName = "NoEntity";
    if (ForeignFilterDivId.includes('dT_')) {
        entityName = ForeignFilterDivId;
    }

    // Collect data into GroupByConditionModel structure
    var groupByConditions = {
        SourceEntityName: PrimaryAPIEntityName, // Replace with actual entity name
        CurrentEntityName: entityName, // Replace with actual entity name
        GroupByConditionList: [] // Initialize an empty list
    };

    // Loop through each row in the table to build GroupByConditionList
    $('#GroupBytable tbody tr').each(function () {
        var outputColumn = $(this).find('.form-check-input').val(); // Get checkbox value
        var isChecked = $(this).find('.form-check-input').is(':checked'); // Check if checkbox is checked
        //var AliasValue = $(this).find('input[type="textbox"]').val(); // Get input filter value

        

        // Retrieve the datatype from the first textbox (in the second <td>)
        var DataType = $(this).find('td:nth-child(2) input[type="textbox"]').val();

        // Retrieve the column from the second textbox (in the third <td>)
        var AliasValue = $(this).find('td:nth-child(3) input[type="textbox"]').val();



        var operator = $(this).find('select').val(); // Get selected operator
        var filterValue = $(this).find('input[type="text"]').val(); // Get input filter value
       
        // If checkbox is checked, store the data
        if (isChecked) {
            groupByConditions.GroupByConditionList.push({
                OutputColumn: outputColumn, // Add OutputColumn
                ActualColumn: outputColumn,
                Operator: operator, // Add ConditionOperator
                FilterValue: filterValue, // Add Filter
                Alias: AliasValue,
                DataType: DataType
            });
        }
        else {
            groupByConditions.GroupByConditionList.push({
                ActualColumn: outputColumn,
                Operator: operator, // Add ConditionOperator
                FilterValue: filterValue, // Add Filter
                Alias: AliasValue,
                DataType: DataType
            });
        }
    });

    $('#overlay').show();
    // Send data to the server
    fetch('/DataTransformation/ApplyGroupBy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupByConditions)
    })
        .then(response => response.json())
        .then(data => {
            if (data.isSuccess)
            {
                var tablebody = $('#dataGridview tbody');
                tablebody.empty(); // Clear the table body
                // Handle the response data and bind it to the HTML table    
                //bindDataGridView(data.resultTable);

                SToreResultData = data.resultTable;
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);

                $('#codeEditorFilter').val(data.code
                    .split('\n') // Split the code into an array of lines
                    .map(line => line.trimStart()) // Trim leading spaces from each line
                    .join('\n'));

                currentEntityName = data.entiyName;
                $('#FilterGroupByresults').removeAttr('hidden');
                $('#overlay').hide();



                $("#btnSaveGroupBY").prop("disabled", false); // Enable the button
                $("#btnSaveCodeGroupBy").prop("disabled", false); // Enable the button
            }
            else {
                var tablebody = $('#dataGridview tbody');
                tablebody.empty(); // Clear the table body
               
                $('#FilterGroupByresults').attr('hidden', true);
                $('#codeEditorFilter').val("");

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.code,
                   
                });



                $("#btnSaveGroupBY").prop("disabled", true); // Enable the button
                $("#btnSaveCodeGroupBy").prop("disabled", true); // Enable the button
                $('#overlay').hide();
                // Handle the response data and bind it to the HTML table    

            }
           

           

            //$(`#${ForeignFilterDivId}`).html(EntityName);

           
            

        })
        .catch(error => {
            console.error('Error:', error);
            $("#btnSaveGroupBY").prop("disabled", true); // Disable the button
            $("#btnSaveCodeGroupBy").prop("disabled", true); // Disable the button
        });
}

function SaveConditionDataGroupBy() {
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
    
    // Initialize DataFilterModel
    // Collect data into GroupByConditionModel structure
    var groupByConditions = {
        SourceCode: $('#codeEditorFilter').val(),
        SourceEntityName: PrimaryAPIEntityName, // Replace with actual entity name
        CurrentEntityName: entityName, // Replace with actual entity name
        GroupByConditionList: [] // Initialize an empty list
    };

    // Loop through each row in the table to build GroupByConditionList
    $('#GroupBytable tbody tr').each(function () {
        var outputColumn = $(this).find('.form-check-input').val(); // Get checkbox value
        var isChecked = $(this).find('.form-check-input').is(':checked'); // Check if checkbox is checked
        var AliasValue = $(this).find('input[type="textbox"]').val(); // Get input filter value

        var operator = $(this).find('select').val(); // Get selected operator
        var filterValue = $(this).find('input[type="text"]').val(); // Get input filter value

        // If checkbox is checked, store the data
        if (isChecked) {
            groupByConditions.GroupByConditionList.push({
                OutputColumn: outputColumn, // Add OutputColumn
                ActualColumn: outputColumn,
                Operator: operator, // Add ConditionOperator
                FilterValue: filterValue, // Add Filter
                Alias: AliasValue
            });
        }
        else {
            groupByConditions.GroupByConditionList.push({
                ActualColumn: outputColumn,
                Operator: operator, // Add ConditionOperator
                FilterValue: filterValue, // Add Filter
                Alias: AliasValue
            });
        }
    });

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
    fetch('/DataTransformation/SaveGroupByCondition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupByConditions)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                Swal.fire({
                    icon: "success",
                    text: data.message,
                });

                $(`#blockydivGroupBY-` + ForeignFilterDivId.split('-')[1]).html(data.currentEntityName);

                $('#APIModal').modal('hide');
                ExportJson();//To store Convax template
                $('#overlay').hide();
            }
            else {
                Swal.fire({
                    icon: "error",
                    text: data.message,
                });
                $('#overlay').hide();
            }
            


            


        })
        .catch(error => {
            console.error('Error:', error);
            $('#overlay').hide();
        });

}