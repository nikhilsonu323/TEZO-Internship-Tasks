import { Employee } from "./Employee";

export interface Role{
    id: number;
    roleName: string;

    departmentId: number;
    department: string;

    locationId: number;
    location: string;
    
    description: string | null;

    employees: Employee[] | null;
}