import { Project, Team } from './types/buisness';

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
    userIds: [],
  },
  {
    id: '2',
    name: 'Security Team',
    userIds: [],
  },
];
