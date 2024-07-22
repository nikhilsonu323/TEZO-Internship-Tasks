var employeeData;
function initialize() {
    var role = localStorage.getItem("role");
    // localStorage.removeItem("role")
    employeeData = getEmployeeData();
    console.log(role);
    if (role == null) {
        displayEmployeeData(employeeData);
        return;
    }
    var filteredEmployeeData = employeeData.filter(function (employee) {
        if (employee.role.toLocaleLowerCase() == (role === null || role === void 0 ? void 0 : role.toLocaleLowerCase()))
            return true;
    });
    displayEmployeeData(filteredEmployeeData);
}
function displayEmployeeData(employeeData) {
    var _a;
    var boxesHtml = "";
    for (var i = 0; i < employeeData.length; i++) {
        boxesHtml +=
            "<div class=\"boxes\">\n            <div class=\"flex-center\">\n                <div><img class=\"details-user-icon\" src=\"".concat(employeeData[i].imageSrc, "\" alt=\"user_image\"></div>\n                <div>\n                    <div class=\"f-bold f-14\">").concat(employeeData[i].user, "</div>\n                    <div class=\"f-13\">").concat(employeeData[i].role, "</div>\n                </div>\n            </div>\n            <div class=\"details\">\n                <div><img src=\"/images/Vector (1).svg\" alt=\"\"> <span name=\"empId\">").concat(employeeData[i].empNo, "</span> </div>\n                <div><img src=\"/images/email-1_svgrepo.com.svg\" alt=\"\"> <span>").concat(employeeData[i].email, "</span> </div>\n                <div><img src=\"/images/team_svgrepo.com.svg\" alt=\"\"> <span>").concat(employeeData[i].department, "</span> </div>\n                <div><img src=\"/images/location-pin-alt-1_svgrepo.com.svg\" alt=\"\"> <span>").concat(employeeData[i].location, "</span></div>\n                <div class=\"f-right c-pointer\" onclick=\"viewEmployeeDetails(this)\">View <img src=\"/images/Vector.svg\" alt=\"\"></div>\n            </div>\n        </div>");
    }
    var employeesDataBoxes = document.getElementById("employeesDataBoxes");
    if (employeesDataBoxes)
        employeesDataBoxes.innerHTML = boxesHtml;
    if (employeeData.length == 0)
        (_a = document.getElementById("noDataMsg")) === null || _a === void 0 ? void 0 : _a.classList.remove("ds-none");
}
function viewEmployeeDetails(element) {
    var _a;
    var userDataBox = (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
    if (userDataBox instanceof HTMLElement) {
        var empIdSpan = userDataBox.querySelector("span[name=empId]");
        if (empIdSpan instanceof HTMLElement) {
            var empNo = empIdSpan.innerText;
            for (var i = 0; i < employeeData.length; i++) {
                if (employeeData[i].empNo == empNo) {
                    localStorage.setItem("index", i.toString());
                    localStorage.setItem("viewDetails", JSON.stringify(employeeData[i]));
                    break;
                }
            }
            window.location.href = "/Employees/addEmployee";
        }
    }
}
