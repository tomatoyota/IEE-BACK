import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    // 搜尋最新消息
    async searchAcademicsList (obj) {
        try{
            const method = 'POST';
            const url = '/academics/list';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async postAcademics (obj) {
        try{
            const method = 'POST';
            const url = '/academics/create';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async uploadFile (obj, type) {
        try{
            const method = 'POST';
            const url = `/publication/upload/${type}`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async academicsKeywordSearch (obj) {
        try{
            const method = 'POST';
            const url = `/publication/search`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getAcademicsDetail (id) {
        try{
            const method = 'GET';
            const url = `/academics/${id}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async putAcademics (obj) {
        try{
            const method = 'PUT';
            const url = `/academics/update`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async deleteAcademicsItem (obj) {
        try{
            const method = 'DELETE';
            const url = `/academics/del`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getAssociationYears() {
        try{
            const method = 'GET';
            const url = `/academics/dropdown/volume`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res
    }catch(error){
        return {
            isSuccess: false,
            rtnCode: error.response?.data?.rtnCode,
            msg: error.response?.data?.rtnMsg || '發生錯誤',
            loading: false
        };
    }
},
}