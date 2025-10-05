import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ChartComponent} from 'ng-apexcharts';
import {example, Report} from '../types/types';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbar,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatTabGroup,
    MatTab,
    MatCardContent,
    ChartComponent,
    NgCircleProgressModule,
    MatIconModule,
    MatIconButton,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  loading = true;
  report: Report | undefined = example;
  error: string | undefined = undefined;
  isDownloaded = false;
  displayedColumns = ["name", "baseline", "baseline_high_date", "baseline_low_date"]

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    const file = params.get('file');

    // Fetch Report
    if (!file) {
      // TODO: handle if there's no file
    } else if (file.endsWith('.json')) {
      fetch(file).then(res => {
        this.loading = false;
        if (!res.ok) throw new Error('Failed to load report: ' + res.status);
        return res.json();
      }).then(json => (this.report = json)).catch(err => (this.error = String(err)));
    } else {
      this.isDownloaded = true;
      const apiUrl = `https://blinescan-bucket.belfodil.me/api/files/${file}`;
      this.http.get(apiUrl).subscribe({
        next: (data) => {
          this.report = data as Report;
          this.loading = false;
          console.log('✅ Report loaded:', data);
        },
        error: (err) => {
          this.error = 'Failed to fetch report.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  getAdoptionTimelineSeries() {
    return this.report!.charts.featureAdoptionTimeline.map(d => d.number);
  }

  getAdoptionTimelineXAxis() {
    return this.report!.charts.featureAdoptionTimeline.map(d => d.year.toString());
  }

  getHealthColor(percent: number): string {
    if (percent >= 80) return '#22c55e'; // green
    if (percent >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  }

  deleteReport() {
    // TODO: delete report
  }

}
