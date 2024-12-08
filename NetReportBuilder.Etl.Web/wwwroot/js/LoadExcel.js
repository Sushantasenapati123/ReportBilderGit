var ClickedExcelEntity = "";
var ClickedExcelDivId = "";
function OpenexcelModal(ClickedExcelDiv, ModalType) {

    //alert("MysqlId " + CurrentOracleDivIdd);
    ClickedExcelDivId = ClickedExcelDiv;
    let DataTableName = document.getElementById(ClickedExcelDivId).innerHTML;

    $('#APIModal').modal('show');
    $('#exampleModalLabel').html('<b>Excel Upload</b>');
    // alert("CorrentAPIDivId :" + CurrentAPIDivId);

    $.ajax({
        url: '/ETLDashboard/LoadExcelModal', // Replace with your controller and action
        type: 'GET',
        success: function (result) {
            let modalBody = document.getElementById("APIModalBody");
            // Clear existing rows in the table body
            $('#APIModalBody tbody').empty();
            modalBody.innerHTML = result;



            if (DataTableName != '')//Only Open API Connector
            {
                BindExcel_Modal(DataTableName);
                ClickedExcelEntity = DataTableName;
            }
            
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: xhr.responseText,
                footer: '<a href="#">Why do I have this issue?</a>'
            });

            $('#overlay').hide();
        }
    });





}

var EntityName = "";
function GetExcelData() {
    currentPage = 1;

    // Change cursor to loading
    document.body.style.cursor = 'wait';
    document.getElementById('btnResultCondition').classList.add('loading'); // Add loading class
    document.getElementById('btnSaveExcel').classList.add('loading'); // 


    if (ClickedExcelEntity == "") {
        EntityName = "NoEntity";
    }
    else {
        EntityName = ClickedExcelEntity;
    }

    var fileInput = document.getElementById('Input');
    var file = fileInput.files[0]; // Get the selected file

    if (file) {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('EntityName', EntityName); // Append the entity name
        $('#overlay').show();
        fetch('/UploadExcell', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                $('#overlay').hide();
                return response.json(); // Assuming server returns JSON data
            })
            .then(data => {
                if (data.isSuccess) {

                    var tablebody = $('#dataGridview tbody');
                    tablebody.empty(); // Clear the table body
                    // Handle the response data and bind it to the HTML table    
                    //bindDataGridView(data.resultTable);

                    SToreResultData = data.resultTable;
                    bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                    setupPagination(SToreResultData.length);



                    $('#codeEditorExcel').val(data.code
                        .split('\n') // Split the code into an array of lines
                        .map(line => line.trimStart()) // Trim leading spaces from each line
                        .join('\n'));

                    currentEntityName = data.entiyName;
                    $('#Excelresults').removeAttr('hidden');


                    // Reset cursor to default
                    document.body.style.cursor = 'default';
                    document.getElementById('btnResultCondition').classList.remove('loading');
                    document.getElementById('btnSaveExcel').classList.remove('loading'); //


                    $("#btnSaveExcel").prop("disabled", false); // Enable the button
                    $("#btnSaveExcelIncode").prop("disabled", false); // Enable the button

                    $('#overlay').hide();

                    

                }
                else {
                    Swal.fire({
                        icon: "error",
                        text: "File Read failed.",
                    });

                    // Reset cursor to default
                    document.body.style.cursor = 'default';
                    document.getElementById('btnResultCondition').classList.remove('loading'); // 
                    document.getElementById('btnSaveExcel').classList.remove('loading'); //

                    $("#btnSaveExcel").prop("disabled", true); // Enable the button
                    $("#btnSaveExcelIncode").prop("disabled", true); // Enable the button
                    $('#overlay').hide();

                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    text: `Error occurred while uploading the file: ${error.message}`
                });

                // Reset cursor to default
                document.body.style.cursor = 'default';
                document.getElementById('btnResultCondition').classList.remove('loading'); // 
                document.getElementById('btnSaveExcel').classList.remove('loading'); // 
                $("#btnSaveExcel").prop("disabled", true); // Enable the button
                $("#btnSaveExcelIncode").prop("disabled", true); // Enable the button
                $('#overlay').hide();


            });
    } else {
        Swal.fire({
            icon: "warning",
            text: 'Please Choose a file.',
        });

        // Reset cursor to default
        document.body.style.cursor = 'default';
        document.getElementById('btnResultCondition').classList.remove('loading'); // 
        document.getElementById('btnSaveExcel').classList.remove('loading'); // 
        $('#overlay').hide();


    }
}
function SetExcelFilename(filepath) {
    // Get a reference to our file input
    const fileInput = document.querySelector('#Input');

    // Create a new File object
    const filePath = filepath;
    const fileName = filePath.split('\\').pop(); // Extract the filename

    const myFile = new File([''], fileName, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        lastModified: new Date(),
    });

    // Create a DataTransfer to get a FileList
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(myFile);

    // Assign the files to the file input
    fileInput.files = dataTransfer.files;
}
//let tableDropdownData = null;//Crucial error
function SaveExcelConfiguration() {

    var entityName = "";// "NoEntity";
    if (ClickedExcelEntity == "") {
        entityName = "NoEntity";
    }
    else {
        entityName = ClickedExcelEntity;
    }


    var entity = {
        FilePath: "",
        Output: "",
        SourceCode: $('#codeEditorExcel').val(),
        EntityName: entityName
    };


    var fileInput = document.getElementById('Input');
    var file = fileInput.files[0]; // Get the selected file

    if (file) {
        $('#overlay').show();
        // Send data to the server
        fetch('/UploadExcel/SaveExcelConfiguration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entity)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {


                    Swal.fire({
                        icon: "success",
                        text: data.message,
                    });
                    $('#' + ClickedExcelDivId).html(data.currentEntityName);

                    $('#APIModal').modal('hide');
                    ExportJson();//To store Convax template
                    $('#overlay').hide();

                }
                else {
                    Swal.fire({
                        icon: "warning",
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
    else {
        Swal.fire({
            icon: "warning",
            text: 'Please Choose a file.',
        });
        $('#overlay').hide();

    }
}

function BindExcel_Modal(EntityName) {
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
            if (response1.isSuccess != undefined) {
                if (!response1.isSuccess) {
                    const errorMsg = response1.errorMsg.replace(/\n/g, '<br/>');

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

                $('#codeEditorExcel').val(response1.sourceCode);
                //.split('\n') // Split the code into an array of lines
                //.map(line => line.trimStart()) // Trim leading spaces from each line
                //.join('\n'));

               // bindDataGridView(JSON.parse(response1.output));

                SToreResultData = JSON.parse(response1.output);
                bindDataGridViewPaging(SToreResultData, currentPage, pageSize); // Pass the current page and page size
                setupPagination(SToreResultData.length);


                SetExcelFilename(response1.excelConfiguration.filePath);

                $('#Excelresults').removeAttr('hidden');
                $('#overlay').hide();

            }






        },
        error: function (xhr, status, error) {
            console.error('Error fetching data sources:', error);
            alert('Error fetching data sources:', error);
            $('#overlay').hide();
        }
    });
}