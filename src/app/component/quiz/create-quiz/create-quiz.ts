import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {Difficulty, Quiz} from '../../../models/quiz/quiz';
import {QuizService} from '../../../service/quiz/quiz-service';
import {MatButtonModule} from '@angular/material/button';
import {Answers} from '../../../models/answer/answer';

import {MatDialog} from '@angular/material/dialog';
import {DialogSuccessError} from '../../dialog/dialog-success-error/dialog-success-error';
import {Categories} from '../../../models/categories/categories';
import {QuestionCreate} from '../../../models/question/question';
import {CategoriesService} from '../../../service/categories/categories-service';

@Component({
  selector: 'app-create-quizz',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
],
  templateUrl: './create-quiz.html',
  styleUrl: './create-quiz.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuiz implements OnInit {

  public form: FormGroup;
  public categories: Categories[] = [];
  public difficulties = Object.values(Difficulty);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly quizService: QuizService,
    private readonly categoriesService: CategoriesService
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category_id: ['', Validators.required],
      difficulty: ['', Validators.required],
      question: this.formBuilder.array([], [this.minQuestionsValidator]),
    });
  }

  ngOnInit() {
    this.addQuestion();
    this.loadAllCategories().then();
  }

  private async loadAllCategories() {
    await this.categoriesService.getAllCategories();
    this.categories = this.categoriesService.categories;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    for (const control of Object.values(formGroup.controls)) {
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    }
  }

  private minQuestionsValidator(control: AbstractControl): ValidationErrors | null {
    const questionsArray = control as FormArray;
    if (questionsArray.length === 0) {
      return { minQuestions: { message: 'Au moins une question est requise' } };
    }
    return null;
  }

  private minAnswersValidator(control: AbstractControl): ValidationErrors | null {
    const answersArray = control as FormArray;
    if (answersArray.length < 2) {
      return { minAnswers: { message: 'Au moins 2 réponses sont requises par question' } };
    }
    return null;
  }

  private oneCorrectAnswerValidator(control: AbstractControl): ValidationErrors | null {
    const answersArray = control as FormArray;
    const correctAnswers = answersArray.controls.filter(
      answerControl => answerControl.get('is_correct')?.value === true
    );

    if (correctAnswers.length === 0) {
      return { noCorrectAnswer: { message: 'Une réponse correcte doit être sélectionnée' } };
    }

    if (correctAnswers.length > 1) {
      return { multipleCorrectAnswers: { message: 'Une seule réponse correcte est autorisée' } };
    }

    return null;
  }

  private createQuestionFormGroup(question?: QuestionCreate): FormGroup {
    const groupQuestion = this.formBuilder.group({
      text: [question?.text || '', Validators.required],
      created_at: [question?.created_at || new Date().toISOString()],
      answers: this.formBuilder.array([], [this.minAnswersValidator, this.oneCorrectAnswerValidator])
    });

    const answersArray = groupQuestion.get('answers') as FormArray;
    answersArray.push(this.createAnswersFormGroup());

    return groupQuestion;
  }

  private createAnswersFormGroup(answers?: Answers): FormGroup {
    return this.formBuilder.group({
      text: [answers?.text || '', Validators.required],
      is_correct: [answers?.is_correct || false]
    });
  }

  public get questions(): FormArray {
    return this.form.get('question') as FormArray;
  }

  public getAnswersControls(questionIndex: number) {
    return (this.questions.at(questionIndex).get('answers') as FormArray).controls;
  }

  public addQuestion() {
    this.questions.push(this.createQuestionFormGroup());
  }

  public addAnswerQuestion(questionIndex: number) {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    answersArray.push(this.createAnswersFormGroup());
  }

  public removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  public removeAnswerQuestion(questionIndex: number, answerIndex: number): void {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    if (answersArray.length > 2) {
      answersArray.removeAt(answerIndex);
    }
  }

  public canRemoveQuestion(): boolean {
    return this.questions.length > 1;
  }

  public canRemoveAnswer(questionIndex: number): boolean {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    return answersArray.length > 2;
  }

  public getQuestionErrors(questionIndex: number): string[] {
    const questionGroup = this.questions.at(questionIndex);
    const answersControl = questionGroup.get('answers');
    const errors: string[] = [];

    if (answersControl?.hasError('minAnswers')) {
      errors.push('Au moins 2 réponses sont requises');
    }

    if (answersControl?.hasError('noCorrectAnswer')) {
      errors.push('Veuillez sélectionner une réponse correcte');
    }

    if (answersControl?.hasError('multipleCorrectAnswers')) {
      errors.push('Une seule réponse correcte est autorisée');
    }

    return errors;
  }

  public onCorrectAnswerChange(questionIndex: number, answerIndex: number): void {
    const answersArray = this.questions.at(questionIndex).get('answers') as FormArray;
    for (const [index, control] of answersArray.controls.entries()) {
      if (index !== answerIndex) {
        control.get('is_correct')?.setValue(false);
      }
    }
  }

  public async onSubmit() {
    if (!this.form.valid) {
      this.markFormGroupTouched(this.form);
      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: { message: 'Le formulaire est invalide. Veuillez vérifier vos champs.', type: 'error' }
      });
      return;
    }

    try {
      const quizValue = this.form.value as Quiz;
      const questionsValue = this.questions.value as QuestionCreate[];
      await this.quizService.insertFullQuiz(quizValue, questionsValue);

      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: { message: 'Le quiz a été enregistré avec succès !', type: 'success' }
      });
      this.form.reset();
    } catch (error) {
      console.error('Erreur lors de l\'insertion du quiz complet', error);
      this.dialog.open(DialogSuccessError, {
        width: '400px',
        height: '170px',
        data: { message: 'Une erreur est survenue lors de l\'enregistrement du quiz.', type: 'error' }
      });
    }
  }


}
