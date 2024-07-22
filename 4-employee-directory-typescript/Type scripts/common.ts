var isSideNavMinimized: boolean = false;
document.getElementById("minimize")?.addEventListener("click",()=>{
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
    togglesSideNav()
    localStorage.setItem("isSideNavMinimized",isSideNavMinimized?"true":"false");
})
function togglesSideNav(){
    document.getElementById("vNav")?.classList.toggle("w-300");
    document.querySelectorAll(".nav-items span").forEach((span)=>{
        span.classList.toggle("hide-nav-items");
    })
    document.querySelectorAll(".nav-side-headings").forEach(element => {
        element.classList.toggle("nav-headings-hidden");
    })
    document.querySelectorAll(".caret").forEach(caret => {
        caret.classList.toggle("ds-none");
    })
    document.querySelector(".update")?.classList.toggle("ds-none");
    document.querySelector("#logoImg")?.classList.toggle("ds-none");
    document.getElementById("minimize")?.classList.toggle("rotate-180");
    document.querySelector(".after")?.classList.toggle("side-red");
    if(isSideNavMinimized)
        document.querySelector(".section-300")?.classList.replace("section-300","section-85");
    else
        document.querySelector(".section-85")?.classList.replace("section-85","section-300");
}

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

function setSideNavMode(){
    let mode = localStorage.getItem('isSideNavMinimized');
    if(mode=="true"){
        isSideNavMinimized = true;
        togglesSideNav();
    }
}

setSideNavMode();