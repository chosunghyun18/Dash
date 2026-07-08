import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { App as AntApp, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { adminAuthService } from '@/services/adminAuth';
import { useAuthStore } from '@/stores/authStore';

interface LoginForm {
  loginId: string;
  password: string;
}

/**
 * 관리자 로그인 — 중앙 카드(로고 + id/pw + 로그인 버튼)만. 회원가입 없음(계정은 SUPER_ADMIN 발급).
 * 로그인 성공 → 토큰 저장 + /me 로 프로필 하이드레이트 후 대시보드로.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const [loading, setLoading] = useState(false);

  if (accessToken) return <Navigate to="/" replace />;

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const { accessToken: acc, refreshToken } = await adminAuthService.login(
        values.loginId,
        values.password,
      );
      setTokens(acc, refreshToken);
      setAdmin(await adminAuthService.me());
      navigate('/', { replace: true });
    } catch {
      useAuthStore.getState().clear();
      message.error('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Typography.Title level={3} style={{ color: '#7B5CFA', marginBottom: 4 }}>
            Dash 관리자
          </Typography.Title>
          <Typography.Text type="secondary">운영 관리 콘솔</Typography.Text>
        </div>
        <Form<LoginForm> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="loginId"
            label="아이디"
            rules={[{ required: true, message: '아이디를 입력하세요' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="아이디" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
