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

export enum ButtonFilterEnum {
  CLEAR = 'clear',
  SEARCH = 'search',
}

export interface IFilter {
  category?: Category;
  difficulty?: Difficulty;
  created_at?: string;
  finish_at?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  adress?: string;
  cp?: string;
  city?: string;
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

export const selectedFilter = {
  [SelectFilterEnum.CATEGORY]: Object.values(Category),
  [SelectFilterEnum.DIFFICULTY]: Object.values(Difficulty),
  [FilterTypeEnum.ALL]: ['All'],
}
