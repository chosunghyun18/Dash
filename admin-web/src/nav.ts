import type { ComponentType } from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  ShareAltOutlined,
  MailOutlined,
  CrownOutlined,
  WarningOutlined,
  MobileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { AdminRole } from '@/rbac';

export interface NavItem {
  key: string;
  path: string;
  label: string;
  icon: ComponentType;
  /** 이 메뉴를 볼 수 있는 최소 역할(위계 적용). */
  minRole: AdminRole;
}

// 정보구조(IA) — admin-dashboard-design.md §2.
export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', path: '/', label: '대시보드', icon: DashboardOutlined, minRole: 'VIEWER' },
  { key: 'members', path: '/members', label: '회원 관리', icon: TeamOutlined, minRole: 'VIEWER' },
  { key: 'network', path: '/network', label: '관계·네트워크', icon: ShareAltOutlined, minRole: 'VIEWER' },
  { key: 'contact-requests', path: '/contact-requests', label: '연락 요청', icon: MailOutlined, minRole: 'VIEWER' },
  { key: 'memberships', path: '/memberships', label: 'Dash+ 구독', icon: CrownOutlined, minRole: 'VIEWER' },
  { key: 'reports', path: '/reports', label: '신고·모더레이션', icon: WarningOutlined, minRole: 'VIEWER' },
  { key: 'app-config', path: '/app-config', label: '앱 버전 정책', icon: MobileOutlined, minRole: 'VIEWER' },
  { key: 'system', path: '/system', label: '시스템', icon: SettingOutlined, minRole: 'SUPER_ADMIN' },
];
