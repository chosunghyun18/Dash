import { Card, Empty, Typography } from 'antd';

/** 후속 구현 예정 화면의 공통 자리표시자. */
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Card>
        <Empty description={`${title} — 구현 예정`} />
      </Card>
    </div>
  );
}
