import { createElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Tag, Typography, Button, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { NAV_ITEMS } from '@/nav';
import { useAuthStore } from '@/stores/authStore';
import { hasRole, ROLE_LABEL, ROLE_BADGE_COLOR, type AdminRole } from '@/rbac';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAuthStore((s) => s.admin);
  const clear = useAuthStore((s) => s.clear);
  const role: AdminRole | undefined = admin?.role;

  const visibleItems = NAV_ITEMS.filter((item) => hasRole(role, item.minRole));

  // 현재 경로에 해당하는 메뉴 key (가장 긴 prefix 매칭, '/' 는 dashboard).
  const selectedKey =
    visibleItems
      .filter((i) => i.path !== '/' && location.pathname.startsWith(i.path))
      .sort((a, b) => b.path.length - a.path.length)[0]?.key ?? 'dashboard';

  const onLogout = () => {
    clear();
    navigate('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={220} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#7B5CFA' }}>
            Dash 관리자
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            const item = visibleItems.find((i) => i.key === key);
            if (item) navigate(item.path);
          }}
          items={visibleItems.map((item) => ({
            key: item.key,
            icon: createElement(item.icon),
            label: item.label,
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            paddingInline: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Space size="middle">
            <span>{admin?.name}</span>
            {role && <Tag color={ROLE_BADGE_COLOR[role]}>{ROLE_LABEL[role]}</Tag>}
            <Button icon={<LogoutOutlined />} onClick={onLogout}>
              로그아웃
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
