export interface UserInfo {
  id: number,
  roles: string[],
  firstName: string,
  lastName: string,
  username: string,
  email: string,
};

export interface UserRole {
  user: UserInfo,
  role: String,
};