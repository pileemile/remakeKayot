import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

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
    private quizzesService: QuizzesService,
  ){}

  public toggleSearch() {
    this.quizzesService.activeTab = this.quizzesService.activeTab === 'search' ? null : 'search';
  }

  public get search() {
    return this.quizzesService.activeTab === 'search';
  }

}
