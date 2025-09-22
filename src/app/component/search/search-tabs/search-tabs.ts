import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {QuizService} from '../../../service/quiz/quiz-service';

@Component({
  selector: 'app-search-tabs',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './search-tabs.html',
  styleUrl: './search-tabs.css'
})
export class SearchTabs {

  constructor(
    private readonly quizService: QuizService,
  ){}

  public toggleSearch() {
    this.quizService.activeTab = this.quizService.activeTab === 'search' ? null : 'search';
  }

  public get search() {
    return this.quizService.activeTab === 'search';
  }

}
