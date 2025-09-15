import {Component, OnInit} from '@angular/core';
import {CanvasJSAngularChartsModule} from '@canvasjs/angular-charts';
import {LoginService} from '../../../service/login/login-service';
import {DashboardService} from '../../../service/dashboard/dashboard-service';
import {AttemptsService} from '../../../service/attempts/attempts-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, CanvasJSAngularChartsModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit{

  constructor(
    public loginService: LoginService,
    public dashboardService: DashboardService,
    public attemptsService: AttemptsService,
    public quizzesService: QuizzesService,
    private http : HttpClient
  ) {}

  public average_quiz: number = 0;
  private stay_all_quizzes: number = 0;

  public average_completed_quiz: {
    animationEnabled: boolean;
    title: { text: string; };
    data: {
      type: string;
      startAngle: number;
      indexLabel: string;
      yValueFormatString: string;
      dataPoints: { y: number; name: string; }[];
    }[];
  } | undefined

 async ngOnInit() {
   await this.attemptsService.getAttempts("22ce5a89-1db2-46e7-a265-c929697ff1d0");
   await this.quizzesService.getAllQuizzesRest();


  }

  dataPoints:any[] = [];
  timeout:any = null;
  xValue:number = 1;
  yValue:number = 10;
  newDataCount:number = 10;
  chart: any;

  dinamyque = {
    theme: "light2",
    title: {
      text: "Live Data"
    },
    data: [{
      type: "line",
      dataPoints: this.dataPoints
    }]
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.updateData();
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

  updateData = () => {
    this.http.get("https://canvasjs.com/services/data/datapoints.php?xstart="+this.xValue+"&ystart="+this.yValue+"&length="+this.newDataCount+"type=json", { responseType: 'json' }).subscribe(this.addData);
  }

  addData = (data:any) => {
    if(this.newDataCount != 1) {
      data.forEach( (val:any[]) => {
        this.dataPoints.push({x: val[0], y: parseInt(val[1])});
        this.xValue++;
        this.yValue = parseInt(val[1]);
      })
    } else {
      //this.dataPoints.shift();
      this.dataPoints.push({x: data[0][0], y: parseInt(data[0][1])});
      this.xValue++;
      this.yValue = parseInt(data[0][1]);
    }
    this.newDataCount = 1;
    this.chart.render();
    this.timeout = setTimeout(this.updateData, 1000);
  }

}
