<template>
  <!-- 季刊=會勘=quarterly -->
  <v-form v-model="valid">
    <h2 class="pa-4">
      <span @click="toPrev()" class="cursor-pointer">
        <v-icon>mdi-chevron-left</v-icon>
        {{ pageTitle }}
      </span>
    </h2>

    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <!-- 基本資料 -->
        <div class="text-style mb-4">基本資料</div>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2">中文姓名</div>
                <v-text-field
                  v-model="formData.chineseName"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <div class="bold mb-2">英文姓名</div>
                <v-text-field
                  v-model="formData.englishName"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2">身分證字號</div>
                <v-text-field
                  v-model="formData.idNumber"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <div class="bold mb-2">性別</div>
                <v-select
                  v-model="formData.gender"
                  readonly
                  density="compact"
                  :items="genderList"
                  item-title="name"
                  item-value="value"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2">出生日期</div>
                <v-text-field
                  name="birthday"
                  :label="formData.birthday"
                  id="id"
                  readonly
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- 聯絡資料 -->
        <div class="text-style mb-4 mt-8">聯絡資料</div>
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2">主要通訊地址</div>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="formData.MainCity"
                  readonly
                  density="compact"
                  item-title="name"
                  item-value="locationId"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="formData.MainDistrict"
                  readonly
                  density="compact"
                  item-title="name"
                  item-value="locationId"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="formData.mainAddressPostal"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.mainAddressDetail"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">主要聯絡電話</div>
            <v-text-field
              v-model="formData.mainPhone"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">電子郵件信箱</div>
            <v-text-field
              v-model="formData.email"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 次要聯絡資料 -->
        <div class="text-style mb-4 mt-8">次要聯絡資料</div>
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2">次要通訊地址</div>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-model="formData.SecondaryCity"
                  readonly
                  density="compact"
                  item-title="name"
                  item-value="locationId"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="formData.SecondaryDistrict"
                  readonly
                  density="compact"
                  item-title="name"
                  item-value="locationId"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="formData.secondaryAddressPostal"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.secondaryAddressDetail"
                  readonly
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">次要聯絡電話</div>
            <v-text-field
              v-model="formData.secondaryPhone"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 其他資料 -->
        <div class="text-style mb-4 mt-8">其他資料</div>
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2">最高學歷</div>
            <v-text-field
              v-model="formData.education"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">畢業年份</div>
            <v-text-field
              v-model="formData.graduationYear"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">科系</div>
            <v-text-field
              v-model="formData.schoolMajor"
              readonly
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">是否訂閱雜誌</div>
            <v-select
              v-model="formData.infoSubscription"
              readonly
              :items="subscriptions"
              item-title="name"
              item-value="value"
              density="compact"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">是否訂閱最新消息</div>
            <v-select
              v-model="formData.infoSubscription"
              readonly
              :items="subscriptions"
              item-title="name"
              item-value="value"
              density="compact"
              variant="outlined"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center mb-6">
      <v-col class="d-flex justify-center" cols="2">
        <v-btn color="success" @click="passedThis">確定通過</v-btn>
      </v-col>
    </v-row>
  </v-form>

  <LoadingComponent :loading="loading" />
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import studentSrv from "@/service/studentMember.js";
import Swal from "@/utils/sweetAlert";
import LoadingComponent from "@/components/LoadingComponent.vue";
import dropSrv from "@/service/dropdowns.js";
import { storeToRefs } from "pinia";
import { studentStore } from "@/stores/student.js";
import { tr } from "vuetify/locale";

export default {
  setup() {},
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      reduce: {
        type: Function,
        default: (option) => option,
      },
      tab: 1,
      search: "",
      // textFieldRule: [(v) => !!v || "此欄位為必填"],
      // selectRule: [(v) => !!v || "此欄位為必填"],
      // branchList: ["台北分會", "高雄分會"],
      formData: {
        studentId: 0,
        chineseName: "",
        englishName: "",
        idNumber: "",
        gender: 0,
        birthday: "",
        mainAddressCity: 0,
        mainAddressDistrict: 0,
        mainAddressPostal: "",
        mainAddressDetail: "",
        mainPhone: "",
        secondaryAddressCity: null,
        secondaryAddressDistrict: null,
        secondaryAddressPostal: "",
        secondaryAddressDetail: "",
        secondaryPhone: "",
        email: "",
        education: "",
        graduationYear: "",
        schoolMajor: "",
        magazineSubscription: false,
        infoSubscription: false,
        reviewStatus: 0,
        createdAt: "",
        updatedAt: "",
        updateBy: null,
        MainCity: null,
        MainDistrict: null,
        SecondaryCity: null,
        SecondaryDistrict: null,
      },
      followMainAddress: false,
      followMainPhone: false,
      pageAction: "view",
      pageTitle: "",
      // branchList: [
      //   {
      //     name: "台北分會",
      //     value: 1,
      //   },
      //   {
      //     name: "高雄分會",
      //     value: 2,
      //   },
      // ],
      // cityList: [],
      // secondaryCityList: [],
      // districtList: [],
      // secondaryDistrictList: [],
      genderList: [
        {
          name: "男",
          value: 0,
        },
        {
          name: "女",
          value: 1,
        },
      ],
      subscriptions: [
        { name: "訂閱", value: true },
        { name: "不訂閱", value: false },
      ],
      valid: false,
      loading: false,
    };
  },
  mounted() {
    // this.initEditor()
    // this.getLocationList()
    this.setPage();
  },
  watch: {
    // followMainAddress(val){
    //   if(val){
    //     this.formData.secondaryAddressCity = this.formData.mainAddressCity
    //     this.formData.secondaryAddressDistrict = this.formData.mainAddressDistrict
    //     this.formData.secondaryAddressPostal = this.formData.mainAddressPostal
    //     this.formData.secondaryAddressDetail = this.formData.mainAddressDetail
    //   }else{
    //     this.formData.secondaryAddressCity = null
    //     this.formData.secondaryAddressDistrict = null
    //     this.formData.secondaryAddressPostal = ""
    //     this.formData.secondaryAddressDetail = ""
    //   }
    // },
    // followMainPhone(val){
    //   if(val){
    //     this.formData.secondaryPhone = this.formData.mainPhone
    //   }else{
    //     this.formData.secondaryPhone = ""
    //   }
    // },
    // 'formData.mainAddressCity': {
    //   handler(val) {
    //     const matchCity = this.cityList.find((city) => city.locationId === val)
    //     const districtList = matchCity.children
    //     const mainPostal = matchCity.postalCode
    //     this.districtList = districtList
    //     this.formData.mainAddressPostal = mainPostal
    //   },
    //   deep: true
    // },
    // 'formData.secondaryAddressCity': {
    //   handler(val) {
    //     const matchCity = this.secondaryCityList.find((city) => city.locationId === val)
    //     // 因為有同主要地址的checkbox，所以要判斷是否有matchCity，這樣 checkbox 才能順利切換
    //     if(matchCity){
    //       const districtList = matchCity.children
    //       const secondaryPostal = matchCity.postalCode
    //       this.secondaryDistrictList = districtList
    //       this.formData.secondaryAddressPostal = secondaryPostal
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    setPage() {
      const action = this.$route.query.action;
      this.pageAction = action;
      if (action === "add") {
        this.pageTitle = "新增會員";
      } else if (action === "view") {
        const store = studentStore();
        const viewDataStore = storeToRefs(store);
        const viewData = viewDataStore.viewTableItem.value;
        this.pageTitle = `查看${viewData.studentId}-${viewData.chineseName}申請表`;
        // 處理 formData
        // this.formData = Object.fromEntries(
        //   Object.entries(viewData).map(([value]) => [ value || "無"])
        // );
        this.formData = viewData;
        // console.log(this.formData);
      }
      this.$router.replace("/admin/studentView");
    },
    transformDate(date) {
      if (date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // 將月份和日期補0
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;

        return `${year}-${month}-${day}`;
      }
      return "";
    },
    async passedThis() {
      this.loading = true;
      try {
        // 構建 API body
        const obj = {
          reviewStatus: 1,
        };
        // console.log("送出前", obj,this.formData.studentId);
        // 呼叫 API
        const res = await studentSrv.putMember(this.formData.studentId,obj);

        // 處理API回應
        this.handleResponse(res);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    handleResponse(res) {
      if (res.isSuccess && res.data.rtnCode === "0000") {
        Swal.fire({
          toast: true,
          position: "center",
          title: `${res.data.rtnMsg}`,
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "確認",
          background: "#F0F0F2",
          width: 400,
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/admin/Member");
          }
        });
      } else {
        Swal.fire({
          toast: true,
          position: "center",
          title: `${res.msg}`,
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "確認",
          background: "#F0F0F2",
          width: 400,
        });
      }
    },

    // transGender(value) {
    //   switch (value) {
    //     case value:
    //       0;
    //       return "男";
    //     case value:
    //       1;
    //       return "女";
    //     default:
    //       break;
    //   }
    // },
    // passwordGenerator() {
    //   const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //   const digits = "0123456789";

    //   // 確保有 2 個大寫和 2 個小寫字母
    //   let upperLetters = "";
    //   let lowerLetters = "";
    //   while (upperLetters.length < 2) {
    //     const char = letters.charAt(Math.floor(Math.random() * 26) + 26); // 大寫字母
    //     if (!upperLetters.includes(char)) upperLetters += char;
    //   }
    //   while (lowerLetters.length < 2) {
    //     const char = letters.charAt(Math.floor(Math.random() * 26)); // 小寫字母
    //     if (!lowerLetters.includes(char)) lowerLetters += char;
    //   }

    //   // 生成 8 個隨機數字
    //   let randomDigits = "";
    //   for (let i = 0; i < 8; i++) {
    //     randomDigits += digits.charAt(Math.floor(Math.random() * digits.length));
    //   }

    //   // 組合密碼並打亂順序
    //   const password = (upperLetters + lowerLetters + randomDigits)
    //     .split("")
    //     .sort(() => 0.5 - Math.random())
    //     .join("");

    //   return password;
    // },
    // async getLocationList(){
    //   try{
    //     await dropSrv.getLocationList().then((res) => {
    //       if(res.isSuccess){
    //         this.cityList = res.data.data
    //         this.secondaryCityList = res.data.data
    //         this.setPage()
    //       }
    //     }).catch((error) => {
    //       Swal.fire({
    //         toast: true,
    //         position: 'center',
    //         title: `${error}`,
    //         confirmButtonColor: '#0E2A34',
    //         confirmButtonText: '確認',
    //         background: '#F0F0F2',
    //         width: 400
    //       });
    //     });
    //   }catch{

    //   }
    // },
    // async verifyEmail(){
    //   try{
    //     const obj = {
    //       email: this.formData.email
    //     }
    //     await studentSrv.verifyEmail(obj).then((res) => {
    //       if (res.isSuccess) {
    //         // rtnCode 為 0000 的情況
    //         if(res.data.rtnCode === '0000'){
    //           Swal.fire({
    //             toast: true,
    //             position: 'center',
    //             title: `${res.data.rtnMsg}`,
    //             confirmButtonColor: '#0E2A34',
    //             confirmButtonText: '確認',
    //             background: '#F0F0F2',
    //             width: 400
    //           }).then((result) => {
    //             if(result.isConfirmed){
    //               this.$router.push('/admin/Member');
    //             }
    //           });
    //         }else{
    //           // rtnCode 不為 0000 的情況
    //           Swal.fire({
    //             toast: true,
    //             position: 'center',
    //             title: `${res.data.rtnMsg}`,
    //             confirmButtonColor: '#0E2A34',
    //             confirmButtonText: '確認',
    //             background: '#F0F0F2',
    //             width: 400
    //           });
    //         }
    //       } else {
    //         // api 回傳失敗
    //         Swal.fire({
    //           toast: true,
    //           position: 'center',
    //           title: `${res.data.data.rtnMsg}`,
    //           confirmButtonColor: '#0E2A34',
    //           confirmButtonText: '確認',
    //           background: '#F0F0F2',
    //           width: 400
    //         });
    //       }
    //     }).catch((error) => {
    //       console.error('Error:', error);
    //     });
    //   }catch{

    //   }
    // },
    // async submitMember(){
    //   this.loading = true
    //   try{
    //     const obj = {
    //       frontUserId: this.formData.frontUserId,
    //       password: this.passwordGenerator(),
    //       chineseName: this.formData.chineseName,
    //       englishName: this.formData.englishName,
    //       idNumber: this.formData.idNumber,
    //       gender: parseInt(this.formData.gender),
    //       birthday: this.pageAction === 'add' ? this.transformDate(this.formData.birthday) : this.formData.birthday,
    //       mainAddressCity: this.formData.mainAddressCity,
    //       mainAddressDistrict: this.formData.mainAddressDistrict,
    //       mainAddressPostal: this.formData.mainAddressPostal,
    //       mainAddressDetail: this.formData.mainAddressDetail,
    //       mainPhone: this.formData.mainPhone,
    //       secondaryAddressCity: this.formData.secondaryAddressCity,
    //       secondaryAddressDistrict: this.formData.secondaryAddressDistrict,
    //       secondaryAddressPostal: this.formData.secondaryAddressPostal,
    //       secondaryAddressDetail: this.formData.secondaryAddressDetail,
    //       secondaryPhone: this.formData.secondaryPhone,
    //       email: this.formData.email,
    //       education: this.formData.education,
    //       graduationYear: this.formData.graduationYear,
    //       schoolMajor: this.formData.schoolMajor,
    //       subscriptionStatus: this.formData.subscriptionStatus,
    //       magazineSubscription: !this.formData.magazineSubscription  ? true : false,
    //       infoSubscription: !this.formData.infoSubscription ? true : false,
    //       // verifyCode: this.formData.verifyCode
    //     }
    //     const apiName = this.pageAction === 'add' ? 'postMember' : 'putMember'
    //     const id = obj.frontUserId
    //     studentSrv[apiName](obj, id).then((res) => {
    //       // api 回傳成功
    //       if (res.isSuccess) {
    //         // rtnCode 為 0000 的情況
    //         if(res.data.rtnCode === '0000'){
    //           Swal.fire({
    //             toast: true,
    //             position: 'center',
    //             title: `${res.data.rtnMsg}`,
    //             confirmButtonColor: '#0E2A34',
    //             confirmButtonText: '確認',
    //             background: '#F0F0F2',
    //             width: 400
    //           }).then((result) => {
    //             if(result.isConfirmed){
    //               this.$router.push('/admin/Member');
    //             }
    //           });
    //         }else{
    //           // rtnCode 不為 0000 的情況
    //           Swal.fire({
    //             toast: true,
    //             position: 'center',
    //             title: `${res.data.rtnMsg}`,
    //             confirmButtonColor: '#0E2A34',
    //             confirmButtonText: '確認',
    //             background: '#F0F0F2',
    //             width: 400
    //           });
    //         }
    //       } else {
    //         // api 回傳失敗
    //         Swal.fire({
    //           toast: true,
    //           position: 'center',
    //           title: `${res.data.data.rtnMsg}`,
    //           confirmButtonColor: '#0E2A34',
    //           confirmButtonText: '確認',
    //           background: '#F0F0F2',
    //           width: 400
    //         });
    //       }
    //     }).catch((error) => {
    //       // 處理錯誤情況
    //       console.error('Error:', error);
    //     }).finally(() => {
    //       // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
    //       this.loading = false;
    //     });
    //   }catch(error){
    //     Swal.fire({
    //       toast: true,
    //       position: 'center',
    //       title: `${error}`,
    //       confirmButtonColor: '#0E2A34',
    //       confirmButtonText: '確認',
    //       background: '#F0F0F2',
    //       width: 400
    //     });
    //     this.loading = false
    //   }
    // },
    toPrev() {
      this.$router.push("/admin/Member");
      // this.$router.go(-1);
    },
  },
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
.al-center {
  align-content: center;
}
</style>
