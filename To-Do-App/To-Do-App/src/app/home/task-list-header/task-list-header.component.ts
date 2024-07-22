import { DatePipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { ToastService } from '../../Services/toast.service';

@Component({
  selector: 'task-list-header',
  standalone: true,
  imports: [DatePipe, NgIf],
  templateUrl: './task-list-header.component.html',
  styleUrl: './task-list-header.component.css'
})
export class TaskListHeaderComponent {
  today = new Date()
  
  @Input() heading: string = '';
  @Input() showDelete: boolean = false;

  constructor(private taskService: TaskService, private toastservice: ToastService){ }

  deleteAllTask(){
    if (!confirm('Are you sure you want to delete all tasks?')) {
      return;
    }
    this.taskService.deleteAllTasks().subscribe({
      next: () =>{
        this.toastservice.show("Tasks deleted successfully!");
        this.taskService.onUsersTasksChanged();
      },
      error: (err) =>{
        this.toastservice.show("An error occurred while deleting tasks","error");
      }
    });
  }

}
