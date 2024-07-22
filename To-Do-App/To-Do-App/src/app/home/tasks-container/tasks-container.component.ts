import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TaskListHeaderComponent } from '../task-list-header/task-list-header.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { Task } from '../../Models/Task';
import { TaskService } from '../../Services/task.service';
import { Statuses } from '../../Models/StatusModels';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NoTaskMessageComponent } from '../no-task-message/no-task-message.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'tasks-container',
  standalone: true,
  imports: [HeaderComponent, TaskListHeaderComponent, TaskListComponent,NoTaskMessageComponent, NgIf],
  templateUrl: './tasks-container.component.html',
  styleUrl: './tasks-container.component.css'
})
export class TasksContainerComponent implements OnInit, OnDestroy{
  tasks: Task[] = [];
  taskChangesSubsricption!: Subscription;
  taskType: Statuses = Statuses.Active;
  Statuses = Statuses;

  constructor(private taskService: TaskService, private activatedRoute: ActivatedRoute){ }


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data =>{
      let taskStatus = data['taskType'];
      this.taskType = taskStatus;
      this.fetchTasks();
    })
    this.taskChangesSubsricption = this.taskService.onTasksChange.subscribe(() =>{
      this.fetchTasks();
    })
  }

  ngOnDestroy(): void {
    this.taskChangesSubsricption.unsubscribe()
  }
  
  getMessage(){
    let taskTypeString = this.taskType == Statuses.Active ? "Active" : "Completed";
    return "There are no "+ taskTypeString +" tasks to display at this time."
  }

  private fetchTasks(){
    this.taskService.getTasks({statusId: this.taskType}).subscribe(data =>{
      this.tasks = data;
    });
  }
}
