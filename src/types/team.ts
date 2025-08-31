export type Team = {
  id: string;
  name: string;
  description?: string;
  userIds: string[];
};

export type TeamInput = Omit<Team, 'id'>;
