export enum ButtonEnum {
  SEARCH = 'search',
  ALL = 'all',
  CREATE = 'create',
  FILTER = 'filter',
  USER = 'user',
}

export type ITabsMode = {
 [key in ButtonEnum]?: boolean;
}

export const labels = {
  [ButtonEnum.SEARCH]: 'Search',
  [ButtonEnum.ALL]: 'All',
  [ButtonEnum.CREATE]: 'Create',
  [ButtonEnum.FILTER]: 'Filter',
  [ButtonEnum.USER]: 'User',
}

