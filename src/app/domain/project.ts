import { UserInfo } from "./user";

export interface Project {
  id: number,
  name: string,
  description: string,
  assignedUsers: UserInfo[],
};