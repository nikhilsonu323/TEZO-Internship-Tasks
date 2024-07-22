namespace EmployeeDirectory.Concerns.Enums

{
    public enum EmployeeEditableDetailsEnum
    {
        FirstName = 1, LastName, DateOfBirth, Email, MobileNumber, Location, Role, Manager, Project, SaveAndGoback, Goback
    }

    public enum EmployeeDetails
    {
        EmployeeNumber, FirstName, LastName, DateOfBirth, Email, MobileNumber, Location, RoleId, Manager, Project
    }
    public enum EmployeeManagementOptions
    {
        AddEmployee = 1, DisplayAll, DisplayOne, EditEmployee, DeleteEmployee, GoBack
    }

    public enum RoleManagementOptions
    {
        AddRole = 1, DisplayAll, GoBack
    }

    public enum ValidationResultsEnum
    {
        Valid, Empty, NotValid, Exists, InvalidDate, JoiningDateIsGreaterThanCurrentDate, AgeLimitExceeded,
        JoiningDateGreaterThanDob, MinimunJoiningAgeRequired,
        InvalidEmpNo, InvalidName, InvalidEmail, InvalidMobileNumber,
        NotFound
    }
}
