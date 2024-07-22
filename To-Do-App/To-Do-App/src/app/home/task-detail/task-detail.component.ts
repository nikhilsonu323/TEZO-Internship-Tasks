import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Statuses } from '../../Models/StatusModels';
import { Task } from '../../Models/Task';
import { TaskService } from '../../Services/task.service';
import { ToastService } from '../../Services/toast.service';


@Component({
  selector: 'task-detail',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent{
  @Input() task!: Task;
  @Input() position: "top" | "bottom" = "bottom";

  @ViewChild('taskDetail') taskDetail!:ElementRef;

  statuses = Statuses

  constructor(private taskService: TaskService, private toastService: ToastService){ }

  editTask(){
    this.taskService.openDialogEditTask(this.task);
  }
  
  toggleStatus(){
    let msg = this.task.statusId == Statuses.Active ? "Task completed! It is now listed as 'Completed'." : "Task reopened. You can find it under 'Active Tasks'.";
    this.task.statusId = this.task.statusId === Statuses.Active ? Statuses.Completed : Statuses.Active;
    this.taskService.updateTask(this.task).subscribe({
      next: () => {
        this.toastService.show(msg,"success");
        this.taskService.onUsersTasksChanged()
      },
      error: () =>{
        this.toastService.show("An error occured","error")
      }
    });
  }

  deleteTask(){
    let msg = `Are you sure you want to delete the task?\nTitle = ${this.task.title}`
    if (!confirm(msg)) {
      return;
    }
    this.taskService.deleteTask(this.task.taskId).subscribe({
      next: () => {
        this.toastService.show("Task deleted sucessfully","success");
        this.taskService.onUsersTasksChanged()
      },
      error: () =>{
        this.toastService.show("An error occured","error")
      }
    });
  }

  timeSince(date: Date): string {
    const now = new Date();
    
    const diffInMs = now.getTime() - new Date(date).getTime();
  
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years > 0) {
      return years + " years ago";
    } else if (months > 0) {
      return months + " months ago";
    } else if (days > 0) {
      return days + " days ago";
    } else if (hours > 0) {
      return hours + " hours ago";
    } else if (minutes > 0) {
      return minutes + " minutes ago";
    } else {
      return "just now";
    }
  }
}
