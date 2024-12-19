<template>
  <!-- 季刊=會勘=quarterly -->

  <v-row class="pa-4 justify-center">
    <v-col cols="6">
      <v-row>
        <v-col cols="12">
          <div class="bold mb-2">分會選擇</div>
          <v-row>
            <v-col cols="3" v-for="(branchItem, index) in branchList">
              <v-checkbox color="primary" v-model="formData.branchIds" :value="branchItem.branchId" :label="branchItem.level"></v-checkbox>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">今年繳費註記</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.paymentStatus"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="paymentStatusList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">近幾年曾繳費</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.paymentTrueYears"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">近幾年未繳費</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.paymentFalseYears"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">級位</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.memberLevel"
                density="compact"
                :items="levelList"
                item-title="name"
                item-value="level"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">選擇列印欄位</div>
          <v-row>
            <v-col cols="3" v-for="(fieldItem, index) in fieldList">
              <v-checkbox color="primary" v-model="formData.fields" :value="fieldItem" :label="fieldItem" hide-details></v-checkbox>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">排序欄位</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.sortField"
                placeholder="請選擇"
                density="compact"
                :items="sortFieldList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">排除條件</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.subscriptionStatus"
                placeholder="可選擇條件"
                density="compact"
                :items="statusList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <div class="bold mb-2">會員資歷（依所選擇之基準日期往前推算）</div>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="setCreatedAt"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="createdAtList"
                item-title="name"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <Datepicker
                :disabled="setCreatedAt === null"
                v-model="formData.joinDateTo"
                :clearable="true"
                :enableTimePicker="false"
                :auto-apply="true"
                placeholder="請選擇基準日期"
                :day-names="['一', '二', '三', '四', '五', '六', '日']"
                :format="dateFormat"
              >
                <template #month="{ text, value }"> {{ value + 1 }}月 </template>
              </Datepicker>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="text-end">
          <v-btn @click="getExcel()" color="primary" variant="flat">匯出成 Excel</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <LoadingComponent :loading="loading" />
</template>

<script>
// import cities from '@/json/TwCities.json'
import { ref, computed, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import printSrv from '@/service/print.js';
import Swal from '@/utils/sweetAlert.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js';
import { storeToRefs } from 'pinia';
import { usePersonalStore } from '@/stores/PersonalMember.js';

export default {
  setup() {},
  components: {
    Datepicker,
    LoadingComponent
  },
  data() {
    return {
      tab: 1,
      branchList: [],
      levelList: ['初級', '正級', '永級', '電級', '機級', '工級', '程級'],
      fieldList: [
        '姓名',
        '會員證號',
        '級位',
        '分會',
        '繳註',
        '性別',
        '生日',
        '服務機關',
        '現任職務',
        '行業別',
        '電話',
        '郵遞區號',
        '通訊地址',
        '電子郵件'
      ],
      statusList: ['不設限', '正常', '失聯'],
      sortFieldList: [
        // {
        //   name: '不設限',
        //   value: null
        // },
        {
          name: '會員證號',
          value: 'front_user_id'
        },
        {
          name: '會員級別',
          value: 'level'
        },
        {
          name: '分會',
          value: 'branch'
        },
        {
          name: '建立日期 ',
          value: 'create_at'
        },
        {
          name: '更新日期 ',
          value: 'updated_at'
        }
      ],
      yearsList: [
        {
          name: '不設限',
          value: null
        },
        {
          name: '一',
          value: 1
        },
        {
          name: '二',
          value: 2
        },
        {
          name: '三',
          value: 3
        },
        {
          name: '四',
          value: 4
        },
        {
          name: '五',
          value: 5
        }
      ],
      createdAtList: [
        {
          name: '不設限',
          value: null
        },
        {
          name: '會籍滿一年',
          value: 1
        },
        {
          name: '會籍滿二年',
          value: 2
        },
        {
          name: '會籍滿三年',
          value: 3
        },
        {
          name: '會籍滿四年',
          value: 4
        },
        {
          name: '會籍滿五年',
          value: 5
        }
      ],
      paymentStatusList: [
        // {
        //   name: '不設限',
        //   value: null
        // },
        {
          name: '已繳費',
          value: 1
        },
        {
          name: '未繳費',
          value: 0
        }
      ],
      formData: {
        branchIds: [],
        paymentStatus: 0, //必填
        paymentTrueYears: null, //為空不送
        paymentFalseYears: null, //為空不送
        subscriptionStatus: '',
        memberLevel: '初級', //必填
        joinDateFrom: '',
        joinDateTo: new Date(),
        fields: ['姓名'], //至少選一個
        sortField: 'create_at',
        subscriptionStatus: '不設限' //必填
      },
      setCreatedAt: null,
      loading: false,
      dateFormat: 'yyyy-MM-dd'
    };
  },
  mounted() {
    this.getBranchList();
    // this.getPersonalLevelList();
  },
  watch: {
    setCreatedAt(val) {
      if (val === null) {
        this.formData.createdAtTo = '';
      }
    }
  },
  methods: {
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
    async getBranchList() {
      try {
        await dropSrv
          .getBranchList()
          .then((res) => {
            if (res.isSuccess) {
              this.branchList = res.data.data;
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getPersonalLevelList() {
      this.loading = true;
      try {
        await dropSrv
          .getPersonalLevelList()
          .then((res) => {
            // api 回傳成功
            if (res.isSuccess && res.data.rtnCode == '0000') {
              // rtnCode 為 0000 的情況
              this.levelList = [{ name: '不設限', level: null }, ...res.data.data];
              this.formData.memberLevel = null;
            } else {
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
    async getExcel() {
      this.loading = true;
      try {
        // 驗證必填欄位
        this.validateForm();

        // 構建 API body
        const obj = this.buildRequestBody();

        const res = await printSrv.getExcel(obj);
        // console.log(res);
        // 直接從 res.data 提取 CSV 資料
        // const responseText = res.data;
        // const rows = responseText.split('\n'); // 按行切割資料

        if (res.isSuccess) {
      const data = res.data;

      // 判斷回應內容是否為 CSV 或錯誤物件
      if (typeof data === 'string' && data.includes('\n')) {
        // 成功：處理下載
        this.downloadCSV(res); // 執行下載
        await Swal.fire({
          toast: true,
          position: 'center',
          title: '下載成功',
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400,
        });
        this.$router.push('/admin/Member');
      } else if (data.rtnCode === '0001') {
        // 失敗：沒有符合條件的資料
        Swal.fire({
          toast: true,
          position: 'center',
          title: data.rtnMsg || '無符合搜尋的資料',
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400,
        });
      } else {
        // 失敗：其他未知錯誤
        Swal.fire({
          toast: true,
          position: 'center',
          title: `下載失敗，原因：${data.rtnMsg || '未知錯誤'}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400,
        });
      }
    } else {
      // 無法執行請求時的處理（應不會進入此邏輯，但保留防禦性代碼）
      Swal.fire({
        toast: true,
        position: 'center',
        title: '下載失敗，請稍後再試',
        confirmButtonColor: '#0E2A34',
        confirmButtonText: '確認',
        background: '#F0F0F2',
        width: 400,
      });
    }
  } catch (error) {
    // 捕捉異常錯誤
    Swal.fire({
      toast: true,
      position: 'center',
      title: `錯誤：${error.rtnMsg || '未知錯誤，請重新登入後嘗試'}`,
      confirmButtonColor: '#0E2A34',
      confirmButtonText: '確認',
      background: '#F0F0F2',
      width: 400,
    });
  } finally {
    // 確保無論成功或失敗都關閉 loading
    this.loading = false;
  }

      //   printSrv.getExcel(obj).then((res) => {
      //     // console.log(res.headers);
      //     // api 回傳成功
      //     if (res.isSuccess) {
      //       // rtnCode 為 0000 的情況
      //       if (res.data.rtnCode == '0000') {
      //         this.downloadCSV(res);
      //         Swal.fire({
      //           toast: true,
      //           position: 'center',
      //           title: '下載成功',
      //           confirmButtonColor: '#0E2A34',
      //           confirmButtonText: '確認',
      //           background: '#F0F0F2',
      //           width: 400
      //         }).then((result) => {
      //           if (result.isConfirmed) {
      //             this.$router.push('/admin/Member');
      //           }
      //         });
      //       } else {
      //         // rtnCode 不為 0000 的情況
      //         Swal.fire({
      //           toast: true,
      //           position: 'center',
      //           title: `無符合搜尋的資料`,
      //           confirmButtonColor: '#0E2A34',
      //           confirmButtonText: '確認',
      //           background: '#F0F0F2',
      //           width: 400
      //         });
      //       }
      //     } else {
      //       // api 回傳失敗
      //       Swal.fire({
      //         toast: true,
      //         position: 'center',
      //         title: `下載失敗`,
      //         confirmButtonColor: '#0E2A34',
      //         confirmButtonText: '確認',
      //         background: '#F0F0F2',
      //         width: 400
      //       });
      //     }
      //   });
      // } catch (error) {
      //   Swal.fire({
      //     toast: true,
      //     position: 'center',
      //     title: `${error}`,
      //     confirmButtonColor: '#0E2A34',
      //     confirmButtonText: '確認',
      //     background: '#F0F0F2',
      //     width: 400
      //   });
      //   this.loading = false;
      // } finally {
      //   // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
      //   this.loading = false;
      // }
    },
    validateForm() {
      const requiredFields = [
        { field: this.formData.paymentStatus, name: '繳費狀態' },
        { field: this.formData.memberLevel, name: '會員等級' },
        { field: this.formData.fields.length > 0, name: '欄位 (至少選一項)' }
      ];
      const errors = requiredFields
        .filter((item) => item.field === '' && item.field === null && item.field == undefined)
        .map((item) => `${item.name}不能為空`);

      if (errors.length > 0) {
        throw new Error(errors.join('、<br>'));
      }
    },
    buildRequestBody() {
      const obj = {
        paymentStatus: this.formData.paymentStatus,
        memberLevel: this.formData.memberLevel,
        fields: this.formData.fields,
        fileType: 'csv'
      };

      // 動態加入選填欄位
      if (this.formData.branchIds) obj.branchIds = this.formData.branchIds;
      if (this.formData.paymentTrueYears) obj.paymentTrueYears = this.formData.paymentTrueYears;
      if (this.formData.paymentFalseYears) obj.paymentFalseYears = this.formData.paymentFalseYears;
      if (this.formData.subscriptionStatus !== '不設限') obj.subscriptionStatus = this.formData.subscriptionStatus;

      if (this.setCreatedAt !== null) {
        (obj.createdAtFrom = this.countDate(this.formData.joinDateTo, this.setCreatedAt)),
          (obj.createdAtTo = this.transformDate(this.formData.joinDateTo));
      }

      if (this.formData.sortField) obj.sortField = this.formData.sortField;
      if (this.formData.subscriptionStatus !== '不設限') obj.subscriptionStatus = this.formData.subscriptionStatus;

      return obj;
    },
    downloadCSV(res) {
      // 創建 Blob
      //csv
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      const blob = new Blob([bom, res.data], { type: 'text/csv;charset=utf-8;' });
      //xlsx
      //// 如果是 Base64
      // const binary = atob(res.data);
      // const arrayBuffer = new ArrayBuffer(binary.length);
      // const uintArray = new Uint8Array(arrayBuffer);
      // for (let i = 0; i < binary.length; i++) {
      //   uintArray[i] = binary.charCodeAt(i);
      // }
      //// 一般blob
      // const blob = new Blob([res.data], {
      //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // });

      //設定檔案名稱
      const fileName = '會員名冊.csv';
      // 建立下載連結
      const url = URL.createObjectURL(blob);

      // 使用 <a> 元素觸發下載
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      // document.body.appendChild(link)
      link.click();

      // 清理資源
      // document.body.removeChild(link)
      URL.revokeObjectURL(url);
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

    countDate(baseDate, yearsAgo) {
      if (!baseDate || !yearsAgo) return '';
      const date = new Date(baseDate);
      date.setFullYear(date.getFullYear() - yearsAgo);
      return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
    }
  }
};
</script>

<style scoped>
.text-red {
  color: crimson;
  font-weight: 900;
  margin-right: 4px;
}
.bold {
  font-size: 16px;
  font-weight: 700;
}

:deep(.v-selection-control--density-default) {
  --v-selection-control-size: 30px !important;
}
:deep(.v-selection-control__input) {
  align-items: center;
  display: flex;
  flex: none;
  justify-content: start;
  position: relative;
  border-radius: 50%;
  padding: 0px !important;
}
.custom-checkbox {
  height: 24px;
  line-height: 24px;
}
.end {
  justify-content: flex-end;
}

.text-style {
  font-size: 20px;
  font-weight: 600;
  color: #1b2482;
  padding: 4px;
  border-left: 8px solid #1b2482;
}
</style>
