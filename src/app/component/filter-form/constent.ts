export enum FilterTypeEnum {
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
}

export type IFilterType = {
  [key in FilterTypeEnum]: boolean
}

export const label = {
  [FilterTypeEnum.CATEGORY]: 'Category',
  [FilterTypeEnum.DIFFICULTY]: 'Difficulty',
  [FilterTypeEnum.CREATED_AT]: 'Created at',
  [FilterTypeEnum.FINISH_AT]: 'Finish at',
  [FilterTypeEnum.LAST_NAME]: 'Last name',
  [FilterTypeEnum.FIRST_NAME]: 'First name',
  [FilterTypeEnum.EMAIL]: 'Email',
  [FilterTypeEnum.ADRESS]: 'Adress',
  [FilterTypeEnum.CP]: 'CP',
  [FilterTypeEnum.CITY]: 'City',
}
