export enum ButtonEnum {
  SEARCH = 'search',
  ALL = 'all',
  CREATE = 'create',
  FILTER = 'filter',
  ALL_USERS = 'all_users',
  FIND_USER = 'find_users',
  SEARCH_USER = 'search_users',
  CLEAR = 'clear',
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
  [ButtonEnum.FIND_USER]: 'Find User',
  [ButtonEnum.SEARCH_USER]: 'Search User',
  [ButtonEnum.CLEAR]: 'Clear',
}

