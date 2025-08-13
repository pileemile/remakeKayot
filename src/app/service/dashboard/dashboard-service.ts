import { Injectable } from '@angular/core';
import {LoginService} from '../login/login-service';
import {AttemptsService} from '../attempts/attempts-service';
import {QuizzesService} from '../quizzes/quizzes-service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    public loginService: LoginService,
    public attemptsService: AttemptsService,
    public quizzesService: QuizzesService,
  ) {}

  public date_test = Date.now();

  private average_quiz: number = 0;
  private stay_all_quizzes: number = 0;

  private average_completed_quiz: {
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

 public summary_quiz = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "Summary of your quizzes"
    },
    axisX: {
      valueFormatString: "D MMM YYYY"
    },
    axisY: {
      labelFormatter: (e: any) => {
        var suffixes = ["", "K", "M", "B", "T"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if(order > suffixes.length - 1)
          order = suffixes.length - 1;
        var suffix = suffixes[order];
        return "$" + (e.value / Math.pow(1000, order)) + suffix;
      }
    },
    data: [{
      type: "line",
      xValueFormatString: "DDD, MMM YYYY",
      yValueFormatString: "$#,###.##",
      dataPoints: [
        this.attemptsService.attemptsAllWithUser$.subscribe(
          created_at => {
            created_at?.map(attempt => ({
              x: new Date(attempt.created_at),
              y: attempt.score
            }))
          }
        ),
        { x: new Date(this.loginService.user_create_at), y: 10 },
        { x: new Date(this.date_test), y:5},
      ]
    }]
  }

  public average_completed_quiz_by_user () {
    const lenght_quizzes = this.quizzesService.allQuizzes$.value?.length ?? 0;
    const lenght_attempts = this.attemptsService.attemptsAllWithUser$.value?.length ?? 0;
    this.average_quiz= (lenght_attempts / lenght_quizzes) * 100;
    this.stay_all_quizzes = 100 - this.average_quiz;
    this.average_completed_quiz = {
      animationEnabled: true,
      title: {
        text: "Average completed quiz"
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: [
          { y: this.average_quiz, name: " Completed Quizzes" },
          { y: this.stay_all_quizzes, name: "stay of quizzes" },
        ]
      }]
    }
    return this.average_quiz && this.stay_all_quizzes && this.average_completed_quiz;
  }
}
