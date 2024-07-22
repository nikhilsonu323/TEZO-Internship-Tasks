import { Manager } from "./AddEmployeeOptions";
import { Role } from "./Role";

export interface Employee{
    empNo: string;
    firstName: string;
    lastName: string;
    email: string;
    
    locationId: number;
    location: string;

    roleId: number;
    role: Role;

    managerId: string | null;
    manager: Manager | null;

    projectId: number | null;
    project: string | null;

    
    statusId: number,
    status: string,
    
    mobileNumber: string | null;
    dateOfBirth: string | null;
    joiningDate: string;
    imageData: string | null;

    [key: string]: any
  }
