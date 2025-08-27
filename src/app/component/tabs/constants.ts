export enum ButtonEnum {
  SEARCH = 'search',
  ALL = 'all',
  CREATE = 'create',
  FILTER = 'filter',
  ALL_USERS = 'all_users',
  Find_USER = 'find_users',
}

export type ITabsMode = {
 [key in ButtonEnum]?: boolean;
}

export const labels = {
  [ButtonEnum.SEARCH]: 'Search',
  [ButtonEnum.ALL]: 'All',
  [ButtonEnum.CREATE]: 'Create',
  [ButtonEnum.FILTER]: 'Filter',
  [ButtonEnum.ALL_USERS]: 'User',
  [ButtonEnum.Find_USER]: 'Find User',
}

