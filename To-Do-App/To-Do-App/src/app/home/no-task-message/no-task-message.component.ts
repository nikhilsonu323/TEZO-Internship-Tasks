import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-task-message',
  standalone: true,
  imports: [],
  templateUrl: './no-task-message.component.html',
  styleUrl: './no-task-message.component.css'
})
export class NoTaskMessageComponent {
  @Input() message = "There are no tasks to display.";
}
