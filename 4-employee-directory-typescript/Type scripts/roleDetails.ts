let employeeData: employeeDataObjectType[];

function initialize(){
    let role = localStorage.getItem("role");
    employeeData = getEmployeeData();
    console.log(role);
    
    if(role == null){
        displayEmployeeData(employeeData);
        return;
    }
    let filteredEmployeeData = employeeData.filter(employee => {
        if(employee.role.toLocaleLowerCase() == role?.toLocaleLowerCase()) return true
    })
    displayEmployeeData(filteredEmployeeData)
    
}

function displayEmployeeData(employeeData: employeeDataObjectType[]){
    let boxesHtml = ``;
    for (let i = 0; i < employeeData.length; i++) {
        boxesHtml+=
         `<div class="boxes">
            <div class="flex-center">
                <div><img class="details-user-icon" src="${employeeData[i].imageSrc}" alt="user_image"></div>
                <div>
                    <div class="f-bold f-14">${employeeData[i].user}</div>
                    <div class="f-13">${employeeData[i].role}</div>
                </div>
            </div>
            <div class="details">
                <div><img src="/images/Vector (1).svg" alt=""> <span name="empId">${employeeData[i].empNo}</span> </div>
                <div><img src="/images/email-1_svgrepo.com.svg" alt=""> <span>${employeeData[i].email}</span> </div>
                <div><img src="/images/team_svgrepo.com.svg" alt=""> <span>${employeeData[i].department}</span> </div>
                <div><img src="/images/location-pin-alt-1_svgrepo.com.svg" alt=""> <span>${employeeData[i].location}</span></div>
                <div class="f-right c-pointer" onclick="viewEmployeeDetails(this)">View <img src="/images/Vector.svg" alt=""></div>
            </div>
        </div>`
    }
    let employeesDataBoxes = document.getElementById("employeesDataBoxes");
    if(employeesDataBoxes)
        employeesDataBoxes.innerHTML = boxesHtml;
    if(employeeData.length == 0)
        document.getElementById("noDataMsg")?.classList.remove("ds-none");
}

function viewEmployeeDetails(element: HTMLElement){
    let userDataBox = element.parentNode?.parentNode;
    if(userDataBox instanceof HTMLElement){
        let empIdSpan = userDataBox.querySelector("span[name=empId]");
        if(empIdSpan instanceof HTMLElement){
            let empNo = empIdSpan.innerText;
            for (let i = 0; i < employeeData.length; i++) {
                if(employeeData[i].empNo == empNo){
                    localStorage.setItem("index",i.toString())
                    localStorage.setItem("viewDetails",JSON.stringify(employeeData[i]));
                    break;
                }
            }
            window.location.href = "/Employees/addEmployee";
        }
    }
}

function getEmployeeData():employeeDataObjectType[]{
    let employeeDetails = JSON.parse(localStorage.getItem("employeeData") || "{}");
    if (employeeDetails && employeeDetails.length > 0) {
        return employeeDetails;
    }
    return [];
}

type employeeDataObjectType =  {
    user: string;
    firstName: string;
    lastName: string;
    location: string;
    department: string;
    status: string;
    role: string;
    empNo: string;
    joiningDate: string;
    imageSrc: string;
    assignManager: string;
    assignProject: string;
    email: string;
    phoneNumber: string;
    dob: string;
}