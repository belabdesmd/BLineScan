import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  report: Report | undefined = undefined;
  error: string | undefined = undefined;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    const file = params.get('file');

    // Fetch Report
    if (!file) {
      // TODO: handle if there's no file
    } else if (file.endsWith('.json')) {
      fetch(file).then(res => {
        if (!res.ok) throw new Error('Failed to load report: ' + res.status);
        return res.json();
      }).then(json => (this.report = json)).catch(err => (this.error = String(err)));
    } else {
      // TODO: fetch report remotely
    }
  }

}
