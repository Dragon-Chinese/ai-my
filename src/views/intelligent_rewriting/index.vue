<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { useStore } from '@/store/all' // 使用命名导入
import { toast } from 'vue-sonner'
const violationText = ref('')
const replaceText = ref('')
const store = useStore();
const test = ref('') // 模拟弹幕
const use_zhipu = ref(true)
const formRef = ref<FormInstance>()
  const BannedList = ref([]);
  const BannedType = ref(false)
  const testTxt = ref('')
const numberValidateForm = reactive({
  zhipu_model: '',
  zhipu_api_key: '',
  zhipu_system: '',
})


 function submitForm (formEl: FormInstance | undefined) {
  formEl.validate(async (valid) => {
    if (valid) {
      await store.zhipu_ai_write(numberValidateForm.zhipu_api_key, numberValidateForm.zhipu_model, numberValidateForm.zhipu_system, use_zhipu.value).then(res => {
        toast.success('提示', {
          description: "设置成功",
        })
      }).catch(err => {
        toast.error('提示', {
          description: "设置失败",
        })
      })
    }
    else {
      console.log('error submit!')
    }
  })
}

const submitDyBannedType = async () => {
     await store.set_banned(BannedType.value).then(res => {
        toast.success('提示', {
          description: "切换成功",
        })
      }).catch(err => {
        toast.error('提示', {
          description: "切换失败",
        })
      })
  }

interface User {
  text: string
  text2: string
}

onMounted(() => {
      BannedList.value = store.initData.BannedList
      BannedType.value = store.initData.BannedType
      for (let item of btnChange) { item.isActive = false }
      if(BannedType.value) {
        btnChange[1].isActive = true
      } else {
        btnChange[0].isActive = true
      }
       
     numberValidateForm.zhipu_api_key = store.initData.zhipu_api_key
      numberValidateForm.zhipu_model = store.initData.zhipu_model
      numberValidateForm.zhipu_system = store.initData.zhipu_system
      use_zhipu.value = store.initData.use_zhipu
})

// function handleDelete(index: number, row: User) {
//   console.log(index, row)
// }

const btnChange = reactive([
  { text: '平替词替换', icon: '@/assets/icons/zhuanhuan', isActive: true},
  { text: '原话术替换', icon: '@/assets/icons/zhuanhuan', isActive: false},
])

function btnItemchange(index) {
  for (let item of btnChange) { item.isActive = false }
  btnChange[index].isActive = true
  switch(index) {
    case 0:
      BannedType.value = false
      break;

    case 1:
    BannedType.value = true
      break;
  }
  submitDyBannedType()
}

const submitDyBanned = async () => {
            // await axios.post('http://localhost:3201/api/dy_banned', {list: BannedList.value}).then(res => {
            //   ElMessage.success("配置成功");
            // }).catch(err => {
            //   ElMessage.error("配置失败");
            // });
            await store.dy_banned(BannedList.value).then(res => {
              console.log(res)
              toast.success('提示', {
                description: "操作成功",
              })
            }).catch(err => {
              toast.error('提示', {
                description: "操作失败",
              })
            })
      }

const testPost = async () => {
        BannedType.value = false

        await store.test_banned(test.value).then(res => {
          console.log(res)
          toast.success('提示', {
            description: "正在测试",
          })
          testTxt.value = res.data
        }).catch(err => {
          toast.error('提示', {
            description: "测试失败",
          })
        })
        // await axios.post('http://localhost:3201/api/test_banned', {msg: test.value}).then(res => {
        //     ElMessage.success("测试成功");
        //     testTxt.value = res.data.data
        //   }).catch(err => {
        //     ElMessage.error("测试失败");
        //   });
    }

  const deleteKeywordAudioPair = (index) => {
    BannedList.value.splice(index, 1);
    submitDyBanned()
  }

  const addKeywordAudioPair = () => {
      if (violationText.value) {
        BannedList.value.push({
          band: violationText.value,
          bandlst: replaceText.value,
        });
        violationText.value = "";
        replaceText.value = "";
        submitDyBanned()
      }
    };

</script>

<template>
  <div style="padding: 16px;">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-form
          ref="formRef"
          :model="numberValidateForm"
          label-width="auto"
          class="demo-ruleForm"
        >
          <div class="PageMain">
            <div class="grid-content">
              <el-form-item
                label="model"
                prop="zhipu_model"
                :rules="[
                  { required: true, message: 'model 是必填项' },
                ]"
              >
                <el-input
                  type="text"
                  v-model="numberValidateForm.zhipu_model"
                  autocomplete="off"
                />
              </el-form-item>
              <div class="height12" />
              <el-form-item
                label="APL_KEY"
                prop="zhipu_api_key"
                :rules="[
                  { required: true, message: 'API_KEY 是必填项' },
                ]"
              >
                <el-input
                  type="zhipu_api_key"
                  v-model="numberValidateForm.zhipu_api_key"
                  autocomplete="off"
                />
              </el-form-item>
              <div class="APL_KEY">
                <!-- <a target="_blank" href="https://www.yuque.com/zhibaoai/cu4g1z/two6i9iiqn7hum7l?singleDoc# ">我想用自己的API_KEY，如何获取？</a> -->
                <a class="APL_KEY_link" target="_blank" href="https://www.yuque.com/zhibaoai/cu4g1z/two6i9iiqn7hum7l?singleDoc# ">我想用自己的APL_KEY，如何获取？</a>
              </div>
            </div>

            <div class="grid-content">
              <div class="fixed">
                <el-form-item>
                  <el-button color="#3E61FF" @click="submitForm(formRef)">
                    设置
                  </el-button>
                </el-form-item>
              </div>
              <el-form-item
                style="margin-bottom: 0;"
                label="告诉AI重写话术你希望怎么做"
                prop="zhipu_system"
                :rules="[
                  { required: true, message: 'text is required' },
                ]"
              >
                <el-input
                  type="textarea"
                  v-model="numberValidateForm.zhipu_system"
                  style="height: 583px;"
                  placeholder="你是一个句子重写作家，请按以下要求改写输入句子:替换部分字词，保持原句核心意思不变，且字数与原句致。仅进行部分字词替换，不添加额外说明、问候或结束语。改写结果须适用于语音合成，仅采用中文，不含任何英文内容。确保改写文本中不出现涉及资金、虚拟形急、无人操作,无人直播，以及优患等描述，也避免使用极限性描述词。我提供的句子:"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <div class="PageMain">
          <div class="grid-content" style="height: 998px;">
            <div class="btnChange">
              <div class="btnTooTip">
                <el-button class="item"
                  v-for="(item, index) in btnChange"
                  :key="index"
                  :class="{ active: item.isActive }" @click="btnItemchange(index)">
                  <img v-if="item.isActive" src="@/assets/icons/zhuanhuan_true.svg" alt="">
                  <img v-else="item.isActive" src="@/assets/icons/zhuanhuan_false.svg" alt="">
                  {{ item.text }}
                  <div v-show="item.isActive" class="triangle-up" />
                </el-button>

              </div>
              <div class="tooTip">
                <span style=' font-size: 16px;color: #303e52;'>请输入您的测试文案：</span><span style=' font-size: 16px;color: #3e61ff;'>文案 → 重写 → 检测违禁词 → 最终文案，测试文案只可测试平替违禁词</span>
              </div>
            </div>
            <div class="input-block">
              <el-input
                v-model="test"
                type="text"
                placeholder="请输入您要模拟的弹幕"
              />
            </div>
            <div class="buttonBox flex">
              <el-button color="#3E61FF" @click="testPost">
                测试
              </el-button>
            </div>
            <div class="prohibitedWords">
              <div class="prohibitedWords-title">
                <div class="el-form-item__label">
                  测试返回的文案： <span style="color: red">{{testTxt}}</span>
                </div>
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="addKeywordAudioPair">
                    添加违禁词
                  </el-button>
                </div>
              </div>
              <div class="input-block">
                <div class="input-box">
                  <el-input
                    v-model="violationText"
                    style="max-width: 600px;"
                    type="text"
                    placeholder="输入违禁词"
                  />
                </div>
                <div class="input-box">
                  <el-input
                    v-model="replaceText"
                    style="max-width: 600px;"
                    type="text"
                    placeholder="平替违禁词"
                  />
                </div>
              </div>
              <el-table :data="BannedList" border style="width: 100%;" max-height="500px">
                <el-table-column prop="band" label="违禁词" align="center" show-overflow-tooltip />
                <el-table-column prop="bandlst" label="平替违禁词" align="center" show-overflow-tooltip />
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <a href="javascript:;" style="display: inline-block; width: 16px; height: 19px;" @click="deleteKeywordAudioPair(scope.$index)">
                      <img style="width: 16px; height: 19px;" src="@/assets/icons/remove.svg" alt="">
                    </a>
                    <!-- <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >
                      Delete
                    </el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
  .APL_KEY {
    width: 100%;
    text-align: right;

    &_link {
      font-size: 18px;
      color: #3e61ff;
      text-decoration: underline;
    }
  }

  .el-form-item__label-wrap {
    margin-left: 0 !important;
  }

  .grid-content {
    position: relative;

    .fixed {
      position: absolute;
      right: 20px;
    }
  }

  .btnChange {
    width: 100%;
    margin-bottom: 20px;

    .btnTooTip {
      .btnBox {
        // display: flex;
        // gap: 20px;
        position: relative;
      }
    }

    .tooTip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      // height: 54px;
      padding: 17px;
      margin-top: 11px;
      background: #ecefff;
      border-radius: 4px;
    }

    .item {
      position: relative;
      width: 195px;
      height: 64px;
      margin-bottom: 20px;
      font-size: 20px;
      color: #303e52;
      background: #fff;
      border-color: #dae2ea;

      img {
        width: 22px;
        height: 22px;
        margin-right: 16px;
      }
    }

    .item.active {
      color: #3e61ff;

      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }

    .triangle-up {
      position: absolute;
      right: 0;
      bottom: -32px;
      left: 0;
      width: 0;
      height: 0;
      margin: 0 auto; /* 这会使得元素在水平方向上居中 */
      border-right: 10px solid transparent; /* 透明右边框 */
      border-bottom: 10px solid #ecefff; /* 黑色下边框 */
      border-left: 10px solid transparent; /* 透明左边框 */
    }
  }

  .prohibitedWords {
    padding-top: 50px;

    &-title {
      display: flex;
      align-content: center;

      .el-form-item__label {
        flex: 1;
        justify-content: flex-start;
      }
    }

    .input-block {
      display: flex;
      gap: 12px;

      .input-box {
        flex: 1;
      }
    }
  }
</style>
