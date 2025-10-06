import {Component, Input} from '@angular/core';
import {Summary} from '../../types/types';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {NgCircleProgressModule} from 'ng-circle-progress';

@Component({
  selector: 'app-overview',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    NgCircleProgressModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  //Data
  @Input() summary: Summary | undefined;

  getHealthColor(percent: number): string {
    if (percent >= 70) return '#22c55e'; // green
    if (percent >= 50) return '#eab308'; // yellow
    return '#ef4444'; // red
  }
}
