// Demo page - Trang demo minh họa tất cả components trong thư viện UI
'use client';

import React, { useState } from 'react';
import {
  ThemeProvider,
  GlobalThemeStyles,
  Button,
  Input,
  Combobox,
  Checkbox,
  Radio,
  RadioGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  Loading,
  DotsLoading,
  BarsLoading,
  ToastProvider,
  useToast,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
  Table,
  useTheme,
} from '../../components';

// Demo component bên trong ToastProvider
const DemoContent: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { success, error, warning, info } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Data cho table
  const tableData = [
    { id: 1, name: 'Nguyễn Văn A', age: 25, email: 'a@example.com' },
    { id: 2, name: 'Trần Thị B', age: 30, email: 'b@example.com' },
    { id: 3, name: 'Lê Văn C', age: 28, email: 'c@example.com' },
  ];

  const tableColumns = [
    {
      key: 'name',
      title: 'Tên',
      dataIndex: 'name',
      sortable: true,
    },
    {
      key: 'age',
      title: 'Tuổi',
      dataIndex: 'age',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Button size="sm" variant="outline">
          Sửa
        </Button>
      ),
    },
  ];

  const selectOptions = [
    { value: 'option1', label: 'Tùy chọn 1' },
    { value: 'option2', label: 'Tùy chọn 2' },
    { value: 'option3', label: 'Tùy chọn 3' },
    { value: 'option4', label: 'Tùy chọn 4', disabled: true },
  ];

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success({
        title: 'Thành công!',
        description: 'Dữ liệu đã được tải xong.',
      });
    }, 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Demo Thư viện Component UI</h1>
        <Button onClick={toggleTheme} variant="outline">
          Chuyển sang {isDark ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      {/* Buttons Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Buttons</CardTitle>
          <CardSubtitle $size="md">Các loại button với variant và size khác nhau</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button leftIcon={<span>👍</span>}>With Icon</Button>
          </div>
        </CardBody>
      </Card>

      {/* Inputs Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Inputs</CardTitle>
          <CardSubtitle $size="md">Các loại input với validation và icon</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Chúng tôi sẽ không chia sẻ email của bạn"
              isRequired
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              helperText="Mật khẩu phải có ít nhất 8 ký tự"
            />
            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="Nhập số điện thoại"
              leftIcon="📞"
              variant="filled"
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://example.com"
              errorText="URL không hợp lệ"
              isInvalid
            />
          </div>
        </CardBody>
      </Card>

      {/* Select/Combobox Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Select/Combobox</CardTitle>
          <CardSubtitle $size="md">Dropdown với tìm kiếm và keyboard navigation</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Combobox
              label="Chọn tùy chọn"
              options={selectOptions}
              placeholder="Tìm kiếm và chọn..."
              value={selectValue}
              onChange={(value) => setSelectValue(value as string)}
              isSearchable
            />
            <Combobox
              label="Không thể tìm kiếm"
              options={selectOptions}
              placeholder="Chỉ có thể chọn..."
              isSearchable={false}
            />
          </div>
        </CardBody>
      </Card>

      {/* Checkbox & Radio Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Checkbox & Radio</CardTitle>
          <CardSubtitle $size="md">Checkbox và Radio button với accessibility</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <h4>Checkbox</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Checkbox
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                >
                  Tôi đồng ý với điều khoản sử dụng
                </Checkbox>
                <Checkbox isIndeterminate>
                  Trạng thái indeterminate
                </Checkbox>
                <Checkbox disabled>
                  Checkbox bị vô hiệu hóa
                </Checkbox>
              </div>
            </div>
            <div>
              <h4>Radio Group</h4>
              <RadioGroup
                name="demo-radio"
                value={radioValue}
                onChange={setRadioValue}
              >
                <Radio value="option1">Tùy chọn 1</Radio>
                <Radio value="option2">Tùy chọn 2</Radio>
                <Radio value="option3">Tùy chọn 3</Radio>
              </RadioGroup>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Loading Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Loading Spinners</CardTitle>
          <CardSubtitle $size="md">Các loại loading spinner khác nhau</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Loading size="sm" label="Spinner nhỏ" />
            <Loading size="md" label="Spinner vừa" />
            <DotsLoading size="md" />
            <BarsLoading size="md" />
            <Button onClick={handleLoadingDemo} loading={loading}>
              {loading ? 'Đang tải...' : 'Demo Loading'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Modal & Toast Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Modal & Toast</CardTitle>
          <CardSubtitle $size="md">Modal dialog và toast notifications</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button onClick={() => setIsModalOpen(true)}>
              Mở Modal
            </Button>
            <Button onClick={() => success({ title: 'Thành công!', description: 'Thao tác đã hoàn thành.' })}>
              Toast Success
            </Button>
            <Button onClick={() => error({ title: 'Lỗi!', description: 'Có lỗi xảy ra.' })}>
              Toast Error
            </Button>
            <Button onClick={() => warning({ title: 'Cảnh báo!', description: 'Hãy kiểm tra lại.' })}>
              Toast Warning
            </Button>
            <Button onClick={() => info({ title: 'Thông tin', description: 'Đây là thông tin quan trọng.' })}>
              Toast Info
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Table Section */}
      <Card variant="outline" size="md" style={{ marginBottom: '2rem' }}>
        <CardHeader $size="md">
          <CardTitle $size="md">Table</CardTitle>
          <CardSubtitle $size="md">Bảng dữ liệu với sorting và pagination</CardSubtitle>
        </CardHeader>
        <CardBody $size="md">
          <Table
            columns={tableColumns}
            data={tableData}
            pagination={{
              current: 1,
              pageSize: 10,
              total: 3,
              onChange: (page, pageSize) => console.log('Page changed:', page, pageSize),
            }}
            onRow={(record) => ({
              onClick: () => console.log('Row clicked:', record),
            })}
          />
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2>Demo Modal</h2>
          <CloseButton onClick={() => setIsModalOpen(false)} />
        </ModalHeader>
        <ModalBody>
          <p>Đây là nội dung của modal. Modal hỗ trợ keyboard navigation và focus management.</p>
          <p>Bạn có thể nhấn ESC để đóng modal hoặc click vào backdrop.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Xác nhận
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

// Main demo page
export default function DemoPage() {
  return (
    <ThemeProvider defaultTheme="light">
      <GlobalThemeStyles />
      <ToastProvider>
        <DemoContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
