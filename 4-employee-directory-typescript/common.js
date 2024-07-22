var _a;
var isSideNavMinimized = false;
(_a = document.getElementById("minimize")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
    // if(isSideNavMinimized){
    //     document.getElementById("vNav")?.classList.add("w-300");
    //     document.querySelectorAll(".nav-items span").forEach((span)=>{
    //         span.classList.remove("hide-nav-items");
    //     })
    //     document.querySelectorAll(".nav-side-headings").forEach(element => {
    //         element.classList.remove("nav-headings-hidden");
    //     })
    //     document.querySelectorAll(".caret").forEach(caret => {
    //         caret.classList.remove("ds-none");
    //     })
    //     document.querySelector(".update")?.classList.remove("ds-none");
    //     document.querySelector("#logoImg")?.classList.remove("ds-none");
    //     document.getElementById("minimize")?.classList.remove("rotate-180");
    //     document.querySelector(".after")?.classList.add("side-red");
    //     document.querySelector(".section-85")?.classList.replace("section-85","section-300");
    // }
    // else{
    //     document.getElementById("vNav")?.classList.remove("w-300");
    //     document.querySelectorAll(".nav-items span").forEach((span)=>{
    //         span.classList.add("hide-nav-items");
    //     })
    //     document.querySelectorAll(".nav-side-headings").forEach(element => {
    //         element.classList.add("nav-headings-hidden");
    //     })
    //     document.querySelectorAll(".caret").forEach(caret => {
    //         caret.classList.add("ds-none");
    //     })
    //     document.querySelector(".update")?.classList.add("ds-none");
    //     document.querySelector("#logoImg")?.classList.add("ds-none");
    //     document.getElementById("minimize")?.classList.add("rotate-180");
    //     document.querySelector(".after")?.classList.remove("side-red");
    //     document.querySelector(".section-300")?.classList.replace("section-300","section-85");
    // }
    isSideNavMinimized = !isSideNavMinimized;
    togglesSideNav();
    localStorage.setItem("isSideNavMinimized", isSideNavMinimized ? "true" : "false");
});
function togglesSideNav() {
    var _a, _b, _c, _d, _e, _f, _g;
    (_a = document.getElementById("vNav")) === null || _a === void 0 ? void 0 : _a.classList.toggle("w-300");
    document.querySelectorAll(".nav-items span").forEach(function (span) {
        span.classList.toggle("hide-nav-items");
    });
    document.querySelectorAll(".nav-side-headings").forEach(function (element) {
        element.classList.toggle("nav-headings-hidden");
    });
    document.querySelectorAll(".caret").forEach(function (caret) {
        caret.classList.toggle("ds-none");
    });
    (_b = document.querySelector(".update")) === null || _b === void 0 ? void 0 : _b.classList.toggle("ds-none");
    (_c = document.querySelector("#logoImg")) === null || _c === void 0 ? void 0 : _c.classList.toggle("ds-none");
    (_d = document.getElementById("minimize")) === null || _d === void 0 ? void 0 : _d.classList.toggle("rotate-180");
    (_e = document.querySelector(".after")) === null || _e === void 0 ? void 0 : _e.classList.toggle("side-red");
    if (isSideNavMinimized)
        (_f = document.querySelector(".section-300")) === null || _f === void 0 ? void 0 : _f.classList.replace("section-300", "section-85");
    else
        (_g = document.querySelector(".section-85")) === null || _g === void 0 ? void 0 : _g.classList.replace("section-85", "section-300");
}
function delFromLocalStorage(name, value) {
    var dataSet = new Set(JSON.parse(localStorage.getItem(name) || "[]"));
    dataSet.delete(value);
    var dataArr = Array.from(dataSet);
    localStorage.setItem(name, JSON.stringify(dataArr));
}
// type employeeDataObjectType =  {[index: string]: string};
function getEmployeeData() {
    var employeeDetails = JSON.parse(localStorage.getItem("employeeData") || "{}");
    if (employeeDetails && employeeDetails.length > 0) {
        return employeeDetails;
    }
    return [];
}
function setSideNavMode() {
    var mode = localStorage.getItem('isSideNavMinimized');
    if (mode == "true") {
        isSideNavMinimized = true;
        togglesSideNav();
    }
}

setSideNavMode();