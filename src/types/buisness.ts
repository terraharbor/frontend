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

export type User = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  disabled?: boolean;
  sha512_hash?: string;
  token?: string;
  token_validity?: number;
  isAdmin: boolean;
};

export type UserLogin = {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};

export type UserRegister = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
};

export type File = {
  id: number;
  projectId: number;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
};

export type AuthToken = {
  id: number;
  userId: number;
  token: string;
  ttl: string;
  createdAt: Date;
};

export type StateFileStatus = 'locked' | 'unlocked';

export type StateFileInfos = {
  status: StateFileStatus;
  lockedAt?: Date;
  lockedBy?: string;
};

export type StateFileSnapshot = {
  id: string;
  projectId: string;
  version: number;
  content: string;
  createdAt: Date;
  createdBy: string;
};
