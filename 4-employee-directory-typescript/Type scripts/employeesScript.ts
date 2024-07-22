let countOfSelectedCheckboxes = 0,sortedColumnName = "";
let tableRowsCount: number, employeesTableData: employeeDataObjectType[], lettersToDisplay:string[] = [], filteredTableData: employeeDataObjectType[];
type filterObj = {status: Set<string>,location: Set<string>,department: Set<string>} ;
let filter: filterObj = {status: new Set(),location: new Set(),department: new Set()}; 
let isFilterActive = false,countOfActiveFilters = 0,overlayedEllipisis: HTMLDivElement | null = null;

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
}

function setCountOfSelectedCheckboxes(count: number) {
    countOfSelectedCheckboxes = count;
    let selectAllCheckbox = document.getElementById('mainCheckbox');
    let delBtn = document.querySelector('.delete');
    //Modifying main check Box
    if(selectAllCheckbox instanceof HTMLInputElement){
        if (tableRowsCount == countOfSelectedCheckboxes && tableRowsCount != 0) {
            selectAllCheckbox.checked = true;
        }
        else {
            selectAllCheckbox.checked = false;
        }
    }

    //Modifying delete button
    if(delBtn instanceof HTMLButtonElement){
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

function deleteElement(tableRow: HTMLTableRowElement){
    let empIdSpan = tableRow.querySelector('span[name=empId]');
    if(empIdSpan instanceof HTMLSpanElement){
        let empNo = empIdSpan.innerText;
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
}

function deleteTableRows() {
    let checkboxes = document.getElementsByClassName("user-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        let checkBox = checkboxes[i];
        if(checkBox instanceof HTMLInputElement)
            if (checkBox.checked) {
                let tableRow = checkBox.parentNode?.parentNode;
                if(tableRow instanceof HTMLTableRowElement){
                    deleteElement(tableRow);
                    i -= 1;
                }
            }
    }
    localStorage.setItem("employeeData",JSON.stringify(employeesTableData));
    //decreasing the count by number of rows deleted
    tableRowsCount -= countOfSelectedCheckboxes;
    setCountOfSelectedCheckboxes(0);
    //just updating the data in filteredTableData array
    filterTableRows(false);
    handleEmptyTableMsg();
}


function addlistenerForFiltersAndTable() {
    //For select all checkBox
    document.getElementById('mainCheckbox')?.addEventListener('click', (e) => {
        let checkboxes = document.getElementsByClassName("user-checkbox");
        if(e.target instanceof HTMLInputElement){
        let selectAllCheckboxValue = e.target.checked;
        for (let i = 0; i < checkboxes.length; i++) {
            let checkBox = checkboxes[i];
            if(checkBox instanceof HTMLInputElement)
                checkBox.checked = selectAllCheckboxValue;
        }
        setCountOfSelectedCheckboxes(selectAllCheckboxValue ? tableRowsCount : 0);
        }
    })

    //For delete button over table
    document.querySelector('.delete')?.addEventListener('click', deleteTableRows);

    //For letters in filter
    let filterLetters = document.getElementsByClassName('letter');
    for (let i = 0; i < filterLetters.length; i++) {
        filterLetters[i].addEventListener('click', (e) => {
            if(e.target instanceof HTMLElement){
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
            }
            //handling filter icon svg stroke
            let filterIcon = document.getElementById("filterIcon");
            if (lettersToDisplay.length == 0 && filterIcon?.classList.contains("stroke-red"))
                filterIcon.classList.replace("stroke-red", "stroke-gray");
            else if (lettersToDisplay.length != 0 && filterIcon?.classList.contains("stroke-gray"))
                filterIcon.classList.replace("stroke-gray", "stroke-red");
            filterTableRows(true);
        })
    }
    
    //Listener for filter icon
    document.getElementById("filterIcon")?.addEventListener("click",(event)=>{
        if(event.target instanceof Element && event.target.classList.contains("stroke-red")){
            document.querySelectorAll(".letter.red-letter").forEach(e => {
                e.classList.replace("red-letter","gray-letter");
            })
            event.target.classList.replace("stroke-red","stroke-gray")
            lettersToDisplay = [];
            filterTableRows(true);
        }
    });

    //For search bar
    document.getElementById("searchText")?.addEventListener('keyup', (event) => {
        if(event.target instanceof HTMLInputElement){
            let text = event.target.value;
            if(text=="")
                filterTableRows(true);
            else{
                let filteredTableData = employeesTableData.filter(e => e.user.toLowerCase().includes(text.toLowerCase()) || e.empNo.toLowerCase().includes(text.toLowerCase()) || e.location.toLowerCase().includes(text.toLowerCase()) || e.department.toLowerCase().includes(text.toLowerCase()) || e.role.toLowerCase().includes(text.toLowerCase()) || e.email.toLowerCase().includes(text.toLowerCase()) || e.status.toLowerCase().includes(text.toLowerCase()));
                displayTableRows(filteredTableData);
            }
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
            filteredTableData = employeesTableData.filter(row => filter.status.has(row.status) &&  filter.department.has(row.department));
        }
        else{
            filteredTableData = employeesTableData.filter(row => filter.status.has(row.status) &&  filter.location.has(row.location));
        }
    }

    else{
        filteredTableData = employeesTableData.filter(row => filter.status.has(row.status) &&  filter.location.has(row.location) && filter.department.has(row.department))
    }
}


function filterTableRows(displayFilteredData: boolean) {
    //Setting the previous sorted column as none
    sortedColumnName = "";
    //From filters
    filteredTableData = employeesTableData;
    if(isFilterActive)
        filterEmployeesOnOptions();
    let x: employeeDataObjectType[] = [];
    //Letters starts with
    if (lettersToDisplay.length > 0) {
        for (let i = lettersToDisplay.length - 1; i >= 0; i--) {
            x = x.concat(filteredTableData.filter(e => e.user.toLowerCase().startsWith(lettersToDisplay[i].toLowerCase())));
        }
        filteredTableData = x;
    }
    if(displayFilteredData)
        displayTableRows(filteredTableData);
}
    // let newEmployeeData = {user,fName,lName,location,department,status,role,empNo,joinDt,imageSrc,assignManager,assignProject,email,mobileNumber,dob};

function addFiltersOptions(filterName: keyof employeeDataObjectType){
    let dataSet = new Set(),filtersClassNames = [".status-options",".location-options",".department-options"],className=`.${filterName}-options`;
    let filterOptionsHtml = ``,filterOptions = document.querySelector(className);
    for (let i = 0; i < employeesTableData.length; i++) {
        dataSet.add(employeesTableData[i][filterName]);
    }
    dataSet.forEach(value => filterOptionsHtml += `<option class="opt-bg-white" value=${value}>${value}</option>`);
    if(filterOptions instanceof HTMLElement){
        filterOptions.innerHTML = filterOptionsHtml;
        let filterDropdown = document.querySelector(`.dropdown.${filterName}`);
        if(filterDropdown instanceof HTMLElement)
            setEqualWidth(filterDropdown,filterOptions);
        filterOptions.classList.add("ds-none");
    }
    //Event listener to view options on click 
    document.querySelector(`.${filterName}-filter`)?.addEventListener("click",(event)=>{
        event.stopPropagation();
        filtersClassNames.forEach(value => {
            if(value!=className)
                document.querySelector(value)?.classList.add("ds-none");
            else
                document.querySelector(value)?.classList.toggle("ds-none");
        })
    })
    let filterKeyName = filterName as keyof filterObj;
    handleFilterOptionsClick(document.querySelectorAll(`${className} option`),filterKeyName);
}

function addFilterOptionsHtml() {
    addFiltersOptions("status");
    addFiltersOptions("location");
    addFiltersOptions("department");

    // let filterOptions = {status:["Active","InActive"],location:["Hyderabad","Secunderabad","Koti"],department:["UIUX","Product Engg.","It"]}

    document.addEventListener("click",()=>{
        hideFilterOptions();
        hideEllipisisOverlay();
    })
    
    handleFilterButtons();
    
    //Apply button in filter
    document.getElementById("apply")?.addEventListener("click", () => {
        isFilterActive = true;
        handleFilterButtons();
        filterTableRows(true);
    })
    
    //Delete button in filter
    document.getElementById("reset")?.addEventListener("click", () => {
        isFilterActive = false;
        countOfActiveFilters = 0;
        // let filterNames = ["status","location","department"];
        let key: keyof filterObj;
        for (key in filter) {
            filter[key].clear();
            displayCountOfFilterOptionsSelected(key);
        }
        handleFilterButtons();
        document.querySelectorAll(".opt-bg-blue").forEach(e =>{
            e.classList.replace("opt-bg-blue","opt-bg-white");
        })
        filterTableRows(true);
    })    
}
function hideEllipisisOverlay(){
    if(overlayedEllipisis!=null)
        overlayedEllipisis.classList.add("ds-none");
}
function hideFilterOptions(){
    document.querySelector(".status-options")?.classList.add("ds-none");
    document.querySelector(".department-options")?.classList.add("ds-none");
    document.querySelector(".location-options")?.classList.add("ds-none");
}

function setEqualWidth(a: HTMLElement,b: HTMLElement){
    let width = Math.max(a.offsetWidth,b.offsetWidth)+30+"px";
    a.style.width = width;
    //given max height of element as 250
    if(b.offsetHeight > 249)
        b.style.overflowY = "auto";
    b.style.width = width;
}

function handleFilterButtons(){
    let applyBtn = document.getElementById("apply");
    let resetBtn = document.getElementById("reset");
    if(applyBtn instanceof HTMLButtonElement){
        if(countOfActiveFilters==0 ){
            applyBtn.style.opacity = "0.4";
            applyBtn.disabled = true;
        }
        else{
            applyBtn.style.opacity = "1";
            applyBtn.disabled = false;
        }
    }
    if(resetBtn instanceof HTMLButtonElement){
        if(isFilterActive || countOfActiveFilters>0){
            resetBtn.style.opacity = "1";
            resetBtn.disabled = false;
        }
        else{
            resetBtn.style.opacity = "0.4";
            resetBtn.disabled = true;
        }
    }
}

//Filters option listener for multi select
function handleFilterOptionsClick(options: NodeListOf<Element>,filterName: keyof filterObj){
    options.forEach((option)=>{
        option.addEventListener("click",(event)=>{
            event.stopPropagation();
            if(option.classList.contains("opt-bg-white")){
                if(filter[filterName].size==0)
                    countOfActiveFilters +=1;
                option.classList.replace("opt-bg-white","opt-bg-blue");
                if(option instanceof HTMLElement)   
                    filter[filterName].add((option).innerText);
            }
            else{
                if(filter[filterName].size==1)
                    countOfActiveFilters -= 1;
                if(option instanceof HTMLElement)   
                    filter[filterName].delete((option).innerText);
                option.classList.replace("opt-bg-blue","opt-bg-white")
            }
            handleFilterButtons();
            displayCountOfFilterOptionsSelected(filterName);
        })
    })
}

function displayCountOfFilterOptionsSelected(filterName: keyof filterObj){
    let filterHeadingClassNames = {status:".status",location:".location",department:".department"};
    let filterElement = document.querySelector(filterHeadingClassNames[filterName])?.querySelector("span");
    if(filterElement){
        if(filter[filterName].size==0)
            filterElement.innerText = capitalizeFirstLetter(filterName);
        else
            filterElement.innerText = filter[filterName].size + " Selected";
    }
}

function displayTableRows(employeesTableData: employeeDataObjectType[]) {
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
        <td><span>${changeDateFormat(employeesTableData[i].joiningDate)}</span></td>
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
    
    let tbody = document.getElementById("tableBody")
    if(tbody instanceof HTMLElement)
        tbody.innerHTML = htmlRows;
    tableRowsCount = employeesTableData.length;
    handleEmptyTableMsg();
    setCountOfSelectedCheckboxes(0);
}

function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function changeDateFormat(date: string){
    let dateArr = date.split("-");
    return dateArr[2]+"/"+dateArr[1]+"/"+dateArr[0];
}

//on click edit or view ellipsis
function editOrViewEmployeeDetails(element: HTMLElement,name: string){
    let tableRow = element.parentNode?.parentNode?.parentNode;
    if(tableRow instanceof HTMLElement){
        let empIdSpan = tableRow.querySelector("span[name=empId]");
        if(empIdSpan instanceof HTMLElement){
            let empNo = empIdSpan.innerText;
            for (let i = 0; i < employeesTableData.length; i++) {
                if(employeesTableData[i].empNo == empNo){
                    localStorage.setItem("index",i.toString())
                    localStorage.setItem(name,JSON.stringify(employeesTableData[i]));
                    break;
                }
            }
            toAddEmployee();
        }
    }
}

//on click delete in ellipsis
function deleterow(element: HTMLElement){
    let tableRow = element.parentNode?.parentNode?.parentNode;
    if(!(tableRow instanceof HTMLTableRowElement))  return;
    let checkbox = tableRow.querySelector("input[type = 'checkbox']");
    if(!(checkbox instanceof HTMLInputElement)) return;
    tableRowsCount -= 1;
    if(checkbox.checked){
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes-1);
    }
    deleteElement(tableRow);
    localStorage.setItem("employeeData",JSON.stringify(employeesTableData));
    //just update data in array
    filterTableRows(false);
    handleEmptyTableMsg();
}

function populateOrHideEllipisis(event: MouseEvent){
    event.stopPropagation();
    let threeDots = event.target;
    if(threeDots instanceof HTMLElement){
        let ellipisis = threeDots.parentNode?.querySelector(".ellipsis");
        if(ellipisis instanceof HTMLDivElement){
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
    }
}

function handleEmptyTableMsg(){
    if(tableRowsCount == 0){
        document.querySelector("#noDataMsg")?.classList.remove("ds-none");
        document.querySelector("#userDetails")?.classList.remove("flex-1");
    }
    else{
        document.querySelector("#userDetails")?.classList.add("flex-1");
        document.querySelector("#noDataMsg")?.classList.add("ds-none");
    }
}

function handleUserCheckBoxClick(checkBox: HTMLInputElement){
    if (checkBox.checked) {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes + 1);
    }
    else {
        setCountOfSelectedCheckboxes(countOfSelectedCheckboxes - 1);
    }
}

function sort(columnName: string) {
    let dataToSort = [...filteredTableData];
    if (columnName == "user") {
        dataToSort.sort(function (a, b) { return a.user.localeCompare(b.user) });
    }
    else if (columnName == "location") {
        dataToSort.sort(function (a, b) { return a.location.localeCompare(b.location) });
    }
    else if (columnName == "department") {
        dataToSort.sort(function (a, b) { return a.department.localeCompare(b.department) });
    }
    else if (columnName == "role") {
        dataToSort.sort(function (a, b) { return a.role.localeCompare(b.role) });
    }
    else if (columnName == "empNo") {
        dataToSort.sort(function (a, b) { return a.empNo.localeCompare(b.empNo) });
    }
    else if (columnName == "status") {
        dataToSort.sort(function (a, b) { return a.status.localeCompare(b.status) });
    }
    else if (columnName == "joinDate") {
        dataToSort.sort(
            function (a, b) {
                let dateA = new Date(a.joiningDate);
                let dateB = new Date(b.joiningDate);
                if (dateA.getTime() > dateB.getTime())
                    return 1;
                else if (dateA.getTime() < dateB.getTime())
                    return -1;
                else
                    return 0;
            });
    }
    //If column is already sorted sorting it in desecending order
    if(sortedColumnName==columnName){
        dataToSort.reverse();
        sortedColumnName = "";
    }
    else{
        sortedColumnName = columnName;
    }
    displayTableRows(dataToSort);
}


function downloadCSV() {
    let csvData: string[] = [];
    let rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        let csvrow: string[] = [];
        let cells = rows[i].querySelectorAll("td span,th span");
        for (let j = 0; j < cells.length; j++) {
            let cell = cells[j];
            if(cell instanceof HTMLElement)
                csvrow.push(cell.innerText);
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
    window.location.href = "addEmployee";
}
