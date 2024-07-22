export class OptionDisplayHandler{
    Status: boolean = false;
    Location: boolean = false;
    Department: boolean = false;
}

export class FilterHandler{
    Status?: boolean;
    Location?: boolean;
    Department?: boolean;
}


export class FilterOptions{
    status: {
        id: number,
        statusType: string}[] = [];
    departments: {
        id: number,
        name: string}[] = [];
    location: {
        id: number,
        city: string}[] = [];
}