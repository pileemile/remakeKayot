import {Category, Difficulty} from '../../models/quizzes/quizzes';

export enum FilterTypeEnum {
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

export enum SelectFilterEnum {
  CATEGORY = 'category',
  DIFFICULTY = 'difficulty',
  ALL = 'all',
}

export interface IFilterQuizz {
  category?: Category;
  difficulty?: Difficulty;
  created_at?: string;
  finish_at?: string;
}

export interface IFilterUser {
  last_name?: string;
  first_name?: string;
  adress?: string;
  cp?: string;
  city?: string;
}

export interface IFilter {
  quizz?: IFilterQuizz;
  user?: IFilterUser;
}

export type IFilterType = {
  [key in FilterTypeEnum | SelectFilterEnum]?: boolean
}

export const labelInput = {
  [SelectFilterEnum.CATEGORY]: 'Filtrer par catégorie',
  [SelectFilterEnum.DIFFICULTY]: 'filtrer par dificulter',
  [FilterTypeEnum.CREATED_AT]: 'Created at',
  [FilterTypeEnum.FINISH_AT]: 'Finish at',
  [FilterTypeEnum.LAST_NAME]: 'Last name',
  [FilterTypeEnum.FIRST_NAME]: 'First name',
  [FilterTypeEnum.EMAIL]: 'Email',
  [FilterTypeEnum.ADRESS]: 'Adress',
  [FilterTypeEnum.CP]: 'CP',
  [FilterTypeEnum.CITY]: 'City',
  [FilterTypeEnum.ALL]: 'All',
}

export const typeInput = {
  [SelectFilterEnum.CATEGORY]: 'select',
  [SelectFilterEnum.DIFFICULTY]: 'select',
  [FilterTypeEnum.CREATED_AT]: 'date',
  [FilterTypeEnum.FINISH_AT]: 'date',
  [FilterTypeEnum.LAST_NAME]: 'text',
  [FilterTypeEnum.FIRST_NAME]: 'text',
  [FilterTypeEnum.ADRESS]: 'text',
  [FilterTypeEnum.CP]: 'number',
  [FilterTypeEnum.CITY]: 'text',
  [FilterTypeEnum.EMAIL]: 'email',
  [FilterTypeEnum.ALL]: 'text',
}

export const selectedFilter = {
  [SelectFilterEnum.CATEGORY]: Object.values(Category),
  [SelectFilterEnum.DIFFICULTY]: Object.values(Difficulty),
  [FilterTypeEnum.ALL]: ['All'],
}
