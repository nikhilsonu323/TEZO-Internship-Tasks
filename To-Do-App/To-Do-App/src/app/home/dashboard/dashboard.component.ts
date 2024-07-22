import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TaskListHeaderComponent } from '../task-list-header/task-list-header.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { Task } from '../../Models/Task';
import { TaskService } from '../../Services/task.service';
import { Statuses } from '../../Models/StatusModels';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { Subscription, forkJoin } from 'rxjs';
import { NoTaskMessageComponent } from '../no-task-message/no-task-message.component';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [HeaderComponent, NgFor, TaskListHeaderComponent, TaskListComponent, StatCardComponent, NgIf, NgClass ,NoTaskMessageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  today = new Date();
  statuses = Statuses;
  taskChangesSubsricption!: Subscription;
  activeTasks: Task[] = [];
  completedTasks: Task[] = [];

  activeTasksPercent: number = 0;
  completedTasksPercent: number = 0;

  constructor(private taskService: TaskService){ }

  ngOnInit(): void {
    this.fetchTasks();
    this.taskChangesSubsricption = this.taskService.onTasksChange.subscribe(() =>{
      this.fetchTasks();
    })
  }

  ngOnDestroy(): void {
    this.taskChangesSubsricption.unsubscribe()
  }

  private fetchTasks(){
    forkJoin([this.taskService.getTasks({statusId: Statuses.Active}), this.taskService.getTasks({statusId: Statuses.Completed})])
    .subscribe(([activeTasks, completedTasks]) =>{
      this.activeTasks = activeTasks;
      this.completedTasks = completedTasks;
      this.calculatePercentage();
    })
  }

  private calculatePercentage(){
    if(this.completedTasks.length === 0 && this.activeTasks.length === 0){
      this.completedTasksPercent = 0;
      this.activeTasksPercent = 0;
      return;
    }
    this.completedTasksPercent = this.activeTasks.length === 0 ? 100 : 0;
    this.activeTasksPercent = this.completedTasks.length === 0 ? 100 : 0;

    if(this.completedTasks.length !== 0 && this.activeTasks.length !== 0){
      let value = (1/(this.activeTasks.length+this.completedTasks.length)) * 100;
      this.activeTasksPercent = value * this.activeTasks.length;
      this.completedTasksPercent = value * this.completedTasks.length;
    }
  }
}
