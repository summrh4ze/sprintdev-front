import { UserInfo } from "./user";

export interface Project {
  id: number,
  name: string,
  description: string,
  assignedUsers: UserInfo[],
};

export interface Sprint {
  id: number,
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
}