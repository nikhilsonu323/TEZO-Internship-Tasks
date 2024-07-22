import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Statuses } from '../../Models/StatusModels';

@Component({
  selector: 'stat-card',
  standalone: true,
  imports: [DecimalPipe, NgClass, NgIf],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input() percent!: number;
  @Input() statusType!: Statuses;

  statuses = Statuses;

  @Input() backgroundColor!: 'brown' | 'orange';
}
