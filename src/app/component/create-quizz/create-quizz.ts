import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Category, Difficulty, Quizzes, QuestionCreate} from '../../models/quizzes/quizzes';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-create-quizz',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-quizz.html',
  styleUrl: './create-quizz.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuizz implements OnInit {

  public form: FormGroup;
  public categories = Object.values(Category);
  public difficulties = Object.values(Difficulty);

  constructor(
    private readonly formBuilder: FormBuilder,
    public quizzesService: QuizzesService,
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      question: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.quizzesService.quiz$.subscribe(quiz => {
      if (quiz) {

        this.form.patchValue({
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
        });
      }
    });

    this.quizzesService.createQuestion$.subscribe(
      question => {
        if (question) {
          console.log("question", question)
           this.questions.push(this.createQuestionFormGroup(question[0]));
        }
      }
    )
  }

  get questions(): FormArray {
    return this.form.get('question') as FormArray;
  }

  createQuestionFormGroup(question?: QuestionCreate): FormGroup {
    const group = this.formBuilder.group({
      text: [question?.text || '', Validators.required],
      created_at: [question?.created_at || new Date().toISOString()]
    });

    return group;
  }

  addQuestion() {
    const questionFormGroup = this.createQuestionFormGroup();
    this.quizzesService.addQuestion(questionFormGroup.value);
  }

  answerQuestion(index: number) {
    this.quizzesService.answers$.next(this.questions.value[index]);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const quiz = this.form.value as Quizzes;
      this.quizzesService.addQuizz(quiz);
      console.log("l'abonnement sur le quiz", this.quizzesService.quiz$.value)
      console.log("l'abonnement sur la question", this.quizzesService.createQuestion$.value)

    } else {
      console.log("erreur sur ce bon vieux form")
    }
  }
}
