function loadAlphabets(){
    let htmlLetters = ``;
    for (let i = 0; i < 26; i++) {
        htmlLetters += `<span class="letter">${String.fromCharCode(65+i)}</span>`;
    }
    document.getElementsByClassName("alphabets")[0].innerHTML += htmlLetters;
}
function statusHtml(status){
    if(status){
        return `<span class="active">Active</span>`;
    }
    return `<span class="not-active">Not Active</span>`;
}

async function fetchUserData(){
    const reponse = await fetch("./user_Information2.json");
    const data = await reponse.json();
    let htmlRows = ``;
    for (let i = 0; i < data.length; i++) {
        htmlRows += `
        <tr>
        <td><input type="checkbox" class="userCheckbox"></td>
        <td class="flex-center gap05"><div><img class="table-user-icon" src="images/user1.png" alt=""></div>
            <div class="span-block"><span>${data[i].user}</span><span>Abel40@gmail.com</span>
        </td>
        <td><span>${data[i].location}</span></td>
        <td><span>${data[i].department}</span></td>
        <td><span>${data[i].role}</span></td>
        <td><span>${data[i].empNo}</span></td>
        <td><span class="active">Active</span></td>
        <td><span>${data[i].joinDt.slice(0,10)}</span></td>
        <td class="dots padd-r-1r"><i class="ph ph-dots-three"></i></td>
        </tr>`;
    }
    document.getElementById("userTable").innerHTML += htmlRows;
}


loadAlphabets();
fetchUserData();