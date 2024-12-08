//For Bind Node Dynamically
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}
function decryptData(encryptedData) {
    var decryptedBytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    var decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    var decryptedObject = JSON.parse(decryptedString);
    var originalData = decryptedObject.data;
    /*var decryptedInteger = parseInt(originalData, 10);*/
    return originalData;
}
$(document).ready(function () {

    var id = getUrlVars()["strid"];

    if (id != undefined || id != null) {

        LoadPipeLineConfigDesign(decryptData(id));
        
    }
});
function LoadPipeLineConfigDesign(id) {
    
    $('#sessionId').html(id);
    $('#mainsessionSpan').removeAttr('hidden');

    $('#overlay').show();
    $.ajax({
        type: "Get",
        dataType: "json",
        url: loadPipelineConfigUrl,
        data: { "PipeLineName": id },
        success: function (Result) {
            if (Result != "Fail") {
                $("#hdn_DatabaseConfigurationsPipelineId").val(JSON.parse(Result).Id);
                editor.import(JSON.parse(JSON.parse(Result).DrowFlowJson));
                $('#overlay').hide();

               
                ExportJson();//To store Convax template
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",

                });
                $('#overlay').hide();
            }

        },
        error: function (Message) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",

            });
            $('#overlay').hide();
        }
    });
}


function BindMappingModalForEdit(id) {
    var PipelineName = decryptData(id);
    $.ajax({
        url: '/DataMapping/FetchConfigurationForMapping', // Replace with your actual endpoint
        type: 'GET',
        data: { PipelineName: PipelineName }, // Pass the table name in the URL
        success: function (response1) {


            if (["Session Is Out", "Something went Wrong"].includes(response1)) {
                alert(response1);
                if (response1 == "Session Is Out") {
                    location.href = "/pipelinedashboard/index";
                }
                return;
            }
            else {//Bind Modal
                if (response1.targetTable != "") {
                    document.getElementById("insertNew").checked = true;

                }
                else {
                    document.getElementById("insertExisting").checked = true;
                }


                document.getElementById("codeEditorMapping").value = response1.sourceCode;


                ShowHideExistingDiv();
                document.getElementById("txtTable").value = response1.targetTable;
            }

        },
        error: function (xhr, status, error) {
            console.error('Error fetching data sources:', error);
            alert('Error fetching data sources:', error);
        }
    });
}

function BindSaveConfigurationModalForEdit(id) {
    var PipelineName = decryptData(id);
    $.ajax({
        url: '/PipelineConfiguration/BindSaveConfigurationModalForEdit', // Replace with your actual endpoint
        type: 'GET',
        data: { PipelineName: PipelineName }, // Pass the table name in the URL
        success: function (response1) {


            if (["Session Is Out", "Something went Wrong"].includes(response1)) {
                alert(response1);
                if (response1 == "Session Is Out") {
                    location.href = "/pipelinedashboard/index";
                }
                return;
            }
            else {//Bind Modal


                document.getElementById("descriptionCustom").value = response1.description;
                /*document.getElementById("executionModeCustom").value = getExecutionModeValue(response1.executionMode);*/

                const selectElement = document.getElementById("executionModeCustom");
                selectElement.value = getExecutionModeValue(response1.executionMode); // Set the dropdown value

                // Call the change function to handle any logic needed
                changeExecutionModeCustom(selectElement);


                document.getElementById("selectedDayCustom").value = response1.executionInterval.day;
                document.getElementById("selectedHourCustom").value = response1.executionInterval.hour;
                document.getElementById("selectedMinuteCustom").value = response1.executionInterval.minute;

                document.getElementById("selectedScheduledHourCustom").value = response1.executionInterval.hoursInterval;
                document.getElementById("selectedScheduledMinuteCustom").value = response1.executionInterval.minutesInterval;


                document.getElementById("selectedWeekDayCustom").value = response1.executionInterval.weekDay;

            }

        },
        error: function (xhr, status, error) {
            console.error('Error fetching data sources:', error);
            alert('Error fetching data sources:', error);
        }
    });
}

function getExecutionModeValue(num) {
    switch (num) {
        case 0: return "Daily";
        case 1: return "Weekly";
        case 2: return "Hourly";
        case 3: return "Monthly";
        case 4: return "Minutely";
        default: return null; // or handle as needed
    }
}
//Load Templtae Dynamically*@


//Load Templtae Dynamically
let nodeDesigns = {};
function LoadAllNodeDesign() {
    // Select all parent nodes
    $('.parent-node').each(function () {
        // Get the node ID from the element's ID
        const nodeId = $(this).children('div').attr('id'); // e.g., "node-1"
        if (nodeId != undefined) {

            const nodeNumber = nodeId.split('-')[1]; // Extract number part
            // Select the entire content inside the drawflow_content_node
            const nodeHtml = $(this).find('.drawflow_content_node').html();
            // Store the HTML in the nodeDesigns object
            nodeDesigns[nodeNumber] = nodeHtml;

        }
    });
}

var currentTemplate = "";
// Function to export JSON and update it with new designs
function ExportJson() {
    LoadAllNodeDesign();
    // Export the current template from the editor
    var currentTemplateString = JSON.stringify(editor.export(), null, 4);
    currentTemplate = JSON.parse(currentTemplateString);




    // Update currentTemplate with new designs
    for (const nodeNumber in nodeDesigns) {
        if (currentTemplate.drawflow.Home.data[nodeNumber]) {
            var design = nodeDesigns[nodeNumber];

            currentTemplate.drawflow.Home.data[nodeNumber].html = design;

        }
    }

    // Clear the editor first
    editor.clear();


    editor.import(currentTemplate);

    console.log(JSON.stringify(currentTemplate, null, 4));



}


function RemoveEntityFromJsonSourceList(EntityName) {
   
    // Fetch columns for the selected table via AJAX
    $.ajax({
        url: '/DataTransformation/RemoveEntityFromJsonSourceList', // Replace with your actual endpoint
        type: 'GET',
        data: { entityName: EntityName }, // Pass the table name in the URL
        success: function (response) {
            let res = JSON.parse(response); // Parse the JSON string
            if (res == "Success") {
                Swal.fire({
                    icon: "success",
                    title: "Your work has been saved",

                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: res,
                    text: "Your work has not been saved",

                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your work has not been saved",
                
            });
        }
    });
}


