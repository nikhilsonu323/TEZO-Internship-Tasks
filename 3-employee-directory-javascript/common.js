let isSideNavMinimized = false;
document.getElementById("minimize").addEventListener("click",()=>{
    if(isSideNavMinimized){
        document.getElementById("vNav").classList.add("w-300");
        document.querySelectorAll(".nav-items span").forEach((span)=>{
            span.classList.remove("hide-nav-items");
        })
        document.querySelectorAll(".navHeadings").forEach(element => {
            element.classList.remove("nav-headings-hidden");
        })
        document.querySelectorAll(".caret").forEach(caret => {
            caret.classList.remove("ds-none");
        })
        document.querySelector(".update").classList.remove("ds-none");
        document.querySelector("#logoImg").classList.remove("ds-none");
        document.querySelector(".after").classList.add("side-red");
        document.getElementById("minimize").classList.remove("rotate-180");
        document.querySelector(".section-85").classList.replace("section-85","section-300");

    }
    else{
        document.getElementById("vNav").classList.remove("w-300");
        document.querySelectorAll(".nav-items span").forEach((span)=>{
            span.classList.add("hide-nav-items");
        })
        document.querySelectorAll(".navHeadings").forEach(element => {
            element.classList.add("nav-headings-hidden");
        })
        document.querySelectorAll(".caret").forEach(caret => {
            caret.classList.add("ds-none");
        })
        document.querySelector(".update").classList.add("ds-none");
        document.querySelector("#logoImg").classList.add("ds-none");
        document.querySelector(".after").classList.remove("side-red");
        document.getElementById("minimize").classList.add("rotate-180");
        document.querySelector(".section-300").classList.replace("section-300","section-85");
    }
    isSideNavMinimized = !isSideNavMinimized;
})