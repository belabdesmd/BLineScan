import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  loading = true;
  report: Report | undefined = undefined;
  error: string | undefined = undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

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
