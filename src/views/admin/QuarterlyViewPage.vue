<template>
  <!-- 季刊=會勘=quarterly -->
   
  <v-form v-model="valid">
    <h2 class="pa-4">
      <span  @click="toPrev()" class="cursor-pointer">
        <v-icon>mdi-chevron-left</v-icon>
        {{ pageTitle }}
          <!-- 返回 -->
      </span>
    </h2>
    
    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="3">
                <div class="bold">類別</div>
                <v-select
                v-model="publicationType"
                placeholder="選擇新增類別"
                density="compact"
                :items="['會刊', '學刊']"
                variant="outlined"
                readonly
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <div class="bold">標題</div>
              <v-text-field
              v-model="formData.title"
              :rules="rules"
              placeholder="請輸入標題"
              clearable
              density="compact"
              variant="outlined"
              ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold">西元</div>
                <v-text-field
                v-model="formData.year"
                :rules="rules"
                placeholder="請輸入西元年"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold">季</div>
                <v-select
                v-model="formData.season"
                placeholder="請選則季度"
                density="compact"
                :items="['1', '2', '3', '4']"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold">發行日期</div>
                <datepicker 
                v-model="formData.releaseAt" 
                :clearable="true" 
                :enableTimePicker="false" 
                placeholder="請選擇日期" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="mb-10">
            <div class="bold">目錄</div>
            <quill-editor v-model="formData.catalog" ref="myQuillEditor" :options="editorOptions" @text-change="handleTextChange"></quill-editor>
          </v-col>
          
          <v-col cols="12" class="mt-10">
            <div class="bold">上傳會刊封面圖片</div>
            <div class="d-flex align-center">
              <v-btn
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              class="upload-btn"
              @click="triggerImageFileUpload"
              >
                點此上傳圖片
              </v-btn>

              <v-file-input
              class="d-none"
              ref="fileInput"
              accept="image/png, image/jpeg"
              hide-input
              show-size
              @change="onImageFileChange"
              ></v-file-input>

              <!-- 顯示圖片檔名及刪除按鈕 -->
              <div v-if="imageFileName" class="file-preview ml-4">
                <p class="mb-0 break-all">{{ imageFileName }}</p>
                <v-icon @click="removeImageFile('cover')" color="primary">mdi-close-circle</v-icon>
              </div>
            </div>
          </v-col>

          <v-col cols="12">
            <div class="bold">上傳會刊電子書檔案</div>
            <div class="d-flex align-center">
              <v-btn
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              class="upload-btn"
              @click="triggerEbookFileUpload"
              >
                點此上傳檔案
              </v-btn>

              <v-file-input
              class="d-none"
              ref="fileInputEbook"
              hide-input
              show-size
              @change="onEbookFileChange"
              ></v-file-input>

              <!-- 顯示圖片檔名及刪除按鈕 -->
              <div v-if="ebookFileName" class="file-preview ml-4">
                <p class="mb-0 break-all">{{ ebookFileName }}</p>
                <v-icon @click="removeImageFile('ebook')" color="primary">mdi-close-circle</v-icon>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" class="text-end">
            <v-btn class="mr-2" @click="toPrev()" variant="outlined">取消</v-btn>
            <v-btn v-if="action === 'add'" @click="postCheck()" color="primary" variant="flat" :disabled="!valid">發布</v-btn>
            <v-btn v-else-if="action === 'edit'" @click="editCheck()" color="primary" variant="flat" :disabled="!valid">儲存</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>

  <LoadingComponent :loading="loading" />
</template>

<script>
// import cities from '@/json/TwCities.json'
import { ref, computed, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import publicationSrv from '@/service/associations.js'
import Swal from '@/utils/sweetAlert';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { storeToRefs } from 'pinia';
import { useQuarterStore } from '@/stores/quarterStore'
import { file } from 'jszip';
import Quill from 'quill';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      action: '',
      reduce: {
        type: Function,
        default: (option) => option
      },
      publicationType: '會刊',
      tab: 1,
      search: '',
      rules: [
        value => !!value || '此欄位為避填欄位',
        // value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      menu: false,
      locale: '',
      to: '',
      from: '',
      picked: '',
      pickedJoinDate: '',
      valid: false,
      imageFileName: '', // 儲存圖片檔名
      ebookFileName: '', // 儲存電子書檔名
      loading: false,
      formData: {
        title: '',
        year: '',
        season: null,
        releaseAt: '',
        catalog: '',
        imgOriginalName: '',
        imgRealName: '',
        ebookOriginalName: '',
        ebookRealName: '',
      },
      editor: null,
      coverImage: null,
      ebook: null,
      pageTitle: '',
      transformedHTML: '',
      editorOptions: {
        modules: {
          toolbar: [
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表和無序列表
          ],
          clipboard: {
            matchers: [
              [
                Node.TEXT_NODE,
                function (node, delta) {
                  // 將每個空白字符轉換成 &nbsp;
                  delta.ops = delta.ops.map((op) => {
                    if (typeof op.insert === 'string') {
                      op.insert = op.insert.replace(/ /g, '\u00a0');
                    }
                    return op;
                  });
                  return delta;
                }
              ]
            ]
          }
        },
        theme: 'snow',
        placeholder: '請輸入會刊目錄'
      },
    }
  },
  mounted() {
    this.setPageTitle()
  },
  watch: {
    picked(newVal) {
      if (newVal) {
        this.birthdate = this.formatDate(newVal)
      }
    }
  },
  
  methods: {
    setPageTitle(){
      const action = this.$route.query.action;
      this.action = action;
      let actionTitle = ''
      if(action === 'add'){
        actionTitle = '建立新發行'
      }else if(action === 'edit'){
        actionTitle = '會刊編輯'
        const store = useQuarterStore()
        const { editData } = storeToRefs(store);
        
        this.formData = editData
        this.$refs.myQuillEditor.pasteHTML(this.formData.catalog);
        this.ebookFileName = decodeURIComponent(this.formData.ebook[0].originalFileName)
        this.imageFileName = decodeURIComponent(this.formData.image[0].originalFileName)
      }
      this.pageTitle = actionTitle
      this.$router.replace('/admin/quarterlyView')
    },
    triggerImageFileUpload() {
      this.$refs.fileInput.click()
    },
    triggerEbookFileUpload() {
      this.$refs.fileInputEbook.click()
    },
    onImageFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const fileName = encodeURIComponent(file.name);
        this.coverImage = file;
        this.uploadFile(1, fileName);
      }
    },
    onEbookFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        const fileName = encodeURIComponent(file.name);
        this.ebook = file;
        this.uploadFile(2, fileName);
      }
    },
    removeImageFile(fileType) {
      if(fileType === 'cover') {
        this.imageFileName = ''
        this.$refs.fileInput.reset()
      } else if(fileType === 'ebook') {
        this.ebookFileName = ''
        this.$refs.fileInputEbook.reset()
      }
    },
    transformDate(date) {
      if (date) {
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        // 將月份和日期補0
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day

        return `${year}-${month}-${day}`
      }
      return ''
    },
    formatDate(dateStr) {
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
   
    addBulletPoint() {
      const lines = this.formData.catalog.split('\n');
      const lastLine = lines[lines.length - 1];
      
      if (lastLine.startsWith('●')) {
        this.formData.catalog += '\n● ';
      } else {
        // 這裡你可以改成數字編號或其他條列樣式
        this.formData.catalog += '\n● ';
      }
    },
    handleTextChange() {
      const quillEditor = this.$refs.myQuillEditor;
      const text = quillEditor.getText();
      const html = quillEditor.getHTML();

      // 檢查是否有空白字符
      if (text.includes(' ')) {
        const newHtml = html.replace(/ /g, '&nbsp;');
        this.transformedHTML = newHtml;
      }
      this.formData.catalog = html;
    },
    uploadFile(type, fileName){
      this.loading = true

      try {
        const formData = new FormData
        if(type === 1){
          formData.append('file', this.coverImage, fileName)
        }else if(type === 2){
          formData.append('file', this.ebook, fileName)
        }
        publicationSrv.uploadFile(formData, type).then((res) => {
          this.loading = false
          
          if(res.isSuccess){
            if(type === 1){
              this.imageFileName = decodeURIComponent(res.data.originName)
              this.formData.imgOriginalName = res.data.originName
              this.formData.imgRealName = res.data.realName
            }else if(type === 2){
              this.ebookFileName = decodeURIComponent(res.data.originName)
              this.formData.ebookOriginalName = res.data.originName
              this.formData.ebookRealName = res.data.realName
            }
          }else{
            console.log(res)
          }
        })
      } catch(error){
        this.loading = false
      }
    },
    postCheck(){
      Swal.fire({
        toast: true,
        position: 'center',
        title: `確定建立新會刊?`,
        text: '請確認輸入的資料是否正確。',
        confirmButtonText: '確認',

        showCancelButton : true,
        cancelButtonText: '取消'

      }).then((result) => {
        if(result.isConfirmed){
          this.postAssociation()
        }
      });
    },
    async postAssociation(){
      this.loading = true
      try{
        const obj = {
          title: this.formData.title,
          year: parseInt(this.formData.year),
          season: parseInt(this.formData.season),
          releaseAt: this.transformDate(this.formData.releaseAt),
          catalog: this.formData.catalog,
          imgOriginalName: this.formData.imgOriginalName,
          imgRealName: this.formData.imgRealName,
          ebookOriginalName: this.formData.ebookOriginalName,
          ebookRealName: this.formData.ebookRealName,
        }
        let content = this.transformedHTML;
        if (content === '') {
          const quillInstance = this.$refs.myQuillEditor;
          content = quillInstance.getHTML();
        }

        if (content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        }

        publicationSrv.postAssociation(obj).then((res) => {
          
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonText: '確認',

                // showCancelButton : true,
                // cancelButtonText: '取消'

              }).then((result) => {
                if(result.isConfirmed){
                  this.$router.push('/admin/publication')
                }
              });
            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                toast: true,
                position: 'center',
                title: '操作錯誤',
                text: `${res.data.rtnMsg}`,
                confirmButtonText: '確認',
              })
            }
          } else {
            // api 回傳失敗
            const msg = res.data.data.rtnMsg
            Swal.fire({
              toast: true,
              position: 'center',
              title: '操作錯誤',
              text: `${msg}`,
              confirmButtonText: '確認',
            })
          }
        }).catch((error) => {
          // 處理錯誤情況
          console.error('Error:', error);
        }).finally(() => {
          // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
          this.loading = false;
        });
      }catch(error){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonText: '確認',
        })
      } finally {
        this.loading = false;
      }
    },
    editCheck(){
      Swal.fire({
        toast: true,
        position: 'center',
        title: `確定修改會刊資料?`,
        text: '請確認輸入的資料是否正確。',
        confirmButtonText: '確認',

        showCancelButton : true,
        cancelButtonText: '取消'

      }).then((result) => {
        if(result.isConfirmed){
          this.putAssociation()
        }
      });
    },
    async putAssociation(){
      this.loading = true
      const store = useQuarterStore()
      const { editData } = storeToRefs(store);
      const associationId = editData.value.associationId;
      try{
        const obj = {
          associationId, 
          title: this.formData.title,
          year: parseInt(this.formData.year),
          season: parseInt(this.formData.season),
          releaseAt: this.formData.releaseAt,
          catalog: this.formData.catalog,
          imgOriginalName: this.formData.imgOriginalName,
          imgRealName: this.formData.imgRealName,
          ebookOriginalName: this.formData.ebookOriginalName,
          ebookRealName: this.formData.ebookRealName,
        }
        let content = this.transformedHTML;
        if (content === '') {
          const quillInstance = this.$refs.myQuillEditor;
          content = quillInstance.getHTML();
        }

        if (content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        }

        publicationSrv.putAssociation(obj).then((res) => {
          
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonText: '確認',

                // showCancelButton : true,
                // cancelButtonText: '取消'

              }).then((result) => {
                if(result.isConfirmed){
                  this.$router.push('/admin/publication')
                }
              });
            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                toast: true,
                position: 'center',
                title: '操作錯誤',
                text: `${res.data.rtnMsg}`,
                confirmButtonText: '確認',
              })
            }
          } else {
            // api 回傳失敗
            const msg = res.data.data.rtnMsg
            Swal.fire({
              toast: true,
              position: 'center',
              title: '操作錯誤',
              text: `${msg}`,
              confirmButtonText: '確認',
            })
          }
        }).catch((error) => {
          // 處理錯誤情況
          console.error('Error:', error);
        }).finally(() => {
          // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
          this.loading = false;
        });
      }catch(error){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonText: '確認',
        })
      } finally {
        this.loading = false;
      }
    },
    toPrev(){
      this.$router.push('/admin/publication');
    }
  }
}
</script>

<style scoped>
.gap {
  display: grid;
  gap: 12px;
}
.sm-width {
  width: 200px;
}
.text-red {
  color: crimson;
  font-weight: 900;
  margin-right: 4px;
}
.bold {
  font-size: 16px;
  font-weight: 700;
}

.row {
  display: flex;
  flex-direction: row;
}
.row-check {
  display: flex;
  flex-direction: row;
  /* align-content: center; */
  align-items: center;
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

.gap-content {
  display: grid;
  gap: 12px;
}

.custom-textarea {
  min-height: 100px;
  resize: vertical;
}
.custom-textarea-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.upload-btn {
  background-color: #fff;
  color: #1b2482;
  font-weight: 400;
  margin-top: 4px;
}
.file-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.file-preview v-icon {
  cursor: pointer;
  margin-left: 10px;
}
.break-all{
  word-break: break-all
}
</style>
