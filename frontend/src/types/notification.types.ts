export type NotificationType = 'MATCH' | 'ATTENDANCE' | 'PERFORMANCE' | 'SYSTEM' | 'ANNOUNCEMENT';
export type NotificationTarget = 'ALL' | 'TEAM' | 'INDIVIDUAL';

export interface Notification {
  id: string;
  recipientId?: string;
  recipientName?: string;
  title: string;
  body: string;
  type: NotificationType;
  target: NotificationTarget;
  teamId?: string;
  teamName?: string;
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface AnnouncementFormData {
  title: string;
  body: string;
  type: NotificationType;
  target: NotificationTarget;
  teamId?: string;
  recipientId?: string;
}
