export interface AddEmployee{
    empNo: string;
    firstName: string;
    lastName: string;
    email: string;
    
    locationId: number;
    
    roleId: number;

    managerId: string | null;

    projectId: number | null;
    
    statusId: number,
    
    mobileNumber: string | null;
    dateOfBirth: string | null;
    joiningDate: string;
    imageData: string | null;
  }
