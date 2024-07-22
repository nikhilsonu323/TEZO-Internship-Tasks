"use strict";

var mode, prevEmail = "", prevEmpno = "", errors = new Set();
var form = document.querySelector("#employeeForm");
function loadAddEmployee() {
    var _a;
    checkMode(); //view employee details or edit employee details or add employee
    setAddEmployeeMode();
    handleImageInput();
    setManagerNames();
    addEmployeeFormSubmit();
    (_a = document.getElementById("phoneNumber")) === null || _a === void 0 ? void 0 : _a.addEventListener("keypress", function (e) {
        var code = e.key.charCodeAt(0);
        if (!((code >= 48 && code <= 57) || code == 32 || code == 45 || code == 43 || code == 69))
            e.preventDefault();
    });
}
//Pending...
function setDatMaxValue(){
    document.getElementById("dob")?.addEventListener("change",(event)=>{
        if(event.target instanceof HTMLInputElement){
            const enteredDate = new Date(event.target.value);
            const today = new Date();
            if(enteredDate>today){
                event.target.value = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate().toString()
                // console.log(a)
            }
        }
    })
}
function toEmployees() {
    window.location.href = "/Employees";
}
function setManagerNames() {
    var managerSelect = document.querySelector("#assignManager");
    if (managerSelect instanceof HTMLSelectElement) {
        var employeesData = getEmployeeData();
        var index = -1, optHtml = "";
        if (mode == 1) {
            var value = localStorage.getItem("index");
            index = value ? parseInt(value) : -1;
        }
        for (var i = 0; i < employeesData.length; i++) {
            if (i != index)
                optHtml += "<option>".concat(employeesData[i].user, "</option>");
        }
        managerSelect.innerHTML += optHtml;
    }
}
function checkMode() {
    var editData = localStorage.getItem("editData");
    var viewData = localStorage.getItem("viewDetails");
    if (!editData && !viewData) {
        //addEmployee
        mode = 0;
    }
    else if (!viewData) {
        //editEmployee
        mode = 1;
    }
    else {
        //viewDetails
        mode = 2;
    }
}
function setInnerText(query, text) {
    var element = document.querySelector(query);
    if (element instanceof HTMLElement) {
        element.innerText = text;
    }
}
function setAddEmployeeMode() {
    var _a, _b, _c, _d, _e;
    if (mode == 0) {
        (_a = document.getElementById("editProfile")) === null || _a === void 0 ? void 0 : _a.classList.add("ds-none");
        (_b = document.getElementById("employeeForm")) === null || _b === void 0 ? void 0 : _b.classList.remove("flex");
        var imageInput = document.querySelector(".image-input");
        imageInput === null || imageInput === void 0 ? void 0 : imageInput.classList.add("flex-center");
        imageInput === null || imageInput === void 0 ? void 0 : imageInput.classList.add("gap-2r");
    }
    else if (mode == 1) {
        setInnerText(".message", "Employee details Updated Sucessfully");
        setInnerText("#formHeading", "EDIT EMPLOYEE");
        setInnerText("button[type='submit']", "Update Employee");
        (_c = document.getElementById("addProfile")) === null || _c === void 0 ? void 0 : _c.classList.add("ds-none");
        var userDetails = localStorage.getItem("editData");
        if (userDetails)
            showEmployeeDetails(JSON.parse(userDetails));
        localStorage.removeItem("editData");
    }
    else {
        setInnerText("#formHeading", "VIEW EMPLOYEE DETAILS");
        (_d = document.getElementById("uploadProfile")) === null || _d === void 0 ? void 0 : _d.classList.add("ds-none");
        (_e = document.getElementById("formBtns")) === null || _e === void 0 ? void 0 : _e.classList.add("ds-none");
        var userDetails = localStorage.getItem("viewDetails");
        if (userDetails)
            showEmployeeDetails(JSON.parse(userDetails));
        localStorage.removeItem("viewDetails");
        readOnlyMode();
    }
}
function showEmployeeDetails(userData) {
    // let inputFieldIds = new Set(["empNo","firstName","lastName","email","phoneNumber","dob","joiningDate"]);
    var inputId;
    for (inputId in userData) {
        // if(inputFieldIds.has(inputId))
        setInputValue(document.getElementById(inputId), userData[inputId]);
    }
    prevEmail = userData.email;
    prevEmpno = userData.empNo;
    setImageSrc("profileImg", userData.imageSrc);
    selectOption("inputLocation", userData.location);
    selectOption("inputDepartment", userData.department);
    selectOption("title", userData.role);
    selectOption("assignProject", userData.assignProject);
    selectOption("assignManager", userData.assignManager);
}
function setImageSrc(id, url) {
    var image = document.getElementById(id);
    if (image instanceof HTMLImageElement) {
        image.src = url;
    }
}
function setInputValue(element, value) {
    if (element instanceof HTMLInputElement) {
        element.value = value;
    }
}
function setReadOnly(element) {
    if (element instanceof HTMLInputElement) {
        element.readOnly = true;
    }
}
function setDisabledTrue(element) {
    if (element instanceof HTMLSelectElement) {
        element.disabled = true;
    }
}
function selectOption(id, value) {
    var _a;
    (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.querySelectorAll("option").forEach(function (e) {
        if (e.innerText == value) {
            e.selected = true;
        }
    });
}
function readOnlyMode() {
    //Read only mode restricts user from modifying data
    var inputFieldIds = ["empNo", "firstName", "lastName", "email", "phoneNumber", "dob", "joiningDate"];
    var selectFieldIds = ["inputLocation", "inputDepartment", "title", "assignProject", "assignManager"];
    for (var inputId of inputFieldIds) {
        setReadOnly(document.getElementById(inputId));
    }
    for (var selectId of selectFieldIds) {
        setDisabledTrue(document.getElementById(selectId));
    }
}
function validateFnameListener() {
    validateName("firstName");
}
function validateLnameListener() {
    validateName("lastName");
}
function handleErrorMsg(valid, inputId) {
    if (valid) {
        clearErrors(inputId);
        errors.delete(inputId);
    }
    else
        errors.add(inputId);
}
function validateEmpno() {
    var inputId = "empNo";
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var empNo = inputElement.value.trim(), valid = true;
    if (empNo.length == 0) {
        showValidationError(".".concat(inputId, "-error"), "This Field is required", inputElement);
        valid = false;
    }
    var regEmpno = /^TZ[0-9]{4,}$/;
    var match = regEmpno.test(empNo);
    if (valid && !match) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Employee Number (TZ0000..)", inputElement);
        valid = false;
    }
    var empNumbers = localStorage.getItem("empNos");
    var empNos = new Set(JSON.parse(empNumbers ? empNumbers : "[]"));
    if (valid && (mode == 0 && empNos.has(empNo)) || (mode == 1 && empNo != prevEmpno && empNos.has(empNo))) {
        showValidationError(".".concat(inputId, "-error"), "Employee Number already exists", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function validateName(inputId) {
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var name = inputElement.value.trim(), valid = true;
    if (name.length == 0) {
        showValidationError(".".concat(inputId, "-error"), "This Field is required", inputElement);
        valid = false;
    }
    var regName = /^[a-zA-Z]+([ ]?[a-zA-Z]+){0,2}$/;
    var match = regName.test(name);
    if (valid && !match) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Name", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function validateEmail() {
    var inputId = "email";
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var email = inputElement.value.trim(), valid = true;
    if (email.length == 0) {
        showValidationError(".".concat(inputId, "-error"), "This Field is required", inputElement);
        valid = false;
    }
    var regEmail = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9]+[.][a-zA-Z]+$/;
    var match = regEmail.test(email);
    if (valid && !match) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Email", inputElement);
        valid = false;
    }
    var userEmails = localStorage.getItem("emails");
    var emails = new Set(JSON.parse(userEmails ? userEmails : "[]"));
    if (valid && (mode == 0 && emails.has(email)) || (mode == 1 && email != prevEmail && emails.has(email))) {
        showValidationError(".".concat(inputId, "-error"), "Email already exists", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function validatephoneNumber() {
    var inputId = "phoneNumber";
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var phoneNumber = inputElement.value.trim(), valid = true;
    var regPhone = /^(\+[0-9]{1,3}[- ]?)?[6-9]{1}[0-9]{9}$/;
    var match = regPhone.test(phoneNumber);
    if (phoneNumber.length != 0 && !match) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Mobile Number", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function validateDate() {
    var inputId = "joiningDate";
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var dateString = inputElement.value.trim(), valid = true;
    if (dateString.length == 0) {
        showValidationError(".".concat(inputId, "-error"), "This Field is required", inputElement);
        valid = false;
    }
    var currentDate = new Date();
    var date = new Date(dateString);
    if (valid && date > currentDate) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Date", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function validateDob() {
    var inputId = "dob";
    var inputElement = form[inputId];
    if (!(inputElement instanceof HTMLInputElement))
        return;
    var dateString = inputElement.value.trim(), valid = true;
    var currentDate = new Date();
    var date = new Date(dateString);
    if (date.toString() != "Invalid Date" && date > currentDate) {
        showValidationError(".".concat(inputId, "-error"), "Enter valid Date", inputElement);
        valid = false;
    }
    handleErrorMsg(valid, inputId);
}
function clearErrors(inputId) {
    var _a, _b;
    var errorClassName = ".".concat(inputId, "-error");
    (_a = document.querySelector(errorClassName)) === null || _a === void 0 ? void 0 : _a.classList.add("ds-none");
    var li = (_b = document.querySelector(errorClassName)) === null || _b === void 0 ? void 0 : _b.parentNode;
    if (li instanceof HTMLElement)
        li.classList.remove("br-red");
}
function showValidationError(errorMsgClassName, msg, inputElement) {
    var alertImg = "<img src=\"/images/alert.png\" alt=\"\">";
    var errorElement = document.querySelector(errorMsgClassName);
    if (!(errorElement instanceof HTMLParagraphElement))
        return;
    errorElement.classList.remove("ds-none");
    errorElement.innerHTML = alertImg + msg;
    var li = inputElement.parentNode;
    if (!(li instanceof HTMLElement))
        return;
    li.classList.add("br-red");
}
function addInputValidationListeners() {
    var inputs = ["empNo", "firstName", "lastName", "email", "phoneNumber", "joiningDate", "dob"];
    form[inputs[0]].addEventListener("keyup", validateEmpno);
    form[inputs[1]].addEventListener("keyup", validateFnameListener);
    form[inputs[2]].addEventListener("keyup", validateLnameListener);
    form[inputs[3]].addEventListener("keyup", validateEmail);
    form[inputs[4]].addEventListener("keyup", validatephoneNumber);
    form[inputs[5]].addEventListener("change", validateDate);
    form[inputs[6]].addEventListener("change", validateDob);
}
function addEmployeeFormSubmit() {
    form.onsubmit = function (event) {
        event.preventDefault();
        if (mode == 2)
            return;
        addInputValidationListeners();
        validateEmpno();
        validateName("firstName");
        validateName("lastName");
        validateEmail();
        validatephoneNumber();
        validateDate();
        validateDob();
        if (errors.size > 0)
            return;
        storeData();
    };
}
function handleImageInput() {
    var profile = document.getElementById("profileInput");
    profile.addEventListener("change", function () {
        var fileReader = new FileReader();
        if (profile.files) {
            fileReader.readAsDataURL(profile.files[0]);
            fileReader.onload = function () {
                if (typeof fileReader.result == "string")
                    setImageSrc("profileImg", fileReader.result);
            };
        }
    });
}
function getInputValue(id) {
    var inputElement = document.getElementById(id);
    if (!(inputElement instanceof HTMLInputElement))
        return "";
    return inputElement.value.trim();
}
function getSelectedValue(id) {
    var inputElement = document.getElementById(id);
    if (!(inputElement instanceof HTMLSelectElement))
        return "";
    return inputElement.options[inputElement.selectedIndex].innerText;
}
function getImageSrc(id) {
    var imageElement = document.getElementById(id);
    if (!(imageElement instanceof HTMLImageElement))
        return "";
    return imageElement.src;
}
function storeData() {
    var _a;
    var firstName = getInputValue("firstName"), lastName = getInputValue("lastName");
    var email = getInputValue("email"), phoneNumber = getInputValue("phoneNumber"), empNo = getInputValue("empNo");
    var joiningDate = getInputValue("joiningDate"), dob = getInputValue("dob");
    var user = firstName + " " + lastName;
    //retriving select tag values 
    var location = getSelectedValue("inputLocation"), department = getSelectedValue("inputDepartment"), role = getSelectedValue("title");
    var assignManager = getSelectedValue("assignManager"), assignProject = getSelectedValue("assignProject");
    var imageSrc = getImageSrc("profileImg");
    var status = "Active";
    var newEmployeeData = { user: user, firstName: firstName, lastName: lastName, location: location, department: department, status: status, role: role, empNo: empNo, joiningDate: joiningDate, imageSrc: imageSrc, assignManager: assignManager, assignProject: assignProject, email: email, phoneNumber: phoneNumber, dob: dob };
    var employeesDataString = localStorage.getItem("employeeData");
    var employeesData = [];
    if (employeesDataString) {
        employeesData = JSON.parse(employeesDataString);
    }
    if (mode == 1) {
        var value = localStorage.getItem("index");
        if (value) {
            var index = parseInt(value);
            employeesData[index] = newEmployeeData;
        }
    }
    else {
        employeesData = employeesData.concat([newEmployeeData]);
    }
    localStorage.setItem("employeeData", JSON.stringify(employeesData));
    if (prevEmail != email && mode == 1)
        delFromLocalStorage("emails", prevEmail);
    if (prevEmpno != empNo && mode == 1)
        delFromLocalStorage("empNos", prevEmpno);
    addDataToLocalStorage(email, "emails");
    addDataToLocalStorage(empNo, "empNos");
    (_a = document.querySelector(".message")) === null || _a === void 0 ? void 0 : _a.classList.add("success");
    form.reset();
    setImageSrc("profileImg", "/images/user3.png");
    setTimeout(function () {
        var _a;
        (_a = document.querySelector(".message")) === null || _a === void 0 ? void 0 : _a.classList.remove("success");
        toEmployees();
    }, 1000);
}
function addDataToLocalStorage(value, name) {
    var dataSet = new Set(), localStorageValue = localStorage.getItem(name);
    if (localStorageValue) {
        dataSet = new Set(JSON.parse(localStorageValue));
    }
    dataSet.add(value);
    var dataArr = Array.from(dataSet);
    localStorage.setItem(name, JSON.stringify(dataArr));
}
