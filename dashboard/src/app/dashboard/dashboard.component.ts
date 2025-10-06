import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ApexXAxis, ChartComponent} from 'ng-apexcharts';
import {Report} from '../types/types';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {OverviewComponent} from './overview/overview.component';
import {FeaturesComponent} from './features/features.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {environment} from '../../environments/environment';

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
  report: Report | undefined = undefined;
  error: string | undefined;

  // -------------------------------- Charts Data
  dataLabels: ApexDataLabels = {enabled: true, formatter: (val: number) => `${val}%`};
  tooltip: ApexTooltip = {y: {formatter: (val: number) => `${val}%`}};
  timelineSeries: ApexAxisChartSeries = []
  timelineXAxis: ApexXAxis = {}

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    const file = params.get('file');

    // Fetch Report
    if (!file) this.error = "Missing report identifier. Please open a valid report or provide a valid ID in the URL."
    else if (file.endsWith('.json')) {
      fetch(file).then(res => {
        this.loading = false;
        if (!res.ok) throw new Error('Failed to load report: ' + res.status);
        return res.json();
      }).then(json => {
        this.report = json
        console.log(json);
        this.timelineSeries = [{
          name: 'Features',
          data: this.report!.charts.featureAdoptionTimeline.map(d => d.number)
        }];
        this.timelineXAxis = {categories: this.report!.charts.featureAdoptionTimeline.map(d => d.year.toString())};
      }).catch(err => (this.error = String(err)));
    } else {
      const apiUrl = `${environment.bucketUrl}/${file}`;
      this.http.get(apiUrl).subscribe({
        next: (data) => {
          this.report = data as Report;
          this.timelineSeries = [{
            name: 'Features',
            data: this.report!.charts.featureAdoptionTimeline.map(d => d.number)
          }];
          this.timelineXAxis = {categories: this.report!.charts.featureAdoptionTimeline.map(d => d.year.toString())};
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
