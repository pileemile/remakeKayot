import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Category, Difficulty, Quizzes, QuestionCreate} from '../../../models/quizzes/quizzes';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {MatButtonModule} from '@angular/material/button';
import {Answers} from '../../../models/answer/answer';

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
export class CreateQuizz {

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

  public get questions(): FormArray {
    return this.form.get('question') as FormArray;
  }

  public getAnswersControls(questionIndex: number) {
    return (this.questions.at(questionIndex).get('answers') as FormArray).controls;
  }

  private createQuestionFormGroup(question?: QuestionCreate): FormGroup {
    const groupQuestion = this.formBuilder.group({
      text: [question?.text || '', Validators.required],
      created_at: [question?.created_at || new Date().toISOString()],
      answers: this.formBuilder.array([])
    });
    return groupQuestion;
  }

  private createAnswersFormGroup(answers?: Answers): FormGroup {
    const groupAnswers = this.formBuilder.group ({
      text: [answers?.text || '', Validators.required],
      is_correct: [answers?.is_correct || false,]
    });
    return groupAnswers;
  }

 public addQuestion() {
    this.questions.push(this.createQuestionFormGroup());
  }

 public addAnswerQuestion(questionIndex: number) {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    answersArray.push(this.createAnswersFormGroup());
  }

  public addQuizz(quiz: Quizzes) {
    this.quizzesService.quiz$.next(quiz);
  }


  public removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  public removeAnswerQuestion(questionIndex: number, answerIndex: number): void {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    answersArray.removeAt(answerIndex);
  }

 public async onSubmit() {
  if (this.form.valid) {
    const quiz = this.form.value as Quizzes;
    this.addQuizz(quiz);
    this.quizzesService.createQuestion$.next(this.questions.value);

    try {
      if (this.quizzesService.quiz$.value) {
        await this.quizzesService.InsertQuizzes(this.quizzesService.quiz$.value);
      }

      const questionsValue = this.quizzesService.createQuestion$.value;
      if (questionsValue) {
        await this.quizzesService.InsertQuestion(questionsValue);

        const questionsWithIds = this.quizzesService.createQuestion$.value;
        const allAnswers: Answers[] = [];

        questionsWithIds?.forEach((question, index) => {
          const answersControl = this.questions.at(index)?.get('answers');
          const questionAnswers = answersControl?.value;

          if (question?.id && questionAnswers) {
            questionAnswers.forEach((answer: any) => {
              allAnswers.push({
                ...answer,
                question_id: question.id!
              });
            });
          }
        });

        if (allAnswers.length > 0) {
          await this.quizzesService.InsertAnswers(allAnswers);
        }
      }
    } catch (error) {
      console.error('Erreur', error);
    }
  } else {
    console.log("erreur sur ce bon vieux form");
  }
}
}
