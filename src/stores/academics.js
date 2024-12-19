import { defineStore } from 'pinia';

export const useAcademicStore = defineStore('academicdb', {
  state: () => ({
     // searchCondition: {
    //   announcementTitle: '',
    //   publishDate: [],
    //   department: '',
    //   createDate: [],
    //   sortDirection: '',
    //   page: 1,
    //   pageSize: 10,
    //   sortBy: 'createdAt',
    //   sortDirection: 'DESC',
    //   type: 1
    // },
    paginations: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 1
    },
    editData: null,
    editViewData: {},
    editViewTableItem: [],
    editStatus: [],
    checkItem: []
  }),
  actions: {
    updatePagination(paginations) {
      this.paginations = paginations;
    },
    updateEditData(editData) {
      this.editData = editData;
    },
    updateEditViewTableItem(editViewTableItem) {
      this.editViewTableItem = editViewTableItem;
    },
    updateEditStatus(editStatus) {
      this.editStatus = editStatus;
    },
    updateCurrentPage(currentPage, type) {
      this.paginations[type - 1].currentPage = currentPage;
    },
    updateChecklistItem(checkItem) {
      this.checkItem = checkItem;
    }
  }
});
