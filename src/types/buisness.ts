export type Project = {
  id: string;
  name: string;
  description?: string;
  lastUpdated?: string;
  teamIds: string[];
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  userIds: string[];
};

export type UserRole = 'Admin' | 'User';

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
};
