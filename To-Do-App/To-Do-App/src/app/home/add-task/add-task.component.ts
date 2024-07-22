import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Task } from '../../Models/Task';
import { TaskService } from '../../Services/task.service';
import { Statuses } from '../../Models/StatusModels';
import { Observable } from 'rxjs';
import { ToastService } from '../../Services/toast.service';
import { NgIf } from '@angular/common';
import { TrapFocusDirective } from '../../Directives/trap-focus.directive';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TrapFocusDirective],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit, OnDestroy{
  
  taskForm: FormGroup;
  @Input() task?: Task;
  @Output() close: EventEmitter<null> = new EventEmitter();

  constructor(private taskService: TaskService, private toastService: ToastService){
    this.taskForm = new FormGroup({
      title: new FormControl(null,[ Validators.required, Validators.pattern(/\S+/), Validators.maxLength(100)]),
      description: new FormControl(null, [Validators.required, Validators.pattern(/\S+/)])
    })
  }

  ngOnInit(): void {
    document.body.classList.add('overflow-none');
    if(this.task){
      this.taskForm.setValue({
        title: this.task.title,
        description: this.task.description,
      })
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-none');
  }

  onDialogClose(){
    if(this.taskForm.dirty)
    {
      if(confirm("Do you want to exit without saving")){ this.closeModal(); }
      return;
    }
    this.closeModal();
  }
  
  closeModal(){
    this.close.emit();
  }

  onSubmit(){
    if(this.taskForm.invalid) { return; }
    let task = this.getTaskDetails();
    let taskObs: Observable<Object>;
    
    if(this.task){
      //Update Mode
      taskObs = this.taskService.updateTask(task);
    }
    else{
      //Add Mode
      taskObs = this.taskService.addTask(task);
    }
    
    taskObs.subscribe({
      next: () => {
        let message = this.task == null ? 'Task Added Sucessfully' : 'Task Updated Sucessfully';
        this.toastService.show(message, "success");
        this.taskService.onUsersTasksChanged();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.show("An Error occured, Couldn't add Task", "error");
      }  
    })
  }

  getErrorMessage(err: ValidationErrors | null | undefined, fieldName: string){
    if(!err) return '';
    if(err['required'] || err['pattern'])
      return fieldName + ' is Required'
    if(err['maxlength']){
      return fieldName + ' cannot exceed '+err['maxlength'].requiredLength +' characters.'
    }
    return '';

  }

  private getTaskDetails(){
    let formData = this.taskForm.value;
    let task: Task = {
      userId: 0,
      taskId: this.task?.taskId ?? 0,
      statusId: Statuses.Active,
      title: formData.title.trim(),
      description: formData.description.trim(),
      createdOn: this.task?.createdOn ?? new Date(),
      completedOn: null,
      status: null,
    }
    return task;
  }
}
