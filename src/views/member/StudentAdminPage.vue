<template>
  <div class="relative">
    <v-form>
      <v-row class="py-4">
        <!-- <v-col>
          <v-text-field
            v-model="searchCondition.studentId"
            variant="outlined"
            label="證號"
            hide-details
            class="search-theme"
          ></v-text-field>
        </v-col> -->
        <v-col>
          <v-text-field v-model="searchCondition.name" variant="outlined" label="姓名" hide-details class="search-theme"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="searchCondition.email" variant="outlined" label="Email" hide-details class="search-theme"></v-text-field>
        </v-col>
        <v-col>
          <v-select
            label="審核狀態"
            :items="StatusList"
            item-title="name"
            item-value="value"
            v-model="searchCondition.reviewStatus"
            variant="outlined"
            hide-details
            class="search-theme"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            label="顯示筆數"
            :items="listAmount"
            v-model="searchCondition.pageSize"
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
            <v-btn class="w-100" flat color="success" @click="searchStudentMember">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>
    <!-- <v-row>
      <v-col class="text-right">
        <v-btn color="primary" flat @click="addMember()"> 新增會員 </v-btn>
      </v-col>
    </v-row> -->
    <v-table
      class="mt-4 mb-2"
      :height="paginatedItems.length > 10 ? '550px' : ''"
      :fixed-header="paginatedItems.length > 10"
    >
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.value" class="no-wrap">
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" class="hover-effect">
          <td class="no-wrap">{{ truncateText(item.studentId,16) }}</td>
          <td class="no-wrap">{{ truncateText(item.chineseName,8) }}</td>
          <td class="no-wrap">{{ truncateText(item.email,30) }}</td>
          <td class="no-wrap">{{ formatDate(item.createdAt) }}</td>
          <td class="no-wrap">
            <!-- 待修改 -->
            <v-chip variant="text"
              ><v-icon :style="{ color: getStatusColor(item.reviewStatus) }">mdi mdi-circle-medium</v-icon
              >{{ getStatusText(item.reviewStatus) }}</v-chip
            >
          </td>
          <td class="no-wrap">
            <v-btn variant="outlined" class="text-style" @click="setPersonalID(item.studentId)">設定代號</v-btn>
            <v-btn variant="text" class="text-style" @click="getStudentDetail(item.studentId)">查看申請表</v-btn>
            <!-- <a href="#" @click.prevent="getStudentItems(item.studentId)"
              ><v-tooltip text="查看申請表" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" class="text-style" v-bind="props"
                    >查看申請表</v-btn
                  >
                </template>
              </v-tooltip></a> -->
            <v-btn variant="text" class="text-style" @click="deleteCheck(item.studentId)">刪除申請</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <PaginationComponent
      v-if="paginations && paginations.currentPage"
      :pageLength="paginations.totalPages"
      :current-page="paginations.currentPage"
      @get-list="searchStudentMember"
      @set-page="setPage"
    ></PaginationComponent>
   
  </div>
  <LoadingComponent :loading="loading" />
</template>

<script>
import { storeToRefs } from 'pinia';
import { studentStore } from '@/stores/student.js';
import { defineComponent } from 'vue';
import studentSrv from '@/service/studentMember.js';
import Swal from '@/utils/sweetAlert';
import PaginationComponent from '@/components/PaginationComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import transform from 'ant-design-vue/es/_util/cssinjs/transformers/legacyLogicalProperties';

export default {
  components: {
    PaginationComponent,
    LoadingComponent
  },
  data() {
    return {
      tab: 3,
      buttons: [
        { id: 1, label: '會員列表', variant: 'outlined' },
        { id: 2, label: '資料列印', variant: 'outlined' },
        { id: 3, label: '年費繳交註記', variant: 'outlined' }
      ],
      activeButton: null,
      searchCondition: {
        // frontUserId: '',
        name: '',
        email: '',
        reviewStatus: '',
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        currentPage: 1,
        pageSize: 10
      },
      // items: [
      //   { id: 1, name: "Item 1" },
      //   { id: 2, name: "Item 2" },
      //   { id: 3, name: "Item 3" },
      // ],
      items: [],
      headers: [
        { text: '序號', value: 'id' },
        { text: '姓名', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: '申請日期', value: 'date' },
        { text: '審核狀態', value: 'status' },
        { text: '', value: 'actions', sortable: false }
      ],
      paginations: {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      page: 1,
      perPage: 1,
      tableItems: [],
      StatusList: [
        { name: '全部', value: '' },
        { name: '審核中', value: 0 },
        { name: '已審核', value: 1 }
      ],
      listAmount: [1, 10, 50, 100, 500],
      search: '',
      loading: false,
      currentTime: ''
    };
  },
  created() {
    this.activeButton = 3;
    const store = studentStore();
    const { searchCondition, paginations } = storeToRefs(store);
    if (searchCondition) {
      this.searchCondition = searchCondition;
    }
    //開了會噴錯
    // if (paginations) {
    //   this.paginations = paginations.value[this.activeTab - 1];
    //   // console.log("created",this.paginations)
    // }
  },
  mounted() {
    this.searchStudentMember();
    // this.initializePage();
  },
  computed: {
    paginatedItems() {
      if (!this.paginations || !this.paginations.currentPage) {
        return []; // 如果 paginations 未初始化，返回空數組
      }
      const start = (this.paginations.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    }
  },
  watch: {
    searchCondition: {
      handler() {
        const store = studentStore();
        store.searchCondition = this.searchCondition;
      },
      deep: true
    },
    paginations: {
      handler() {
        const store = studentStore();
        // store.paginations[this.activeTab] = this.paginations;
        store.updatePagination(this.paginations);
      },
      deep: true
    }
    // "paginations.currentPage"(newPage, oldPage) {
    //   console.log(`頁碼從 ${oldPage} 變為 ${newPage}`);
    // },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) {
        // 如果 dateStr 是 undefined 或空值，直接返回空字符串或其他處理邏輯
        // console.error("Invalid date string:", dateStr);
        return '';
      }
      const date = new Date(dateStr);
      const isUtc = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-');
      if (isUtc) {
        date.setHours(date.getHours() + 8);
      }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}`;
      return formattedDateTime;
    },
    async searchStudentMember() {
      this.loading = true;
      try {
        const params = {
          page: this.paginations.currentPage,
          size: this.searchCondition.pageSize,
          sortField: 'created_at',
          sortOrder: 'DESC',
          name: this.searchCondition.name || '',
          email: this.searchCondition.email || '',
          reviewStatus: this.searchCondition.reviewStatus
        };
      
        // const studentId = this.searchCondition.studentId || '';
        // const name = this.searchCondition.name || '';
        // const email = this.searchCondition.email || '';
        // const reviewStatus = this.searchCondition.reviewStatus || '';
        // const currentPage = this.paginations.currentPage || 1;
        // const pageSize = this.paginations.pageSize || 10;
        // const sortField = 'created_at';
        // const sortOrder = 'ASC';

        await studentSrv.searchStudentMember(params).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if (res.data.rtnCode === '0000') {
              this.tableItems = res.data.data;
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
    clearSearch() {
      this.searchCondition = {
        name: '',
        email: '',
        reviewStatus: '',
        currentPage: 1,
        pageSize: 10
      };
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },
    async getStudentItems(id) {
      this.loading = true;
      try {
        await studentSrv
          .getStudentsDetail(id)
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              if (res.data.rtnCode === '0000') {
                this.tableItems = res.data.data;

                // this.paginations.currentPage = res.data.pagination.currentPage;
                // this.paginations.totalPages = res.data.pagination.totalPages;
                this.paginations = {
                  // ...this.paginations,
                  currentPage: res.data.pagination.currentPage,
                  totalPages: res.data.pagination.totalPages,
                  totalCount: res.data.pagination.totalCount
                };
                // console.log(this.tableItems);
                this.$router.push('/admin/StudentViewPage');
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
    addMember() {
      this.$router.push({
        path: '/admin/studentView',
        query: {
          action: 'add'
        }
      });
    },
    //設定代號
    setPersonalID(id) {
      this.loading = true;
      this.currentTime = new Date();
      const obj = {
        entryDate: this.currentTime
      };
      try {
        if (obj.entryDate !== '' || obj.entryDate !== undefined) {
          // console.log(obj.entryDate);
          studentSrv.postTransferToPersonal(id, obj).then((res) => {
            // api 回傳成功
            // rtnCode 為 0000 的情況
            if (res.isSuccess && res.data.rtnCode === '0000') {
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
                  this.searchStudentMember();
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
          });
        }
      } catch (error) {
        // 處理錯誤情況
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    //查看申請表
    getStudentDetail(id) {
      this.loading = true;
      try {
        studentSrv
          .getStudentsDetail(id)
          .then((res) => {
            // api 回傳成功
            // rtnCode 為 0000 的情況
            if (res.isSuccess && res.data.rtnCode === '0000') {
              const store = studentStore();
              console.log('1', res.data.data);
              store.updateEditViewTableItem(res.data.data);

              this.$router.push({
                path: '/admin/StudentView',
                query: {
                  action: 'view'
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
        this.loading = false;
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
    //刪除申請防呆
    deleteCheck(id) {
      Swal.fire({
        toast: true,
        position: 'center',
        title: `是否確定要刪除此申請?`,
        confirmButtonText: '確認',

        showCancelButton: true,
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteItem(id);
        }
      });
    },
    //call刪除申請API
    async deleteItem(id) {
      this.loading = true;
      try {
        await studentSrv
          .deleteMember(id)
          .then((res) => {
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
                    this.searchStudentMember();
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
    getStatusColor(status) {
      switch (status) {
        case 1: // 狀態 1：綠色
          return '#73E14C';
        case 0: // 狀態 0：橙色
          return '#FCAF15';
        default:
          // 預設灰色處理
          return '#CCCCCC';
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
      this.searchStudentMember();

      // 日誌方便檢查
      console.log('更新分頁', this.paginations);
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '完成審核，待設定證號';
        case 0:
          return '審核中';
        default:
          return '未知狀態';
      }
    },
    handleButtonClick(buttonId) {
      this.activeButton = buttonId;
    },
    checkCheckbox() {
      if (this.checkAllItem) {
        this.checkItem = this.tableItems.map((item) => item.id);
      } else {
        this.checkItem = [];
      }
    },
    sortDBList(header) {
      // 排序邏輯
    },
    getStatusClass(status) {
      return {
        'text-success': status === '已編輯',
        'text-error': status !== '已編輯'
      };
    },
    transferStatus(status) {
      return status === '已編輯' ? '已編輯' : '未編輯';
    }
  }
};
</script>

<style scoped>
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

.text-style {
  font-size: 16px;
  font-weight: 600;
  color: #1b2482;
}
.no-wrap {
  white-space: nowrap; /* 避免文字斷行 */
  text-align: start;
}

.lvColor {
  background-color: #111;
  border-radius: 0px 10px 0px 10px;
  color: #fff !important;
  font-weight: 600;
  font-size: 14px;
  padding: 4px;
  width: 52px;
}
.content {
  padding: 3px 0px 3px 0px;
  justify-content: center !important;
}

.v-container {
  padding: 16px 16px 0px 0px;
}

.v-pagination__list {
  justify-content: flex-start !important;
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

.hover-effect {
  transition: background-color 0.3s ease;
}

.hover-effect:hover {
  background-color: #dddeea;
  cursor: pointer; /* 滑鼠懸停時顯示指針 */
}

.v-chip.v-chip--size-default {
  padding: 0px;
}

.custom-pagination {
  justify-content: start;
  width: 50%;
  margin: 20px 0px 0px 0px;
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
.relative {
  position: relative;
}
</style>
