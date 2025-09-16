import { Injectable } from '@angular/core';
import {AttemptsService} from '../attempts/attempts-service';
import {QuizzesService} from '../quizzes/quizzes-service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    public attemptsService: AttemptsService,
    public quizzesService: QuizzesService,
  ) {}

  private average_quiz: number = 0;
  private stay_all_quizzes: number = 0;
  private percentage_correcte: {
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
  private stay_quiz: {
    animationEnabled: boolean;
    title: { text: string; };
    axisX: { labelAngle: number; };
    axisY: { title: string; };
    axisY2: { title: string; };
    toolTip: { shared: boolean; };
    legend: { cursor: string; itemclick: (e: any) => void; };
    data: ({
      type: string;
      name: string;
      legendText: string;
      showInLegend: boolean;
      dataPoints: { label: string; y: number; }[];
      axisYType?: undefined;
    } | {
      type: string;
      name: string;
      legendText: string;
      axisYType: string;
      showInLegend: boolean;
      dataPoints: { label: string; y: number; }[];
    })[];
  } | undefined

  private get lenght_quizzes() {
    return this.quizzesService.allQuizs$.value?.length ?? 0;
  }

  private get lenght_attempts() {
    return this.attemptsService.attemptsAllWithUser$.value?.length ?? 0
  }

  public average_completed_quiz_by_user () {
    const lenght_quizzes = this.lenght_quizzes;
    const lenght_attempts = this.lenght_attempts;
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

  public stay_quiz_user() {
    const lenght_quizzes = this.lenght_quizzes;
    const lenght_attempts = this.lenght_attempts;
    this.stay_quiz = {
      animationEnabled: true,
      title: {
        text: "total of quizzes vs completed quizzes"
      },
      axisX: {
        labelAngle: -90
      },
      axisY: {
        title: "number of quizzes"
      },
      axisY2: {
        title: "million barrels/day"
      },
      toolTip: {
        shared: true
      },
      legend:{
        cursor:"pointer",
        itemclick: function(e: any){
          if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "column",
        name: "💩",
        legendText: "quiz",
        showInLegend: true,
        dataPoints:[
          {label: "number of quizzes", y: lenght_quizzes},
          {label: "completed quizzes", y: lenght_attempts},
        ]
      }]
    }
    return this.stay_quiz;
  }

  public percentage_correcte_answers_last_quiz() {
    this.attemptsService.attemptsAllWithUser$.value?.sort((a, b) => a.created_at > b.created_at ? 1 : +1);
    const last_score = this.attemptsService.attemptsAllWithUser$.value?.[0]?.score ?? 0;
    const last_total = this.attemptsService.attemptsAllWithUser$.value?.[0]?.total ?? 0;
    this.average_quiz = (last_score / last_total) * 100;
    this.percentage_correcte = {
      animationEnabled: true,
      title: {
        text: "pourcentage de réponse correcte sur le dernier quiz"
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: [
          { y: this.average_quiz, name: " score" },
          { y: 100 - this.average_quiz, name: "total" },
        ]
      }]
    }
    return this.average_quiz && this.stay_all_quizzes && this.percentage_correcte;
  }

}
