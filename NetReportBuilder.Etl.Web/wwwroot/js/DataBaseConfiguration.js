
var CurrentDataBasetype = "";
var ClickedDataBaseEntity = "";
function OpenOracleModal(CurrentOracleDivIdd, dbType) {
   
    // alert("OracleId " + CurrentOracleDivIdd);
    CurrentAPIDivId = CurrentOracleDivIdd;
    let DataTableName = document.getElementById(CurrentOracleDivIdd).innerHTML;


    $('#APIModal').modal('show');
    $('#exampleModalLabel').html('<b>ORACLE CONNECTOR</b>');
    // alert("CorrentAPIDivId :" + CurrentAPIDivId);
  
    $.ajax({
        url: '/ETLDashboard/LoadDataBaseConfigModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");

            // Clear existing rows in the table body
            $('#APIModalBody tbody').empty();

            modalBody.innerHTML = result;
            // Create an array of Promises
            let promises = [];
            // BindConnection(dbType);
            promises.push(BindConnection(dbType));

            if (DataTableName != '')//Only Open API Connector
            {
                //BindDataBase_Modal(DataTableName);
                promises.push(BindDataBase_Modal(DataTableName));
                ClickedDataBaseEntity = DataTableName;
            }


            // Wait for all Promises to complete
            Promise.all(promises).then(() => {
                $('#overlay').hide(); // Hide the loader if both completed successfully
            }).catch(error => {
                console.error('Error in binding functions:', error);
                $('#overlay').hide(); // Hide the loader in case of an error
            });

          //  $('#overlay').hide();

        },
        error: function (xhr, status, error) {
            console.error('Error loading partial view:', error);
        }
    });





}

function OpenSqlServerModal(CurrentOracleDivIdd,dbType) {
   
    CurrentAPIDivId = CurrentOracleDivIdd;
    let DataTableName = document.getElementById(CurrentOracleDivIdd).innerHTML;


    $('#APIModal').modal('show');
    $('#exampleModalLabel').html('<b>SQL CONNECTOR</b>');
    // alert("CorrentAPIDivId :" + CurrentAPIDivId);

    $.ajax({
        url: '/ETLDashboard/LoadDataBaseConfigModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");
            // Clear existing rows in the table body
            $('#APIModalBody tbody').empty();
            modalBody.innerHTML = result;

           

            // Create an array of Promises
            let promises = [];
            // BindConnection(dbType);
            promises.push(BindConnection(dbType));

            if (DataTableName != '')//Only Open API Connector
            {
                //BindDataBase_Modal(DataTableName);
                promises.push(BindDataBase_Modal(DataTableName));
                ClickedDataBaseEntity = DataTableName;
            }


            // Wait for all Promises to complete
            Promise.all(promises).then(() => {
                $('#overlay').hide(); // Hide the loader if both completed successfully
            }).catch(error => {
                console.error('Error in binding functions:', error);
                $('#overlay').hide(); // Hide the loader in case of an error
            });

            // Hide the loader after the functions are complete
          //  $('#overlay').hide();

        },
        error: function (xhr, status, error) {
            console.error('Error loading partial view:', error);
        }
    });





}




function OpenPostgreSQLModal(CurrentOracleDivIdd, dbType) {
    return;
    // alert("PostGressId " + CurrentOracleDivIdd);
    CurrentAPIDivId = CurrentOracleDivIdd;
    let DataTableName = document.getElementById(CurrentOracleDivIdd).innerHTML;


    $('#APIModal').modal('show');
    $('#exampleModalLabel').html('<b>POSTGRE CONNECTOR</b>');
    // alert("CorrentAPIDivId :" + CurrentAPIDivId);

    $.ajax({
        url: '/ETLDashboard/LoadDataBaseConfigModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");
            modalBody.innerHTML = result;




        },
        error: function (xhr, status, error) {
            console.error('Error loading partial view:', error);
        }
    });





}

function OpenmysqlModal(CurrentOracleDivIdd, dbType) {
   
    //alert("MysqlId " + CurrentOracleDivIdd);
    CurrentAPIDivId = CurrentOracleDivIdd;
    let DataTableName = document.getElementById(CurrentOracleDivIdd).innerHTML;


    $('#APIModal').modal('show');
    $('#exampleModalLabel').html('<b>MYSQL CONNECTOR</b>');
    // alert("CorrentAPIDivId :" + CurrentAPIDivId);

    $.ajax({
        url: '/ETLDashboard/LoadDataBaseConfigModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");
            // Clear existing rows in the table body
            $('#APIModalBody tbody').empty();
            modalBody.innerHTML = result;

            // Create an array of Promises
            let promises = [];
            // BindConnection(dbType);
            promises.push(BindConnection(dbType));

            if (DataTableName != '')//Only Open API Connector
            {
                //BindDataBase_Modal(DataTableName);
                promises.push(BindDataBase_Modal(DataTableName));
                ClickedDataBaseEntity = DataTableName;
            }


            // Wait for all Promises to complete
            Promise.all(promises).then(() => {
                $('#overlay').hide(); // Hide the loader if both completed successfully
            }).catch(error => {
                console.error('Error in binding functions:', error);
                $('#overlay').hide(); // Hide the loader in case of an error
            });

        },
        error: function (xhr, status, error) {
            console.error('Error loading partial view:', error);
        }
    });





}
function BindConnection(dbType) {
    return new Promise((resolve, reject) => {
        CurrentDataBasetype = dbType;
        $('#overlay').show();

        $.ajax({
            type: "GET",
            dataType: "json",
            url: getDatabaseConfigurationsByDbTypeUrl,
            data: { "dbType": dbType },
            success: function (Result) {
                var data = JSON.parse(Result);

                // Clear existing options
                $('#Connection').empty();

                data.forEach(function (item) {
                    var combinedValue = item.HostName + '/' + item.DatabaseName;
                    $('#Connection').append('<option value="' + combinedValue + '">' + combinedValue + '</option>');
                });

              //  $('#overlay').hide(); // Hide the loader here
                resolve(); // Resolve the Promise
            },
            error: function (Message) {
                alert(Message);
                $('#overlay').hide(); // Hide the loader here
                reject(Message); // Reject the Promise
            }
        });
    });
}


//function BindConnection(dbType) {
//    CurrentDataBasetype = "";
//    CurrentDataBasetype = dbType;
//    $('#overlay').show();
//    $.ajax({
//        type: "Get",
//        dataType: "json",
//        url: getDatabaseConfigurationsByDbTypeUrl,
//        data: { "dbType": dbType },
//        success: function (Result) {
//            var data = JSON.parse(Result);

//            // Clear existing options
//            $('#Connection').empty();

           
//            data.forEach(function (item) {
//                var combinedValue = item.HostName + '/' + item.DatabaseName;
//                $('#Connection').append('<option value="' + combinedValue + '">' + combinedValue + '</option>');
//            });

            

//        },
//        error: function (Message) {
//            alert(Message);
//            $('#overlay').hide();
            
//        }
//    });
//}
var EntityName = "";

let currentPage = 1; // Initialize the current page
const pageSize = 10; // Set the number of records per page
var SToreResultData;
function ViewResult() {
    currentPage = 1;
    if (ClickedDataBaseEntity == "") {
        EntityName = "Source";
    }
    else {
        EntityName = ClickedDataBaseEntity;
    }
    

    var entity = {
        Query: $('#txtQueryBuilder').val(),
        ConcatServerAndDatabase: $('#Connection').val(),
        DatabaseType: CurrentDataBasetype,
        EntityName: EntityName,

    };

    
    $.ajax({
        url: '/MultiDataBaseConfiguration/GetResult', // Your endpoint for the Submit action
        type: 'POST',
        data: entity,
        success: function (data) {
            //$('#apiresult').val(JSON.stringify(data.ApiResponse, null, 2));
            $('#apiresult').val(JSON.stringify(JSON.parse(data.TableResponse), null, 2));
            $('#codeEditor').val(data.Code);
            SToreResultData = JSON.parse(data.TableResponse);
           // bindDataGridViewPaging(JSON.parse(data.TableResponse));
            bindDataGridViewPaging(JSON.parse(data.TableResponse), currentPage, pageSize); // Pass the current page and page size
            setupPagination(JSON.parse(data.TableResponse).length); // Call to set up pagination controls
            $('#APIresults').css('display', 'block');
            EntityName = data.EntiyName;
            

            $('#pagination').show();
            $('#dataGridViewContainer').show();

            $("#connectButton").prop("disabled", false); // Enable the button
            $("#btnSave").prop("disabled", false); // Enable the button

        },
        error: function (xhr, status, error) {
            $('#overlay').hide();
            // $('#apiresult').val('Error: ' + xhr.responseText);
            //alert('Error: ' + xhr.responseText);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: xhr.responseText,
                footer: '<a href="#">Why do I have this issue?</a>'
            });

            $('#dataGridview thead').empty();  // Clear the table header
            $('#dataGridview tbody').empty();  // Clear the table body
            $('#pagination').hide();
            $('#dataGridViewContainer').hide();
            $("#connectButton").prop("disabled", true); // Enable the button
            $("#btnSave").prop("disabled", true); // Enable the button
            SToreResultData = [];
            //parent.ClosePopupFromChild("There was an issue while connecting to the API");
        }
    });

 
}



// Pagination function to navigate between pages
function goToPage(page) {
    currentPage = page; 
    GetPagingData();
}

function GetPagingData() {
    bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
    setupPagination(SToreResultData.length); // Call to set up pagination controls
    $('#APIresults').css('display', 'block');
}

// Function to set up pagination controls
function setupPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / pageSize);

    $('#pagination').empty(); // Clear existing pagination

    // Create Previous button
    const prevButton = $('<button class="btn btn-secondary me-2">Previous</button>')
        .attr('disabled', currentPage === 1)
        .click(function () {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });

    $('#pagination').append(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = $('<button class="btn btn-primary me-2">' + i + '</button>')
            .click(function () {
                goToPage(i);
            });

        if (i === currentPage) {
            pageButton.attr('disabled', true); // Disable the button for the current page
            pageButton.addClass('active'); // Add active class for current page
        }

        $('#pagination').append(pageButton);
    }

    // Create Next button
    const nextButton = $('<button class="btn btn-secondary">Next</button>')
        .attr('disabled', currentPage === totalPages)
        .click(function () {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });

    $('#pagination').append(nextButton);
}


function bindDataGridViewPaging(data, currentPage, pageSize) {
    //alert("bindDataGridViewPaging currentPage=" + currentPage);
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data structure or empty data array");
        return;
    }

    // Calculate total number of records
    const totalRecords = data.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Validate the current page
    if (currentPage < 1 || currentPage > totalPages) {
        console.error("Current page is out of bounds");
        return;
    }

    // Get the subset of data for the current page
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    // Populate the table header
    var tablehead = $('#dataGridview thead');
    tablehead.empty(); // Clear the table head

    // Extract headers from the first data item
    var headers = Object.keys(data[0]);
    var rowHeaderhtml = '<tr style="font-weight:bold;border: 1px solid black; background-color: #EEE;">';
    headers.forEach(header => {
        rowHeaderhtml += '<td>' + header + '</td>';
    });
    rowHeaderhtml += '</tr>';
    tablehead.append(rowHeaderhtml);

    // Populate the table body
    var tablebody = $('#dataGridview tbody');
    tablebody.empty(); // Clear the table body

    paginatedData.forEach(row => {
        var rowBodyhtml = '<tr>';
        headers.forEach(header => {
            rowBodyhtml += '<td>' + (row[header] !== undefined ? row[header] : '') + '</td>';
        });
        rowBodyhtml += '</tr>';
        tablebody.append(rowBodyhtml);
    });
}


function saveDatabase() {

    var entity = {

        Query: $('#txtQueryBuilder').val(),
        ConcatServerAndDatabase: $('#Connection').val(),
        DatabaseType: CurrentDataBasetype,
        SourceCode: $('#codeEditor').val(),
        EntityName: ClickedDataBaseEntity
        

    };
    $('#overlay').show();
    $.ajax({
        url: '/MultiDataBaseConfiguration/SubmitDBConnection', // Your endpoint for the Submit action
        type: 'POST',
        data: entity,
        success: function (response) {
            
            //parent.ClosePopupFromChild("The Api was successfully configured");
            Swal.fire({
                title: 'Success',
                text: response.message,
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
function BindDataBase_Modal(EntityName) {
    return new Promise((resolve, reject) => {
        var SaveType = "Insert";
        var id = getUrlVars()["strid"];

        if (id !== undefined) { // Update
            SaveType = "Update";
        }

        $('#overlay').show();
        
        $.ajax({
            url: '/ETLDashboard/FetchConfigurationByTableName', // Replace with your actual endpoint
            type: 'GET',
            data: {
                entityName: EntityName,
                SaveType: SaveType // Pass the table name in the URL
            },
            success: function (response1) {
                // Check if the response indicates success
                if (response1.isSuccess !== undefined && !response1.isSuccess) {
                    const errorMsg = response1.errorMsg.replace(/\n/g, '<br/>');
                    Swal.fire({
                        icon: "error",
                        html: errorMsg,
                    });
                    //$('#overlay').hide(); // Hide the loader in case of error
                    reject(errorMsg); // Reject the Promise
                    return;
                }

                if (!response1) {
                    alert('No Configuration Found');
                    $('#overlay').hide(); // Hide the loader if no configuration found
                    return;
                }

                // Bind the MethodType, EndPoint, and ParameterType to the respective elements
                document.getElementById("txtQueryBuilder").value = JSON.parse(response1.dataBaseInputsModel).Query;
                document.getElementById("codeEditor").value = response1.sourceCode; // JSON.parse(response1.configuration).EndPoint;
                document.getElementById("Connection").value = JSON.parse(response1.dataBaseInputsModel).Host + "/" + JSON.parse(response1.dataBaseInputsModel).DataBase;

                SToreResultData = JSON.parse(response1.output);
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);

                $('#APIresults').show();
               // $('#overlay').hide(); // Hide the loader here
                resolve(); // Resolve the Promise
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data sources:', error);
                alert('Error fetching data sources:', error);
                $('#overlay').hide(); // Hide the loader here
                reject(error); // Reject the Promise
            }
        });
    });
}


//function BindDataBase_Modal(EntityName) {
//    var SaveType = "Insert";

//    var id = getUrlVars()["strid"];

//    if (id != undefined) {//Update

//        SaveType = "Update";
//    }
//    $('#overlay').show();
//    $.ajax({
//        url: '/ETLDashboard/FetchConfigurationByTableName', // Replace with your actual endpoint
//        type: 'GET',
//        data: {
//            entityName: EntityName,
//            SaveType: SaveType }, // Pass the table name in the URL
//        success: function (response1) {
//            if (response1.IsSuccess != undefined) {
//                if (!response1.IsSuccess) {
//                    const errorMsg = response1.ErrorMsg.replace(/\n/g, '<br/>');

//                    Swal.fire({
//                        icon: "error",
//                        /*text: JSON.parse(response1).ErrorMsg,*/
//                        html: errorMsg,

//                    });
//                    reject(errorMsg); // Reject the Promise
//                    return;
//                }
//            }
//            if (!response1) {
//                alert('No Configuration Found');
//                return;
//            }
            



         


//            // Bind the MethodType, EndPoint, and ParameterType to the respective elements
//            document.getElementById("txtQueryBuilder").value = JSON.parse(response1.dataBaseInputsModel).Query;
//            document.getElementById("codeEditor").value = response1.sourceCode;// JSON.parse(response1.configuration).EndPoint;
//            document.getElementById("Connection").value = JSON.parse(response1.dataBaseInputsModel).Host + "/" + JSON.parse(response1.dataBaseInputsModel).DataBase;
            
           

//        },
//        error: function (xhr, status, error) {
//            console.error('Error fetching data sources:', error);
//            alert('Error fetching data sources:', error);
//            $('#overlay').hide();
//        }

//    });
//}


