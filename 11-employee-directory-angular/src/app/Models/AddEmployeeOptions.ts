export interface Manager{
    empNo: string;
    firstName: string;
    lastName: string;
}

export interface Location{
    id: number, 
    city: string
}

export interface Department{
    id: number,
    name: string
}

export interface Status{
    id: number, 
    statusType: string
}

export interface Project{
    id: number, 
    name: string
}