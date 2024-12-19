import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
  async postMember(obj) {
    try {
      const method = 'POST';
      const url = '/members/personal';
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async searchStudentMember(params) {
   
    try {
      const method = 'GET';
        
      const queryString = Object.entries(params)
        .filter(([key, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      const url = `/members/students?${queryString}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async getStudentsDetail(id) {
    try {
      const method = 'GET';
      const url = `/members/students/${id}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async putMember(id, obj) {
    try {
      const method = 'PUT';
      const url = `/members/students/${id}`;
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async deleteMember(id) {
    try {
      const method = 'DELETE';
      const url = `/members/students/${id}`;
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
      const url = `/members/personal/payments/${id}`;
      const data = '';
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async verifyEmail(obj) {
    try {
      const method = 'POST';
      const url = `/members/students/verify-email`;
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  },
  async postTransferToPersonal(id, obj) {
    try {
      const method = 'POST';
      const url = `members/students/transfer/${id}`;
      const data = obj;
      const res = await callApi(method, url, data);

      return res;
    } catch (error) {
      return error;
    }
  }
};
