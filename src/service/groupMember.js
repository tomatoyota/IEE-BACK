import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
  async postGroupMember(obj) {
    try {
      const method = 'POST';
      const url = '/members/group';
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },

  async searchGroupMemberList(params) {
    try {
      const filteredParams = Object.entries(params)
        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      const url = `/members/group?${filteredParams}`;
      const method = 'GET';
      // const url = `/members/group?frontUserId=${frontUserId}&name=${name}&level=${level}&paymentStatus=${paymentStatus}&page=${page}&size=${size}&sortField=${sortField}&sortOrder=${sortOrder}`;
      // const url = `/members/group?currentPage=${page}&pageSize=${size}&sortField=${sortField}&sortOrder=${sortOrder}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async getGroupMemberDetail(id) {
    try {
      const method = 'GET';
      const url = `/members/group/${id}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async putGroupMember(obj, id) {
    try {
      const method = 'PUT';
      const url = `/members/group/${id}`;
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async deleteGroup(id) {
    try {
      const method = 'DELETE';
      const url = `/members/group/${id}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async getPaymentHistory(id) {
    try {
      const method = 'GET';
      const url = `/members/group/payments/${id}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  }
};
