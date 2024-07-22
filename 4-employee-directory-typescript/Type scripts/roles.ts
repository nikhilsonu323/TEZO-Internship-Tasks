function toViewAllEmployees(role: string){
    localStorage.setItem("role",role);
    window.location.href = 'RoleDetails/';
}