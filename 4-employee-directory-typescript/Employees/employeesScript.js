"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var countOfSelectedCheckboxes = 0, sortedColumnName = "";
var tableRowsCount, employeesTableData, lettersToDisplay = [], filteredTableData;
var filter = { status: new Set(), location: new Set(), department: new Set() };
var isFilterActive = false, countOfActiveFilters = 0, overlayedEllipisis = null;
function loadAlphabets() {
    var htmlForLetters = "";
    for (var i = 0; i < 26; i++) {
        htmlForLetters += "<span class=\"letter gray-letter\" >".concat(String.fromCharCode(65 + i), "</span>");
    }
    document.getElementsByClassName("alphabets")[0].innerHTML += htmlForLetters;
}
function loadEmployees() {
    loadAlphabets();
    employeesTableData = getEmployeeData();
    displayTableRows(employeesTableData);
    addFilterOptionsHtml();
    addlistenerForFiltersAndTable();
}
function setCountOfSelectedCheckboxes(count) {
    countOfSelectedCheckboxes = count;
    var selectAllCheckbox = document.getElementById('mainCheckbox');
    var delBtn = document.querySelector('.delete');
    //Modifying main check Box
    if (selectAllCheckbox instanceof HTMLInputElement) {
        if (tableRowsCount == countOfSelectedCheckboxes && tableRowsCount != 0) {
            selectAllCheckbox.checked = true;
        }
        else {
            selectAllCheckbox.checked = false;
        }
    }
    //Modifying delete button
    if (delBtn instanceof HTMLButtonElement) {
        if (count > 0) {
            delBtn.disabled = false;
            delBtn.classList.replace("del-dis", "del-act");
        }
        else {
            delBtn.disabled = true;
            delBtn.classList.replace("del-act", "del-dis");
        }
    }
}
function deleteElement(tableRow) {
    var empIdSpan = tableRow.querySelector('span[name=empId]');
    if (empIdSpan instanceof HTMLSpanElement) {
        var empNo = empIdSpan.innerText;
        for (var i = 0; i < employeesTableData.length; i++) {
            if (employeesTableData[i].empNo == empNo) {
                delFromLocalStorage("emails", employeesTableData[i].email);
                delFromLocalStorage("empNos", employeesTableData[i].empNo);
                employeesTableData.splice(i, 1);
                break;
            }
        }
        tableRow.remove();
    }
}
function deleteTableRows() {
    var _a;
    var checkboxes = document.getElementsByClassName("user-checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        var checkBox = checkboxes[i];
        if (checkBox instanceof HTMLInputElement)
            if (checkBox.checked) {
                var tableRow = (_a = checkBox.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
                if (tableRow instanceof HTMLTableRowElement) {
                    deleteElement(tableRow);
                    i -= 1;
                }
            }
    }
    localStorage.setItem("employeeData", JSON.stringify(employeesTableData));
    //decreasing the count by number of rows deleted
    tableRowsCount -= countOfSelectedCheckboxes;
    setCountOfSelectedCheckboxes(0);
    //just updating the data in filteredTableData array
    filterTableRows(false);
    handleEmptyTableMsg();
}
function addlistenerForFiltersAndTable() {
    var _a, _b, _c, _d;
    //For select all checkBox
    (_a = document.getElementById('mainCheckbox')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
        var checkboxes = document.getElementsByClassName("user-checkbox");
        if (e.target instanceof HTMLInputElement) {
            var selectAllCheckboxValue = e.target.checked;
            for (var i = 0; i < checkboxes.length; i++) {
                var checkBox = checkboxes[i];
                if (checkBox instanceof HTMLInputElement)
                    checkBox.checked = selectAllCheckboxValue;
            }
            setCountOfSelectedCheckboxes(selectAllCheckboxValue ? tableRowsCount : 0);
        }
    });
    //For delete button over table
    (_b = document.querySelector('.delete')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteTableRows);
    //For letters in filter
    var filterLetters = document.getElementsByClassName('letter');
    for (var i = 0; i < filterLetters.length; i++) {
        filterLetters[i].addEventListener('click', function (e) {
            if (e.target instanceof HTMLElement) {
                if (e.target.classList.contains("gray-letter")) {
                    e.target.classList.replace("gray-letter", "red-letter");
                    lettersToDisplay.push(e.target.innerText);
                }
                else {
                    e.target.classList.replace("red-letter", "gray-letter");
                    var char = e.target.innerText;
                    for (var j = 0; j < lettersToDisplay.length; j++) {
                        if (lettersToDisplay[j] == char) {
                            lettersToDisplay.splice(j, 1);
                        }
                    }
                }
            }
            //handling filter icon svg stroke
            var filterIcon = document.getElementById("filterIcon");
            if (lettersToDisplay.length == 0 && (filterIcon === null || filterIcon === void 0 ? void 0 : filterIcon.classList.contains("stroke-red")))
                filterIcon.classList.replace("stroke-red", "stroke-gray");
            else if (lettersToDisplay.length != 0 && (filterIcon === null || filterIcon === void 0 ? void 0 : filterIcon.classList.contains("stroke-gray")))
                filterIcon.classList.replace("stroke-gray", "stroke-red");
            filterTableRows(true);
        });
    }
    //Listener for filter icon
    (_c = document.getElementById("filterIcon")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function (event) {
        if (event.target instanceof Element && event.target.classList.contains("stroke-red")) {
            document.querySelectorAll(".letter.red-letter").forEach(function (e) {
                e.classList.replace("red-letter", "gray-letter");
            });
            event.target.classList.replace("stroke-red", "stroke-gray");
            lettersToDisplay = [];
            filterTableRows(true);
        }
    });
    //For search bar
    (_d = document.getElementById("searchText")) === null || _d === void 0 ? void 0 : _d.addEventListener('keyup', function (event) {
        if (event.target instanceof HTMLInputElement) {
            var text_1 = event.target.value;
            if (text_1 == "")
                filterTableRows(true);
            else {
                var filteredTableData_1 = employeesTableData.filter(function (e) { return e.user.toLowerCase().includes(text_1.toLowerCase()) || e.empNo.toLowerCase().includes(text_1.toLowerCase()) || e.location.toLowerCase().includes(text_1.toLowerCase()) || e.department.toLowerCase().includes(text_1.toLowerCase()) || e.role.toLowerCase().includes(text_1.toLowerCase()) || e.email.toLowerCase().includes(text_1.toLowerCase()) || e.status.toLowerCase().includes(text_1.toLowerCase()); });
                displayTableRows(filteredTableData_1);
            }
        }
    });
}
function filterEmployeesOnOptions() {
    if (countOfActiveFilters == 1) {
        if (filter.status.size > 0) {
            filteredTableData = employeesTableData.filter(function (row) { return filter.status.has(row.status); });
        }
        else if (filter.location.size > 0) {
            filteredTableData = employeesTableData.filter(function (row) { return filter.location.has(row.location); });
        }
        else {
            filteredTableData = employeesTableData.filter(function (row) { return filter.department.has(row.department); });
        }
    }
    else if (countOfActiveFilters == 2) {
        if (filter.status.size == 0) {
            filteredTableData = employeesTableData.filter(function (row) { return filter.location.has(row.location) && filter.department.has(row.department); });
        }
        else if (filter.location.size == 0) {
            filteredTableData = employeesTableData.filter(function (row) { return filter.status.has(row.status) && filter.department.has(row.department); });
        }
        else {
            filteredTableData = employeesTableData.filter(function (row) { return filter.status.has(row.status) && filter.location.has(row.location); });
        }
    }
    else {
        filteredTableData = employeesTableData.filter(function (row) { return filter.status.has(row.status) && filter.location.has(row.location) && filter.department.has(row.department); });
    }
}
function filterTableRows(displayFilteredData) {
    //Setting the previous sorted column as none
    sortedColumnName = "";
    //From filters
    filteredTableData = employeesTableData;
    if (isFilterActive)
        filterEmployeesOnOptions();
    var x = [];
    //Letters starts with
    if (lettersToDisplay.length > 0) {
        var _loop_1 = function (i) {
            x = x.concat(filteredTableData.filter(function (e) { return e.user.toLowerCase().startsWith(lettersToDisplay[i].toLowerCase()); }));
        };
        for (var i = lettersToDisplay.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        filteredTableData = x;
    }
    if (displayFilteredData)
        displayTableRows(filteredTableData);
}
// let newEmployeeData = {user,fName,lName,location,department,status,role,empNo,joinDt,imageSrc,assignManager,assignProject,email,mobileNumber,dob};
function addFiltersOptions(filterName) {
    var _a;
    var dataSet = new Set(), filtersClassNames = [".status-options", ".location-options", ".department-options"], className = ".".concat(filterName, "-options");
    var filterOptionsHtml = "", filterOptions = document.querySelector(className);
    for (var i = 0; i < employeesTableData.length; i++) {
        dataSet.add(employeesTableData[i][filterName]);
    }
    dataSet.forEach(function (value) { return filterOptionsHtml += "<option class=\"opt-bg-white\" value=".concat(value, ">").concat(value, "</option>"); });
    if (filterOptions instanceof HTMLElement) {
        filterOptions.innerHTML = filterOptionsHtml;
        var filterDropdown = document.querySelector(".dropdown.".concat(filterName));
        if (filterDropdown instanceof HTMLElement)
            setEqualWidth(filterDropdown, filterOptions);
        filterOptions.classList.add("ds-none");
    }
    //Event listener to view options on click 
    (_a = document.querySelector(".".concat(filterName, "-filter"))) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (event) {
        event.stopPropagation();
        filtersClassNames.forEach(function (value) {
            var _a, _b;
            if (value != className)
                (_a = document.querySelector(value)) === null || _a === void 0 ? void 0 : _a.classList.add("ds-none");
            else
                (_b = document.querySelector(value)) === null || _b === void 0 ? void 0 : _b.classList.toggle("ds-none");
        });
    });
    var filterKeyName = filterName;
    handleFilterOptionsClick(document.querySelectorAll("".concat(className, " option")), filterKeyName);
}
function addFilterOptionsHtml() {
    var _a, _b;
    addFiltersOptions("status");
    addFiltersOptions("location");
    addFiltersOptions("department");
    // let filterOptions = {status:["Active","InActive"],location:["Hyderabad","Secunderabad","Koti"],department:["UIUX","Product Engg.","It"]}
    document.addEventListener("click", function () {
        hideFilterOptions();
        hideEllipisisOverlay();
    });
    handleFilterButtons();
    //Apply button in filter
    (_a = document.getElementById("apply")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        isFilterActive = true;
        handleFilterButtons();
        filterTableRows(true);
    });
    //Delete button in filter
    (_b = document.getElementById("reset")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        isFilterActive = false;
        countOfActiveFilters = 0;
        // let filterNames = ["status","location","department"];
        var key;
        for (key in filter) {
            filter[key].clear();
            displayCountOfFilterOptionsSelected(key);
        }
        handleFilterButtons();
        document.querySelectorAll(".opt-bg-blue").forEach(function (e) {
            e.classList.replace("opt-bg-blue", "opt-bg-white");
        });
        filterTableRows(true);
    });
}
function hideEllipisisOverlay() {
    if (overlayedEllipisis != null)
        overlayedEllipisis.classList.add("ds-none");
}
function hideFilterOptions() {
    var _a, _b, _c;
    (_a = document.querySelector(".status-options")) === null || _a === void 0 ? void 0 : _a.classList.add("ds-none");
    (_b = document.querySelector(".department-options")) === null || _b === void 0 ? void 0 : _b.classList.add("ds-none");
    (_c = document.querySelector(".location-options")) === null || _c === void 0 ? void 0 : _c.classList.add("ds-none");
}
function setEqualWidth(a, b) {
    var width = Math.max(a.offsetWidth, b.offsetWidth) + 30 + "px";
    a.style.width = width;
    //given max height of element as 250
    if (b.offsetHeight > 249)
        b.style.overflowY = "auto";
    b.style.width = width;
}
function handleFilterButtons() {
    var applyBtn = document.getElementById("apply");
    var resetBtn = document.getElementById("reset");
    if (applyBtn instanceof HTMLButtonElement) {
        if (countOfActiveFilters == 0) {
            applyBtn.style.opacity = "0.4";
            applyBtn.disabled = true;
        }
        else {
            applyBtn.style.opacity = "1";
            applyBtn.disabled = false;
        }
    }
    if (resetBtn instanceof HTMLButtonElement) {
        if (isFilterActive || countOfActiveFilters > 0) {
            resetBtn.style.opacity = "1";
            resetBtn.disabled = false;
        }
        else {
            resetBtn.style.opacity = "0.4";
            resetBtn.disabled = true;
        }
    }
}
//Filters option listener for multi select
function handleFilterOptionsClick(options, filterName) {
    options.forEach(function (option) {
        option.addEventListener("click", function (event) {
            event.stopPropagation();
            if (option.classList.contains("opt-bg-white")) {
                if (filter[filterName].size == 0)
                    countOfActiveFilters += 1;
                option.classList.replace("opt-bg-white", "opt-bg-blue");
                if (option instanceof HTMLElement)
                    filter[filterName].add((option).innerText);
            }
            else {
                if (filter[filterName].size == 1)
                    countOfActiveFilters -= 1;
                if (option instanceof HTMLElement)
                    filter[filterName].delete((option).innerText);
                option.classList.replace("opt-bg-blue", "opt-bg-white");
            }
            handleFilterButtons();
            displayCountOfFilterOptionsSelected(filterName);
        });
    });
}
function displayCountOfFilterOptionsSelected(filterName) {
    var _a;
    var filterHeadingClassNames = { status: ".status", location: ".location", department: ".department" };
    var filterElement = (_a = document.querySelector(filterHeadingClassNames[filterName])) === null || _a === void 0 ? void 0 : _a.querySelector("span");
    if (filterElement) {
        if (filter[filterName].size == 0)
            filterElement.innerText = capitalizeFirstLetter(filterName);
        else
            filterElement.innerText = filter[filterName].size + " Selected";
    }
}
function displayTableRows(employeesTableData) {
    filteredTableData = employeesTableData;
    var htmlRows = "";
    for (var i = 0; i < employeesTableData.length; i++) {
        var src = employeesTableData[i].imageSrc;
        var statusClass = (employeesTableData[i].status == "Active") ? "green" : "red";
        htmlRows += "\n        <tr>\n        <td ><input type=\"checkbox\" onclick=\"handleUserCheckBoxClick(this)\" class=\"user-checkbox\"></td>\n        <td>\n            <div class=\"flex-center gap-05\"> \n                <div><img class=\"table-user-icon\" src=\"".concat(src, "\" alt=\"\"></div>\n                <div class=\"span-block\"><span name=\"userName\">").concat(employeesTableData[i].user, "</span><span>").concat(employeesTableData[i].email, "</span>\n            </div>        \n        </td>\n        <td><span>").concat(employeesTableData[i].location, "</span></td>\n        <td><span>").concat(employeesTableData[i].department, "</span></td>\n        <td><span>").concat(employeesTableData[i].role, "</span></td>\n        <td><span name=\"empId\">").concat(employeesTableData[i].empNo, "</span></td>\n        <td><span class=\"status ").concat(statusClass, "\">").concat(employeesTableData[i].status, "</span></td>\n        <td><span>").concat(changeDateFormat(employeesTableData[i].joiningDate), "</span></td>\n        <td class=\"f-30 padd-r-1r rel\">\n            <div class=\"ellipsis ds-none\">\n                <div class=\"c-pointer\" onclick=\"editOrViewEmployeeDetails(this,'viewDetails')\">View Details</div>\n                <div class=\"c-pointer\" onclick=\"editOrViewEmployeeDetails(this,'editData')\">Edit</div>\n                <div class=\"c-pointer\" onclick=\"deleterow(this)\">Delete</div>\n            </div>\n            <i class=\"ph ph-dots-three c-pointer\" onclick=\"populateOrHideEllipisis(event)\"></i>\n        </td>\n        </tr>");
    }
    var tbody = document.getElementById("tableBody");
    if (tbody instanceof HTMLElement)
        tbody.innerHTML = htmlRows;
    tableRowsCount = employeesTableData.length;
    handleEmptyTableMsg();
    setCountOfSelectedCheckboxes(0);
}
function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function changeDateFormat(date) {
    var dateArr = date.split("-");
    return dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
}
//on click edit or view ellipsis
function editOrViewEmployeeDetails(element, name) {
    var _a, _b;
    var tableRow = (_b = (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    if (tableRow instanceof HTMLElement) {
        var empIdSpan = tableRow.querySelector("span[name=empId]");
        if (empIdSpan instanceof HTMLElement) {
            var empNo = empIdSpan.innerText;
            for (var i = 0; i < employeesTableData.length; i++) {
                if (employeesTableData[i].empNo == empNo) {
                    localStorage.setItem("index", i.toString());
                    localStorage.setItem(name, JSON.stringify(employeesTableData[i]));
                    break;
                }
            }
            toAddEmployee();
        }
    }
}
//on click delete in ellipsis
function deleterow(element) {
    var _a, _b;
    var tableRow = (_b = (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
    if (!(tableRow instanceof HTMLTableRowElement))
        return;
    var checkbox = tableRow.querySelector("input[type = 'checkbox']");
    if (!(checkbox instanceof HTMLInputElement))
        return;
    tableRowsCount -= 1;
    if (checkbox.checked) {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes - 1);
    }
    deleteElement(tableRow);
    localStorage.setItem("employeeData", JSON.stringify(employeesTableData));
    //just update data in array
    filterTableRows(false);
    handleEmptyTableMsg();
}
function populateOrHideEllipisis(event) {
    var _a;
    event.stopPropagation();
    var threeDots = event.target;
    if (threeDots instanceof HTMLElement) {
        var ellipisis = (_a = threeDots.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(".ellipsis");
        if (ellipisis instanceof HTMLDivElement) {
            if (overlayedEllipisis && overlayedEllipisis != ellipisis) {
                overlayedEllipisis.classList.add("ds-none");
            }
            overlayedEllipisis = ellipisis;
            overlayedEllipisis.classList.toggle("ds-none");
            if (!overlayedEllipisis.classList.contains("ds-none")) {
                overlayedEllipisis.scrollIntoView({ block: 'center', behavior: "smooth" });
            }
            hideFilterOptions();
        }
    }
}
function handleEmptyTableMsg() {
    var _a, _b, _c, _d;
    if (tableRowsCount == 0) {
        (_a = document.querySelector("#noDataMsg")) === null || _a === void 0 ? void 0 : _a.classList.remove("ds-none");
        (_b = document.querySelector("#userDetails")) === null || _b === void 0 ? void 0 : _b.classList.remove("flex-1");
    }
    else {
        (_c = document.querySelector("#userDetails")) === null || _c === void 0 ? void 0 : _c.classList.add("flex-1");
        (_d = document.querySelector("#noDataMsg")) === null || _d === void 0 ? void 0 : _d.classList.add("ds-none");
    }
}
function handleUserCheckBoxClick(checkBox) {
    if (checkBox.checked) {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes + 1);
    }
    else {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes - 1);
    }
}
function sort(columnName) {
    var dataToSort = __spreadArray([], filteredTableData, true);
    if (columnName == "user") {
        dataToSort.sort(function (a, b) { return a.user.localeCompare(b.user); });
    }
    else if (columnName == "location") {
        dataToSort.sort(function (a, b) { return a.location.localeCompare(b.location); });
    }
    else if (columnName == "department") {
        dataToSort.sort(function (a, b) { return a.department.localeCompare(b.department); });
    }
    else if (columnName == "role") {
        dataToSort.sort(function (a, b) { return a.role.localeCompare(b.role); });
    }
    else if (columnName == "empNo") {
        dataToSort.sort(function (a, b) { return a.empNo.localeCompare(b.empNo); });
    }
    else if (columnName == "status") {
        dataToSort.sort(function (a, b) { return a.status.localeCompare(b.status); });
    }
    else if (columnName == "joinDate") {
        dataToSort.sort(function (a, b) {
            var dateA = new Date(a.joiningDate);
            var dateB = new Date(b.joiningDate);
            if (dateA.getTime() > dateB.getTime())
                return 1;
            else if (dateA.getTime() < dateB.getTime())
                return -1;
            else
                return 0;
        });
    }
    //If column is already sorted sorting it in desecending order
    if (sortedColumnName == columnName) {
        dataToSort.reverse();
        sortedColumnName = "";
    }
    else {
        sortedColumnName = columnName;
    }
    displayTableRows(dataToSort);
}
function downloadCSV() {
    var csvData = [];
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var csvrow = [];
        var cells = rows[i].querySelectorAll("td span,th span");
        for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            if (cell instanceof HTMLElement)
                csvrow.push(cell.innerText);
        }
        csvData.push(csvrow.join(","));
    }
    var link = document.createElement("a");
    link.download = "user Data";
    var blob = new Blob([csvData.join("\n")], { type: "text/csv" });
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}
function toAddEmployee() {
    // Redirecting to input page
    window.location.href = "addEmployee";
}
