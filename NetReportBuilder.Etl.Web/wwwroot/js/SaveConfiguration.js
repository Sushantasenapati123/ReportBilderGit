function resetForm() {
    document.getElementById('pipelineForm').reset();
}


function changeExecutionModeCustom(element) {
    const hiddenDiv = document.getElementById('hiddenDivCustom');
   
    const weekDay = document.getElementById('weekDayCustom');
    const day = document.getElementById('dayCustom');
    const hour = document.getElementById('hourCustom');
    const minute = document.getElementById('minuteCustom');
    const scheduledHour = document.getElementById('scheduledHourCustom');
    const scheduledMinutes = document.getElementById('scheduledMinutesCustom');


    if (element.value === 'Weekly') {
        hiddenDiv.style.display = 'block'

        hourCustom.style.display = 'none'
        minuteCustom.style.display = 'none'
        scheduledMinutes.style.display = 'none'
        scheduledHour.style.display = 'none'


        hour.style.display = 'block'
        minute.style.display = 'block'
        weekDay.style.display = 'block'
    }
  else  if (element.value === 'Monthly') {
        hiddenDiv.style.display = 'block'

        hourCustom.style.display = 'none'
        minuteCustom.style.display = 'none'
        weekDay.style.display = 'none'
        scheduledHour.style.display = 'none'


        hour.style.display = 'block'
        minute.style.display = 'block'
        dayCustom.style.display = 'block'
    }

    else if (element.value === 'Daily') {
        hiddenDiv.style.display = 'block'

        hourCustom.style.display = 'none'
        minuteCustom.style.display = 'none'
        weekDay.style.display = 'none'
        dayCustom.style.display = 'none'


        hour.style.display = 'block'
        minute.style.display = 'block'
    }

    else if (element.value === 'Hourly') {
        hiddenDiv.style.display = 'block'
        scheduledHour.style.display = 'block'

        scheduledMinutes.style.display = 'none'
        weekDay.style.display = 'none'
        dayCustom.style.display = 'none'

        hour.style.display = 'none'
        minute.style.display = 'none'



    }

    else if (element.value === 'Minutely') {
        hiddenDiv.style.display = 'block'

        scheduledHour.style.display = 'none'
        weekDay.style.display = 'none'
        dayCustom.style.display = 'none'

        hour.style.display = 'none'
        minute.style.display = 'none'

        scheduledMinutes.style.display = 'block'
    }
    else if (element.value === '') {
        hiddenDiv.style.display = 'none'
    }
}

function savePipelineConfigurationCustom() {
    var SaveType = "Insert";
    var ConfigureMessage = "PipeLine was successfully configured";
    var id = getUrlVars()["strid"];

    if (id != undefined) {//Update
        ConfigureMessage = "PipeLine was Updated successfully";
        SaveType = "Update";
    }
    ExportJson();//To store Convax template
   
    
    if ($('#dataSyncModesCustom').val() === "") {
        Swal.fire({
            icon: "warning",
            text: "Please select DataSyncModes!",
        });
        $('#dataSyncModesCustom').addClass('highlight');
        return;
    } else {
        $('#dataSyncModesCustom').removeClass('highlight');
    }

    if ($('#executionModeCustom').val() === "") {
        Swal.fire({
            icon: "warning",
            text: "Please select ExecutionMode",
        });
        $('#executionModeCustom').addClass('highlight');
        return;
    } else {
        $('#executionModeCustom').removeClass('highlight');
        /////////////////////////////Daily///////////////////////////////
        if ($('#executionModeCustom').val() == 'Daily') {
            if ($('#selectedHourCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Hour!",
                });
                $('#selectedHourCustom').addClass('highlight');
                return;
            } else {
                $('#selectedHourCustom').removeClass('highlight');
            }

            if ($('#selectedMinuteCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Minute!",
                });
                $('#selectedMinuteCustom').addClass('highlight');
                return;
            } else {
                $('#selectedMinuteCustom').removeClass('highlight');
            }
        }
        /////////////////////////////Weekly///////////////////////////////
        if ($('#executionModeCustom').val() == 'Weekly') {
            if ($('#selectedWeekDayCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select WeekDay!",
                });
                $('#selectedWeekDayCustom').addClass('highlight');
                return;
            } else {
                $('#selectedWeekDayCustom').removeClass('highlight');
            }

            if ($('#selectedHourCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Hour!",
                });
                $('#selectedHourCustom').addClass('highlight');
                return;
            } else {
                $('#selectedHourCustom').removeClass('highlight');
            }

            if ($('#selectedMinuteCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Minute!",
                });
                $('#selectedMinuteCustom').addClass('highlight');
                return;
            } else {
                $('#selectedMinuteCustom').removeClass('highlight');
            }
        }
        /////////////////////////////Hourly///////////////////////////////
        if ($('#executionModeCustom').val() == 'Hourly') {
            if ($('#selectedScheduledHourCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Hour!",
                });
                $('#selectedScheduledHourCustom').addClass('highlight');
                return;
            } else {
                $('#selectedScheduledHourCustom').removeClass('highlight');
            }
        }
        /////////////////////////////Monthly///////////////////////////////
        if ($('#executionModeCustom').val() == 'Monthly') {
            if ($('#selectedDayCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Day!",
                });
                $('#selectedDayCustom').addClass('highlight');
                return;
            } else {
                $('#selectedDayCustom').removeClass('highlight');
            }

            if ($('#selectedHourCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Hour!",
                });
                $('#selectedHourCustom').addClass('highlight');
                return;
            } else {
                $('#selectedHourCustom').removeClass('highlight');
            }

            if ($('#selectedMinuteCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Minute!",
                });
                $('#selectedMinuteCustom').addClass('highlight');
                return;
            } else {
                $('#selectedMinuteCustom').removeClass('highlight');
            }
        }
        /////////////////////////////Minutely///////////////////////////////
        if ($('#executionModeCustom').val() == 'Minutely') {
            if ($('#selectedScheduledMinuteCustom').val() === "") {
                Swal.fire({
                    icon: "warning",
                    text: "Please Select Minute!",
                });
                $('#selectedScheduledMinuteCustom').addClass('highlight');
                return;
            } else {
                $('#selectedScheduledMinuteCustom').removeClass('highlight');
            }
        }
    }

    if ($('#descriptionCustom').val() === "") {
        Swal.fire({
            icon: "warning",
            text: "Please Write Description",
        });
        $('#descriptionCustom').addClass('highlight');
        return;
    } else {
        $('#descriptionCustom').removeClass('highlight');
    }

    const model = {
        PipelineName: $('#pipelineNameCustom').val() || "",
        DataSourceType: $('#dataSourceTypeCustom').val() || "",
        ExecutionMode: $('#executionModeCustom').val() || "",
        DataSyncModes: $('#dataSyncModesCustom').val(),
        DrowFlowJson: JSON.stringify(currentTemplate, null, 4),
        ExecutionInterval: {
            WeekDay: $('#selectedWeekDayCustom').val() || "",
            Day: $('#selectedDayCustom').val() || 0,
            Hour: $('#selectedHourCustom').val() || 0,
            Minute: $('#selectedMinuteCustom').val() || 0,
            HoursInterval: $('#selectedScheduledHourCustom').val() || 0,
            MinutesInterval: $('#selectedScheduledMinuteCustom').val() || 0
        },
        Description: $('#descriptionCustom').val() || "",
        SaveType: SaveType
    };

    console.log('Model:', model); // Debugging: log the model to the console

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
            fetch('/PipelineConfiguration/Save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(model)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message === 'success') {
                        Swal.fire({
                            title: "Success",
                            text: ConfigureMessage,
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.href = "/PipelineDashBoard/Index";
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: data.message,
                            footer: '<a href="#">Why do I have this issue?</a>'
                        });
                    }
                })
        }
    });
}


