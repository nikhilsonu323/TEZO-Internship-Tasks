// import { employeeDataObjectType,getEmployeeData,delFromLocalStorage } from "./exports";
let mode: number,prevEmail: string = "",prevEmpno: string = "",errors: Set<string>= new Set();
let form = document.querySelector("#employeeForm") as HTMLFormElement;

function loadAddEmployee(){
    checkMode();//view employee details or edit employee details or add employee
    setAddEmployeeMode();
    handleImageInput();
    setManagerNames();
    addEmployeeFormSubmit();
    document.getElementById("phoneNumber")?.addEventListener("keypress",(e)=>{
        let code: number = e.key.charCodeAt(0);
        if(!((code>=48 && code<=57) || code==32 || code==45 || code==43 || code==69))
            e.preventDefault()
    })
}
function toEmployees(){
    window.location.href = "/Employees"
}

function setManagerNames(){
    let managerSelect = document.querySelector("#assignManager");
    if(managerSelect instanceof HTMLSelectElement){
        let employeesData = getEmployeeData();
        let index = -1,optHtml = ``;
        if(mode==1){
            let value = localStorage.getItem("index") ;
            index = value? parseInt(value): -1;
        }
        for (let i = 0; i < employeesData.length; i++) {
            if(i!=index)
                optHtml += `<option>${employeesData[i].user}</option>`
        }
        managerSelect.innerHTML += optHtml;
    }
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

function setInnerText(query: string,text: string){
    let element = document.querySelector(query); 
    if(element instanceof HTMLElement){
        element.innerText = text;
    }
}

function setAddEmployeeMode(){
    if(mode==0){
        document.getElementById("editProfile")?.classList.add("ds-none");
        document.getElementById("employeeForm")?.classList.remove("flex");
        let imageInput = document.querySelector(".image-input");
        imageInput?.classList.add("flex-center");
        imageInput?.classList.add("gap-2r");
    }
    else if(mode==1){
        setInnerText(".message","Employee details Updated Sucessfully");
        setInnerText("#formHeading","EDIT EMPLOYEE");
        setInnerText("button[type='submit']","Update Employee");
        document.getElementById("addProfile")?.classList.add("ds-none");
        let userDetails = localStorage.getItem("editData");
        if(userDetails)
            showEmployeeDetails(JSON.parse(userDetails));
        localStorage.removeItem("editData");
    }
    else{
        setInnerText("#formHeading","VIEW EMPLOYEE DETAILS");
        document.getElementById("uploadProfile")?.classList.add("ds-none");
        document.getElementById("formBtns")?.classList.add("ds-none");
        let userDetails = localStorage.getItem("viewDetails");
        if(userDetails)
            showEmployeeDetails(JSON.parse(userDetails));
        localStorage.removeItem("viewDetails");
        readOnlyMode();
    }
}

function showEmployeeDetails(userData: employeeDataObjectType){
    // let inputFieldIds = new Set(["empNo","firstName","lastName","email","phoneNumber","dob","joiningDate"]);
    let inputId: keyof employeeDataObjectType;
    for(inputId in userData){
        // if(inputFieldIds.has(inputId))
        setInputValue(document.getElementById(inputId),userData[inputId]);
    }
    prevEmail = userData.email;
    prevEmpno = userData.empNo;
    setImageSrc("profileImg",userData.imageSrc);
    selectOption("inputLocation",userData.location);
    selectOption("inputDepartment",userData.department);
    selectOption("title",userData.role);
    selectOption("assignProject",userData.assignProject);
    selectOption("assignManager",userData.assignManager);
}

function setImageSrc(id: string,url: string){
    let image = document.getElementById(id);
    if(image instanceof HTMLImageElement){
        image.src = url;
    }
}

function setInputValue(element: HTMLElement | null,value: string){
    if(element instanceof HTMLInputElement){
        element.value = value;
    }
}

function setReadOnly(element: HTMLElement | null){
    if(element instanceof HTMLInputElement){
        element.readOnly = true;
    }
}

function setDisabledTrue(element: HTMLElement | null){
    if(element instanceof HTMLSelectElement){
        element.disabled = true;
    }
}

function selectOption(id: string, value: string){
    document.getElementById(id)?.querySelectorAll("option").forEach(e=>{
        if(e.innerText == value){
            e.selected = true;
        }
    }) 
}

function readOnlyMode(){
    //Read only mode restricts user from modifying data
    let inputFieldIds = ["empNo","firstName","lastName","email","phoneNumber","dob","joiningDate"];
    let selectFieldIds = ["inputLocation","inputDepartment","title","assignProject","assignManager"]
    for(let inputId in inputFieldIds){
        setReadOnly(document.getElementById(inputId));
    }
    for(let selectId in selectFieldIds){
        setDisabledTrue(document.getElementById(selectId));
    }
}

function validateFnameListener(){
    validateName("firstName");
}
function validateLnameListener(){
    validateName("lastName");
}
function handleErrorMsg(valid: boolean,inputId: string){
    if(valid){
        clearErrors(inputId);
        errors.delete(inputId);
    }
    else
        errors.add(inputId);
}
function validateEmpno(){
    let inputId = "empNo"
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let empNo = inputElement.value.trim(),valid = true;
    if(empNo.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",inputElement);
        valid = false;
    }
    let regEmpno = /^TZ[0-9]{4,}$/;
    let match = regEmpno.test(empNo);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Employee Number (TZ0000..)",inputElement);
        valid = false;
    }
    let empNumbers = localStorage.getItem("empNos");
    let empNos: Set<string> = new Set(JSON.parse(empNumbers ? empNumbers : "[]"));
    if(valid && (mode==0 && empNos.has(empNo)) || (mode==1 && empNo!=prevEmpno && empNos.has(empNo))){
        showValidationError(`.${inputId}-error`,"Employee Number already exists",inputElement);
        valid = false;        
    }
    handleErrorMsg(valid,inputId);
}

function validateName(inputId: string){
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let name = inputElement.value.trim(),valid = true;
    if(name.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",inputElement);
        valid = false;
    }
    let regName = /^[a-zA-Z]+([ ]?[a-zA-Z]+){0,2}$/;
    let match = regName.test(name);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Name",inputElement);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateEmail(){
    let inputId = "email";
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let email = inputElement.value.trim(),valid = true;
    if(email.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",inputElement);
        valid = false;
    }
    let regEmail = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9]+[.][a-zA-Z]+$/;
    let match = regEmail.test(email);
    if(valid && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Email",inputElement);
        valid = false;
    }
    let userEmails = localStorage.getItem("emails");
    let emails: Set<string> = new Set(JSON.parse(userEmails ? userEmails : "[]"));
    if(valid && (mode==0 && emails.has(email)) || (mode==1 && email!=prevEmail && emails.has(email))){
        showValidationError(`.${inputId}-error`,"Email already exists",inputElement);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validatephoneNumber(){
    let inputId = "phoneNumber";
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let phoneNumber = inputElement.value.trim(),valid = true;
    let regPhone = /^(\+[0-9]{1,3}[- ]?)?[6-9]{1}[0-9]{9}$/
    let match = regPhone.test(phoneNumber);
    if(phoneNumber.length!=0 && !match){
        showValidationError(`.${inputId}-error`,"Enter valid Mobile Number",inputElement);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateDate(){
    let inputId = "joiningDate";
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let dateString = inputElement.value.trim(),valid = true;
    if(dateString.length==0){
        showValidationError(`.${inputId}-error`,"This Field is required",inputElement);
        valid = false;
    }
    let currentDate = new Date();
    let date = new Date(dateString);
    if(valid && date>currentDate){
        showValidationError(`.${inputId}-error`,"Enter valid Date",inputElement);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function validateDob(){
    let inputId = "dob";
    let inputElement = form[inputId];
    if(!(inputElement instanceof HTMLInputElement)) return;
    let dateString = inputElement.value.trim(),valid = true;
    let currentDate = new Date();
    let date = new Date(dateString);
    if(date.toString()!="Invalid Date" && date>currentDate){
        showValidationError(`.${inputId}-error`,"Enter valid Date",inputElement);
        valid = false;
    }
    handleErrorMsg(valid,inputId);
}

function clearErrors(inputId: string){
    let errorClassName = `.${inputId}-error`;
    document.querySelector(errorClassName)?.classList.add("ds-none");
    let li = document.querySelector(errorClassName)?.parentNode;
    if(li instanceof HTMLElement)
        li.classList.remove("br-red");
}

function showValidationError(errorMsgClassName: string,msg: string,inputElement: HTMLInputElement){
    let alertImg = `<img src="/images/alert.png" alt="">`;
    let errorElement = document.querySelector(errorMsgClassName);
    if(!(errorElement instanceof HTMLParagraphElement)) return;
    errorElement.classList.remove("ds-none");
    errorElement.innerHTML = alertImg + msg;
    let li = inputElement.parentNode;
    if(!(li instanceof HTMLElement)) return;
    li.classList.add("br-red");
}

function addInputValidationListeners(){
    let inputs = ["empNo","firstName","lastName","email","phoneNumber","joiningDate","dob"];
    form[inputs[0]].addEventListener("keyup",validateEmpno);
    form[inputs[1]].addEventListener("keyup",validateFnameListener);
    form[inputs[2]].addEventListener("keyup",validateLnameListener);
    form[inputs[3]].addEventListener("keyup",validateEmail);
    form[inputs[4]].addEventListener("keyup",validatephoneNumber);
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
        validateName("firstName");
        validateName("lastName");
        validateEmail();
        validatephoneNumber();
        validateDate();
        validateDob();
        if(errors.size>0)
            return;
        storeData();
    }
}

function handleImageInput(){
    let profile = document.getElementById("profileInput") as HTMLInputElement;
    profile.addEventListener("change",()=>{
        let fileReader = new FileReader();
        if(profile.files){
            fileReader.readAsDataURL(profile.files[0]);
            fileReader.onload = ()=>{
                if(typeof fileReader.result == "string")
                    setImageSrc("profileImg",fileReader.result)
            }
        }
    })
}

function getInputValue(id: string){
    let inputElement = document.getElementById(id);
    if(!(inputElement instanceof HTMLInputElement)) return "";
    return inputElement.value.trim();
}

function getSelectedValue(id: string){
    let inputElement = document.getElementById(id);
    if(!(inputElement instanceof HTMLSelectElement)) return "";
    return inputElement.options[inputElement.selectedIndex].innerText;
}

function getImageSrc(id: string){
    let imageElement = document.getElementById(id);
    if(!(imageElement instanceof HTMLImageElement)) return "";
    return imageElement.src;
}

function storeData(){
    let firstName = getInputValue("firstName"),lastName = getInputValue("lastName");
    let email = getInputValue("email"),phoneNumber = getInputValue("phoneNumber"),empNo = getInputValue("empNo")
    let joiningDate = getInputValue("joiningDate"),dob = getInputValue("dob");
    let user = firstName+" "+lastName;
    //retriving select tag values 
    let location = getSelectedValue("inputLocation"),department = getSelectedValue("inputDepartment"),role = getSelectedValue("title");
    let assignManager = getSelectedValue("assignManager"),assignProject = getSelectedValue("assignProject");
    let imageSrc = getImageSrc("profileImg");
    let status = "Active";
    
    let newEmployeeData: employeeDataObjectType = {user,firstName,lastName,location,department,status,role,empNo,joiningDate,imageSrc,assignManager,assignProject,email,phoneNumber,dob};
    let employeesDataString = localStorage.getItem("employeeData");
    let employeesData: employeeDataObjectType[] = [] ;
    if(employeesDataString){
        employeesData = JSON.parse(employeesDataString);
    }
    if(mode==1){
        let value = localStorage.getItem("index") ;
        if(value){
            let index = parseInt(value);
            employeesData[index] = newEmployeeData;
        }
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

    document.querySelector(".message")?.classList.add("success");
    form.reset();
    setImageSrc("profileImg","/images/user3.png");
    setTimeout(()=>{
        document.querySelector(".message")?.classList.remove("success");
        toEmployees();
    },1000)
}

function addDataToLocalStorage(value: string,name: string){
    let dataSet: Set<string> = new Set(),localStorageValue = localStorage.getItem(name);
    if(localStorageValue){
        dataSet = new Set(JSON.parse(localStorageValue));
    }
    dataSet.add(value);
    let dataArr = Array.from(dataSet)
    localStorage.setItem(name,JSON.stringify(dataArr));
}