import { Category, Difficulty } from '../../models/quiz/quiz';

export enum FilterEnum {
  CATEGORY = 'category',
  DIFFICULTY = 'difficulty',
  CREATED_AT = 'created_at',
  FINISH_AT = 'finish_at',
  LAST_NAME = 'last_name',
  FIRST_NAME = 'first_name',
  EMAIL = 'email',
  ADRESS = 'adress',
  ROLE = 'role',
  CP = 'cp',
  CITY = 'city',
  ALL = 'all',
}

export enum FilterType {
  USER = 'user',
  QUIZ = 'quiz',
}

export type IFilters = {
  [key in FilterEnum]?: boolean;
}

export const filterConfig = {
  [FilterEnum.CATEGORY]: {
    label: 'Filtrer par catégorie',
    type: 'select',
    values: Object.values(Category),
    target: 'quiz'
  },
  [FilterEnum.DIFFICULTY]: {
    label: 'Filtrer par difficulté',
    type: 'select',
    values: Object.values(Difficulty),
    target: 'quiz'
  },
  [FilterEnum.CREATED_AT]: {
    label: 'Created at',
    type: 'date',
    target: 'quiz'
  },
  [FilterEnum.FINISH_AT]: {
    label: 'Finish at',
    type: 'date',
    target: 'quiz'
  },
  [FilterEnum.LAST_NAME]: {
    label: 'Last name',
    type: 'text',
    target: 'user'
  },
  [FilterEnum.FIRST_NAME]: {
    label: 'First name',
    type: 'text',
    target: 'user'
  },
  [FilterEnum.EMAIL]: {
    label: 'Email',
    type: 'email',
    target: 'user'
  },
  [FilterEnum.ADRESS]: {
    label: 'Adress',
    type: 'text',
    target: 'user'
  },
  [FilterEnum.ROLE]: {
    label: 'Rôle',
    type: 'select',
    values: ['admin', 'user', 'moderator'],
    target: 'user'
  },
  [FilterEnum.CP]: {
    label: 'CP',
    type: 'number',
    target: 'user'
  },
  [FilterEnum.CITY]: {
    label: 'City',
    type: 'text',
    target: 'user'
  },
  [FilterEnum.ALL]: {
    label: 'All',
    type: 'text',
    values: ['All'],
    target: 'all'
  },
};
