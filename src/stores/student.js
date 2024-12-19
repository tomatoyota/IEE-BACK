import { defineStore } from 'pinia';

export const studentStore = defineStore('studentdb', {
  state: () => ({
    searchCondition: {
      studentId: '',
      chineseName:'',
      email: '',
      reviewStatus: '',
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    },
    editViewData: {},
    editViewTableItem: [],
    paginations: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 1
    },
    // paginations: [
    //   {
    //     currentPage: 1,
    //     totalCount: 0,
    //     totalPages: 1
    //   },
    //   {
    //     currentPage: 1,
    //     totalCount: 0,
    //     totalPages: 1
    //   },
    //   {
    //     currentPage: 1,
    //     totalCount: 0,
    //     totalPages: 1
    //   },
    //   {
    //     currentPage: 1,
    //     totalCount: 0,
    //     totalPages: 1
    //   }
    // ],
    editStatus: [],
    checkItem: [],
    viewTableItem:null,
 
  }),
  actions: {
    updateSearchCondition(newCondition) {
      this.searchCondition = newCondition;
    },
    updateEditViewTableItem(viewTableItem) {
      this.viewTableItem = viewTableItem
    },
    updatePagination(paginations) {
      this.paginations = paginations;
      console.log("student.js updatePagination: ",this.paginations)
    },
    updateEditStatus(editStatus) {
      this.editStatus = editStatus;
    },
    updateCurrentPage(currentPage) {
      this.paginations.currentPage = currentPage;
    },
    updateChecklistItem(checkItem) {
      this.checkItem = checkItem;
    }
  }
});
