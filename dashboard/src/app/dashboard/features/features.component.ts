import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Feature} from '../../types/types';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgClass, TitleCasePipe} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-features',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatTooltipModule,
    TitleCasePipe,
    NgClass,
    MatHeaderCellDef,
    MatHeaderRow,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements OnChanges {
  baselineOptions = ['Experimental', 'Low', 'Medium', 'High'];
  displayedColumns = ["name", "baseline", "baseline_high_date", "baseline_low_date"]
  selectedBaselines: string[] = []
  @Input() features: Feature[] | undefined;
  filteredFeatures: Feature[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.filteredFeatures = this.features!
  }

  applyBaselineFilter() {
    if (this.selectedBaselines.length === 0) {
      this.filteredFeatures = this.features!;
      return;
    }

    this.filteredFeatures = this.features!.filter(f =>
      this.selectedBaselines.map((b => b.toLowerCase())).includes(f.status.baseline)
    );
  }
}
