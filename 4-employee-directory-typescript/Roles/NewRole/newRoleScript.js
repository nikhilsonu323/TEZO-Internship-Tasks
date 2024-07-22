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