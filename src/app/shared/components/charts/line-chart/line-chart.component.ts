import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartPosition } from '../chartPosition';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges, AfterViewInit {

  @Input() label: string;
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() borderColor = 'rgba(75, 192, 192, 1)';
  @Input() backgroundColor = 'rgba(75, 192, 192, 0.2)';
  @Input() isFill = true;
  @Input() position: ChartPosition = ChartPosition.Top;
  @Input() displaySideTitle = true;

  @ViewChild('lineChartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['data'] || changes['labels'])) {
      this.updateChart();
    }
  }

  createChart(): void {
    const context = this.chartRef.nativeElement.getContext('2d');
    if (!context) return;

    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.data,
            borderColor: this.borderColor,
            backgroundColor: this.backgroundColor,
            fill: this.isFill,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            position: 'bottom'
          },
          y: {
            beginAtZero: true,
            title: {
              display: this.displaySideTitle,
              text: `${this.label} (%)`
            }
          }
        },
        plugins: {
          legend: {
            position: this.position
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw + '%';
              }
            }
          }
        }
      }
    });
  }

  updateChart(): void {
    this.chart.destroy();
    this.createChart();
  }
}
