import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/features/auth/LoginPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import PlaceholderPage from '@/features/common/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

// Dash+ 보라 계열을 프라이머리로(제품 톤 준용).
const theme = {
  token: { colorPrimary: '#7B5CFA', borderRadius: 6 },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR} theme={theme}>
        <AntApp>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/members" element={<PlaceholderPage title="회원 관리" />} />
                <Route path="/network" element={<PlaceholderPage title="관계·네트워크" />} />
                <Route
                  path="/contact-requests"
                  element={<PlaceholderPage title="연락 요청" />}
                />
                <Route path="/memberships" element={<PlaceholderPage title="Dash+ 구독" />} />
                <Route path="/reports" element={<PlaceholderPage title="신고·모더레이션" />} />
                <Route path="/app-config" element={<PlaceholderPage title="앱 버전 정책" />} />
                <Route path="/system" element={<PlaceholderPage title="시스템" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
