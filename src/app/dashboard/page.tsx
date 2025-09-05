// Dashboard Page - Trang demo tích hợp và minh họa dashboard layout
'use client';

import React from 'react';

import { 
  ThemeProvider, 
  ToastProvider, 
  GlobalThemeStyles, 
  Button, 
  Input, 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle 
} from '../../components';
import { 
  DashboardLayout, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  ContentBody, 
  PanelFooter, 
  useLayoutActions, 
  MenuItem, 
  UserInfo, 
  BreadcrumbItem 
} from '../../components/layout';

// Mock data cho dashboard
const mockUser: UserInfo = {
  id: 'user-1',
  name: 'Hoang Nam',
  email: 'hoangnam@example.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'Admin',
};

const mockMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
  {
    id: 'inventory-in',
    label: 'Nhập kho',
    path: '/dashboard/inventory-in',
    icon: '📥',
    children: [
      { id: 'in-requests', label: 'Phiếu nhập', path: '/dashboard/inventory-in/requests' },
      { id: 'in-history', label: 'Lịch sử nhập', path: '/dashboard/inventory-in/history' },
    ],
  },
  {
    id: 'inventory-out',
    label: 'Xuất kho',
    path: '/dashboard/inventory-out',
    icon: '📤',
    children: [
      { id: 'out-requests', label: 'Phiếu xuất', path: '/dashboard/inventory-out/requests' },
      { id: 'out-history', label: 'Lịch sử xuất', path: '/dashboard/inventory-out/history' },
    ],
  },
  { id: 'inventory', label: 'Tồn kho', path: '/dashboard/inventory', icon: '📦', badge: 5 },
  {
    id: 'reports',
    label: 'Báo cáo',
    path: '/dashboard/reports',
    icon: '📈',
    children: [
      { id: 'report-inventory', label: 'Báo cáo tồn kho', path: '/dashboard/reports/inventory' },
      { id: 'report-in-out', label: 'Báo cáo xuất nhập', path: '/dashboard/reports/in-out' },
    ],
  },
  { id: 'settings', label: 'Cài đặt', path: '/dashboard/settings', icon: '⚙️', disabled: true },
];

const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Dashboard', path: '/dashboard' },
];

// Nội dung cho Side Panel
const SidePanelContent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, padding: '1rem' }}>
        <p>Đây là form để thêm hoặc sửa dữ liệu. Focus được quản lý và bạn có thể nhấn ESC để đóng.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Input label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" isRequired />
          <Input label="Mã sản phẩm" placeholder="Nhập mã sản phẩm" />
          <Input type="number" label="Số lượng" placeholder="Nhập số lượng" />
        </div>
      </div>
      <PanelFooter>
        <Button variant="secondary">Hủy</Button>
        <Button variant="primary">Lưu thay đổi</Button>
      </PanelFooter>
    </div>
  );
};

// Component chứa nội dung chính của trang, sử dụng các hook của layout
const DashboardContent = () => {
  const { openSidePanel } = useLayoutActions();

  const handleOpenPanel = () => {
    openSidePanel('Thêm sản phẩm mới', <SidePanelContent />);
  };

  return (
    <>
      <PageHeader>
        <PageTitle>Dashboard Overview</PageTitle>
        <PageDescription>Chào mừng trở lại, Hoang Nam! Đây là tổng quan hệ thống của bạn.</PageDescription>
      </PageHeader>

      <ContentBody>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card variant="elevated">
            <CardHeader $size="md">
              <CardTitle $size="md">Doanh thu tháng này</CardTitle>
            </CardHeader>
            <CardBody $size="md">
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>123.456.789đ</p>
              <p style={{ color: 'green' }}>+15% so với tháng trước</p>
            </CardBody>
          </Card>

          <Card variant="outline">
            <CardHeader $size="md">
              <CardTitle $size="md">Đơn hàng mới</CardTitle>
            </CardHeader>
            <CardBody $size="md">
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>58</p>
              <p>Có 5 đơn hàng đang chờ xử lý</p>
            </CardBody>
          </Card>

          <Card variant="filled">
            <CardHeader $size="md">
              <CardTitle $size="md">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardBody $size="md">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="primary" onClick={handleOpenPanel}>
                  Thêm sản phẩm
                </Button>
                <Button variant="secondary">Tạo đơn hàng</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </ContentBody>
    </>
  );
};

// Trang dashboard hoàn chỉnh với các provider và layout
export default function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="light">
      <GlobalThemeStyles />
      <ToastProvider>
        <DashboardLayout
          user={mockUser}
          menuItems={mockMenuItems}
          currentPath="/dashboard"
          breadcrumbs={mockBreadcrumbs}
        >
          <DashboardContent />
        </DashboardLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}
