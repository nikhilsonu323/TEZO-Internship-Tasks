import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../Models/Task';
import { Subject, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = environment.tasks;

  onTasksChange: Subject<void> = new Subject();
  editTask: Subject<Task> = new Subject();

  constructor(private http: HttpClient, private toastService: ToastService) { }

  getTasks(queryParams?: {
    createdOn?: Date,
    CompletedOn?: Date,
    statusId?: number
  }){
    let params = new HttpParams();
    if(queryParams?.createdOn){
      params = params.append("createdOn", queryParams.createdOn.toLocaleString())
    }
    if(queryParams?.CompletedOn){
      params = params.append("completedOn", queryParams.CompletedOn.toLocaleString())
    }
    if(queryParams?.statusId){
      params = params.append("statusId", queryParams.statusId)
    }

    return this.http.get<Task[]>(this.url, {params: params}).pipe(
    catchError(err=>{
      if(err.status != 401)
        this.toastService.show("Failed to retrieve tasks. Check your internet connection and try again.","error");
      console.log(err);
      throw err;
    }));
  }

  addTask(task: Task){
    return this.http.post(this.url+'/Add', task);
  }

  updateTask(task: Task){
    return this.http.put(this.url+'/Update', task);
  }

  deleteTask(taskId: number){
    return this.http.delete(this.url+'/'+taskId);
  }

  deleteAllTasks(date?: Date){
    let params = new HttpParams();
    if(date){
      params = params.append("date", date.toISOString())
    }
    return this.http.delete(this.url, {params: params});
  }

  onUsersTasksChanged(){
    this.onTasksChange.next();
  }

  openDialogEditTask(task: Task){
    this.editTask.next(task);
  }
}
