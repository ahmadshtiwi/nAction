import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartPosition } from '../chartPosition';

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title: string = 'Project Distribution';

  chart!: Chart;

  private readonly modernColors: string[] = [
    '#A8DADC', '#457B9D', '#E63946', '#919AEE', '#2A9D8F',
    '#F4A261', '#E76F51', '#264653', '#E9C46A', '#A29BFE',
    '#81B29A', '#F6BD60', '#B5838D', '#6D6875', '#CB997E',
    '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'
  ];

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart&&(changes['data'] || changes['labels'])) {
      this.updateChart();
    }
  }

  updateChart(): void {
    this.chart.destroy();
    this.createChart();
  }

  private createChart(): void {
    const ctx = this.pieCanvas?.nativeElement.getContext('2d'); 

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.data,
            backgroundColor: this.labels.map((_, index) =>
              this.modernColors[index % this.modernColors.length]
            ),
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: ChartPosition.Right,
              labels: {
                color: '#555',
                boxWidth: 10,
                padding: 5,
                font: {
                  size: 12,
                  family: 'Segoe UI, Roboto, sans-serif'
                }
              }
            },
            title: {
              display: true,
              text: this.title,
              color: '#333',
              font: {
                size: 18
              }
            },
            tooltip: {
              backgroundColor: '#fff',
              titleColor: '#333',
              bodyColor: '#555',
              borderColor: '#ddd',
              borderWidth: 1
            }
          }
        }
      });
    }
  }
}
