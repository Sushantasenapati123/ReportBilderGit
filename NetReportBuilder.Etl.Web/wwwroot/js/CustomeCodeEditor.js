
// Declare a variable outside any function scope

function submitForm() {

    if ($('#Input').val() == "") {
        Swal.fire({
            icon: "warning",
            text: "Please Write Query First!",
        });
        $('#Input').addClass('highlight');
        return;
    } else {
        $('#Input').removeClass('highlight');
    }





    //if (document.getElementById('Input').value == "") {
    //    Swal.fire({
    //        icon: "warning",
    //        text: "Please Write Query First!",
    //    });

    //    return;
    //}

    document.getElementById("compileButton").disabled = true;

    document.getElementById('Output').innerHTML = ""; // Clear previous output

    document.getElementById('ViewTable').innerHTML = ""; // Clear previous output

    const form = document.getElementById('compileForm');
    const formData = new FormData(form);


    formData.append('input', document.getElementById('Input').value);
    formData.append('Code_Type', document.getElementById('Code_Type').value);


    fetch('/CustomCodeConnector/CompileCode', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {


            const outputMessages = data.messages;
            outputMessages.forEach(message => {
                const outputElement = document.getElementById('Output');
                outputElement.innerHTML += message + "<br>"; // Append each message with a line break

            });





            //    // Display view table
            const viewTableElement = document.getElementById('ViewTable');
            viewTableElement.innerHTML = data.viewTable;







            var IsSuccessful = data.isSuccessfullyCompile;
            if (IsSuccessful) {
                document.getElementById("ExportButton").disabled = false;

            }
            else {
                document.getElementById("ExportButton").disabled = true;


            }
            document.getElementById("compileButton").disabled = false;

        })
        .catch(error => console.error('Error:', error));

}



function Save() {
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

            const form = document.getElementById('compileForm');
            const formData = new FormData(form);
            formData.append('input', document.getElementById('Input').value);
            formData.append('Code_Type', document.getElementById('Code_Type').value);
            fetch('/CustomCodeConnector/Save', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    //alert(data.message);
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: "success"
                    });
                    $('#CustomeCodelinkBtn').html('<b  style="color: #3478c0;">Modify Again?</b>');
                    // Hide the modal using jQuery
                    $('#CustomModal').modal('hide');


                })
                .catch(error => console.error('Error:', error));





        }
    });



}



