import {
  Project,
  ProjectToken,
  StateFileInfos,
  StateFileSnapshot,
  Team,
  User,
} from './types/buisness';

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Project A',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    teamIds: [],
    lastUpdated: '21.04.2025 17:12',
  },
  {
    id: '2',
    name: 'Project B',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    teamIds: ['1'],
    lastUpdated: '19.04.2025 13:10',
  },
  {
    id: '3',
    name: 'Project C',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    teamIds: ['1', '2'],
    lastUpdated: '15.04.2025 12:02',
  },
];

export const sampleTeams: Team[] = [
  {
    id: '1',
    name: 'Dev Team',
    userIds: ['1', '3'],
  },
  {
    id: '2',
    name: 'Security Team',
    userIds: ['2'],
  },
];

export const sampleUsers: User[] = [
  {
    id: '1',
    username: 'John Doe',
    email: 'john.doe@test.ch',
    isAdmin: true,
  },
  {
    id: '2',
    username: 'Marie Martin',
    email: 'marie.martin@test.ch',
    isAdmin: true,
  },
  {
    id: '3',
    username: 'Luc Bernard',
    email: 'luc.bernard@test.ch',
    isAdmin: true,
  },
];

export const sampleStateFilesTerraform: StateFileSnapshot[] = [
  {
    id: 'state-001',
    projectId: '3',
    version: 1,
    content: JSON.stringify(
      {
        version: 4,
        terraform_version: '1.6.3',
        resources: [
          { type: 'aws_s3_bucket', name: 'app_bucket', id: 'bucket-123' },
          { type: 'aws_iam_role', name: 'app_role', id: 'role-abc' },
        ],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-01T10:12:00Z'),
    createdBy: '1',
  },
  {
    id: 'state-002',
    projectId: '3',
    version: 2,
    content: JSON.stringify(
      {
        version: 4,
        terraform_version: '1.6.3',
        resources: [
          { type: 'aws_vpc', name: 'main_vpc', id: 'vpc-789' },
          { type: 'aws_subnet', name: 'public_subnet', id: 'subnet-456' },
        ],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-10T14:35:00Z'),
    createdBy: '3',
  },
  {
    id: 'state-003',
    projectId: '3',
    version: 3,
    content: JSON.stringify(
      {
        version: 4,
        terraform_version: '1.7.0',
        resources: [{ type: 'aws_lambda_function', name: 'process_data', id: 'lambda-xyz' }],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-15T09:20:00Z'),
    createdBy: '2',
  },
  {
    id: 'state-004',
    projectId: '3',
    version: 4,
    content: JSON.stringify(
      {
        version: 4,
        terraform_version: '1.6.5',
        resources: [
          { type: 'azurerm_resource_group', name: 'rg_app', id: 'rg-999' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
        ],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-20T17:42:00Z'),
    createdBy: '2',
  },
  {
    id: 'state-005',
    projectId: '3',
    version: 5,
    content: JSON.stringify(
      {
        version: 4,
        terraform_version: '1.7.1',
        resources: [
          { type: 'google_compute_instance', name: 'vm-web', id: 'gce-555' },
          { type: 'google_sql_database_instance', name: 'db-prod', id: 'sql-777' },
        ],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-25T12:05:00Z'),
    createdBy: '1',
  },
  {
    id: 'state-006',
    projectId: '3',
    version: 6,
    content: JSON.stringify(
      {
        version: 5,
        terraform_version: '1.7.1',
        resources: [
          { type: 'google_compute_instance', name: 'vm-website', id: 'gce-555' },
          { type: 'google_sql_database_instance', name: 'db-prd', id: 'sql-777' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
          { type: 'azurerm_storage_account', name: 'stapp', id: 'st-111' },
        ],
      },
      null,
      2,
    ),
    createdAt: new Date('2025-08-30T10:02:00Z'),
    createdBy: '1',
  },
];

export const sampleStateFileInfos: StateFileInfos[] = [
  {
    status: 'locked',
    lockedAt: new Date('2025-08-14T10:02:00Z'),
    lockedBy: '2',
  },
  {
    status: 'unlocked',
  },
];

export const sampleProjectTokens: ProjectToken[] = [
  {
    value: 'jnjndewonkwn-820993-ndjnjedn',
    projectId: '3',
    createdAt: new Date('2025-08-14T10:02:00Z'),
    createdBy: '2',
    canRead: true,
    canWrite: true,
  },
  {
    value: 'hjidehbdnkwn-820993-ndjnjedn',
    projectId: '2',
    createdAt: new Date('2025-08-14T10:02:00Z'),
    createdBy: '1',
    canRead: true,
    canWrite: false,
  },
];
