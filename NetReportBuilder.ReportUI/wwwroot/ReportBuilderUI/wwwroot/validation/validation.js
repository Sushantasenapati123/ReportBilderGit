/*    email address validated using 'onchange='emailValidate(txtEmail,llbError)'' inside controller*/
//and check its true or false if(emailValidate(txtEmail,llbError)==true){ } at javascript

//Email Validation
function emailValidate(txtEmail, llbError) {
  
    var email = $("#" + txtEmail).val();

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(email)) {
        $("#" + llbError).text("");
        // alert("okk");
        return true;
    } else {

        $("#" + llbError).text("Invalid email address.");
        return false;

    }
}
/* phone number validated  using 'onchange=' Phonevalidate(txtPhone,llbError)'' inside controller*/
//and check its true or false if(Phonevalidate(txtPhone,llbError)==true){ } at javascript

//Mobile  No Validation
function Phonevalidate(txtPhone, llbError) {
    var phoneText = $("#" + txtPhone).val();

    var filter = /^([0-9]{10})$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid phone Number");
        return false;
    }
}

//Land Phone Validation
function Land_Phonevalidate(txtPhone, llbError) {
    var phoneText = $("#" + txtPhone).val();

    var filter = /^[0-9]\d{2,4}-\d{6,8}$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid Land Number Hints:544-87878787");
        return false;
    }
}
//Name validation
function Namevalidation(txtName, llbError) {
    var nameText = $("#" + txtName).val();
    var check = (/^[a-zA-Z\s]+$/);
    if (check.test(nameText)) {
        $("#" + llbError).text("");
        return true;
    }
    else {

        $("#" + llbError).text("Invalid Name ");
        return false;
    }

}
function NamevalidationC(txtName, llbError) {
    var nameText = $("#" + txtName).val();
    var check = /^[a-zA-Z. ]+$/;
    if (check.test(nameText)) {
        $("#" + llbError).text("");
        return true;
    }
    else {

        $("#" + llbError).text("Invalid Name ");
        return false;
    }

}

//Pin Validation 
function Pinvalidate(Pincode, lblErrorPin) {
    var Pincodee = $("#" + Pincode).val();

    var filter = /^([0-9]{6})$/;
    if (filter.test(Pincodee)) {
        $("#" + lblErrorPin).text("");
        return true;

    }
    else {

        $("#" + lblErrorPin).text("Invalid pin code");
        return false;
    }
}

//Age Validation(Only Number)
function OnlyNumber(AgeYea, lblErrorAgeYe) {
    var Pincodee = $("#" + AgeYea).val();

    var filter = /^[0-9]{0,50}$/;
    if (filter.test(Pincodee)) {
        $("#" + lblErrorAgeYe).text("");
        return true;

    }
    else {

        $("#" + lblErrorAgeYe).text("Only Number Is Allowed");
        return false;
    }
}

function UserNameValidate(txtPhone, llbError) {
    var phoneText = $("#" + txtPhone).val();

    var filter = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid User Name");
        return false;
    }
}


function StrongPwd(txtPhone, llbError) {
    var phoneText = $("#" + txtPhone).val();

    var filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid Password  Hints:Ghana123@");
        return false;
    }
}

function GstNo(txtPhone, llbError) {
    var phoneText = $("#" + txtPhone).val();

    var filter = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid Gst Number  Hint-18AABCU9603R1ZM");
        return false;
    }



    

}

//Blood Pressure validation
function BPvalidate(txtbp, llbError) {
    var phoneText = $("#" + txtbp).val();

    var filter = /^\b(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)\/(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text("");
        return true;

    }
    else {

        $("#" + llbError).text("Invalid Measure");
        return false;
    }
}
//oxygen validation

function Oxyvalidate(txtoxy, llbError) {
    var phoneText = $("#" + txtoxy).val();

    var filter = /^[1-9]?[0-9]{1}$|^100$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text(" ");
        return true;

    }
    else {

        $("#" + llbError).text("oxygen saturation lavel above 92 is Healthy ");
        return false;
    }
}

//Price validation
function Pricevalidate(txtprice, llbError) {
    var phoneText = $("#" + txtprice).val();

    var filter = /^\d{0,10}[.]?\d{1,10}$/;
    if (filter.test(phoneText)) {
        $("#" + llbError).text(" ");
        return true;

    }
    else {

        $("#" + llbError).text("Enter a valid Amount ");
        return false;
    }
}























//check the validation of textbox is empty or not 
//using 'onkeypress=txtChkValidation('txtBoxID')' inside textbox controller 
//and used at submit time and check its true or false if(txtChkValidation(txtBox)==true){ }
function txtChkValidation(txtBox) {
    if ($("#" + txtBox).val().trim() == "") {
        $("#" + txtBox).css("background-color", "red");
        return false;
    } else {
        $("#" + txtBox).css("background-color", "");
        return true;
    }
}
//this funcitoin copy past on inside file nad call using 'onchange='dropDownValidation(drpID)''
//for this used separeted js file
//function dropDownValidation(id) {
//    var x = $("#" + id).val();
//    if (x == 0) {
//        $("#" + id).css("background-color", "red");
//        return false;
//    } else {
//        $("#" + id).css("background-color", "");
//        return true;
//    }
//    }
