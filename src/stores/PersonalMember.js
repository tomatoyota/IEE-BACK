import { defineStore } from 'pinia';

export const usePersonalStore = defineStore('personaldb', {
  state: () => ({
    searchCondition: {
      frontUserId: '',
      name: '',
      level: '',
      paymentStatus: 0,
      sortField: 'createdAt',
      sortOrder: 'DESC',
      currentPage: 1,
      page: 1,
      size: 10
    },
    tableItems: [],

    paginations: {
      currentPage: 1,
      totalCount: 0,
      totalPages: 1
    },
    editData: null,
    paymentData: null,
    userData: null
  }),
  actions: {
    updatePagination(paginations) {
      this.paginations = paginations;
    },
    updateEditData(editData) {
      this.editData = editData;
    },
    updatePaymentData(paymentData) {
      this.paymentData = paymentData;
    },
    updateUserData(userData) {
      this.userData = userData;
    },
    setSearchCondition(condition) {
      this.searchCondition = condition;
    },
    setTableItems(items) {
      this.tableItems = items;
    },
    setPaginations(pagination) {
      this.paginations = pagination;
    },
    clearStore() {
      this.searchCondition = {
        frontUserId: '',
        name: '',
        level: null,
        paymentStatus: null,
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      };
      this.paginations = {
        currentPage: 1,
        totalPages: 1
      };
      this.tableItems = [];
    }
  }
});
