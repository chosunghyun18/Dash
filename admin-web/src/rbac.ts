// 관리자 역할(RBAC). BE AdminRole 과 1:1. 위계: SUPER_ADMIN > OPERATOR > VIEWER.
export type AdminRole = 'SUPER_ADMIN' | 'OPERATOR' | 'VIEWER';

const RANK: Record<AdminRole, number> = {
  VIEWER: 0,
  OPERATOR: 1,
  SUPER_ADMIN: 2,
};

/** current 역할이 required 이상인지(위계 포함). current 미상이면 false. */
export function hasRole(current: AdminRole | undefined, required: AdminRole): boolean {
  if (!current) return false;
  return RANK[current] >= RANK[required];
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: '슈퍼관리자',
  OPERATOR: '운영자',
  VIEWER: '뷰어',
};

export const ROLE_BADGE_COLOR: Record<AdminRole, string> = {
  SUPER_ADMIN: 'purple',
  OPERATOR: 'blue',
  VIEWER: 'default',
};
