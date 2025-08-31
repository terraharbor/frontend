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
