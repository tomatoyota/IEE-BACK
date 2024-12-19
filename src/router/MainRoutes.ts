import { Components } from 'ant-design-vue/es/date-picker/generatePicker';
import { computed } from 'vue';

const MainRoutes = {
  path: '/admin',
  meta: {
    requiresAuth: true
  },
  redirect: '/admin/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: () => import('@/views/dashboard/DefaultDashboard.vue')
    },
  
    
    // 最新消息列表
    {
      name: 'Announcement',
      path: 'announcement',
      component: () => import('@/views/bulletin/AnnouncementAdminPage.vue')
    },
    // 最新消息內頁
    {
      name: 'AnnouncementView',
      path: 'announcementView',
      component: () => import('@/views/bulletin/AnnouncementViewPage.vue')
    },
    {
      name: 'Bulletin',
      path: 'bulletin',
      component: () => import('@/views/bulletin/Bulletin.vue')
    },
    {
      name: 'Publication',
      path: 'publication',
      component: () => import('@/views/publication/Publication.vue')
    },
    {
      name: 'Academic',
      path: 'academic',
      component: () => import('@/views/admin/AcademicAdminPage.vue')
    },
    {
      name: 'AcademicView',
      path: 'academicView',
      component: () => import('@/views/admin/AcademicViewPage.vue')
    },
    {
      name: 'Quarterly',
      path: 'quarterly',
      component: () => import('@/views/admin/QuarterlyAdminPage.vue')
    },
    {
      name: 'QuarterlyView',
      path: 'quarterlyView',
      component: () => import('@/views/admin/QuarterlyViewPage.vue')
    },
    {
      name: 'Member',
      path: 'member',
      component: () => import('@/views/member/Member.vue')
    },
    //新增/編輯個人會員頁面
    {
      name: 'PersonalView',
      path: 'personalView',
      component: () => import('@/views/member/PersonalViewPage.vue')
    },
    // 個人會員繳費紀錄
    {
      name: 'PersonalPaymentView',
      path: 'personalPaymentView',
      component: () => import('@/views/member/PersonalPaymentPage.vue')
    },
    // 影印標籤貼紙
    {
      name: 'PrintPage',
      path: 'PrintPage',
      component: () => import('@/views/member/PrintPage.vue')
    },
    // 影印收據
    {
      name: 'PrintInvoice',
      path: 'printInvoice',
      component: () => import('@/views/member/PrintInvoice.vue')
    },
    {
      name: 'GroupView',
      path: 'groupView',
      component: () => import('@/views/member/GroupViewPage.vue')
    },
    // 個人會員繳費紀錄
    {
      name: 'GroupPaymentView',
      path: 'groupPaymentView',
      component: () => import('@/views/member/GroupPaymentPage.vue')
    },
    {
      name: 'StudentView',
      path: 'studentView',
      component: () => import('@/views/member/StudentViewPage.vue')
    },
    // {
    //   name: 'MemberAdmin',
    //   path: 'memberAdmin',
    //   component: () => import('@/views/admin/MemberAdminPage.vue')
    // },
    // {
    //   name: 'MemberView',
    //   path: 'memberView',
    //   component: () => import('@/views/admin/MemberViewPage.vue')
    // },
  ]
};

export default MainRoutes;
