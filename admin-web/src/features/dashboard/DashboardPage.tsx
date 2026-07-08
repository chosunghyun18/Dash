import { Card, Col, Row, Statistic, Typography, Alert } from 'antd';

// 상단 스탯 타일 — 지표 API(/api/admin/dashboard/summary) 연동 전이라 값은 자리표시자.
const TILES = [
  { title: '총 회원(ACTIVE)', suffix: '' },
  { title: '오늘 신규 가입', suffix: '' },
  { title: '오늘 연락 요청', suffix: '' },
  { title: 'Dash+ 구독자', suffix: '' },
];

export default function DashboardPage() {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        대시보드
      </Typography.Title>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="지표 API 연동 예정"
        description="대시보드 요약/추이 지표는 /api/admin/dashboard/* 구현 후 활성화됩니다. 현재는 레이아웃 자리표시자입니다."
      />
      <Row gutter={16}>
        {TILES.map((t) => (
          <Col span={6} key={t.title}>
            <Card>
              <Statistic title={t.title} value="—" suffix={t.suffix} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
