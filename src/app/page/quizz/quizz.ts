import { Component } from '@angular/core';
import {CreateQuizz} from '../../component/create-quizz/create-quizz';

@Component({
  selector: 'app-quizz',
  imports: [
    CreateQuizz
  ],
  templateUrl: './quizz.html',
  styleUrl: './quizz.css'
})
export class Quizz {

}
