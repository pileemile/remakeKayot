export interface UserModele {
  adress?: string | null
  first_name?: string | null
  id?: number
  last_name?: string | null
  role: RoleEnum
  user_id: string
  cp: string
  ville: string
}

export enum RoleEnum {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}


