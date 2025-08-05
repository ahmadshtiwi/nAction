import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-statistic-chart',
  imports: [],
  templateUrl: './statistic-chart.component.html',
  styleUrl: './statistic-chart.component.scss'
})
export class StatisticChartComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartType: ChartType = 'bar'; // default to 'bar', can be 'line', 'pie', etc.
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title: string = 'Statistic Chart';

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
    if (this.chart && (changes['data'] || changes['labels'] || changes['chartType'])) {
      this.updateChart();
    }
  }

  updateChart(): void {
    this.chart.destroy();
    this.createChart();
  }

  private createChart(): void {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.labels,
          datasets: [{
            data: this.data,
            label: this.title,
            backgroundColor: this.labels.map((_, index) =>
              this.modernColors[index % this.modernColors.length]
            ),
            borderColor: '#ffffff',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: this.chartType !== 'bar' && this.chartType !== 'line',
              position: 'top',
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
          },
          scales: (this.chartType === 'bar' || this.chartType === 'line') ? {
            x: {
              ticks: {
                color: '#555'
              },
              grid: {
                color: '#eee'
              }
            },
            y: {
              ticks: {
                color: '#555'
              },
              grid: {
                color: '#eee'
              }
            }
          } : undefined
        }
      });
    }
  }
}
