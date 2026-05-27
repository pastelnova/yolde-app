export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low';
export type IssueTypeName = 'bug' | 'feature' | 'task' | 'chore' | 'spike';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  initials: string;
  avatarColor: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  key: string;
  color: string;
  isFavorite: boolean;
}

export interface IssueType {
  id: string;
  name: IssueTypeName;
  label: string;
  icon: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  projectId: string;
  typeId: string;
  status: IssueStatus;
  priority: IssuePriority;
  estimate: number | null;
  assigneeId: string | null;
  reporterId: string;
  labelIds: string[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export const currentUser: User = {
  id: 'u-alex',
  username: 'alexchen',
  email: 'alex@acme.com',
  fullName: 'Alex Chen',
  initials: 'AC',
  avatarColor: '#f59e0b',
};

export const users: User[] = [
  currentUser,
  {
    id: 'u-sarah',
    username: 'sarahmiller',
    email: 'sarah@acme.com',
    fullName: 'Sarah Miller',
    initials: 'SM',
    avatarColor: '#ec4899',
  },
  {
    id: 'u-john',
    username: 'johndoe',
    email: 'john@acme.com',
    fullName: 'John Doe',
    initials: 'JD',
    avatarColor: '#3b82f6',
  },
  {
    id: 'u-emma',
    username: 'emmaross',
    email: 'emma@acme.com',
    fullName: 'Emma Ross',
    initials: 'ER',
    avatarColor: '#8b5cf6',
  },
  {
    id: 'u-mike',
    username: 'mikebauer',
    email: 'mike@acme.com',
    fullName: 'Mike Bauer',
    initials: 'MB',
    avatarColor: '#10b981',
  },
];

export const projects: Project[] = [
  {
    id: 'p-acme',
    slug: 'acme-app',
    name: 'Acme App',
    key: 'ACME',
    color: '#3b82f6',
    isFavorite: true,
  },
  {
    id: 'p-marketing',
    slug: 'marketing-site',
    name: 'Marketing Site',
    key: 'MKT',
    color: '#ec4899',
    isFavorite: false,
  },
  {
    id: 'p-internal',
    slug: 'internal-tools',
    name: 'Internal Tools',
    key: 'INT',
    color: '#10b981',
    isFavorite: true,
  },
];

export const activeProjectId = 'p-acme';

export const issueTypes: IssueType[] = [
  { id: 't-bug', name: 'bug', label: 'Bug', icon: 'Bug', color: '#ef4444' },
  { id: 't-feature', name: 'feature', label: 'Feature', icon: 'Sparkles', color: '#3b82f6' },
  { id: 't-task', name: 'task', label: 'Task', icon: 'CheckSquare', color: '#10b981' },
  { id: 't-chore', name: 'chore', label: 'Chore', icon: 'Wrench', color: '#6b7280' },
  { id: 't-spike', name: 'spike', label: 'Spike', icon: 'FlaskConical', color: '#8b5cf6' },
];

export const labels: Label[] = [
  { id: 'l-frontend', name: 'frontend', color: '#3b82f6' },
  { id: 'l-backend', name: 'backend', color: '#10b981' },
  { id: 'l-design', name: 'design', color: '#ec4899' },
  { id: 'l-db', name: 'db', color: '#8b5cf6' },
  { id: 'l-api', name: 'api', color: '#06b6d4' },
  { id: 'l-docs', name: 'docs', color: '#64748b' },
  { id: 'l-ops', name: 'ops', color: '#f97316' },
  { id: 'l-urgent', name: 'urgent', color: '#ef4444' },
];

export const issues: Issue[] = [
  {
    id: 'i-181',
    key: 'ACME-181',
    title: 'Implement dark mode toggle',
    description: 'Add a theme switcher in settings that persists across sessions.',
    projectId: 'p-acme',
    typeId: 't-feature',
    status: 'backlog',
    priority: 'low',
    estimate: 3,
    assigneeId: 'u-sarah',
    reporterId: 'u-alex',
    labelIds: ['l-frontend', 'l-design'],
    commentCount: 2,
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'i-182',
    key: 'ACME-182',
    title: 'Add export to CSV functionality',
    description: 'Allow users to export their board as a CSV file.',
    projectId: 'p-acme',
    typeId: 't-feature',
    status: 'backlog',
    priority: 'medium',
    estimate: 5,
    assigneeId: 'u-john',
    reporterId: 'u-alex',
    labelIds: ['l-backend'],
    commentCount: 1,
    createdAt: '2024-01-09T10:30:00Z',
    updatedAt: '2024-01-11T14:20:00Z',
  },
  {
    id: 'i-183',
    key: 'ACME-183',
    title: 'Refactor authentication module',
    description: 'Split the auth module into smaller, testable units.',
    projectId: 'p-acme',
    typeId: 't-chore',
    status: 'backlog',
    priority: 'low',
    estimate: 8,
    assigneeId: 'u-john',
    reporterId: 'u-alex',
    labelIds: ['l-backend', 'l-db'],
    commentCount: 3,
    createdAt: '2024-01-09T11:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
  },
  {
    id: 'i-184',
    key: 'ACME-184',
    title: 'Fix login button not responding',
    description: 'Login button fails to fire onClick on Safari 17.',
    projectId: 'p-acme',
    typeId: 't-bug',
    status: 'todo',
    priority: 'high',
    estimate: 2,
    assigneeId: 'u-alex',
    reporterId: 'u-sarah',
    labelIds: ['l-frontend', 'l-urgent'],
    commentCount: 2,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
  },
  {
    id: 'i-180',
    key: 'ACME-180',
    title: 'Design new dashboard layout',
    description: 'Mock up the v2 dashboard layout with collapsible sidebar.',
    projectId: 'p-acme',
    typeId: 't-task',
    status: 'todo',
    priority: 'medium',
    estimate: 5,
    assigneeId: 'u-sarah',
    reporterId: 'u-alex',
    labelIds: ['l-design'],
    commentCount: 7,
    createdAt: '2024-01-07T13:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
  },
  {
    id: 'i-186',
    key: 'ACME-186',
    title: 'Update API documentation',
    description: 'Bring the OpenAPI spec up to date with v2 endpoints.',
    projectId: 'p-acme',
    typeId: 't-task',
    status: 'todo',
    priority: 'low',
    estimate: 2,
    assigneeId: 'u-john',
    reporterId: 'u-alex',
    labelIds: ['l-api', 'l-docs'],
    commentCount: 1,
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
  },
  {
    id: 'i-188',
    key: 'ACME-188',
    title: 'Memory leak in dashboard component',
    description: 'Investigate and fix the memory leak causing performance issues.',
    projectId: 'p-acme',
    typeId: 't-bug',
    status: 'in_progress',
    priority: 'urgent',
    estimate: 5,
    assigneeId: 'u-sarah',
    reporterId: 'u-alex',
    labelIds: ['l-frontend', 'l-urgent'],
    commentCount: 6,
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'i-187',
    key: 'ACME-187',
    title: 'Implement real-time notifications',
    description: 'Push board updates over SSE so members see changes live.',
    projectId: 'p-acme',
    typeId: 't-feature',
    status: 'in_progress',
    priority: 'high',
    estimate: 8,
    assigneeId: 'u-alex',
    reporterId: 'u-sarah',
    labelIds: ['l-frontend', 'l-backend'],
    commentCount: 11,
    createdAt: '2024-01-12T09:30:00Z',
    updatedAt: '2024-01-15T13:45:00Z',
  },
  {
    id: 'i-189',
    key: 'ACME-189',
    title: 'Add user profile avatars',
    description: 'Show member avatars on issue cards and in the drawer.',
    projectId: 'p-acme',
    typeId: 't-feature',
    status: 'in_review',
    priority: 'medium',
    estimate: 3,
    assigneeId: 'u-emma',
    reporterId: 'u-alex',
    labelIds: ['l-frontend'],
    commentCount: 4,
    createdAt: '2024-01-11T14:00:00Z',
    updatedAt: '2024-01-14T17:00:00Z',
  },
  {
    id: 'i-118',
    key: 'ACME-118',
    title: 'Spike: Evaluate new state management',
    description: 'Compare NgRx Signals vs. plain signals for the board store.',
    projectId: 'p-acme',
    typeId: 't-spike',
    status: 'in_review',
    priority: 'high',
    estimate: 5,
    assigneeId: 'u-alex',
    reporterId: 'u-john',
    labelIds: ['l-frontend', 'l-db'],
    commentCount: 5,
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
  },
  {
    id: 'i-111',
    key: 'ACME-111',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for build, test, and deploy.',
    projectId: 'p-acme',
    typeId: 't-chore',
    status: 'done',
    priority: 'low',
    estimate: 3,
    assigneeId: 'u-alex',
    reporterId: 'u-alex',
    labelIds: ['l-ops'],
    commentCount: 3,
    createdAt: '2023-12-10T09:00:00Z',
    updatedAt: '2023-12-18T16:00:00Z',
  },
  {
    id: 'i-112',
    key: 'ACME-112',
    title: 'Fix broken image uploads',
    description: 'Uploads above 5MB silently failed — switch to multipart streaming.',
    projectId: 'p-acme',
    typeId: 't-bug',
    status: 'done',
    priority: 'medium',
    estimate: 2,
    assigneeId: 'u-mike',
    reporterId: 'u-emma',
    labelIds: ['l-backend', 'l-urgent'],
    commentCount: 4,
    createdAt: '2023-12-12T11:00:00Z',
    updatedAt: '2023-12-20T10:30:00Z',
  },
  {
    id: 'i-113',
    key: 'ACME-113',
    title: 'Implement keyboard shortcuts',
    description: 'Add J/K navigation, C to create, E to edit, / to search.',
    projectId: 'p-acme',
    typeId: 't-feature',
    status: 'done',
    priority: 'medium',
    estimate: 5,
    assigneeId: 'u-alex',
    reporterId: 'u-alex',
    labelIds: ['l-frontend'],
    commentCount: 6,
    createdAt: '2023-12-15T13:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z',
  },
];
