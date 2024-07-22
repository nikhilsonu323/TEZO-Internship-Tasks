import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { Task } from '../../Models/Task';
import { Statuses } from '../../Models/StatusModels';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TaskDetailComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit{
  @Input() tasks: Task[] = [];
  @Input() toShowTaskDetails: boolean = true;
  taskDetailsPosition: "top" | "bottom" = "bottom"

  @ViewChild('tasklist') taskListContainer!: ElementRef;

  statuses = Statuses
 
  taskId: null | number = null;

  ngOnInit(): void {
    document.body.addEventListener('click', (event: Event) => this.handleClickOutside(event));
  }

  showTaskDetails(taskId: number, event: MouseEvent){
    let toShowDetailsonTop = window.innerWidth < 550 ? (window.innerHeight - event.clientY)<180 : (window.innerHeight - event.clientY) < 320;
    if(toShowDetailsonTop){
      this.taskDetailsPosition = "top";
    }
    else{
      this.taskDetailsPosition = "bottom";
    }
    this.taskId =  this.taskId === taskId ? null : taskId;
  }

  private handleClickOutside(event: Event) {
    if (event.target === this.taskListContainer.nativeElement || !this.taskListContainer.nativeElement.contains(event.target as Node)) {
      this.taskId = null;
    }
  }
}
