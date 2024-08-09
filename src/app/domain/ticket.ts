import { Project, Sprint } from "./project";
import { UserInfo } from "./user";

export interface Ticket {
  id: number,
  title: string,
  author: UserInfo,
  assignee: UserInfo,
  project: Project,
  sprint: Sprint,
  creationTime: Date,
  status: string,
  size: string,
  content: string,
  errata: string,
  comments: TicketComment[],
  events: TicketEvent[],
};

export interface TicketComment {
  author: UserInfo,
  content: string,
  creationTime: Date,
};

export interface TicketEvent {
  id: number,
  ticketId: number,
  author: UserInfo,
  type: string,
  message: string,
  sizeVote: string,
  creationTime: Date,
}