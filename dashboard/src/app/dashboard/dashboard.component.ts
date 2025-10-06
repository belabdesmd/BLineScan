import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ApexXAxis, ChartComponent} from 'ng-apexcharts';
import {example, Report} from '../types/types';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {OverviewComponent} from './overview/overview.component';
import {FeaturesComponent} from './features/features.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

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
    MatIconModule,
    MatTooltipModule,
    OverviewComponent,
    FeaturesComponent,
    MatProgressSpinner
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  // -------------------------------- Data
  loading = false;
  report: Report | undefined = example;
  error: string | undefined;

  // -------------------------------- Charts Data
  dataLabels: ApexDataLabels = {enabled: true, formatter: (val: number) => `${val}%`};
  tooltip: ApexTooltip = {y: {formatter: (val: number) => `${val}%`}};
  timelineSeries: ApexAxisChartSeries = [{ name: 'Features', data: this.report!.charts.featureAdoptionTimeline.map(d => d.number)}]
  timelineXAxis: ApexXAxis = {categories: this.report!.charts.featureAdoptionTimeline.map(d => d.year.toString())}

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    const file = params.get('file');

    // Fetch Report
    if (!file) {
      // TODO: this.error = "Missing report identifier. Please open a valid report or provide a valid ID in the URL."
    } else if (file.endsWith('.json')) {
      fetch(file).then(res => {
        this.loading = false;
        if (!res.ok) throw new Error('Failed to load report: ' + res.status);
        return res.json();
      }).then(json => (this.report = json)).catch(err => (this.error = String(err)));
    } else {
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
}
