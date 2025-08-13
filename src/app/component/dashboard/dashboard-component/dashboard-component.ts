import {Component, OnInit} from '@angular/core';
import {CanvasJSAngularChartsModule} from '@canvasjs/angular-charts';
import {LoginService} from '../../../service/login/login-service';
import {DashboardService} from '../../../service/dashboard/dashboard-service';
import {AttemptsService} from '../../../service/attempts/attempts-service';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    CanvasJSAngularChartsModule
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
   await this.quizzesService.getAllQuizzes();

  }


}
