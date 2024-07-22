function delFromLocalStorage(name: string,value: string): void{
    let dataSet = new Set<string>(JSON.parse(localStorage.getItem(name) || "[]"));
    dataSet.delete(value);
    let dataArr = Array.from(dataSet);
    localStorage.setItem(name,JSON.stringify(dataArr));
}

// type employeeDataObjectType =  {[index: string]: string};
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
