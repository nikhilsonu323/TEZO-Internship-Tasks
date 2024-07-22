export interface Task{
    userId: number;
    taskId: number;
    title: string;
    description: string;
    statusId: number;
    status: string | null;
    createdOn: Date;
    completedOn: Date | null;
}