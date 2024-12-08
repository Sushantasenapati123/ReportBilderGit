let connectApiPopup = `<div id="ConnectApi" onclick="ConfigureApi();">
    <div class='blockyleft'>
        <img src="/images/api.jpg" width="50" height="50">
        <p class='blockyname'>Connect to and API</p>
    </div>
    <div class='blockyright'><i class="fas fa-connectdevelop"></i></div>
    <div class='blockydiv'></div>
    <div class='blockyinfo'>Connects to an API</div>
</div>`;


let connectOraclePopup = `<div class='blockyleft'>
    <img src="/images/oracle.png" width="50" height="50">
    <p class='blockyname'>Connect to Oracle Database</p>
</div>
<div class='blockyright'><i class="fas fa-database"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Connects to Oracle Database</div>`;

let connectmssqlPopup = `<div class='blockyleft'>
    <img src="/images/mssql.jpg" width="50" height="50">
    <p class='blockyname'>Connect to MS SQL Database</p>
</div>
<div class='blockyright'><i class="fas fa-database"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Connects to MS SQL Database</div>`;


let connectmysqlPopup = `<div class='blockyleft'>
    <img src="/images/mysql.png" width="50" height="50">
    <p class='blockyname'>Connect to My SQL Database</p>
</div>
<div class='blockyright'><i class="fas fa-database"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Connects to My SQL Database</div>`;

let connectcustomcodePopup = `<div class='blockyleft'>
    <img src="/images/codeeditor.png" width="50" height="50">
    <p class='blockyname'>Connect to the Code Editor</p>
</div>
<div class='blockyright'><i class="fas fa-code"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Connects to Custom Code Editor</div>`;



let connectdataMappingPopup = `<div class='blockyleft'>
    <img src="/images/datamapping.png" width="50" height="50">
    <p class='blockyname'>Data Mapping Process</p>
</div>
<div class='blockyright'><i class="fas fa-database"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Data Mapping Process</div>`;

let connectsaveconfigurationPopup = `<div class='blockyleft'>
    <img src="/images/saveconfiguration.png" width="50" height="50">
    <p class='blockyname'>Save the Pipeline configuration</p>
</div>
<div class='blockyright'><i class="fas fa-save"></i></div>
<div class='blockydiv'></div>
<div class='blockyinfo'>Save the Pipeline configuration</div>`;



let actionsInnerHtml = `<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="6">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"> <img src="/images/datamapping.png" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">Data Mapping</p>
            <p class="blockdesc">Data Mapping Process</p>
        </div>
    </div>
</div>
`;
let loggersInnerHtml = `<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="7">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"> <img src="/images/saveconfiguration.png" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">Save Configuration</p>
            <p class="blockdesc">Save Configuration</p>
        </div>
    </div>
</div>
`;

let triggersInnerHtml = `
<div class="blockelem create-flowy noselect" >
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="1">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"><img src="/assets/api.svg" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">Api</p>
            <p class="blockdesc">Connects to an API</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="2">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"><img src="/images/oracle.png" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">Oracle </p>
            <p class="blockdesc">Connects to Oracle Database</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="3">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"> <img src="/images/mssql.jpg" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">SQL Server</p>
            <p class="blockdesc">Connects to SQL Server Database</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="4">
   <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"><img src="/images/mysql.png" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">My SQL</p>
            <p class="blockdesc">Connects to the My SQL Database</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect">
    <input type="hidden" name="blockelemtype" class="blockelemtype" value="5">
    <div class="grabme">
                    <img src="/assets/grabme.svg">
    </div>
    <div class="blockin">
        <div class="blockico"><img src="/images/codeeditor.png" width="30" height="30"></div>
        <div class="blocktext">
            <p class="blocktitle">Custom Code</p>
            <p class="blockdesc">Opens the Custom Code Editor</p>
        </div>
    </div>
</div>
`;
function ConnectAPI() {
    
           $.ajax({
               url: '/ETLDashboard/ConnectApi', // URL of the action method
            type: 'GET', // HTTP method
            success: function (result) {
                $('#SelectedAction').html(result); // Insert the loaded content into the container div
            },
            error: function (error) {
                console.error('Error loading partial view:', error);
            }
        });
   
}
document.addEventListener("DOMContentLoaded", function () {
    var rightcard = false;
    var tempblock;
    var tempblock2;


    
    document.getElementById("blocklist").innerHTML = triggersInnerHtml;
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
            drag.innerHTML += connectApiPopup;
        } else if (drag.querySelector(".blockelemtype").value == "2") {
            drag.innerHTML += connectOraclePopup;
        } else if (drag.querySelector(".blockelemtype").value == "3") {
            drag.innerHTML += connectmssqlPopup;
        } else if (drag.querySelector(".blockelemtype").value == "4") {
            drag.innerHTML += connectmysqlPopup;
        } else if (drag.querySelector(".blockelemtype").value == "5") {
            drag.innerHTML += connectcustomcodePopup;
        } else if (drag.querySelector(".blockelemtype").value == "6") {
            drag.innerHTML += connectdataMappingPopup;
        } else if (drag.querySelector(".blockelemtype").value == "7") {
            drag.innerHTML += connectsaveconfigurationPopup;
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
            document.getElementById("blocklist").innerHTML = triggersInnerHtml;
        } else if (this.getAttribute("id") == "actions") {
            document.getElementById("blocklist").innerHTML = actionsInnerHtml;
        } else if (this.getAttribute("id") == "loggers") {
            document.getElementById("blocklist").innerHTML = loggersInnerHtml;
        }
    }
    addEventListenerMulti("click", disabledClick, false, ".side");
    document.getElementById("close").addEventListener("click", function () {

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
function ConfigureApi() {
    $('#myModal').modal('show');
    ConnectApi();
}

function CloseModal() {
    $('#myModal').modal('hide');
}