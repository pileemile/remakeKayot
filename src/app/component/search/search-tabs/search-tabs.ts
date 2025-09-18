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
    private quizzesService: QuizService,
  ){}

  public toggleSearch() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'search' ? null : 'search';
  }

  public get search() {
    return this.quizzesService.activeTab === 'search';
  }

}
