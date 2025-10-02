export interface Login {
  email: string;
  password: string;
}

export interface UserRoles {
  role: app_roles,
  user_id: string
}

export interface RolePermissions {
  role: app_roles,
  permission: role_permission
}

export enum role_permission {
  CHANNELS_DELETE = 'channels.delete',
  MESSAGES_DELETE = 'messages.delete',
}

export enum app_roles {
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
