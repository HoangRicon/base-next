'use client'

import React from 'react'
import { DashboardLayout, useDashboardLayout } from '@/components/layout/dashboard'
import { ContentSection, DashboardGrid, EmptyState } from '@/components/layout/dashboard'
import { SidePanelForm, SidePanelSection } from '@/components/layout/dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddItemForm } from '@/components/features/inventory/AddItemForm';
import { PlusCircle, Package, TrendingUp, AlertTriangle, Users } from 'lucide-react'
import { StatCard } from '@/components/features/dashboard/stat-card'

export default function DashboardPage() {
  const {
    sidePanel,
    openSidePanel,
    closeSidePanel,
    setSidePanelLoading
  } = useDashboardLayout()

  const breadcrumbs = [
    { title: 'Trang chủ', href: '/' },
    { title: 'Tổng quan' }
  ]

  const handleOpenAddPanel = () => {
    openSidePanel({
      title: 'Thêm mặt hàng mới',
      description: 'Điền thông tin chi tiết để thêm một mặt hàng vào kho.',
      content: <AddItemForm onSave={handleSaveItem} onCancel={closeSidePanel} />
    })
  }

  const handleSaveItem = async () => {
    setSidePanelLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSidePanelLoading(false)
    closeSidePanel()
    // Here you would typically show a success notification
  }

  return (
    <DashboardLayout
      pageTitle="Tổng quan kho hàng"
      pageDescription="Chào mừng trở lại, đây là tình hình kho hàng của bạn."
      breadcrumbs={breadcrumbs}
      pageActions={
        <Button onClick={handleOpenAddPanel} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Thêm mặt hàng
        </Button>
      }
      sidePanelOpen={sidePanel.isOpen}
      onSidePanelClose={closeSidePanel}
      sidePanelTitle={sidePanel.title}
      sidePanelDescription={sidePanel.description}
      sidePanelContent={sidePanel.content}
      onSidePanelSave={handleSaveItem}
      onSidePanelReset={() => console.log("Reset form")}
      sidePanelLoading={sidePanel.loading}
    >
      <DashboardGrid columns={4}>
        <StatCard 
          title="Tổng số mặt hàng"
          value="1,250"
          change="+5.2%"
          icon={Package}
        />
        <StatCard 
          title="Hàng sắp hết"
          value="15"
          change="+2"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard 
          title="Giao dịch trong tháng"
          value="320"
          change="+12%"
          icon={TrendingUp}
        />
        <StatCard 
          title="Nhà cung cấp"
          value="45"
          change="-1"
          icon={Users}
          variant="destructive"
        />
      </DashboardGrid>

      <ContentSection title="Hoạt động gần đây" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <EmptyState 
              title="Chưa có hoạt động"
              description="Các hoạt động nhập, xuất kho gần đây sẽ được hiển thị ở đây."
              icon={TrendingUp}
              action={<Button variant="outline">Xem tất cả hoạt động</Button>}
            />
          </CardContent>
        </Card>
      </ContentSection>
    </DashboardLayout>
  )
}




