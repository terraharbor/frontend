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
  id: string;
  user_id: string;
  token: string;
  ttl: string;
  created_at: string;
};

// Organization types
export type Organization = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

// Permission types
export type Permission = {
  user_id: string;
  read: boolean;
  write: boolean;
  edit_settings: boolean;
  role: string;
};

export type OrganizationPermission = {
  org_id: string;
} & Permission;

export type ProjectPermission = {
  proj_id: string;
} & Permission;

// Audit and State types
export type AuditLog = {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: string;
  details?: Record<string, any>;
};

export type StateVersion = {
  id: string;
  project_id: string;
  state_name: string;
  version: number;
  created_at: string;
  file_size: number;
};

export type StateFile = {
  project_id: string;
  state_name: string;
  version?: number;
  content: Blob | string;
  last_modified: string;
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

export type ProjectToken = {
  token: string;
  project_id: string;
};
