





document.addEventListener("DOMContentLoaded", function () {
    var rightcard = false;
    var tempblock;
    var tempblock2;
    document.getElementById("blocklist").innerHTML = '   </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/web-code-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">Custom CodeEditor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>         </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/rest-api-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">API Connector</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/cluster-data-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">Data Mapping</p><p class="blockdesc">Triggers when somebody visits a specified page</p>         </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="20"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/save.svg"></div><div class="blocktext">                        <p class="blocktitle">Save Configuration    </p><p class="blockdesc">Triggers when somebody visits a specified page</p>  ';



    flowy(document.getElementById("canvas"), drag, release, snapping);


    function addEventListenerMulti(type, listener, capture, selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }
    function snapping(drag, first) {

        var grab = drag.querySelector(".grabme");
        grab.parentNode.removeChild(grab);
        var blockin = drag.querySelector(".blockin");
        blockin.parentNode.removeChild(blockin);
        if (drag.querySelector(".blockelemtype").value == "1") {
            drag.innerHTML += "<div  class='blockyleft'><img src='/assets/actionblue.svg'><p class='blockyname'>Custom CodeEditor</p></div><div class='blockyright'><img src='/assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'><span>Are You Want Write</span>    <a id='CustomeCodelinkBtn' onclick='OpenModal(1)' class='link-button'><b style='color: #3478c0;'>Code?</b?</a></div>";
        }

        else if (drag.querySelector(".blockelemtype").value == "2") {
            drag.innerHTML += "<div  class='blockyleft'><img src='/assets/actionblue.svg'><p class='blockyname'>API Connector</p></div><div class='blockyright'><img src='/assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'><span>Are You Want to</span>    <a id='ApilinkBtn' onclick='OpenModal(2)' class='link-button'><b style='color: #3478c0;'>Configure?</b?</a></div>";
        }

      

        else if (drag.querySelector(".blockelemtype").value == "10") {
            drag.innerHTML += "<div  class='blockyleft'><img src='/assets/actionblue.svg'><p class='blockyname'>Mapping Data</p></div><div class='blockyright'><img src='/assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'><span>Are You Want to</span>    <a id='MappinglinkBtn' onclick='OpenModal(10)' class='link-button'><b style='color: #3478c0;'>Mapping Data?</b?</a></div>";
        }

      
        else if (drag.querySelector(".blockelemtype").value == "20") {
            drag.innerHTML += "<div  class='blockyleft'><img src='/assets/actionblue.svg'><p class='blockyname'>Save Configuration</p></div><div class='blockyright'><img src='/assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'><span>Are You Want to</span>    <a id='SavelinkBtn' onclick='OpenModal(20)' class='link-button'><b  style='color: #3478c0;'> Save?</b?</a></div>";
        }


        return true;
    }
    function drag(block) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }
    function release() {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }
    var disabledClick = function () {
        document.querySelector(".navactive").classList.add("navdisabled");
        document.querySelector(".navactive").classList.remove("navactive");
        this.classList.add("navactive");
        this.classList.remove("navdisabled");
        if (this.getAttribute("id") == "triggers") {


            document.getElementById("blocklist").innerHTML = '            </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/rest-api-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">API Connector</p><p class="blockdesc">Triggers when somebody visits a specified page</p>                    </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/cluster-data-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">Data Mapping</p><p class="blockdesc">Triggers when somebody visits a specified page</p>            </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="20"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/save.svg"></div><div class="blocktext">                        <p class="blocktitle">Save Configuration    </p><p class="blockdesc">Triggers when somebody visits a specified page</p>  ';
        }
        else if (this.getAttribute("id") == "actions") {

          

            document.getElementById("blocklist").innerHTML = '</div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/cluster-data-icon.svg"></div><div class="blocktext">                        <p class="blocktitle">Data Mapping</p><p class="blockdesc">Triggers when somebody visits a specified page</p>    ';
        }

        else if (this.getAttribute("id") == "loggers") {

            document.getElementById("blocklist").innerHTML = '</div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="20"><div class="grabme"><img src="/assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="/assets1/save.svg"></div><div class="blocktext">                        <p class="blocktitle">Save Configuration    </p><p class="blockdesc">Triggers when somebody visits a specified page</p>    ';
        }
    }
    addEventListenerMulti("click", disabledClick, false, ".side");

    document.getElementById("close").addEventListener("click", function () {

        alert("98");
        if (rightcard) {
            rightcard = false;
            document.getElementById("properties").classList.remove("expanded");
            setTimeout(function () {
                document.getElementById("propwrap").classList.remove("itson");
            }, 300);
            tempblock.classList.remove("selectedblock");
        }
    });

    document.getElementById("removeblock").addEventListener("click", function () {
        flowy.deleteBlocks();
    });
    var aclick = false;
    var noinfo = false;
    var beginTouch = function (event) {
        aclick = true;
        noinfo = false;
        if (event.target.closest(".create-flowy")) {
            noinfo = true;
        }
    }
    var checkTouch = function (event) {
        aclick = false;
    }
    var doneTouch = function (event) {

        if (event.type === "mouseup" && aclick && !noinfo) {
            if (!rightcard && event.target.closest(".block") && !event.target.closest(".block").classList.contains("dragging")) {
                tempblock = event.target.closest(".block");
                rightcard = true;
                //document.getElementById("properties").classList.add("expanded");
                document.getElementById("propwrap").classList.add("itson");
                tempblock.classList.add("selectedblock");

            }
        }
    }
    addEventListener("mousedown", beginTouch, false);
    addEventListener("mousemove", checkTouch, false);
    addEventListener("mouseup", doneTouch, false);
    addEventListenerMulti("touchstart", beginTouch, false, ".block");
});


function OpenModal(s) {
    if (s == 1) {//Custome Code
        $('#CustomModal').modal('show');
        OpenCustomeCodeView();

    }
   
    if (s == 2) {//configure api
        $('#APIModal').modal('show');
        ConfigureApi();
        $("#exampleModalLabel").html("Configure API");
    }
    else if (s == 10) {//Mapping Data
        $('#MappingModal').modal('show');
       // $("#exampleModalLabel").html("Data Mapping");
        MappingData();
    }
    else if (s == 20) {//save configuration
        $('#SaveConfigurationModal').modal('show');
        OpenSaveConfigurationView();
    }
  
}



function MappingData() {


    if ($('#MappinglinkBtn').text() == 'Mapping Data?') {

        $.ajax({
            url: '/ETLDashboard/MappingData', // Replace with your controller and action
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("MappingModalBody");
                modalBody.innerHTML = result;




            },
            error: function (xhr, status, error) {
                console.error('Error loading partial view:', error);
            }
        });
    }

}


function OpenSaveConfigurationView() {

  
    if ($('#SavelinkBtn').text() == ' Save?') {
     
        $.ajax({
            url: '/ETLDashboard/SaveConfiguration', // Replace with your controller and action
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("SaveConfigurationModalBody");
                modalBody.innerHTML = result;




            },
            error: function (xhr, status, error) {
                console.error('Error loading partial view:', error);
            }
        });

    }
}



function ConfigureApi() {

    
    if ($('#ApilinkBtn').text() == 'Configure?') {

        $.ajax({
            url: '/ETLDashboard/ConnectApi', // Replace with your controller and action
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("APIModalBody");
                modalBody.innerHTML = result;

                lblbind();
                addRow();

                bindTableEvents();


            },
            error: function (xhr, status, error) {
                console.error('Error loading partial view:', error);
            }
        });
    }

}



function OpenCustomeCodeView() {


    if ($('#CustomeCodelinkBtn').text() == 'Code?') {

        $.ajax({
            url: '/ETLDashboard/CustomCodeEditor', // Replace with your controller and action
            type: 'GET',
            success: function (result) {
                let modalBody = document.getElementById("CustomModalBody");
                modalBody.innerHTML = result;




            },
            error: function (xhr, status, error) {
                console.error('Error loading partial view:', error);
            }
        });

    }
}