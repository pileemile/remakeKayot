import {Component, Input} from '@angular/core';
import {Quizzes} from '../../models/quizzes/quizzes';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css'
})
export class Accordion  {
  @Input() headAccordion: Quizzes[] = [];
  @Input() bodyAccordion: QuizComment[] = [];

}
