import { defineStore } from 'pinia';

export const useQuarterStore = defineStore('quarterdb', {
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
    editViewData: {},
    editViewTableItem: [],
    paginations: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 1
    },
    editStatus: [],
    checkItem: [],
    editData: null
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
    updateChecklistItem(checkItem) {
      this.checkItem = checkItem;
    }
  }
});
