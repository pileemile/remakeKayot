import {Component, OnInit} from '@angular/core';
import {CanvasJSAngularChartsModule} from '@canvasjs/angular-charts';
import {DashboardService} from '../../../service/dashboard/dashboard-service';
import {AttemptsService} from '../../../service/attempts/attempts-service';
import {QuizService} from '../../../service/quiz/quiz-service';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [
    CommonModule, CanvasJSAngularChartsModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit{

  public dataPoints:any[] = [];
  public timeout:any = null;
  public xValue:number = 1;
  public yValue:number = 10;
  public newDataCount:number = 10;
  public chart: any;

  constructor(
    public dashboardService: DashboardService,
    public attemptsService: AttemptsService,
    private readonly quizService: QuizService,
    private readonly http : HttpClient
  ) {}

  ngOnInit() {
   this.loadData().then();
  }

  private async loadData(){
    await this.attemptsService.getAttempts("22ce5a89-1db2-46e7-a265-c929697ff1d0");
    await this.quizService.getAllQuiz();
  }

  public updateData = () => {
    this.http.get("https://canvasjs.com/services/data/datapoints.php?xstart="+this.xValue+"&ystart="+this.yValue+"&length="+this.newDataCount+"type=json", { responseType: 'json' }).subscribe(this.addData);
  }

  public addData = (data: any) => {
    if (this.newDataCount === 1) {
      this.dataPoints.push({
        x: data[0][0],
        y: Number.parseInt(data[0][1])
      });
      this.xValue++;
      this.yValue = Number.parseInt(data[0][1]);
    } else {
      for (const val of data as any[]) {
        this.dataPoints.push({
          x: val[0],
          y: Number.parseInt(val[1])
        });
        this.xValue++;
        this.yValue = Number.parseInt(val[1]);
      }
    }
    this.newDataCount = 1;
    this.chart.render();
    this.timeout = setTimeout(this.updateData, 1000);
  };


}
