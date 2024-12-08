


function ShowHideExistingDiv() {
    var TableNameDiv = document.getElementById('DivTableName');
    var parentDiv = document.getElementById('ExpertForm');
    var newInsertOptions = document.getElementById('newInsertOptions');
    var existingExportOptions = document.getElementById('existingExportOptions');

    var selectedInsertType = document.querySelector('input[name="insertType"]:checked').value;

    if (selectedInsertType === 'Existing') {
        const form = document.getElementById('ExpertForm');
        if (form) {
            const formData = new FormData(form);
            formData.append('input', "");

            processJsonData(formData);

        }

        parentDiv.style.display = 'block';
        existingExportOptions.style.display = 'block';
        newInsertOptions.style.display = 'none';
        TableNameDiv.style.display = 'none';
    } else {


        const form = document.getElementById('ExpertForm');
        if (form) {
            const formData = new FormData(form);
            formData.append('input', "");

            processJsonData(formData);



        }

        else {
            console.error('Form with id "ExpertForm" not found.');
        }



        TableNameDiv.style.display = 'block';
        parentDiv.style.display = 'block';
        existingExportOptions.style.display = 'none';
        newInsertOptions.style.display = 'block';
    }
}


var SourceTYpee = '@ViewBag.DisplaySection';
var tableDropdownData = null;
function processJsonData(formData) {
    fetch('@Url.Action("GetJsonData", "DataMapping")', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            if (!text) {
                throw new Error('Response is empty');
            }
            try {
                return JSON.parse(text);
            } catch (error) {
                throw new Error('Invalid JSON: ' + error.message);
            }
        })
        .then(data => {
            var IsSuccessful = data.isSuccessfullyCompile;
            if (IsSuccessful) {
                let dataMapping = document.getElementById("DataMapping");
                if (dataMapping != null && dataMapping != undefined) {
                    dataMapping.disabled = false;
                }

                // Check if ListOfProperty is defined and is an array
                const listOfProperty = data.listOfProperty;
                if (Array.isArray(listOfProperty)) {
                    const sourceGridBody = document.querySelector("#SourceGrid tbody");
                    const newGridBody = document.querySelector("#NewGrid tbody");

                    sourceGridBody.innerHTML = ""; // Clear previous content
                    newGridBody.innerHTML = "";

                    listOfProperty.forEach(property => {
                        const row = document.createElement("tr");
                        const rowNewExport = document.createElement("tr");

                        const columnNameCell = document.createElement("td");
                        columnNameCell.textContent = property.column_Name;

                        const columnTypeCell = document.createElement("td");
                        columnTypeCell.textContent = property.column_Type;

                        const tableNameCell = document.createElement("td");
                        const tableDropdown = document.createElement("select");

                        const tableConstraintTypeCell = document.createElement("td");

                        // Create checkboxes
                        const isNullCheckbox = document.createElement("input");
                        isNullCheckbox.type = "checkbox";
                        isNullCheckbox.name = "Null";
                        isNullCheckbox.classList.add("form-check-input", "me-2");
                        isNullCheckbox.style.marginLeft = "-30px";

                        const isIdentityCheckbox = document.createElement("input");
                        isIdentityCheckbox.type = "checkbox";
                        isIdentityCheckbox.name = "Identity";
                        isIdentityCheckbox.classList.add("form-check-input", "me-2");
                        isIdentityCheckbox.style.marginLeft = "-30px";

                        const isPrimaryCheckbox = document.createElement("input");
                        isPrimaryCheckbox.type = "checkbox";
                        isPrimaryCheckbox.name = "Primary";
                        isPrimaryCheckbox.classList.add("form-check-input", "me-2");
                        isPrimaryCheckbox.style.marginLeft = "-30px";

                        // Add click event listener
                        isPrimaryCheckbox.addEventListener('click', function () {
                            validatePrimaryKeyAndIdentityColumns();
                        });

                        const isIdentityLabel = document.createElement("label");
                        isIdentityLabel.textContent = "Is Identity";
                        isIdentityLabel.classList.add("form-check-label", "me-3");
                        isIdentityLabel.insertBefore(isIdentityCheckbox, isIdentityLabel.firstChild);
                        isIdentityLabel.style.marginLeft = "120px";
                        isIdentityLabel.addEventListener('click', function () {
                            if (!validatePrimaryKeyAndIdentityColumns()) {
                                event.target.checked = !event.target.checked;
                            }
                        });

                        const isNullLabel = document.createElement("label");
                        isNullLabel.textContent = "Is Null";
                        isNullLabel.classList.add("form-check-label", "me-3");
                        isNullLabel.insertBefore(isNullCheckbox, isNullLabel.firstChild);
                        isNullLabel.style.marginLeft = "120px";
                        isNullLabel.addEventListener('click', function () {
                            if (!validatePrimaryKeyAndIdentityColumns()) {
                                event.target.checked = !event.target.checked;
                            }
                        });

                        const isPrimaryLabel = document.createElement("label");
                        isPrimaryLabel.textContent = "Is Primary";
                        isPrimaryLabel.classList.add("form-check-label", "me-3", "gap-3");
                        isPrimaryLabel.insertBefore(isPrimaryCheckbox, isPrimaryLabel.firstChild);
                        isPrimaryLabel.style.marginLeft = "120px";
                        isPrimaryLabel.addEventListener('change', function () {
                            if (!validatePrimaryKeyAndIdentityColumns()) {
                                event.target.checked = !event.target.checked;
                            }
                        });

                        // Create a div to hold the checkboxes and labels in a single line
                        const checkboxContainer = document.createElement("div");
                        checkboxContainer.classList.add("d-flex", "align-items-center");
                        checkboxContainer.appendChild(isNullLabel);
                        checkboxContainer.appendChild(isIdentityLabel);
                        checkboxContainer.appendChild(isPrimaryLabel);

                        // Append the container to the table cell
                        tableConstraintTypeCell.appendChild(checkboxContainer);

                        const tableColumnCelltxt = document.createElement("td");
                        const textBox = document.createElement("input");
                        textBox.value = property.column_Name;
                        textBox.classList.add("form-control");

                        tableNameCell.appendChild(tableDropdown);
                        tableColumnCelltxt.appendChild(textBox);

                        // Populate table dropdown options
                        if (tableDropdownData) {
                            tableDropdownData.forEach(table => {
                                const option = document.createElement("option");
                                option.value = table.name;
                                option.textContent = table.name;
                                tableDropdown.appendChild(option);
                            });
                        } else {
                            console.error('tableDropdownData is not available.');
                        }

                        const columnDropdownCell = document.createElement("td");
                        const columnDropdown = document.createElement("select");
                        columnDropdown.classList.add("form-control");

                        columnDropdownCell.appendChild(columnDropdown);

                        // Append cells to the row
                        row.appendChild(columnNameCell);
                        row.appendChild(columnTypeCell);
                        row.appendChild(tableNameCell);
                        row.appendChild(columnDropdownCell);

                        rowNewExport.appendChild(columnNameCell);
                        rowNewExport.appendChild(columnTypeCell);
                        rowNewExport.appendChild(tableColumnCelltxt);
                        rowNewExport.appendChild(tableConstraintTypeCell);

                        sourceGridBody.appendChild(row);
                        newGridBody.appendChild(rowNewExport);

                        // Event listener for table dropdown change
                        tableDropdown.addEventListener('change', function () {
                            const selectedTable = this.value;
                            fetchColumnsByTable(selectedTable, columnDropdown);
                        });
                    });
                } else {
                    console.error('listOfProperty is not an array:', listOfProperty);
                }

                // Dynamically add rows to the destination grid
                populateDestinationGrid(data.listOfProperty);

                // Populate table name dropdowns
                populateTableDropdowns(data.listOfTable);

                // Store data.listOfTable in the variable
                tableDropdownData = data.listOfTable;

                document.getElementById('InsertButton').hidden = false;
                document.getElementById('NewGrid').hidden = false;

                document.getElementById('loader').hidden = true;
            } else {
                document.getElementById('existingExportOptions').style.display = 'none'; // or 'none' to hide it initially
            }
        })
        .catch(error => console.error('Error:', error));
}


//function processJsonData(formData) {
//    fetch('@Url.Action("GetJsonData", "DataMapping")', {
//        method: 'POST',
//        body: formData
//    })
//        .then(response => response.json())
//        .then(data => {

//            var IsSuccessful = data.isSuccessfullyCompile;
//            if (IsSuccessful) {
//                let dataMapping = document.getElementById("DataMapping");
//                if (dataMapping != null && dataMapping != undefined) {
//                    dataMapping.disabled = false;
//                }

//                // Check if ListOfProperty is defined and is an array
//                const listOfProperty = data.listOfProperty;
//                if (Array.isArray(listOfProperty)) {
//                    const sourceGridBody = document.querySelector("#SourceGrid tbody");
//                    const NewGridBody = document.querySelector("#NewGrid tbody");

//                    sourceGridBody.innerHTML = ""; // Clear previous content
//                    NewGridBody.innerHTML = "";

//                    listOfProperty.forEach(property => {
//                        const row = document.createElement("tr");
//                        const rowNewExport = document.createElement("tr");

//                        const columnNameCell = document.createElement("td");
//                        columnNameCell.textContent = property.column_Name;

//                        const columnTypeCell = document.createElement("td");
//                        columnTypeCell.textContent = property.column_Type;

//                        const tableNameCell = document.createElement("td");
//                        const tableDropdown = document.createElement("select");
//                        // tableDropdown.classList.add("form-control");

//                        const tableConstraintTypeCell = document.createElement("td");
//                        // Create checkboxes
//                        // Create checkboxes
//                        const isNullCheckbox = document.createElement("input");
//                        isNullCheckbox.type = "checkbox";
//                        isNullCheckbox.name = "Null";
//                        isNullCheckbox.classList.add("form-check-input", "me-2");
//                        isNullCheckbox.style.marginLeft = "-30px"; // Add custom style


//                        const isIdentityCheckbox = document.createElement("input");
//                        isIdentityCheckbox.type = "checkbox";
//                        isIdentityCheckbox.name = "Identity";
//                        isIdentityCheckbox.classList.add("form-check-input", "me-2");
//                        isIdentityCheckbox.style.marginLeft = "-30px"; // Add custom style

//                        const isPrimaryCheckbox = document.createElement("input");
//                        isPrimaryCheckbox.type = "checkbox";
//                        isPrimaryCheckbox.name = "Primary";
//                        isPrimaryCheckbox.classList.add("form-check-input", "me-2");
//                        isPrimaryCheckbox.style.marginLeft = "-30px"; // Add custom style

//                        // Add click event listener
//                        isPrimaryCheckbox.addEventListener('click', function () {

//                            validatePrimaryKeyAndIdentityColumns();
//                        });
//                        const isIdentityLabel = document.createElement("label");
//                        isIdentityLabel.textContent = "Is Identity";
//                        isIdentityLabel.classList.add("form-check-label", "me-3");
//                        isIdentityLabel.insertBefore(isIdentityCheckbox, isIdentityLabel.firstChild);
//                        isIdentityLabel.style.marginLeft = "120px";
//                        // Add click event listener
//                        isIdentityLabel.addEventListener('click', function () {

//                            if (!validatePrimaryKeyAndIdentityColumns()) {
//                                event.target.checked = !event.target.checked;
//                            }
//                        });


//                        // Create labels for checkboxes
//                        const isNullLabel = document.createElement("label");
//                        isNullLabel.textContent = "Is Null";
//                        isNullLabel.classList.add("form-check-label", "me-3");
//                        isNullLabel.insertBefore(isNullCheckbox, isNullLabel.firstChild);
//                        isNullLabel.style.marginLeft = "120px";
//                        // Add click event listener
//                        isNullLabel.addEventListener('click', function () {

//                            if (!validatePrimaryKeyAndIdentityColumns()) {
//                                event.target.checked = !event.target.checked;
//                            }
//                        });



//                        const isPrimaryLabel = document.createElement("label");
//                        isPrimaryLabel.textContent = "Is Primary";
//                        isPrimaryLabel.classList.add("form-check-label", "me-3", "gap-3");
//                        isPrimaryLabel.insertBefore(isPrimaryCheckbox, isPrimaryLabel.firstChild);
//                        isPrimaryLabel.style.marginLeft = "120px";
//                        // Add click event listener
//                        isPrimaryLabel.addEventListener('change', function () {

//                            if (!validatePrimaryKeyAndIdentityColumns()) {
//                                event.target.checked = !event.target.checked;
//                            }
//                        });

//                        // Create a div to hold the checkboxes and labels in a single line
//                        const checkboxContainer = document.createElement("div");
//                        checkboxContainer.classList.add("d-flex", "align-items-center");
//                        checkboxContainer.appendChild(isNullLabel);
//                        checkboxContainer.appendChild(isIdentityLabel);
//                        checkboxContainer.appendChild(isPrimaryLabel);

//                        // Append the container to the table cell
//                        tableConstraintTypeCell.appendChild(checkboxContainer);

//                        // Append checkboxes and labels to the table cell



//                        // Append the dropdown to the table cell
//                        tableNameCell.appendChild(tableDropdown);


//                        const tableColumnCelltxt = document.createElement("td");
//                        const textBox = document.createElement("input");
//                        textBox.value = property.column_Name;

//                        //tableDropdown.classList.add("form-control");
//                        textBox.classList.add("form-control");

//                        tableNameCell.appendChild(tableDropdown);

//                        tableColumnCelltxt.appendChild(textBox);

//                        // Populate table dropdown options
//                        if (tableDropdownData) {
//                            tableDropdownData.forEach(table => {
//                                const option = document.createElement("option");
//                                option.value = table.name;
//                                option.textContent = table.name;
//                                tableDropdown.appendChild(option);
//                            });
//                        } else {
//                            console.error('tableDropdownData is not available.');
//                        }

//                        const columnDropdownCell = document.createElement("td");
//                        const columnDropdown = document.createElement("select");
//                        //columnDropdown.classList.add("column-dropdown");
//                        columnDropdown.classList.add("form-control");

//                        //tableDropdown.classList.add("form-control");
//                        columnDropdownCell.appendChild(columnDropdown);

//                        // Append cells to the row
//                        row.appendChild(columnNameCell);
//                        row.appendChild(columnTypeCell);
//                        row.appendChild(tableNameCell);
//                        row.appendChild(columnDropdownCell);

//                        rowNewExport.appendChild(columnNameCell);
//                        rowNewExport.appendChild(columnTypeCell);
//                        rowNewExport.appendChild(tableColumnCelltxt);
//                        rowNewExport.appendChild(tableConstraintTypeCell);

//                        sourceGridBody.appendChild(row);
//                        NewGridBody.appendChild(rowNewExport);

//                        // Event listener for table dropdown change
//                        tableDropdown.addEventListener('change', function () {
//                            const selectedTable = this.value;
//                            fetchColumnsByTable(selectedTable, columnDropdown);
//                        });
//                    });
//                } else {
//                    console.error('listOfProperty is not an array:', listOfProperty);
//                }

//                // Dynamically add rows to the destination grid
//                populateDestinationGrid(data.listOfProperty);

//                // Populate table name dropdowns
//                populateTableDropdowns(data.listOfTable);

//                // Store data.listOfTable in the variable
//                tableDropdownData = data.listOfTable;

//                document.getElementById('InsertButton').hidden = false;
//                document.getElementById('NewGrid').hidden = false;

//                document.getElementById('loader').hidden = true;
//                //InsertButton
//                // document.getElementById('InsertButton').disabled = 'false';

//            } else {
//                document.getElementById('existingExportOptions').style.display = 'none'; // or 'none' to hide it initially
//            }
//            // document.getElementById("compileButton").disabled = false;
//        })
//        .catch(error => console.error('Error:', error));
//}



function validateTable() {
    const table = document.getElementById("SourceGrid");
    const rows = table.querySelectorAll("tbody tr");
    let isValid = true;

    rows.forEach(row => {
        const tableDropdown = row.querySelector("td:nth-child(3) select");
        if (tableDropdown.value === "") {
            isValid = false;
            tableDropdown.classList.add("is-invalid");
        } else {
            tableDropdown.classList.remove("is-invalid");
        }
    });

    if (!isValid) {
        alert("Please select All TableName.");
    }

    return isValid;
}

function ExportDataInsert() {


    if (SourceTYpee != 'File') {


        var selectElement = document.querySelector('input[name="insertType"]:checked').value;
        // const selectElement = document.getElementById('InsertType');
        if (selectElement !== 'Existing') {
            if (document.getElementById('txtTable').value == "") {
                alert("Please Write Table Name");
                return;
            }
        }
        const dataToSend = {};
        var columnNames = "";
        if (selectElement === 'Existing') {

            if (!validateTable()) {
                return;
            }



            // Function to get data from SourceGrid
            function getSourceGridData() {
                const sourceGrid = document.getElementById('SourceGrid').getElementsByTagName('tbody')[0];
                const rows = sourceGrid.getElementsByTagName('tr');
                let sourceData = [];
                for (let row of rows) {
                    const cells = row.getElementsByTagName('td');
                    sourceData.push({
                        fieldName: cells[0].innerText,
                        dataType: cells[1].innerText
                    });
                }
                return sourceData;
            }

            // Function to get data from DestinationGrid
            function getDestinationGridData() {
                const destinationGrid = document.getElementById('SourceGrid').getElementsByTagName('tbody')[0];
                const rows = destinationGrid.getElementsByTagName('tr');
                let destinationData = [];
                for (let row of rows) {
                    const cells = row.getElementsByTagName('td');

                    const tableNameCell = cells[2];
                    let tableName;
                    const tableSelectElement = tableNameCell.querySelector('select');
                    if (tableSelectElement) {
                        tableName = tableSelectElement.value;
                    } else {
                        tableName = tableNameCell.innerText.trim();
                    }

                    const columnNameCell = cells[3];
                    let columnName;
                    const columnSelectElement = columnNameCell.querySelector('select');
                    if (columnSelectElement) {
                        columnName = columnSelectElement.value;
                    } else {
                        columnName = columnNameCell.innerText.trim();
                    }

                    destinationData.push({
                        tableName: tableName,
                        columnName: columnName
                    });
                }
                return destinationData;
            }

            // Collect data from both tables
            const sourceData = getSourceGridData();
            const destinationData = getDestinationGridData();

            // Ensure both grids have the same number of rows
            if (sourceData.length !== destinationData.length) {
                alert('The number of rows in SourceGrid and DestinationGrid do not match.');
                return;
            }

            // Create a mapping
            let mapping = [];
            for (let i = 0; i < sourceData.length; i++) {
                mapping.push({
                    source: sourceData[i],
                    destination: destinationData[i]
                });
            }


            const tableName = document.getElementById('txtTable').value;

            // Construct data to send
            dataToSend.mapping = mapping;

            dataToSend.TableName = tableName;

        }

        else {
            // Handle other cases as needed
            // const inputValue = document.getElementById('Input').value;
            const tableName = document.getElementById('txtTable').value;
            // const databaseType = document.getElementById('DataBaseType').value;

            // dataToSend.inputValue = inputValue;
            dataToSend.TableName = tableName;
            //  dataToSend.DatabaseType = databaseType;


            dataToSend.List_NewColumnNameWithType = getTextboxValuesFromNewGrid();




        }

        // Store the mapping (here we simply log it to the console)
        console.log('Data to send:', dataToSend);

        // Send the data to the server
        fetch('/DataMapping/PostMappingData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.text())  // Get the response text
            .then(data => {
                console.log('Response:', data);
                if (data === "Success") {

                    alert("The Mapping was successfully configured");
                    $('#MappingModal').modal('hide');

                } else {
                    alert("The Datamapping process was failed.");

                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                alert('Network error: ' + error.message);
                document.getElementById('InsertButton').disabled = false;
            });
    }
    ////To Handel File Data
    else {

        const selectElement = document.getElementById('InsertType');
        if (selectElement !== 'Existing') {
            if (document.getElementById('txtTable').value == "") {
                alert("Please Write Table Name");
                return;
            }
        }

        const dataToSend = {};
        const form = document.getElementById('compileForm');
        const formData = new FormData(form);
        if (selectElement === 'Existing') {
            // Function to get data from SourceGrid
            function getSourceGridData() {
                const sourceGrid = document.getElementById('SourceGrid').getElementsByTagName('tbody')[0];
                const rows = sourceGrid.getElementsByTagName('tr');
                let sourceData = [];
                for (let row of rows) {
                    const cells = row.getElementsByTagName('td');
                    sourceData.push({
                        fieldName: cells[0].innerText,
                        dataType: cells[1].innerText
                    });
                }
                return sourceData;
            }

            // Function to get data from DestinationGrid
            function getDestinationGridData() {
                const destinationGrid = document.getElementById('DestinationGrid').getElementsByTagName('tbody')[0];
                const rows = destinationGrid.getElementsByTagName('tr');
                let destinationData = [];
                for (let row of rows) {
                    const cells = row.getElementsByTagName('td');

                    const tableNameCell = cells[0];
                    let tableName;
                    const tableSelectElement = tableNameCell.querySelector('select');
                    if (tableSelectElement) {
                        tableName = tableSelectElement.value;
                    } else {
                        tableName = tableNameCell.innerText.trim();
                    }

                    const columnNameCell = cells[1];
                    let columnName;
                    const columnSelectElement = columnNameCell.querySelector('select');
                    if (columnSelectElement) {
                        columnName = columnSelectElement.value;
                    } else {
                        columnName = columnNameCell.innerText.trim();
                    }

                    destinationData.push({
                        tableName: tableName,
                        columnName: columnName
                    });
                }
                return destinationData;
            }

            // Collect data from both tables
            const sourceData = getSourceGridData();
            const destinationData = getDestinationGridData();

            // Ensure both grids have the same number of rows
            if (sourceData.length !== destinationData.length) {
                alert('The number of rows in SourceGrid and DestinationGrid do not match.');
                return;
            }

            // Create a mapping
            let mapping = [];
            for (let i = 0; i < sourceData.length; i++) {
                mapping.push({
                    source: sourceData[i],
                    destination: destinationData[i]
                });
            }

            // Get other input values
            const inputValue = document.getElementById('Input').value;
            const tableName = document.getElementById('txtTable').value;
            const databaseType = document.getElementById('DataBaseType').value;

            // Construct data to send
            dataToSend.mapping = mapping;
            dataToSend.inputValue = inputValue;
            dataToSend.TableName = tableName;
            dataToSend.DatabaseType = databaseType;
        }

        else {
            // Handle other cases as needed
            const inputValue = document.getElementById('Input').value;
            const tableName = document.getElementById('txtTable').value;
            const databaseType = document.getElementById('DataBaseType').value;

            dataToSend.inputValue = inputValue;
            dataToSend.TableName = tableName;
            dataToSend.DatabaseType = databaseType;


        }
        // Store the mapping (here we simply log it to the console)
        console.log('Data to send:', dataToSend);

        // Send the data to the server
        // fetch('/DataMapping/PostMappingData', {

        fetch('@Url.Action("ExportExcel", "DataMapping")', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error('Network response was not ok: ' + response.status + ' ' + text);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Handle success response
                const outputElement = document.getElementById('Output');
                outputElement.innerHTML = ''; // Clear previous messages
                const outputMessages = data.messages;
                outputMessages.forEach(message => {
                    outputElement.innerHTML += message + "<br>";
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                // Optionally handle error response
            });



    }
}




function getTextboxValuesFromNewGrid() {

    if (!validatePrimaryKeyAndIdentityColumns()) {
        return [];
    }



    const newGridTable = document.getElementById('NewGrid');
    const rows = newGridTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const columnDetailsList = [];


    for (let row of rows) {
        const columnTypeCell = row.getElementsByTagName('td')[1];
        const columnNameTextbox = row.getElementsByTagName('td')[2].getElementsByTagName('input')[0];

        const Original_FieldName = row.getElementsByTagName('td')[0];

        // Get checkbox values
        const isNullCheckbox = row.querySelector('input[name="Null"]');
        const isIdentityCheckbox = row.querySelector('input[name="Identity"]');
        const isPrimaryCheckbox = row.querySelector('input[name="Primary"]');

        // Concatenate checkbox values
        let constraints = '';
        if (isNullCheckbox && isNullCheckbox.checked) {
            constraints += 'Null ';
        }
        if (isIdentityCheckbox && isIdentityCheckbox.checked) {
            constraints += 'Identity ';
        }
        if (isPrimaryCheckbox && isPrimaryCheckbox.checked) {
            constraints += 'Primary ';
        }
        constraints = constraints.trim(); // Remove trailing space




        if (columnTypeCell && columnNameTextbox) {
            const columnType = columnTypeCell.textContent.trim();
            const columnName = columnNameTextbox.value;
            const OriginalColumnNmae = Original_FieldName.textContent.trim();
            const Source = {
                Original_FieldName: OriginalColumnNmae,
                FieldName: columnName,
                DataType: columnType,
                constraints: constraints

            };
            columnDetailsList.push(Source);
        }
    }

    return columnDetailsList;
}

function validatePrimaryKeyAndIdentityColumns() {
    const newGridTable = document.getElementById('NewGrid');
    const rows = newGridTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    let primaryKeyCount = 0;
    let identityColumnCount = 0;

    for (let row of rows) {

        const isNullCheckbox = row.querySelector('input[name="Null"]');
        const isIdentityCheckbox = row.querySelector('input[name="Identity"]');
        const isPrimaryCheckbox = row.querySelector('input[name="Primary"]');

        if (isIdentityCheckbox && isIdentityCheckbox.checked) {
            identityColumnCount++;
            if (isNullCheckbox && isNullCheckbox.checked) {
                // alert("An identity column cannot be marked as Null.");
                return false;
            }
        }

        if (isPrimaryCheckbox && isPrimaryCheckbox.checked) {
            primaryKeyCount++;
            if (isNullCheckbox && isNullCheckbox.checked) {
                // alert("A primary key column cannot be marked as Null.");
                return false;
            }
        }


        //if (isIdentityCheckbox && isIdentityCheckbox.checked) {
        //    identityColumnCount++;
        //}
        //if (isPrimaryCheckbox && isPrimaryCheckbox.checked) {
        //    primaryKeyCount++;
        //}
    }

    // Validation for only one primary key and one identity column
    if (primaryKeyCount > 1) {
        // alert("Only one primary key is allowed.");
        return false;
    }

    if (identityColumnCount > 1) {
        //alert("Only one identity column is allowed.");
        return false;
    }

    return true;
}


function populateDestinationGrid(listOfProperty) {
    const destinationGridBody = document.querySelector("#SourceGrid tbody");
    destinationGridBody.innerHTML = ""; // Clear previous content

    listOfProperty.forEach(property => {
        const row = document.createElement("tr");

        // Create cell for field name
        const fieldNameCell = document.createElement("td");
        fieldNameCell.textContent = property.column_Name;
        row.appendChild(fieldNameCell);

        // Create cell for data type
        const dataTypeCell = document.createElement("td");
        dataTypeCell.textContent = property.column_Type;
        row.appendChild(dataTypeCell);

        // Create cell for table name dropdown
        const tableNameCell = document.createElement("td");
        const tableDropdown = document.createElement("select");
        tableDropdown.classList.add("table-dropdown");
        tableDropdown.classList.add("form-control");



        tableNameCell.appendChild(tableDropdown);

        // Populate table dropdown options
        if (tableDropdownData) {
            tableDropdownData.forEach(table => {
                const option = document.createElement("option");
                option.value = table.name;
                option.textContent = table.name;
                tableDropdown.appendChild(option);
            });
        } else {
            console.error('tableDropdownData is not available.');
        }

        // Append table name cell to the row
        row.appendChild(tableNameCell);

        // Create cell for column name dropdown
        const columnNameCell = document.createElement("td");
        const columnDropdown = document.createElement("select");
        columnDropdown.classList.add("column-dropdown");

        columnDropdown.classList.add("form-control"); columnNameCell.appendChild(columnDropdown);

        // Append column name cell to the row
        row.appendChild(columnNameCell);

        // Append row to the destination grid body
        destinationGridBody.appendChild(row);

        // Event listener for table dropdown change
        tableDropdown.addEventListener('change', function () {
            const selectedTable = this.value;
            fetchColumnsByTable(selectedTable, columnDropdown);
        });
    });
}

function populateTableDropdowns(tables) {
    const tableDropdowns = document.querySelectorAll("#SourceGrid tbody tr td:nth-child(3) select");

    tableDropdowns.forEach(dropdown => {
        // Clear previous options
        dropdown.innerHTML = "";

        // Create default 'Select' option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select"; // Change text as needed
        dropdown.appendChild(defaultOption);

        // Populate table options
        tables.forEach(table => {
            const option = document.createElement("option");
            option.value = table.name;
            option.textContent = table.name;
            dropdown.appendChild(option);
        });

        // Add event listener for onchange event
        dropdown.addEventListener('change', function () {
            const selectedTable = this.value;
            fetchColumnsByTable(selectedTable, this);
        });
    });
}




function fetchColumnsByTable(order, tableDropdown) {
    fetch(`/DataMapping/Get_ColumnsByTable?TableName=${order}`)
        .then(response => response.json())
        .then(data => {
            const columns = data;
            populateColumnDropdown(columns, tableDropdown);
        })
        .catch(error => console.error('Error:', error));
}

function populateColumnDropdown(columns, tableDropdown) {
    const columnDropdown = tableDropdown.parentElement.nextElementSibling.querySelector('select');
    columnDropdown.innerHTML = ""; // Clear previous options
    columns.forEach(column => {
        const option = document.createElement("option");
        option.value = column.name;
        option.textContent = column.name;
        columnDropdown.appendChild(option);
    });
}

