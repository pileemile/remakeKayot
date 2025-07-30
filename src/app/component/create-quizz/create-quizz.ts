import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Category, Difficulty, Quizzes, QuestionCreate, Answers} from '../../models/quizzes/quizzes';
import {QuizzesService} from '../../service/quizzes/quizzes-service';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-create-quizz',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
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
      question: this.formBuilder.array([]),
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
  }

  public get questions(): FormArray {
    return this.form.get('question') as FormArray;
  }

  getAnswersControls(questionIndex: number) {
    return (this.questions.at(questionIndex).get('answers') as FormArray).controls;
  }

  private createQuestionFormGroup(question?: QuestionCreate): FormGroup {
    const group = this.formBuilder.group({
      text: [question?.text || '', Validators.required],
      created_at: [question?.created_at || new Date().toISOString()],
      answers: this.formBuilder.array([])
    });
    return group;
  }

  private createAnswersFormGroup(answers?: Answers): FormGroup {
    const group = this.formBuilder.group ({
      text: [answers?.text || '', Validators.required],
      is_correct: [answers?.is_correct || false,]
    });
    return group;
  }

 public addQuestion() {
    this.questions.push(this.createQuestionFormGroup());
    console.log("la questil",this.questions.value)
  }

  addAnswerQuestion(questionIndex: number) {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    answersArray.push(this.createAnswersFormGroup());
  }


  public removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  public onSubmit() {
    if (this.form.valid) {
      const quiz = this.form.value as Quizzes;
      this.quizzesService.addQuizz(quiz);
      this.quizzesService.createQuestion$.next(this.questions.value);
      console.log("l'abonnement sur le quiz", this.quizzesService.quiz$.value);
      console.log("l'abonnement sur la question", this.quizzesService.createQuestion$.value);
      const allAnswers = this.questions.value.flatMap((question: { answers: any; }) => question.answers);
      this.quizzesService.answers$.next([
        ...(this.quizzesService.answers$.value ?? []),
        ...allAnswers
      ]);
      console.log("l'abonnement sur les answers", this.quizzesService.answers$.value);
      if (this.quizzesService.quiz$.value) {
        this.quizzesService.InsertQuizzes(this.quizzesService.quiz$.value);
        console.log('l api de supaaaa')
      }

    } else {
      console.log("erreur sur ce bon vieux form")
    }

  }
}
