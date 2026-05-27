import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  LucideBug,
  LucideChevronDown,
  LucideCircle,
  LucideCircleCheck,
  LucideCirclePlay,
  LucideEllipsis,
  LucideFlaskConical,
  LucideGitPullRequest,
  LucideInbox,
  LucideMessageSquare,
  LucidePin,
  LucidePlus,
  LucideSearch,
  LucideSparkles,
  LucideSquareCheck,
  LucideStar,
  LucideWrench,
} from '@lucide/angular';
import {
  Issue,
  IssuePriority,
  IssueStatus,
  Label,
  Project,
  User,
  issueTypes,
  issues,
  labels,
  users,
} from '../../../../lib/mock-data';

interface CardLabel {
  id: string;
  name: string;
  color: string;
}

interface CardType {
  name: string;
  label: string;
  color: string;
  icon: string;
}

interface CardData {
  issue: Issue;
  type: CardType | undefined;
  labels: CardLabel[];
  assignee: User | undefined;
}

interface Column {
  status: IssueStatus;
  label: string;
  color: string;
  cards: CardData[];
}

const STATUS_ORDER: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

const STATUS_META: Record<IssueStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: '#6b7280' },
  todo: { label: 'Todo', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#f97316' },
  in_review: { label: 'In Review', color: '#8b5cf6' },
  done: { label: 'Done', color: '#10b981' },
};

const PRIORITY_META: Record<IssuePriority, { label: string; color: string }> = {
  urgent: { label: 'urgent', color: '#ef4444' },
  high: { label: 'high', color: '#f97316' },
  medium: { label: 'medium', color: '#eab308' },
  low: { label: 'low', color: '#64748b' },
};

const FILTER_CHIPS: { key: 'status' | 'assignee' | 'priority' | 'type' | 'more'; label: string }[] = [
  { key: 'status', label: 'Status' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'priority', label: 'Priority' },
  { key: 'type', label: 'Type' },
  { key: 'more', label: 'More filters' },
];

@Component({
  selector: 'app-board',
  imports: [
    LucideBug,
    LucideChevronDown,
    LucideCircle,
    LucideCircleCheck,
    LucideCirclePlay,
    LucideEllipsis,
    LucideFlaskConical,
    LucideGitPullRequest,
    LucideInbox,
    LucideMessageSquare,
    LucidePin,
    LucidePlus,
    LucideSearch,
    LucideSparkles,
    LucideSquareCheck,
    LucideStar,
    LucideWrench,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  readonly project = input.required<Project>();

  protected readonly filterChips = FILTER_CHIPS;

  private readonly typesById = new Map(issueTypes.map((t) => [t.id, t]));
  private readonly labelsById = new Map<string, Label>(labels.map((l) => [l.id, l]));
  private readonly usersById = new Map<string, User>(users.map((u) => [u.id, u]));

  protected readonly columns = computed<Column[]>(() => {
    const projectId = this.project().id;
    const projectIssues = issues.filter((i) => i.projectId === projectId);

    return STATUS_ORDER.map((status) => {
      const meta = STATUS_META[status];
      const cards = projectIssues
        .filter((i) => i.status === status)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return b.updatedAt.localeCompare(a.updatedAt);
        })
        .map<CardData>((issue) => this.toCard(issue));
      return { status, label: meta.label, color: meta.color, cards };
    });
  });

  protected priorityMeta(priority: IssuePriority) {
    return PRIORITY_META[priority];
  }

  private toCard(issue: Issue): CardData {
    const t = this.typesById.get(issue.typeId);
    return {
      issue,
      type: t ? { name: t.name, label: t.label, color: t.color, icon: t.icon } : undefined,
      labels: issue.labelIds.map((id) => this.labelsById.get(id)).filter((l): l is Label => Boolean(l)),
      assignee: issue.assigneeId ? this.usersById.get(issue.assigneeId) : undefined,
    };
  }
}
