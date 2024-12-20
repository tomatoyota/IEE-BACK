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
            <v-btn class="w-100" flat color="success" @click="searchMemberList(1)">搜尋</v-btn>
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
          <td class="no-wrap">{{ truncateText(item.frontUserId, 16) }}</td>
          <td class="no-wrap position-relative">
            <div class="paymentFalse" v-if="item.paymentStatus === ''">
              <v-icon class="icon" icon="mdi mdi-exclamation" size="8px" color="white"></v-icon>
            </div>
            <div :class="['lvColor text-center', getLvColor(item)]">{{ convertLevel(item.level) }}</div>
          </td>
          <td class="no-wrap">{{ truncateText(item.chineseName, 16) }}</td>
          <td class="no-wrap">{{ truncateText(item.mainAddressCity + item.mainAddressDistrict + item.mainAddressDetail, 30) }}</td>
          <td class="no-wrap">{{ item.mainPhone }}</td>
          <td class="no-wrap">{{ truncateText(item.email, 25) }}</td>
          <td :class="getStatusClass(item.paymentStatus)" class="no-wrap">
            <v-chip :color="item.statusColor" :class="getStatusClass(item.paymentStatus)" variant="text">
              {{ convertPaymentStatus(item.paymentStatus) }}
            </v-chip>
          </td>

          <td class="no-wrap text-right">
            <v-btn variant="outlined" class="text-style" @click="getAcademicsDetail(item.frontUserId)">編輯</v-btn>
            <v-btn variant="text" class="text-style" @click="getPaymentHistory(item)">繳費紀錄</v-btn>
            <v-btn variant="text" class="text-style" @click="deleteAcademicsItemCheck(item.frontUserId)">刪除</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <PaginationComponent
      :pageLength="paginations.totalPages"
      :currentPage="paginations.currentPage"
      @get-list="searchMemberList"
      @set-page="setPage"
    ></PaginationComponent>
  </div>
  <LoadingComponent :loading="loading" />
</template>

<script>
import { storeToRefs } from 'pinia';
import { usePersonalStore } from '@/stores/PersonalMember.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from '@/utils/sweetAlert';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import personalMemSrv from '@/service/personalMember.js';
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
          title: '姓名',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '地址',
          value: '',
          sort: '',
          width: '25%'
        },
        {
          title: '電話',
          value: '',
          sort: '',
          width: '10%'
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
      listAmount: [10, 50, 100, 500],
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
          value: 0
        }
      ]
    };
  },
  setup() {
    const personalStore = usePersonalStore();
    const { searchCondition, paginations } = storeToRefs(personalStore);

    return { personalStore, searchCondition, paginations };
  },
  created() {
    // const store = useEditdbStore();
    // const { searchCondition, editViewTableItem, paginations, checkItem, allWordIds } = storeToRefs(store);
    // // 搜尋欄位狀態儲存
  },
  watch: {},
  mounted() {
    this.searchMemberList();
    this.getPersonalLevelList();
    this.initializePage();
    const personalStore = usePersonalStore();

    // 如果要根據 Store 資料重新渲染頁面
    if (personalStore.searchCondition) {
      this.searchCondition = { ...personalStore.searchCondition };
    }
    if (personalStore.paginations) {
      this.paginations = { ...personalStore.paginations };
    }
    if (personalStore.tableItems) {
      this.tableItems = [...personalStore.tableItems];
    }
  },
  methods: {
    async searchMemberList() {
      this.loading = true;
      const personalStore = usePersonalStore();
      try {
        const frontUserId = this.searchCondition.frontUserId || '';
        const name = this.searchCondition.name || '';
        const level = this.searchCondition.level || '';
        const paymentStatus =
          this.searchCondition.paymentStatus !== null || this.searchCondition.paymentStatus !== undefined
            ? this.searchCondition.paymentStatus
            : '';
        const currentPage = this.paginations.currentPage || 1;
        // const page = this.paginations.currentPage
        // const size = this.searchCondition.size
        const pageSize = this.searchCondition.size || 10;
        const sortField = 'created_at';
        const sortOrder = 'DESC';

        //     const condition = {
        //   frontUserId : frontUserId,
        //   name : name,
        //   level : level,
        //   paymentStatus : paymentStatus,
        //   // page : page,
        //   currentPage: page || 1,
        //   pageSize : pageSize || 10,
        //   sortField : sortField,
        //   sortOrder:  sortOrder,
        // };
        const condition = {
          frontUserId,
          name,
          level,
          paymentStatus,
          currentPage,
          pageSize,
          sortField,
          sortOrder
        };

        await personalMemSrv
          .searchMemberList(frontUserId, name, level, paymentStatus, currentPage, pageSize, sortField, sortOrder)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                this.tableItems = res.data.data;
                this.paginations.currentPage = res.data.pagination.currentPage;
                this.paginations.totalPages = res.data.pagination.totalPages;
                this.paginations = {
                  ...this.paginations,
                  currentPage: res.data.pagination.currentPage,
                  totalPages: res.data.pagination.totalPages,
                  totalCount: res.data.pagination.totalCount
                };
                // console.log("發送的請求參數：", condition);
                // console.log(this.tableItems)
                // console.log(this.paginations.currentPage)
                // console.log(this.paginations.totalPages)
                //TODO 這個結果存進store 搜尋欄位、table、pagenation都要存
                // personalStore.setSearchCondition(condition);
                personalStore.setTableItems(res.data.data);
                personalStore.setPaginations(this.paginations);
                // console.log(personalStore)
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
      } finally {
        // 確保無論成功或失敗都執行
        this.loading = false;
      }
    },
    addMember() {
      this.$router.push({
        path: '/admin/personalView',
        query: {
          action: 'add'
        }
      });
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },
    async getPersonalLevelList() {
      this.loading = true;
      try {
        await dropSrv
          .getPersonalLevelList()
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
      } finally {
        // 確保無論成功或失敗都執行
        this.loading = false;
      }
    },
    async getAcademicsDetail(id) {
      this.loading = true;
      try {
        await personalMemSrv
          .getAcademicsDetail(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                const store = usePersonalStore();
                store.updateEditData(res.data.data);

                // personalStore.setSearchCondition(this.searchCondition);
                // personalStore.setPaginations(this.paginations);
                // personalStore.setTableItems(this.tableItems);

                this.$router.push({
                  path: '/admin/personalView',
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
      } finally {
        // 確保無論成功或失敗都執行
        this.loading = false;
      }
    },
    deleteAcademicsItemCheck(id) {
      Swal.fire({
        toast: true,
        position: 'center',
        title: `是否確定要刪除此會員?`,
        confirmButtonText: '確認',

        showCancelButton: true,
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteAcademicsItem(id);
        }
      });
    },
    async deleteAcademicsItem(id) {
      this.loading = true;
      try {
        await personalMemSrv
          .deleteMember(id)
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
                    this.searchMemberList();
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
        // 捕捉錯誤
        console.error('Error:', error);
        await Swal.fire({
          toast: true,
          position: 'center',
          title: `系統錯誤：${error.message || error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      } finally {
        // 確保無論成功或失敗都執行
        this.loading = false;
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
        await personalMemSrv
          .getPaymentHistory(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                const store = usePersonalStore();
                store.updateUserData(userData);
                store.updatePaymentData(res.data.data);
                this.$router.push('/admin/personalPaymentView');
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
      } finally {
        // 確保無論成功或失敗都執行
        this.loading = false;
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
      const personalStore = usePersonalStore();
      if (personalStore.searchCondition.frontUserId || personalStore.tableItems.length) {
        this.searchCondition = { ...personalStore.searchCondition };
        this.paginations = { ...personalStore.paginations };
        this.tableItems = [...personalStore.tableItems];
      } else {
        // 如果無狀態則執行初始資料加載
        this.searchMemberList();
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
      const personalStore = usePersonalStore();
      personalStore.clearSearchCondition();
      // this.$resetStore();
    },
    convertLevel(status) {
      switch (status) {
        case 1:
          return '初級';
        case 2:
          return '正級';
        case 3:
          return '永級';
        default:
          return '';
      }
    },
    getStatusClass(status) {
      return status === 1 ? 'paid' : 'unpaid';
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
    setPage(page) {
      if (this.paginations.currentPage === page) {
        console.log('點擊了同一頁，無需更新');
        return;
      }

      // 更新當前頁碼
      this.paginations.currentPage = page;

      // 調用 API 請求
      this.searchMemberList();

      // 日誌方便檢查
      console.log('更新分頁', this.paginations);
    },
    handlePageChange(newPage) {
      // if (this.paginations.currentPage === newPage) {
      //   return; // 避免重複 API 請求
      // }
      this.paginations.currentPage = newPage; // 更新當前頁碼
      this.searchMemberList(); // 執行搜尋
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
      this.searchMemberList();
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
