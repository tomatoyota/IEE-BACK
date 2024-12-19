<template>
  <div class="">
    <v-form>
      <v-row class="py-4">
        <v-col>
          <v-text-field
            v-model="searchCondition.frontUserId"
            variant="outlined"
            label="證號"
            hide-details
            class="search-theme"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="searchCondition.name" variant="outlined" label="姓名" hide-details class="search-theme"></v-text-field>
        </v-col>
        <v-col>
          <v-select
            label="級別"
            :items="levelList"
            item-title="name"
            item-value="level"
            v-model="searchCondition.level"
            variant="outlined"
            hide-details
            class="search-theme"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            label="當年繳費況狀"
            :items="paymentStatusList"
            item-title="name"
            item-value="value"
            v-model="searchCondition.paymentStatus"
            variant="outlined"
            hide-details
            class="search-theme"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            label="顯示筆數"
            :items="listAmount"
            v-model="searchCondition.size"
            variant="outlined"
            hide-details
            class="search-theme"
          ></v-select>
        </v-col>
        <v-col class="d-flex align-center">
          <v-col class="py-0 pr-1 pl-0">
            <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
          </v-col>
          <v-col class="py-0 pl-2 pr-0">
            <v-btn class="w-100" flat color="success" @click="searchGroupMemberList(1)">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col class="text-right">
        <v-btn color="primary" flat @click="addMember()"> 新增會員 </v-btn>
      </v-col>
    </v-row>

    

    <v-table class="mt-4" :height="tableItems.length > 10 ? '550px' : ''" :fixed-header="tableItems.length > 10 ? true : false">
      <thead>
        <tr>
          <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
            <a
              href="#"
              class="text-decoration-none text-darkprimary d-flex align-center"
              @click.prevent="sortDBList(header)"
              :class="header.value !== '' ? '' : 'noCursor'"
            >
              {{ header.title }}
              <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'ASC'"></v-icon>
              <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'DESC'"></v-icon>
            </a>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" :key="item.frontUserId" class="hover-effect">
          <td class="no-wrap">{{ truncateText(item.frontUserId,16) }}</td>
          <td class="no-wrap position-relative">
            <div class="paymentFalse" v-if="item.paymentStatus === 0">
              <v-icon class="icon" icon="mdi mdi-exclamation" size="8px" color="white"></v-icon>
            </div>
            <div :class="['lvColor text-center', getLvColor(item)]">{{ convertLevel(item.level) }}</div>
          </td>
          <td class="no-wrap">{{ truncateText(item.chineseName,16) }}</td>
          <td class="no-wrap">{{ truncateText(item.responsiblePersonName,10) }}</td>
          <td class="no-wrap">{{ truncateText(item.mainAddressCity + item.mainAddressDistrict + item.mainAddressDetail,30) }}</td>
          <td class="no-wrap">{{ truncateText(item.email,25) }}</td>
          <td :class="getStatusClass(item.paymentStatus)" class="no-wrap">
            <v-chip :color="item.statusColor" :class="getStatusClass(item.paymentStatus)" variant="text">
              {{ convertPaymentStatus(item.paymentStatus) }}
            </v-chip>
          </td>

          <td class="no-wrap text-right">
            <v-btn variant="outlined" class="text-style" @click="getGroupDetail(item.frontUserId)">編輯</v-btn>
            <v-btn variant="text" class="text-style" @click="getPaymentHistory(item)">繳費紀錄</v-btn>
            <v-btn variant="text" class="text-style" @click="deleteGroupMemberCheck(item.frontUserId)">刪除</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <PaginationComponent
      :pageLength="paginations.totalPages"
      :current-page="paginations.currentPage"
      @get-list="searchGroupMemberList"
      @set-page="setPage"
    ></PaginationComponent>
  </div>
  <LoadingComponent :loading="loading" />
</template>

<script>
import { storeToRefs } from 'pinia';
import { useGroupStore } from '@/stores/GroupMember.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from '@/utils/sweetAlert';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import groupMemSrv from '@/service/groupMember.js';
import dropSrv from '@/service/dropdowns.js';

export default {
  components: {
    VueDatePicker,
    PaginationComponent,
    LoadingComponent
  },
  data() {
    return {
      searchCondition: {
        frontUserId: '',
        name: '',
        level: null,
        paymentStatus: '',
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        currentPage: 1,
        pageSize: 10
      },
      tableItems: [],
      paginations: {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      loading: false,
      headers: [
        {
          title: '證號',
          value: '',
          sort: '',
          width: '5%'
        },
        {
          title: '級別',
          value: '',
          sort: '',
          width: '5%'
        },
        {
          title: '團體中文名稱',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '負責人',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '地址',
          value: '',
          sort: '',
          width: '20%'
        },
        {
          title: 'Email',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '當年繳費狀況',
          value: '',
          sort: '',
          width: '10%'
        }
      ],
      listAmount: [1, 10, 50, 100, 500],
      pagePermissions: [],
      levelList: [],
      paymentStatusList: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '已繳費',
          value: 1
        },
        {
          name: '未繳費',
          value: 2
        }
      ]
    };
  },
  setup() {
    const groupStore = useGroupStore();
    const { searchCondition, paginations } = storeToRefs(groupStore);

    return { groupStore, searchCondition, paginations };
  },
  created() {
    // const store = useEditdbStore();
    // const { searchCondition, editViewTableItem, paginations, checkItem, allWordIds } = storeToRefs(store);
    // // 搜尋欄位狀態儲存
  },
  watch: {},
  mounted() {
    this.searchGroupMemberList();
    this.getGroupLevelList();
    const groupStore = useGroupStore();

    // 如果要根據 Store 資料重新渲染頁面
    if (groupStore.searchCondition) {
      this.searchCondition = { ...groupStore.searchCondition };
    }
    if (groupStore.paginations) {
      this.paginations = { ...groupStore.paginations };
    }
    if (groupStore.tableItems) {
      this.tableItems = [...groupStore.tableItems];
    }
  },
  methods: {
    async searchGroupMemberList() {
      this.loading = true;
      const groupStore = useGroupStore();
      try {
        // const params = {
        //   page: this.paginations.currentPage || 1,
        //   size: this.searchCondition.size || 10,
        //   sortField: 'created_at',
        //   sortOrder: 'DESC',
        //   frontUserId: this.searchCondition.frontUserId || '',
        //   name: this.searchCondition.name || '',
        //   level: this.searchCondition.level || null,
        //   paymentStatus: this.searchCondition.paymentStatus || null
        // };
        const frontUserId = this.searchCondition.frontUserId || ''
        const name = this.searchCondition.name || ''
        const level = this.searchCondition.level || ''
        const paymentStatus = this.searchCondition.paymentStatus || ''
        const currentPage = this.paginations.currentPage || 1;
        const pageSize = this.searchCondition.size || 10;
        const sortField = 'created_at'
        const sortOrder = 'DESC'
        const params = {
          frontUserId,
          name,
          level,
          paymentStatus,
          currentPage,
          pageSize,
          sortField,
          sortOrder
        };
        await groupMemSrv.searchGroupMemberList(params).then((res) => {
          if (!res.isSuccess) {
            // api 回傳失敗
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          } else {
            // api 回傳成功
            // rtnCode 為 0000 的情況
            if (res.data.rtnCode === '0000') {
              this.tableItems = res.data.data;
              this.paginations.currentPage = res.data.pagination.currentPage;
                this.paginations.totalPages = res.data.pagination.totalPages;
                this.paginations = {
          ...this.paginations,
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalCount: res.data.pagination.totalCount,};
          groupStore.setTableItems(res.data.data);
          groupStore.setPaginations(this.paginations);
            } else {
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          }
        });
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      } finally {
        // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
        this.loading = false;
      }
    },
    addMember() {
      this.$router.push({
        path: '/admin/groupView',
        query: {
          action: 'add'
        }
      });
    },
    async getGroupLevelList() {
      this.loading = true;
      try {
        await dropSrv
          .getGroupLevelList()
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              this.levelList = res.data.data;
            } else {
              // api 回傳失敗
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          })
          .catch((error) => {
            // 處理錯誤情況
            console.error('Error:', error);
          })
          .finally(() => {
            // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
            this.loading = false;
          });
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
    async getGroupDetail(id) {
      this.loading = true;
      try {
        await groupMemSrv
          .getGroupMemberDetail(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                const store = useGroupStore();
                store.updateEditData(res.data.data);
                // console.log(res.data.data)
                this.$router.push({
                  path: '/admin/groupView',
                  query: {
                    action: 'edit'
                  }
                });
              } else {
                // rtnCode 不為 0000 的情況
                Swal.fire({
                  toast: true,
                  position: 'center',
                  title: `${res.data.rtnMsg}`,
                  confirmButtonColor: '#0E2A34',
                  confirmButtonText: '確認',
                  background: '#F0F0F2',
                  width: 400
                });
              }
            } else {
              // api 回傳失敗
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          })
          .catch((error) => {
            // 處理錯誤情況
            console.error('Error:', error);
          })
          .finally(() => {
            // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
            this.loading = false;
          });
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
    deleteGroupMemberCheck(id) {
      Swal.fire({
        toast: true,
        position: 'center',
        title: `是否確定要刪除此會員?`,
        confirmButtonText: '確認',

        showCancelButton: true,
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteGroup(id);
        }
      });
    },
    async deleteGroup(id) {
      this.loading = true;
      try {
        await groupMemSrv
          .deleteGroup(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                Swal.fire({
                  toast: true,
                  position: 'center',
                  title: `${res.data.rtnMsg}`,
                  confirmButtonColor: '#0E2A34',
                  confirmButtonText: '確認',
                  background: '#F0F0F2',
                  width: 400
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.searchGroupMemberList();
                  }
                });
              } else {
                // rtnCode 不為 0000 的情況
                Swal.fire({
                  toast: true,
                  position: 'center',
                  title: `${res.data.rtnMsg}`,
                  confirmButtonColor: '#0E2A34',
                  confirmButtonText: '確認',
                  background: '#F0F0F2',
                  width: 400
                });
              }
            } else {
              // api 回傳失敗
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          })
          .catch((error) => {
            // 處理錯誤情況
            console.error('Error:', error);
          })
          .finally(() => {
            // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
            this.loading = false;
          });
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
    async getPaymentHistory(item) {
      const id = item.frontUserId;
      const userData = {
        frontUserId: id,
        chineseName: item.chineseName
      };
      this.loading = true;
      try {
        await groupMemSrv
          .getPaymentHistory(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                const store = useGroupStore();
                store.updateUserData(userData);
                store.updatePaymentData(res.data.data);
                this.$router.push('/admin/groupPaymentView');
              } else {
                // rtnCode 不為 0000 的情況
                Swal.fire({
                  toast: true,
                  position: 'center',
                  title: `${res.data.rtnMsg}`,
                  confirmButtonColor: '#0E2A34',
                  confirmButtonText: '確認',
                  background: '#F0F0F2',
                  width: 400
                });
              }
            } else {
              // api 回傳失敗
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          })
          .catch((error) => {
            // 處理錯誤情況
            console.error('Error:', error);
          })
          .finally(() => {
            // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
            this.loading = false;
          });
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
    convertPaymentStatus(status) {
      switch (status) {
        case 0:
          return '未繳費';
        case 1:
          return '已繳費';
        default:
          return '';
      }
    },
    initializePage() {
      // 檢查是否有保存的狀態
      const groupStore = useGroupStore();
      if (groupStore.searchCondition.frontUserId || groupStore.tableItems.length) {
        this.searchCondition = { ...groupStore.searchCondition };
        this.paginations = { ...groupStore.paginations };
        this.tableItems = [...groupStore.tableItems];
      } else {
        // 如果無狀態則執行初始資料加載
        this.searchGroupMemberList();
      }
    },
    clearSearch() {
      this.searchCondition = {
        frontUserId: '',
        name: '',
        level: null,
        paymentStatus: '',
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        currentPage: 1,
        pageSize: 10
      };
    },
    convertLevel(status) {
      switch (status) {
        case 1:
          return '電級';
        case 2:
          return '機級';
        case 3:
          return '工級';
        case 4:
          return '程級';
        default:
          return '';
      }
    },
    getStatusClass(status) {
      return status === 1 ? 'paid' : 'unpaid';
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },
    getLvColor(item) {
      if (item.paymentStatus === '') {
        return 'bg-gray';
      }
      switch (item.level) {
        case 4:
          return 'bg-light-blue';
        case 1:
          return 'bg-yellow';
        case 2:
          return 'bg-green';
        case 3:
          return 'bg-blue';
        default:
          return '';
      }
    },
    // setPage(page) {
    //   const store = useEditdbStore();
    //   this.paginations.currentPage = page;
    //   store.updateCurrentPage(page);
    // },
    setPage(page) {
      if (this.paginations.currentPage === page) {
        console.log('點擊了同一頁，無需更新');
        return;
      }

      // 更新當前頁碼
      this.paginations.currentPage = page;

      // 調用 API 請求
      this.searchGroupMemberList();

      // 日誌方便檢查
      console.log('更新分頁', this.paginations);
    },
    transformDate(date) {
      if (date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // 將月份和日期補0
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
      }
      return '';
    },
    sortDBList(header) {
      // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
      if (header.value === '') {
        return;
      }
      if (header.value !== this.searchCondition.sortBy) {
        this.headers.forEach((item) => (item.sort = ''));
      }
      // 找出哪個欄位要排序，給予對應的條件值
      const idx = this.headers.findIndex((item) => item === header);
      if (idx !== -1) {
        this.headers[idx].sort = header.sort ? (header.sort === 'ASC' ? 'DESC' : 'ASC') : 'DESC';
        this.searchCondition.sortBy = header.value;
        this.searchCondition.sortDirection = this.headers[idx].sort;
        this.paginations.currentPage = 1;
      }
      this.searchGroupMemberList();
    },
    getPagePermission() {
      const id = 10;
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
      const obj = {
        userAccount: user.backendUserAccount
      };
      userPagePermissionSrv.getUserPagePermission(id, obj).then((res) => {
        res.data.data.permissions.forEach((i) => {
          this.pagePermissions.push(i.permissionId);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-container {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addBtn {
  padding: 12px 24px 12px 24px;
  border-radius: 4px;
  width: 112px;
  height: 48px;
  background: #1b2482;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  position: absolute;
  top: -60px;
  right: 0;
}

.v-data-table .v-data-table-header th {
  background-color: #f5f5f5;
  text-align: center;
}
.v-data-table .v-data-table__wrapper {
  max-height: 500px;
}

.v-table th,
.v-table td {
  padding: 8px;
}

.v-table thead {
  background-color: #f5f5f5;
}

/* .v-btn {
  margin: 0 5px;
} */

.text-style {
  font-size: 16px;
  font-weight: 600;
  color: #1b2482;
}
.no-wrap {
  white-space: nowrap; /* 避免文字斷行 */
  /* text-align: center; */
}

.lvColor {
  border-radius: 0px 10px 0px 10px;
  color: #fff !important;
  font-weight: 600;
  font-size: 14px;
  padding: 4px;
  width: 52px;
}

.bg-green {
  background-color: #6fbe9f !important;
}

.bg-blue {
  background-color: #5860b0 !important;
}

.bg-light-blue {
  background-color: #6fa8d1 !important;
}
.bg-yellow {
  background-color: #fcaf15 !important;
}

.bg-gray {
  background-color: #c0c0c0 !important;
}
.content {
  padding: 3px 0px 3px 0px;
  justify-content: center !important;
}

.v-container {
  padding: 16px 16px 0px 0px;
}

.v-table {
  background-color: transparent !important;
  width: 100% !important;
}
.thead {
  background-color: transparent !important;
}

.paid {
  color: #111;
}

.unpaid {
  color: #ff2424;
}
.custom-pagination {
  justify-content: start;
  width: 50%;
  margin: 20px 0px 0px 0px;
}

:deep(.v-btn.v-btn--density-default) {
  /* height: calc(var(--v-btn-height) - 4px); */
  height: none;
  /* width: calc(var(--v-btn-height)); */
}
:deep(.v-pagination__list) {
  justify-content: start;
  padding: 0px;
}

:deep(.v-pagination__item--is-active) {
  background-color: #111;
  color: #fff;
  border-radius: 4px;
}

.hover-effect {
  transition: background-color 0.3s ease;
}

.hover-effect:hover {
  background-color: #dddeea;
  cursor: pointer; /* 滑鼠懸停時顯示指針 */
}

.relative {
  position: relative;
}

.paymentFalse {
  position: absolute;
  background-color: #ff2424;
  width: 17px;
  height: 17px;
  border-radius: 100px;
  text-align: center;
  top: 3px;
  left: 5px;

  :deep(.icon) {
    margin-top: -3px;
  }
}
</style>
