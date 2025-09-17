import { Category, Difficulty } from '../../models/quizzes/quizzes';

export enum FilterEnum {
  CATEGORY = 'category',
  DIFFICULTY = 'difficulty',
  CREATED_AT = 'created_at',
  FINISH_AT = 'finish_at',
  LAST_NAME = 'last_name',
  FIRST_NAME = 'first_name',
  EMAIL = 'email',
  ADRESS = 'adress',
  CP = 'cp',
  CITY = 'city',
  ALL = 'all',
}

export type IFilters = {
  [key in FilterEnum]?: boolean;
}

export const filterConfig = {
  [FilterEnum.CATEGORY]: {
    label: 'Filtrer par catégorie',
    type: 'select',
    values: Object.values(Category),
  },
  [FilterEnum.DIFFICULTY]: {
    label: 'Filtrer par difficulté',
    type: 'select',
    values: Object.values(Difficulty),
  },
  [FilterEnum.CREATED_AT]: {
    label: 'Created at',
    type: 'date',
  },
  [FilterEnum.FINISH_AT]: {
    label: 'Finish at',
    type: 'date',
  },
  [FilterEnum.LAST_NAME]: {
    label: 'Last name',
    type: 'text',
  },
  [FilterEnum.FIRST_NAME]: {
    label: 'First name',
    type: 'text',
  },
  [FilterEnum.EMAIL]: {
    label: 'Email',
    type: 'email',
  },
  [FilterEnum.ADRESS]: {
    label: 'Adress',
    type: 'text',
  },
  [FilterEnum.CP]: {
    label: 'CP',
    type: 'number',
  },
  [FilterEnum.CITY]: {
    label: 'City',
    type: 'text',
  },
  [FilterEnum.ALL]: {
    label: 'All',
    type: 'text',
    values: ['All'],
  },
};
