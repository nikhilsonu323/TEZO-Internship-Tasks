import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { NgIf } from '@angular/common';
import { TaskService } from '../Services/task.service';
import { Task } from '../Models/Task';

@Component({
  selector: 'home',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AddTaskComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  showAddTaskModal = false;
  editingTask?: Task;
  @ViewChild('home') homeDiv!: ElementRef;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.editTask.subscribe(task => {
      this.editingTask = task;
      this.openDialog();
    })
  }

  openDialog(){
    this.showAddTaskModal = true;
    this.homeDiv.nativeElement.classList.add('blur');
  }

  closeAddTaskModal(){
    this.showAddTaskModal = false;
    this.homeDiv.nativeElement.classList.remove('blur');
    this.editingTask = undefined;
  }

}
