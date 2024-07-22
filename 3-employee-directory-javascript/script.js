let countOfSelectedCheckboxes = 0,sortedColumnNumber = null;
let tableRowsCount, employeesTableData, lettersToDisplay = [], filteredTableData;
let filter = {status: new Set(),location: new Set(),department: new Set()}; 
let isFilterActive = false;countOfActiveFilters = 0,overlayedEllipisis = null;

function loadAlphabets() {
    let htmlForLetters = ``;
    for (let i = 0; i < 26; i++) {
        htmlForLetters += `<span class="letter gray-letter" >${String.fromCharCode(65 + i)}</span>`;
    }
    document.getElementsByClassName("alphabets")[0].innerHTML += htmlForLetters;
}

function loadEmployees(){
    loadAlphabets();
    employeesTableData = getEmployeeData();
    displayTableRows(employeesTableData);
    addFilterOptionsHtml();
    addlistenerForFiltersAndTable();
    console.log(employeesTableData);

}

function getEmployeeData() {
    let employeeDetails = localStorage.getItem("employeeData");
    employeeDetails = JSON.parse(employeeDetails);
    if (employeeDetails && employeeDetails.length > 0) {
        return employeeDetails;
    }
    return [];
}

function setCountOfSelectedCheckboxes(count) {
    countOfSelectedCheckboxes = count;
    //Modifying main check Box
    if (tableRowsCount == countOfSelectedCheckboxes && tableRowsCount != 0) {
        document.getElementById('mainCheckbox').checked = true;
    }
    else {
        document.getElementById('mainCheckbox').checked = false;
    }

    //Modifying delete button
    if (count > 0) {
        let delBtn = document.querySelector('.delete');
        delBtn.disabled = false;
        delBtn.classList.replace("del-dis", "del-act");
    }
    else {
        let delBtn = document.querySelector('.delete')
        delBtn.disabled = true;
        delBtn.classList.replace("del-act", "del-dis");
    }
}

function delFromLocalStorage(name,value){
    let dataSet = new Set(JSON.parse(localStorage.getItem(name)));
    dataSet.delete(value);
    let dataArr = [...dataSet];
    localStorage.setItem(name,JSON.stringify(dataArr));

}

function deleteElement(tableRow){
    let empNo = tableRow.querySelector('span[name=empId]').innerText;
    for (let i = 0; i < employeesTableData.length; i++) {
        if (employeesTableData[i].empNo == empNo) {
            delFromLocalStorage("emails",employeesTableData[i].email);
            delFromLocalStorage("empNos",employeesTableData[i].empNo);
            employeesTableData.splice(i, 1);
            break;
        }
    }
    tableRow.remove();
}

function deleteTableRows() {
    checkboxes = document.getElementsByClassName("user-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        let checkBox = checkboxes[i];
        if (checkBox.checked) {
            deleteElement(checkBox.parentNode.parentNode)
            i -= 1;
        }
    }
    localStorage.setItem("employeeData",JSON.stringify(employeesTableData));
    //decreasing the count by number of rows deleted
    tableRowsCount -= countOfSelectedCheckboxes;
    setCountOfSelectedCheckboxes(0);
    //just updating the data in filteredTableData array
    filterTableRows(true);
    handleEmptyTableMsg();
}


function addlistenerForFiltersAndTable() {
    //For select all checkBox
    document.getElementById('mainCheckbox').addEventListener('click', (e) => {
        let checkboxes = document.getElementsByClassName("user-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = e.target.checked;
        }
        setCountOfSelectedCheckboxes(e.target.checked ? tableRowsCount : 0);
    })

    //For delete button over table
    document.querySelector('.delete').addEventListener('click', deleteTableRows);

    //For letters in filter
    let filterLetters = document.getElementsByClassName('letter');
    for (let i = 0; i < filterLetters.length; i++) {
        filterLetters[i].addEventListener('click', (e) => {
            if (e.target.classList.contains("gray-letter")) {
                e.target.classList.replace("gray-letter", "red-letter");
                lettersToDisplay.push(e.target.innerText);
            }
            else {
                e.target.classList.replace("red-letter", "gray-letter");
                let char = e.target.innerText;
                for (let j = 0; j < lettersToDisplay.length; j++) {
                    if (lettersToDisplay[j] == char) {
                        lettersToDisplay.splice(j, 1);
                    }
                }
            }
            //handling filter icon svg stroke
            let filterIcon = document.getElementById("filterIcon");
            if (lettersToDisplay.length == 0 && filterIcon.classList.contains("stroke-red"))
            filterIcon.classList.replace("stroke-red", "stroke-gray");
            else if (lettersToDisplay.length != 0 && filterIcon.classList.contains("stroke-gray"))
                filterIcon.classList.replace("stroke-gray", "stroke-red");
            filterTableRows();
        })
    }
    
    //Listener for filter icon
    document.getElementById("filterIcon").addEventListener("click",(event)=>{
        if(event.target.classList.contains("stroke-red")){
            document.querySelectorAll(".letter.red-letter").forEach(e => {
                e.classList.replace("red-letter","gray-letter");
            })
            event.target.classList.replace("stroke-red","stroke-gray")
            lettersToDisplay = [];
            filterTableRows();
        }
    });

    //For search bar
    document.getElementById("searchText").addEventListener('keyup', (event) => {
        let text = event.target.value;
        if(text=="")
            filterTableRows();
        else{
            let filteredTableData = employeesTableData.filter(e => e.user.toLowerCase().includes(text.toLowerCase()) || e.empNo.toLowerCase().includes(text.toLowerCase()) || e.location.toLowerCase().includes(text.toLowerCase()) || e.department.toLowerCase().includes(text.toLowerCase()) || e.role.toLowerCase().includes(text.toLowerCase()) || e.email.toLowerCase().includes(text.toLowerCase()) || e.status.toLowerCase().includes(text.toLowerCase()));
            displayTableRows(filteredTableData);
        }
    })
}

function filterEmployeesOnOptions(){
    if(countOfActiveFilters == 1){
        if (filter.status.size>0) {
            filteredTableData = employeesTableData.filter(row => filter.status.has(row.status));
        }
        else if(filter.location.size>0){
            filteredTableData = employeesTableData.filter(row => filter.location.has(row.location));
        }
        else{
            filteredTableData = employeesTableData.filter(row => filter.department.has(row.department));
        }
    }

    else if(countOfActiveFilters == 2){
        if(filter.status.size == 0){
            filteredTableData = employeesTableData.filter(row => filter.location.has(row.location) && filter.department.has(row.department));
        }
        else if(filter.location.size == 0){
            filteredTableData = employeesTableData.filter(row => filter.location.has(row.status) &&  filter.department.has(row.department));
        }
        else{
            filteredTableData = employeesTableData.filter(row => filter.status.has(row.status) &&  filter.location.has(row.location));
        }
    }

    else{
        filteredTableData = employeesTableData.filter(row => filter.status.has(row.status) &&  filter.location.has(row.location) && filter.department.has(row.department))
    }
}


function filterTableRows(justUpdateArray) {
    //From filters
    filteredTableData = employeesTableData;
    if(isFilterActive)
        filterEmployeesOnOptions();
    let x = [];
    //Letters starts with
    if (lettersToDisplay.length > 0) {
        for (let i = lettersToDisplay.length - 1; i >= 0; i--) {
            x = x.concat(filteredTableData.filter(e => e.user.toLowerCase().startsWith(lettersToDisplay[i].toLowerCase())));
        }
        filteredTableData = x;
    }
    if(!justUpdateArray)
        displayTableRows(filteredTableData);
}

function addFilterOptions(filterName){
    let dataSet = new Set(),filtersClassNames = [".status-options",".location-options",".department-options"],className=`.${filterName}-options`;
    let filtterOptionsHtml = ``,filterOptions = document.querySelector(className);
    for (let i = 0; i < employeesTableData.length; i++) {
        dataSet.add(employeesTableData[i][filterName]);
    }
    dataSet.forEach(value => filtterOptionsHtml += `<option class="opt-bg-white" value=${value}>${value}</option>`);
    filterOptions.innerHTML = filtterOptionsHtml;
    setEqualWidth(document.querySelector(`.dropdown.${filterName}`),filterOptions);
    filterOptions.classList.add("ds-none");
    //Event listener to view options on click 
    document.querySelector(`.${filterName}-filter`).addEventListener("click",(event)=>{
        event.stopPropagation();
        filtersClassNames.forEach(value => {
            if(value!=className)
                document.querySelector(value).classList.add("ds-none");
            else
                document.querySelector(value).classList.toggle("ds-none");
        })
    })
    handleFilterOptionsClick(document.querySelectorAll(`${className} option`),filterName);
}

function addFilterOptionsHtml() {
    addFilterOptions("status");
    addFilterOptions("location");
    addFilterOptions("department");

    document.addEventListener("click",()=>{
        document.querySelector(".status-options").classList.add("ds-none");
        document.querySelector(".location-options").classList.add("ds-none");
        document.querySelector(".department-options").classList.add("ds-none");
        hideEllipisisOverlay();
    })
    
    handleFilterButtons();
    
    //Apply button in filter
    document.getElementById("apply").addEventListener("click", () => {
        isFilterActive = true;
        handleFilterButtons();
        filterTableRows();
    })
    
    //Delete button in filter
    document.getElementById("reset").addEventListener("click", () => {
        isFilterActive = false;
        countOfActiveFilters = 0;
        let filterNames = ["status","location","department"];
        for (let i = 0; i < filterNames.length; i++) {
            filter[filterNames[i]].clear();
            displayCountOfFilterOptionsSelected(filterNames[i]);
        }
        handleFilterButtons();
        document.querySelectorAll(".opt-bg-blue").forEach(e =>{
            e.classList.replace("opt-bg-blue","opt-bg-white");
        })
        filterTableRows();
    })    
}
function hideEllipisisOverlay(){
    if(overlayedEllipisis!=null)
        overlayedEllipisis.classList.add("ds-none");
}
function hideFilterOptions(){
    document.querySelector(".status-options").classList.add("ds-none");
    document.querySelector(".department-options").classList.add("ds-none");
    document.querySelector(".location-options").classList.add("ds-none");
}

function setEqualWidth(a,b){
    let width = Math.max(a.offsetWidth,b.offsetWidth)+30+"px";
    a.style.width = width;
    if(b.offsetHeight > 250)
        b.style.overflowX = "auto";
    b.style.width = width;
}

function handleFilterButtons(){
    let applyBtn = document.getElementById("apply");
    let resetBtn = document.getElementById("reset");
    if(countOfActiveFilters==0){
       applyBtn.style.opacity = 0.4;
       applyBtn.disabled = true;
    }
    else{
       applyBtn.style.opacity = 1;
       applyBtn.disabled = false;
    }
    if(isFilterActive || countOfActiveFilters>0){
        resetBtn.style.opacity = 1;
        resetBtn.disabled = false;
    }
    else{
       resetBtn.style.opacity = 0.4;
       resetBtn.disabled = true;
    }
}

//Filters option listener for multi select
function handleFilterOptionsClick(options,filterName){
    options.forEach((option)=>{
        option.addEventListener("click",(event)=>{
            event.stopPropagation();
            if(option.classList.contains("opt-bg-white")){
                if(filter[filterName].size==0)
                    countOfActiveFilters +=1;
                option.classList.replace("opt-bg-white","opt-bg-blue")
                filter[filterName].add(option.innerText);
            }
            else{
                if(filter[filterName].size==1)
                    countOfActiveFilters -= 1;
                filter[filterName].delete(option.innerText);
                option.classList.replace("opt-bg-blue","opt-bg-white")
            }
            handleFilterButtons();
            displayCountOfFilterOptionsSelected(filterName);
        })
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayCountOfFilterOptionsSelected(filterName){
    let filterHeadingClassNames = {status:".status",location:".location",department:".department"};
    let filterElement = document.querySelector(filterHeadingClassNames[filterName]).querySelector("span");
    if(filter[filterName].size==0)
        filterElement.innerText = capitalizeFirstLetter(filterName);
    else
        filterElement.innerText = filter[filterName].size + " Selected";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayTableRows(employeesTableData) {
    filteredTableData = employeesTableData;
    let htmlRows = ``;
    for (let i = 0; i < employeesTableData.length; i++) {
        let src = employeesTableData[i].imageSrc;
        let statusClass = (employeesTableData[i].status=="Active")?"green":"red";
        htmlRows += `
        <tr>
        <td ><input type="checkbox" onclick="handleUserCheckBoxClick(this)" class="user-checkbox"></td>
        <td>
            <div class="flex-center gap-05"> 
                <div><img class="table-user-icon" src="${src}" alt=""></div>
                <div class="span-block"><span name="userName">${employeesTableData[i].user}</span><span>${employeesTableData[i].email}</span>
            </div>        
        </td>
        <td><span>${employeesTableData[i].location}</span></td>
        <td><span>${employeesTableData[i].department}</span></td>
        <td><span>${employeesTableData[i].role}</span></td>
        <td><span name="empId">${employeesTableData[i].empNo}</span></td>
        <td><span class="status ${statusClass}">${employeesTableData[i].status}</span></td>
        <td><span>${employeesTableData[i].joinDt}</span></td>
        <td class="f-30 padd-r-1r rel">
            <div class="ellipsis ds-none">
                <div class="c-pointer" onclick="editOrViewEmployeeDetails(this,'viewDetails')">View Details</div>
                <div class="c-pointer" onclick="editOrViewEmployeeDetails(this,'editData')">Edit</div>
                <div class="c-pointer" onclick="deleterow(this)">Delete</div>
            </div>
            <i class="ph ph-dots-three c-pointer" onclick="populateOrHideEllipisis(event)"></i>
        </td>
        </tr>`;
    }
    
    document.getElementById("tableBody").innerHTML = htmlRows;
    tableRowsCount = employeesTableData.length;
    handleEmptyTableMsg();
    setCountOfSelectedCheckboxes(0);
}

function changeDateFormat(date){
    date = date.split("-");
    return date[2]+"/"+date[1]+"/"+date[0];
}

//on click edit or view ellipsis
function editOrViewEmployeeDetails(element,name){
    element = element.parentNode.parentNode.parentNode;
    empData = element.querySelector("span[name=empId]");
    empNo = empData.innerText;
    for (let i = 0; i < employeesTableData.length; i++) {
        if(employeesTableData[i].empNo == empNo){
            localStorage.setItem("index",i)
            localStorage.setItem(name,JSON.stringify(employeesTableData[i]));
            break;
        }
    }
    toAddEmployee();
}

//on click delete in ellipsis
function deleterow(element){
    let tableRow = element.parentNode.parentNode.parentNode;
    let checkbox = tableRow.querySelector("input[type = 'checkbox']");
    tableRowsCount -= 1;
    if(checkbox.checked){
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes-1);
    }
    deleteElement(tableRow);
    localStorage.setItem("employeeData",JSON.stringify(employeesTableData));
    //just update data in array
    filterTableRows(true);
    handleEmptyTableMsg();
}

function populateOrHideEllipisis(event){
    event.stopPropagation();
    let threeDots = event.target;
    let ellipisis = threeDots.parentNode.querySelector(".ellipsis");
    if(overlayedEllipisis && overlayedEllipisis!=ellipisis){
        overlayedEllipisis.classList.add("ds-none");
    }
    overlayedEllipisis = ellipisis;
    overlayedEllipisis.classList.toggle("ds-none");
    if(!overlayedEllipisis.classList.contains("ds-none")){
        overlayedEllipisis.scrollIntoView({block: 'center',behavior: "smooth"});
    }
    hideFilterOptions();
}

function handleEmptyTableMsg(){
    if(tableRowsCount == 0){
        document.querySelector(".noDataMsg").classList.remove("ds-none");
        document.querySelector("#userDetails").classList.remove("flex-1");
    }
    else{
        document.querySelector("#userDetails").classList.add("flex-1");
        document.querySelector(".noDataMsg").classList.add("ds-none");
    }
}

function handleUserCheckBoxClick(checkBox){
    if (checkBox.checked) {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes + 1);
    }
    else {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes - 1);
    }
}

function sort(columnName) {
    if (columnName == "user") {
        filteredTableData.sort(function (a, b) { return a.user.localeCompare(b.user) });
    }
    else if (columnName == "location") {
        filteredTableData.sort(function (a, b) { return a.location.localeCompare(b.location) });
    }
    else if (columnName == "department") {
        filteredTableData.sort(function (a, b) { return a.department.localeCompare(b.department) });
    }
    else if (columnName == "role") {
        filteredTableData.sort(function (a, b) { return a.role.localeCompare(b.role) });
    }
    else if (columnName == "empNo") {
        filteredTableData.sort(function (a, b) { return a.empNo.localeCompare(b.empNo) });
    }
    else if (columnName == "status") {
        filteredTableData.sort(function (a, b) { return a.status.localeCompare(b.status) });
    }
    else if (columnName == "joinDate") {
        filteredTableData.sort(
            function (a, b) {
                a = new Date(a.joinDt);
                b = new Date(b.joinDt);
                if (a.getTime() > b.getTime())
                    return 1;
                else if (a.getTime() < b.getTime())
                    return -1;
                else
                    return 0;
            });
    }
    //If column is already sorted sorting it in desecending order
    if(sortedColumnNumber==columnName){
        filteredTableData.reverse();
        sortedColumnNumber = null;
    }
    else{
        sortedColumnNumber = columnName;
    }
    displayTableRows(filteredTableData);
}


function downloadCSV() {
    let csvData = [];
    let rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        let csvrow = [];
        let cols = rows[i].querySelectorAll("td span,th span");
        for (let j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerText);
        }
        csvData.push(csvrow.join(","));
    }

    let link = document.createElement("a");
    link.download = "user Data";
    let blob = new Blob([csvData.join("\n")], { type: "text/csv" });
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();

    URL.revokeObjectURL(link.href);
}

function toAddEmployee() {
    // Redirecting to input page
    window.location.href = "addEmployee.html";
}

//For add Employee
let mode,prevEmail = "",prevEmpno = "",errors = new Set();
let form = document.querySelector("#employeeForm");

function loadAddEmployee(){
    checkMode();
    addEmployeeMode();
    handleImageInput();
    addEmployeeFormSubmit();
    setManagerNames();
    document.getElementById("phoneNum").addEventListener("keypress",(e)=>{
        let code = e.key.charCodeAt(0);
        if(!((code>=48 && code<=57) || code==32 || code==45 || code==43 || code==69))
            e.preventDefault()
    })
}

function toEmployees(){
    window.location.href = "employees.html"
}

function setManagerNames(){
    let managerSelect = document.querySelector("#assignManager");
    let employeesData = getEmployeeData();
    let index = -1,optHtml = ``;
    if(mode==1)
        index = localStorage.getItem("index");
    for (let i = 0; i < employeesData.length; i++) {
        if(i!=index)
            optHtml += `<option>${employeesData[i].user}</option>`
    }
    managerSelect.innerHTML += optHtml;
}

function checkMode(){
    let editData = localStorage.getItem("editData");
    let viewData = localStorage.getItem("viewDetails");
    if(!editData && !viewData){
        //addEmployee
        mode = 0;
    }
    else if(!viewData){
        //editEmployee
        mode = 1;
    }
    else{
        //viewDetails
        mode = 2;
    }
}

function addEmployeeMode(){
    if(mode==0){
        document.getElementById("editProfile").classList.add("ds-none");
        document.getElementById("employeeForm").classList.remove("flex");
        let imageInput = document.querySelector(".image-input");
        imageInput.classList.add("flex-center");
        imageInput.classList.add("gap-2r");
    }
    else if(mode==1){
        document.querySelector(".message").innerText = "Employee details Updated Sucessfully";
        document.querySelector(".formHeading").innerText = "EDIT EMPLOYEE"
        document.querySelector("button[type='submit']").innerText = "Update Employee"
        document.getElementById("addProfile").classList.add("ds-none");
        showEmployeeDetails(JSON.parse(localStorage.getItem("editData")));
        localStorage.removeItem("editData");
    }
    else{
        document.querySelector(".formHeading").innerText = "VIEW EMPLOYEE DETAILS"
        document.getElementById("uploadProfile").classList.add("ds-none");
        document.getElementById("formBtns").classList.add("ds-none");
        showEmployeeDetails(JSON.parse(localStorage.getItem("viewDetails")));
        localStorage.removeItem("viewDetails");
        blockInput();
    }
}

function showEmployeeDetails(userData){
    document.getElementById("empNo").value = userData.empNo;
    document.getElementById("fName").value = userData.fName;
    document.getElementById("lName").value = userData.lName;
    document.getElementById("email").value = userData.email;
    document.getElementById("phoneNum").value = userData.mobileNumber;
    document.getElementById("dob").value = userData.dob;
    document.getElementById("jdate").value =  userData.joinDt;
    prevEmail = userData.email;
    prevEmpno = userData.empNo;
    if(userData.imageSrc)
        document.getElementById("profile").src = userData.imageSrc;
    selectOption("inputLocation",userData.location);
    selectOption("inputDepartment",userData.department);
    selectOption("title",userData.role);
    selectOption("assignProject",userData.assignProject);
    selectOption("assignManager",userData.assignManager);
}

function blockInput(){
    //Read only mode restricts user from modifying data
    document.getElementById("empNo").readOnly = true;
    document.getElementById("fName").readOnly = true;
    document.getElementById("lName").readOnly = true;
    document.getElementById("email").readOnly = true;
    document.getElementById("phoneNum").readOnly = true;
    document.getElementById("dob").readOnly = true;
    document.getElementById("jdate").readOnly = true;
    document.getElementById("inputLocation").disabled = true;
    document.getElementById("inputDepartment").disabled = true;
    document.getElementById("title").disabled = true;
    document.getElementById("assignProject").disabled = true;
    document.getElementById("assignManager").disabled = true;
}

function validateFnameListener(){
    validateName("fName");
}
function validateLnameListener(){
    validateName("lName");
}
function handleErrorMsg(valid,inputId){
    if(valid){
        clearErrors(inputId);
        errors.delete(inputId);
    }
    else
        errors.add(inputId);
}
function validateEmpno(){
    let inputId = "empNo"
    let empNo = form[inputId].value.trim(),valid = true;
    if(empNo.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",form[inputId]);
        valid = false;
    }
    let regEmpno = /^TZ[0-9]{4,}$/;
    match = regEmpno.test(empNo);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Employee Number (TZ0000..)",form[inputId]);
        valid = false;
    }
    let empNos = new Set(JSON.parse(localStorage.getItem("empNos")));
    if(valid && (mode==0 && empNos.has(empNo)) || (mode==1 && empNo!=prevEmpno && empNos.has(empNo))){
        showValidationError(`.${inputId}-error`,"Employee Number already exists",form[inputId]);
        valid = false;        
    }
    handleErrorMsg(valid,inputId);
}

function validateName(inputId){
    let name = form[inputId].value.trim(),valid = true;
    if(name.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",form[inputId]);
        valid = false;
    }
    let regName = /^[a-zA-Z]+([ ]?[a-zA-Z]+){0,2}$/;
    match = regName.test(name);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Name",form[inputId]);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateEmail(){
    let inputId = "email";
    let email = form[inputId].value.trim(),valid = true;
    if(email.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",form[inputId]);
        valid = false;
    }
    let regEmail = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9]+[.][a-zA-Z]+$/;
    match = regEmail.test(email);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Email",form[inputId]);
        valid = false;
    }
    let emails = new Set(JSON.parse(localStorage.getItem("emails")));
    if(valid && (mode==0 && emails.has(email)) || (mode==1 && email!=prevEmail && emails.has(email))){
        showValidationError(`.${inputId}-error`,"Email already exists",form[inputId]);
        valid = false;        
    }
    handleErrorMsg(valid,inputId);
}

function validateMobileNumber(){
    let inputId = "phoneNum";
    let phoneNumber = form[inputId].value.trim(),valid = true;
    let regPhone = /^(\+[0-9]{1,3}[- ]?)?[6-9]{1}[0-9]{9}$/
    match = regPhone.test(phoneNumber);
    if(phoneNumber.length!=0 && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Mobile Number",form[inputId]);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateDate(){
    let inputId = "jdate";
    let date = form[inputId].value,valid = true;
    if(date.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",form[inputId]);
        valid = false;
    }
    let cdate = new Date();
    date = new Date(date);
    if(valid && date>cdate){
        showValidationError(`.${inputId}-error`,"Enter valid Date",form[inputId]);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateDob(){
    let inputId = "dob";
    let date = form[inputId].value,valid = true;
    let cdate = new Date();
    date = new Date(date);
    if(date.toString()!="Invalid Date" && date>cdate){
        showValidationError(`.${inputId}-error`,"Enter valid Date",form[inputId]);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function clearErrors(inputId){
    errorClassName = `.${inputId}-error`;
    document.querySelector(errorClassName).classList.add("ds-none");
    document.querySelector(errorClassName).parentNode.classList.remove("br-red");
}

function showValidationError(erClassName,msg,inputElement){
    let alertImg = `<img src="images/alert.png" alt="">`;
    let errorElement = document.querySelector(erClassName);
    errorElement.classList.remove("ds-none");
    errorElement.innerHTML = alertImg + msg;
    let li = inputElement.parentNode;
    li.classList.add("br-red");
}

function addInputValidationListeners(){
    let inputs = ["empNo","fName","lName","email","phoneNum","jdate","dob"];
    form[inputs[0]].addEventListener("keyup",validateEmpno);
    form[inputs[1]].addEventListener("keyup",validateFnameListener);
    form[inputs[2]].addEventListener("keyup",validateLnameListener);
    form[inputs[3]].addEventListener("keyup",validateEmail);
    form[inputs[4]].addEventListener("keyup",validateMobileNumber);
    form[inputs[5]].addEventListener("change",validateDate);
    form[inputs[6]].addEventListener("change",validateDob);
}

function addEmployeeFormSubmit(){
    form.onsubmit = function(event){
        event.preventDefault();
        if(mode==2)
            return;
        addInputValidationListeners();
        validateEmpno();
        validateName("fName");
        validateName("lName");
        validateEmail();
        validateMobileNumber();
        validateDate();
        validateDob();
        if(errors.size>0)
            return;
        storeData();
    }   
}

function handleImageInput(){
    let profile = document.getElementById("profileInput");
    profile.addEventListener("change",()=>{
        let fileReader = new FileReader();
        fileReader.readAsDataURL(profile.files[0]);
        fileReader.onload = ()=>{
            document.getElementById("profile").src = fileReader.result;
        }
    })
}


function selectOption(id, value){
    document.getElementById(id).querySelectorAll("option").forEach(e=>{
        if(e.innerText == value){
            e.selected = true;
        }
    }) 
}

function storeData(){
    let fName = document.getElementById("fName").value.trim();
    let lName = document.getElementById("lName").value.trim();
    let user = fName+" "+lName;
    let email = document.getElementById("email").value.trim();
    let mobileNumber = document.getElementById("phoneNum").value.trim();
    let location = document.getElementById("inputLocation");
    let department = document.getElementById("inputDepartment");
    let role = document.getElementById("title");
    let empNo = document.getElementById("empNo").value.trim();
    let date = document.getElementById("jdate").value;
    let assignManager = document.getElementById("assignManager");
    let assignProject = document.getElementById("assignProject");
    let dob = document.getElementById("dob").value;
    let imageSrc = document.getElementById("profile").src;
    location = location.options[location.selectedIndex].innerText;
    department = department.options[department.selectedIndex].innerText;
    role = role.options[role.selectedIndex].innerText;
    assignManager = assignManager.options[assignManager.selectedIndex].innerText;
    assignProject = assignProject.options[assignProject.selectedIndex].innerText;
    let status = "Active";
    date = date.split("-");
    let joinDt = date[2]+"/"+date[1]+"/"+date[0];
    
    let newEmployeeData = {user,fName,lName,location,department,status,role,empNo,joinDt,imageSrc,assignManager,assignProject,email,mobileNumber,dob};
    let employeesData = localStorage.getItem("employeeData");
    if(employeesData){
        employeesData = JSON.parse(employeesData);
    }
    else
        employeesData = [];
    if(mode==1){
        index = localStorage.getItem("index");
        employeesData[index] = newEmployeeData;
    }
    else{
        employeesData = employeesData.concat([newEmployeeData]);
    }
    localStorage.setItem("employeeData",JSON.stringify(employeesData));
    if(prevEmail!=email && mode==1)
        delFromLocalStorage("emails",prevEmail);
    if(prevEmpno!=empNo && mode==1)
        delFromLocalStorage("empNos",prevEmpno);
    addDataToLocalStorage(email,"emails");
    addDataToLocalStorage(empNo,"empNos");

    document.querySelector(".message").classList.add("success");
    document.getElementById("profile").src = "images/user3.png";
    document.querySelector('button[type="reset"]').click();
    setTimeout(()=>{
        document.querySelector(".message").classList.remove("success");
        window.location.href = "employees.html";
    },1000)
}

function addDataToLocalStorage(value,name){
    let dataSet = JSON.parse(localStorage.getItem(name));
    dataSet = new Set(dataSet);
    dataSet.add(value);
    dataArr = [...dataSet]
    localStorage.setItem(name,JSON.stringify(dataArr));
}

//New Role
function newRoleLoad(){
    let assignInput = document.querySelector("#assignEmployees");
    document.querySelector(".displayOpt").addEventListener("click",(e)=>{
        e.stopPropagation();
        let options = document.querySelector(".options");
        options.classList.remove("ds-none");
    })
    document.querySelector("body").addEventListener("click",()=>{
        document.querySelector(".options").classList.add("ds-none");
    })
}