function RemoveSourceEntityInTransformationDiv(primaryblockydivId, ForeignblockydivId) {
   
    var SourceId = primaryblockydivId;
    var DestinationDivId = 'SourceListEntity-' + ForeignblockydivId.split('-')[1];
  
}
function StoreSourceEntityInTransformationDiv(primaryblockydivId, ForeignblockydivId) {
   
    var SourceId = primaryblockydivId;
    var DestinationDivId = 'SourceListEntity-' + ForeignblockydivId.split('-')[1];

    // Get the inner HTML content of the source div
    var sourceContent = $('#' + SourceId).html();

    // Get the current content of the destination div
    var destinationContent = $('#' + DestinationDivId).html();

    // Check if the destination div already has content
    if (destinationContent) {
        // Append the new content with a | symbol
        $('#' + DestinationDivId).html(destinationContent + ' | ' + sourceContent);
    } else {
        // If no content, just set the source content
        $('#' + DestinationDivId).html(sourceContent);
    }
}




function OpenJoinConDiditionModal() {
   
    $('#APIModal').modal('show');
    $('#overlay').show();
    $.ajax({
        url: '/ETLDashboard/OpenJoinConditionModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");
            modalBody.innerHTML = result;
            $('#exampleModalLabel').html('<b>Add Reference</b>');
          
            addNewRow();
            $('#overlay').hide();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: xhr.responseText,
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            console.error('Error loading partial view:', error);
            $('#overlay').hide();
        }
    });

}
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
let columnCount = 1;
function AddDiv(EntityName) {

    const innerRow = document.getElementById('innerrow');

    

    let currentRow;

    // Check if the last row has less than 3 columns
    if (innerRow.children.length % 3 === 0 && innerRow.children.length !== 0) {
        // Create a new row if needed
        currentRow = document.createElement('div');
        currentRow.className = 'row';
        innerRow.appendChild(currentRow);
    } else {
        // Use the last row or the initial row if empty
        currentRow = innerRow.lastElementChild || innerRow;
    }

    // Create the new column div
    const newColumn = document.createElement('div');
    newColumn.className = 'col-xl-4 col-lg-4 TextLeft';
    newColumn.innerHTML = `
        <div class="card">
        <div class="card-header" style="padding: 5px;">
        <label class="label_heading">${EntityName}</label>
        </div>

        <div class="card-body" style="border:1px solid #ced4da; height:158px; 
          overflow-y:auto; padding-left: 11px; margin-left: 7px; padding-top: 13px;">
        <div id="chkleftcolumns_${EntityName}" class="form-group" >
        </div>
        </div>
         </div>
    `;

    if (currentRow === innerRow) {
        currentRow.appendChild(newColumn);
    } else {
        innerRow.appendChild(newColumn);
    }

    columnCount++;
}

function ShowJoinDiv() {




    $('#lblFirstDataTablee').removeAttr('hidden');
    $('#lblJoin').removeAttr('hidden');
    $('#lblSecondDataTablee').removeAttr('hidden');
    $('#ddlSourceColumn').removeAttr('hidden');
    $('#ddlJointype').removeAttr('hidden');
    $('#ddlDestinationColumn').removeAttr('hidden');
}

function generateDropdownOptions() {

    

    // Split the string by '|' to get an array of IDs
    let blockyDivIdss = EnityListOfJoinTransformation.split('|');


    // Retrieve the inner HTML values of the divs
    //let options = blockyDivIds.map(id => {
    //    let divElement = document.getElementById(id);
    //    let innerHtml = divElement ? divElement.innerHTML : '';
    //    return `<option value="${id}">${innerHtml}</option>`;
    //}).join('');


    let options = EnityListOfJoinTransformation.split('|').map(id => {

        return `<option value="${id}">${id}</option>`;
    }).join('');

    return options;
}

//For Join Condition Use
function addNewRow() {

    let options = generateDropdownOptions();

    let newRow = `
        <tr>
            <td>
                <select class="form-control" id="ddlLeftTables" onchange="bindColumnsJoin(this)">
                    <option value="">Select</option>
                    ${options}
                </select>
            </td>
            <td>
                <select class="form-control" id="ddlLeftColumns">
                    <option value="">Select</option>
                </select>
            </td>
            <td>
                <select class="form-control">
                    <option value="INNER JOIN">INNER JOIN</option>
                </select>
            </td>
            <td>
                <select class="form-control" id="ddlRightTables" onchange="bindColumnsJoin(this)">
                    <option value="">Select</option>
                    ${options}
                </select>
            </td>
            <td>
                <select class="form-control" id="ddlRightColumns">
                    <option value="">Select</option>
                </select>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)">Remove</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="moreConcept()">More</button>
            </td>
        </tr>
    `;
    $('#jointable tbody').append(newRow);
}

function bindColumnsJoin(selectElement) {
    // Get the selected table ID
    let EntityName = $(selectElement).val().trim();


    // Find the closest table row
    let $row = $(selectElement).closest('tr');

    // Determine if the change is for left-side or right-side table
    let isLeftSide = $(selectElement).attr('id') === 'ddlLeftTables'; // Assuming ID for left-side table dropdowns
    let $columnsDropdown = isLeftSide ? $row.find('select[id^="ddlLeftColumns"]') : $row.find('select[id^="ddlRightColumns"]');

    // Fetch columns for the selected table via AJAX
    $.ajax({
        url: '/ETLDashboard/FetchDataSources', // Replace with your actual endpoint
        type: 'GET',
        data: { entityName: EntityName }, // Pass the table name in the URL
        success: function (response) {
            let dataSource = JSON.parse(response); // Parse the JSON string
            if (!dataSource || !dataSource.Columns) {
                console.error('No columns found for the entity:', tableName);
                return;
            }

            // Clear existing columns in the dropdown
            $columnsDropdown.empty();

            // Add a default "Select" option
            $columnsDropdown.append('<option value="">Select</option>');

            // Populate the columns dropdown with new options
            dataSource.Columns.forEach(column => {
                let option = `<option value="${column.Value}">${column.Text}</option>`;
                $columnsDropdown.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data sources:', error);
            alert('Error fetching data sources:', error);
        }
    });
}

function removeRow(button) {
  
    $(button).closest('tr').remove();
}

function moreConcept() {
   
    addNewRow();
}


let joinTransformModel = {
    ListOfJoinConditions: [],
    SelectedColumns: []
};

function CloseApplyJoinTransformDataModal() {
    joinTransformModel = {
        ListOfJoinConditions: [],
        SelectedColumns: []
    };
    collectJoinConditions();
    $('#APIModal').modal('hide');
    Swal.fire({
        icon: "success",
        text: "Join Condition Saved!",
    });
  //  alert("Join Condition Saved");
    document.getElementById('btnResultJoin').removeAttribute('hidden');
    document.getElementById('btnSaveJoin').removeAttribute('hidden');
}

function collectJoinConditions() {
  

    // Get the table body element
    let table = document.getElementById("jointable").getElementsByTagName('tbody')[0];

    // Iterate through each row
    for (let row of table.rows) {
        let leftTable = row.querySelector("select[id^='ddlLeftTables']").selectedOptions[0].text;
        let leftColumn = row.querySelector("select[id^='ddlLeftColumns']").selectedOptions[0].text;
        let joinType = row.getElementsByTagName("select")[2].value; // Assumes only one dropdown for JoinType in each row
        
        let rightTable = row.querySelector("select[id^='ddlRightTables']").selectedOptions[0].text;
        let rightColumn = row.querySelector("select[id^='ddlRightColumns']").selectedOptions[0].text;

        let relationModel = {
            LeftTable: {
                EntityName: leftTable,
                ColumnName: leftColumn
            },
            RightTable: {
                EntityName: rightTable,
                ColumnName: rightColumn
            },
            JoinType: joinType
        };

        // Add the relationModel to ListOfJoinConditions
        joinTransformModel.ListOfJoinConditions.push(relationModel);
    }

    // Now joinTransformModel holds all the data in the desired format
    console.log(joinTransformModel);
    return joinTransformModel;
}

function collectSelectedColumns() {
    let selectedColumns = [];

    let columnNameSet = new Set();
    let duplicateFound = false;


    // Iterate through all checkboxes in the left and right columns
    document.querySelectorAll("#innerrow .col-xl-4 input[type=checkbox]:checked").forEach((checkbox) => {
        // Get the parent column div
        let columnDiv = checkbox.closest(".col-xl-4");
        // Get the label text within the column div
        let entityName = columnDiv.querySelector("label").innerText.trim();
        // Get the column name from the checkbox value
        let columnName = checkbox.value;



        // Check if the column name is already in the set
        if (columnNameSet.has(columnName)) {
            duplicateFound = true;
        } else {
            columnNameSet.add(columnName);
            // Add to selectedColumns array
            selectedColumns.push({
                EntityName: entityName,
                ColumnName: columnName
            });
        }


        //// Add to selectedColumns array
        //selectedColumns.push({
        //    EntityName: entityName,
        //    ColumnName: columnName
        //});
    });

    // If duplicate found, alert and return an empty array
    if (duplicateFound) {
        //alert("Please Write Table Name");
        Swal.fire({
            icon: "warning",
            text: "Duplicate column names are not allowed!",
        });

       
        return [];
    }


    return selectedColumns;
}


//Bind Join Result and Csharp Code
function BindJoinResult_For_Entity(CurrentEntity) {
    currentPage = 1;
    var SaveType = "Insert";
   
    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update
       
        SaveType = "Update";
    }

    $('#overlay').show();
   // alert("BindJoinResult_For_Entity " + CurrentEntity);
    $.ajax({
        url: '/ETLDashboard/GetOutputResultDataForJoin', // Replace with your actual endpoint
        type: 'GET',
        data: { entityName: CurrentEntity, SaveType: SaveType },          // Pass the table name in the URL
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
                    $('#overlay').hide();
                    return;
                }
            }
            if (!parentModelData) {
                console.error('No columns found for the entity:', tableName);
                $('#overlay').hide();
                return;
            }

            SToreResultData = JSON.parse(parentModelData.Output);
            bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
            setupPagination(SToreResultData.length);



            //bindDataGridView(JSON.parse(parentModelData.Output));

            $('#codeEditorJoin').val(parentModelData.SourceCode
                .split('\n') // Split the code into an array of lines
                .map(line => line.trimStart()) // Trim leading spaces from each line
                .join('\n'));


            $('#DataTableresults').removeAttr('hidden');
            $('#overlay').hide();
            //DataTableresults
            


        },
        error: function (xhr, status, error) {
            $('#overlay').hide();
            alert('Error fetching data sources:', error);
            console.error('Error fetching data sources:', error);
        }
    });

}

var currentJoinEntity = "";
function Join() {
    currentPage = 1;
   // alert(" Check Join Data " + $('#' + CurrentClickedJoinTransformationDivId).html());
    var entityName = "Source";
    if ($('#' + CurrentClickedJoinTransformationDivId).html().includes('dT_')) {
        entityName = $('#' + CurrentClickedJoinTransformationDivId).html();
    }


    if (collectSelectedColumns().length == 0)
        return;

    joinTransformModel.SelectedColumns = collectSelectedColumns();
    joinTransformModel.EntityName = entityName;
    $('#overlay').show();
    // Send data to the server
    fetch('/DataTransformation/CheckJoin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(joinTransformModel)
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data and bind it to the HTML table    
            if (data.isSuccess) {
               
                //bindDataGridView(data.resultTable);
                SToreResultData = data.resultTable;
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);
                $('#codeEditorJoin').val(data.code
                    .split('\n') // Split the code into an array of lines
                    .map(line => line.trimStart()) // Trim leading spaces from each line
                    .join('\n'));
               // $('#' + CurrentClickedJoinTransformationDivId).html(data.entiyName);
                currentJoinEntity = data.entiyName;
                $('#DataTableresults').removeAttr('hidden');
                console.log(data);
                $('#overlay').hide();


                $("#btnSaveInCode").prop("disabled", false); // Enable the button
                $("#btnSaveJoin").prop("disabled", false); // Enable the button
            }
            else {
                Swal.fire({
                    icon: "warning",
                    text: data.code,
                });
             
                $('#DataTableresults').attr('hidden', 'hidden');
                $("#btnSaveInCode").prop("disabled", true); // Enable the button
                $("#btnSaveJoin").prop("disabled", true); // Enable the button
                $('#overlay').hide();

            }
            

        })
        .catch(error => {
            console.error('Error:', error);
            $("#btnSaveInCode").prop("disabled", true); // Enable the button
            $("#btnSaveJoin").prop("disabled", true); // Enable the button
            $('#overlay').hide();
        });
}

function SaveJoinData() {
    var entityName = "Source";
    if ($('#' + CurrentClickedJoinTransformationDivId).html().includes('dT_')) {
        entityName = $('#' + CurrentClickedJoinTransformationDivId).html();
    }
  
    // Create the DataTransformationModel object
    const dataTransformationModel = {
        SourceCode: $('#codeEditorJoin').val() || "", // Assuming SourceCode might come from joinTransformModel
        SelectedColumns: joinTransformModel.SelectedColumns || [],
        JoinCondition: joinTransformModel.ListOfJoinConditions || [],
        Output: "Output", // Assuming Output will be handled separately
        EntityName: entityName // Assuming EntityName might come from joinTransformModel
    };
  
    $('#overlay').show();
    // Send data to the server
    fetch('/DataTransformation/SaveJoinTransformation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataTransformationModel)
    })
        .then(response => response.json())
        .then(data => {

            Swal.fire({
                icon: "success",
                text: data.message,
            });
            $('#' + CurrentClickedJoinTransformationDivId).html(currentJoinEntity);

            $('#JoinTransformDataModal').modal('hide');
            ExportJson();//To store Convax template
            $('#overlay').hide();

        })
        .catch(error => {
            console.error('Error:', error);
            $('#overlay').hide();
        });
}



function BindJoinModalOnClick(ListOfEntityInString) {

    alert('BindJoinModalOnClick '+ListOfEntityInString);

}


function RemoveEntityFromSourceList(foreigntargetDiv, primarytargetDiv) {




    var entityToRemove = $("#" + primarytargetDiv).text().trim(); 
    var blockEntityName = $('#' + foreigntargetDiv).text().trim(); 

    //// Find the blockydiv element by searching for the entity name (e.g., 'dT_055588')
    //const targetBlock = [...document.querySelectorAll('.blockydiv')]
    //    .find(block => block.textContent.trim() === blockEntityName);

    const targetBlock = $("#" + foreigntargetDiv);
   

    var blockyDivId = $(".blockydiv:contains('" + blockEntityName + "')").attr("id");


    // Split the ID to get the number (2 in this case)
    var idNumber = blockyDivId.split('-')[1];


    // If the block with the correct entity name is found
    if (targetBlock) {
        // Find the corresponding SourceListEntity element
        const sourceList = document.getElementById('SourceListEntity-' + idNumber);

        if (sourceList) {
            // Get the current list of entities
            let entities = sourceList.textContent.trim();

            // Split the entities by '|' and filter out the one to be removed
            const updatedEntities = entities
                .split('|')
                .map(e => e.trim())
                .filter(e => e !== entityToRemove)
                .join(' | ');

            // Update the SourceListEntity content
            sourceList.textContent = updatedEntities;
        } else {
            console.warn("SourceListEntity element not found.");
        }
    } else {
        console.warn(`No block found with entity name: ${blockEntityName}`);
    }
}

function ReOrderingListOfSource(NewleyCreatedNode, TargetNode) {
    // Perform an AJAX GET request
    $.ajax({
        url: '/DataTransformation/ReOrderingListOfSource',  // Replace with your controller name
        type: 'GET',
        data: {
            NewleyCreatedNode: NewleyCreatedNode,
            TargetNode: TargetNode
        },
        success: function (response) {
            // Handle the response here
            console.log('Response:', response);
            var result = JSON.parse(response);
            alert(result);
            // You can manipulate the DOM or handle success actions based on 'result'
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.error('Error:', error);
        }
    });
}


