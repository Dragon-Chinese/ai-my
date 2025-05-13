<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useStore } from '@/store/all' // 使用命名导入
  import { toast } from 'vue-sonner'
  const formRef = ref<FormInstance>()
  const usertext = ref('')
  const validateForm = reactive({
    BaseUrl: '',
    ARK_API_KEY: '',
    model: '',
  })
  const steps = ref('1')
  const store = useStore();
  const test = ref('')
  const formRef2 = ref<FormInstance>()
  const validateForm2 = reactive({
    DeepSeekValue: '',
  })

  const formRef3 = ref<FormInstance>()
  const validateForm3 = reactive({
    bulletChat: '',
  })

  const rules = reactive<FormRules<typeof ruleForm>>({
    BaseUrl: [{required: true, trigger: 'blur' }],
    ARK_API_KEY: [{required: true, trigger: 'blur' }],
    model: [{required: true, trigger: 'blur' }],
  })
  

  // 步骤切换
  const carouselRef = ref(null)
  const carouselIndex = ref(1)

  function nextCarousel() {
    if (carouselRef.value) {
      carouselRef.value.next()
      carouselIndex.value ++
    }
  }

  function prevCarousel() {
    if (carouselRef.value) {
      carouselRef.value.prev()
      carouselIndex.value --
    }
  }


  function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) { return }
    formEl.validate( async (valid) => {
      if (valid) {
        store.initData.api_key = validateForm.ARK_API_KEY
        await store.set_continuous_text_model(validateForm.ARK_API_KEY, validateForm.model, validateForm.BaseUrl).then(res => {
         localStorage.setItem('apiModel', JSON.stringify(validateForm))
          toast.success('提示', {
            description: "设置成功",
          })
          nextCarousel()
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

  function resetForm(formEl: FormInstance | undefined) {
    if (!formEl) { return }
    formEl.resetFields()
  }

  const getShop = async () => {
      usertext.value += "你是一个卖货的，这是我的黄车链接"
      store.initData.shop_list.forEach((val, index) => {
        usertext.value += index+1 + "号链接，商品名称：" + val.title
      })
      usertext.value += "有人如果问相关商品的问题，如果和产品相关的问题回复的时候记得带上几号链接这几个字，因为我要匹配商品，每次只回复一个链接，如果和产品没关系的就不要回复链接相关的文案,回复不超过30个字"
    }

  const  submitForm2  = async () => {
      if (usertext.value) {
        await store.set_continuous_text_user(usertext.value).then(res => {
          localStorage.setItem('apiUser', usertext.value)
          toast.success('提示', {
            description: "设置成功",
          })
          nextCarousel()
        }).catch(err => {
          toast.error('提示', {
            description: "设置失败",
          })
      })
        nextCarousel()
      }
      else {
        console.log('error submit!')
        toast.error('提示', {
            description: "请输入内容",
          })
      }

  }

  const stopUserAi = async () => {
    await store.stop_continuous_text_user().then(res => {
          toast.success('提示', {
            description: "已关闭",
          })
          // ncarouselRef.value.prev()
          if (carouselRef.value) {
            carouselRef.value.prev()
            carouselIndex.value --
          }
        }).catch(err => {
          toast.error('提示', {
            description: "关闭失败",
          })
      })
    }

    const testPost = async () => {
      if(!test.value) return
      console.log(test.value)
      await store.ds_test("测试用户", test.value).then(res => {
          toast.success('提示', {
            description: "已发送测试",
          })
        }).catch(err => {
          toast.error('提示', {
            description: "关闭失败",
          })
      })

      // await axios.post('http://localhost:3201/api/ds_test', {name: "测试", content: test.value}).then(res => {
      //   ElMessage.success("测试中");
      //   test.value = ""
      // }).catch(err => {
      //   ElMessage.error("配置失败");
      // });
    }

  onMounted(() => {
    validateForm.BaseUrl = store.initData.BaseUrl
    let data = localStorage.getItem('apiModel')
       let data1 = localStorage.getItem('apiUser')
       console.log(data)
       if(data1) {
        usertext.value = data1
       }
       if(data) {
         validateForm.ARK_API_KEY = JSON.parse(data).ARK_API_KEY
         validateForm.model = JSON.parse(data).model
       }

       if(store.initData.api_key) {
        carouselIndex.value = 2
        carouselRef.value.next()
          if(store.initData.UserAiOff) {
            carouselIndex.value = 3
            carouselRef.value.next()
          }
       }
  })
</script>

<template>
  <div class="main-content">
    <div style="height: 30px;"></div>
    <div class="steps-title">只需三步，开启AI智能弹幕互动</div>
    <div class="steps-box">
      <div class="steps-item">
        <img v-if="carouselIndex >= 2" class="stepIcon" src="@/assets/icons/step.svg" alt="">
        <div v-if="carouselIndex == 1" class="number" :class="{active: carouselIndex >= 1}">1</div>
        <div class="string" :class="{active: carouselIndex >= 1}">
          <div>第一步</div>
          <div class="position">输入配置</div>
        </div>
      </div>
      <div class="steps-item">
        <div class="line" :class="{active: carouselIndex >= 2}"></div>
        <img v-if="carouselIndex >= 3" class="stepIcon" src="@/assets/icons/step.svg" alt="">
        <div v-if="carouselIndex <= 2" class="number" :class="{active: carouselIndex >= 2}">2</div>
        <div class="string" :class="{active: carouselIndex >= 2}">
          <div>第二步</div>
          <div class="position">告诉TA让他做什么</div>
        </div>
      </div>
      <div class="steps-item">
        <div class="line" :class="{active: carouselIndex >= 3}"></div>
        <div class="number" :class="{active: carouselIndex >= 3}">3</div>
        <div class="string" :class="{active: carouselIndex >= 3}">
          <div>第三步</div>
          <div class="position">开启AI</div>
        </div>
      </div>
    </div>
    <el-carousel ref="carouselRef" height="auto" :autoplay="false" :loop="false" indicator-position="none" arrow="never">
      <el-carousel-item style="height: auto;overflow:hidden">
        <!-- 第一步 -->
        <div class="steps-content step1">
          <el-form
            ref="formRef"
            :model="validateForm"
            label-width="auto"
            class="demo-ruleForm"
            :rules="rules"
          >
            <el-form-item
              label="BaseUrl"
              prop="BaseUrl"
            >
              <el-input
                type="text"
                autocomplete="off"
                v-model="validateForm.BaseUrl"
              />
            </el-form-item>
            <div class="height12" />
            <el-form-item
              label="ARK_API_KEY"
              prop="ARK_API_KEY"
            >
              <el-input
                type="text"
                v-model="validateForm.ARK_API_KEY"
              />
            </el-form-item>
            <div class="height12" />
            <el-form-item
              label="model"
              prop="model"
            >
              <el-input
                type="text"
                autocomplete="off"
                v-model="validateForm.model"
              />
            </el-form-item>
            <div class="aLink">
              <a target="_blank" href="https://www.yuque.com/zhibaoai/cu4g1z/vybdt1x9wcspmbt4?singleDoc# ">如何获取？</a>
            </div>
            <el-form-item>
              <div class="button-block">
                <el-button color="#3E61FF" plain @click="resetForm(formRef)">重置</el-button>
                <el-button color="#3E61FF" @click="submitForm(formRef)">设置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-carousel-item>
      <el-carousel-item style="height: auto;overflow:hidden">
        <!-- 第二步 -->
        <div class="steps-content step2">
          <div class="deepseekTips">
            <div class="deepseek-icon">
              <div class="position">
                <img class="deepseek" src="@/assets/images/DeepSeek.svg" alt="">
                <img class="bg" src="@/assets/images/depbg.svg" alt="">
              </div>
            </div>
            <div class="item1">告诉<span>DeepSeek</span>你想让他扮演什么角色，越详细他回复的越好！</div>
            <div class="item2">
              <div class="itemTit">
                <span class="round"></span>
                <span>例如您是<span class="colors">带货主播</span>:</span>
              </div>
              <div class="itemCont">告诉他您的商品相关信息，每个产品挂在几号链接，总之就是把你知道的都告诉DeepSeek，他就能复制出来一个你，实现自定义顺序或随机触发关键词回复弹幕，介绍商品并促单成交。</div>
            </div>
            <div class="item2">
              <div class="itemTit">
                <span class="round"></span>
                <span>例如您是<span class="colors">游戏主播</span>:</span>
              </div>
              <div class="itemCont">告诉他游戏类型、名称、特色玩法以及其它的深入内容。生成一个智能主播 ，他将会随机或按顺序自动插入AI话术进行打乱，永不重复。进入欢迎，送礼感谢，关注点赞以及转化全自动互动。读取弹幕，无需关键词，精准回复用卢。</div>
            </div>
          </div>
          <el-form
            ref="formRef2"
            :model="validateForm2"
            label-width="auto"
            class="demo-ruleForm"
          >
            <el-form-item
              label="告诉我您希望AI扮演的角色"
              prop="BaseUrl"
            >
              <el-input
                type="textarea"
                autocomplete="off"
                v-model="usertext"
                placeholder="请输入内容"
                style="height: 281px;"
              />
            </el-form-item>
            <el-form-item>
              <div class="button-block">
                <div class="floatLeft">
                  <el-button @click="prevCarousel">上一步</el-button>
                </div>
                <div class="floatRight">
                  <el-button color="#3E61FF" @click="submitForm2()">开始/更新角色</el-button>
                  <!-- <el-button color="#3E61FF" plain @click="prevCarousel">关闭</el-button> -->
                  <el-button color="#3E61FF" @click="getShop">一键导入商品信息</el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-carousel-item>
      <el-carousel-item style="height: auto;overflow:hidden">
        <!-- 第三步 -->
        <div class="steps-content step3">
          <div class="steps-content-item">
            <div class="steps-content-item-tit">当前配置信息</div>
            <div class="steps-content-item-cont">
              <div class="item">
                <span>功能是否开启：</span>
                <span style="color: #00b155" class="colors">已开启</span>
              </div>
            </div>
            <div class="steps-content-item-tit2">角色描述：</div>
            <div class="roleDescription">{{store.initData.system}}</div>
          </div>
          <el-form
            ref="formRef3"
            :model="validateForm3"
            label-width="auto"
            class="demo-ruleForm"
          >
            <div class="steps-content-item">
              <div class="steps-content-item-tit">
                <span>测试</span>
                <el-button color="#3E61FF" @click="testPost">测试</el-button>
              </div>
              <div class="steps-content-item-cont">
                <el-input
                  type="input"
                  autocomplete="off"
                  v-model="test"
                  placeholder="请输入您要模拟的弹幕"
                />
              </div>
            </div>
            <div class="steps-content-item">
              <div class="steps-content-item-tit">弹幕问题记录</div>
              <el-table :data="store.initData.ds_list" border style="width: 100%;" height="301px">
                <el-table-column prop="val" label="用户问的问题" show-overflow-tooltip />
                <el-table-column prop="response" label="回复" show-overflow-tooltip />
                <el-table-column prop="timestamp" label="触发时间" show-overflow-tooltip />
              </el-table>
              <el-form-item>
                <div class="button-block">
                  <div class="floatLeft">
                    <!-- <el-button color="#3E61FF" plain @click="stopUserAi"></el-button> -->
                  </div>
                  <div class="floatRight">
                    <el-button color="#3E61FF" plain @click="stopUserAi()">关闭智能回复</el-button>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
  .main-content {
    flex: 1;
    overflow: auto;
    background: #fff;
    margin: 16px;
    box-sizing: border-box;
    padding: 20px;
    margin-bottom: 16px;
    background: #fff;
    border-radius: 8px;
    color: #303e52;
  }
  .steps-title {
    width: 100%;
    margin-bottom: 35px;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }

  .steps-box {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 70px;

    .steps-item {
      display: flex;
      align-items: center;

      .line {
        width: 200px;
        height: 1px;
        margin: 0 16px;
        background: #dae2ea;
      }

      .line.active {
        background: #3e61ff;
      }
      .stepIcon {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
      .number {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        line-height: 40px;
        color: #9da8b6;
        text-align: center;
        border: 1px solid #9da8b6;
        border-radius: 50%;
      }

      .number.active {
        color: #fff;
        background: #3e61ff;
        border-color: #3e61ff;
      }

      .string {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        color: #9da8b6;
        text-align: left;

        .position {
          position: absolute;
          margin-top: 5px;
          font-size: 14px;
          line-height: 14px;
        }
      }

      .string.active {
        color: #303e52;
      }
    }
  }

  .steps-content {
    max-width: 886px;
    min-height: 100px;
    margin: auto;
  }
  .steps-content.step1 {
    .aLink {
      text-align: right;
      a {
        font-size: 18px;
        color: #3e61ff;
        text-decoration: underline;
      }
    }
    .button-block {
      width: 100%;
      text-align: center;
      margin-top: 65px;
      .el-button {
        margin: 0 10px;
        padding: 0 20px;
      }
    }
  }
  .steps-content.step2 {
    padding-top: 5px;
    padding-right: 5px;
    .deepseekTips {
      background: #F0F3FA;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 20px;
      position: relative;
      overflow: visible !important;
      .deepseek-icon {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 79px;
        height: 63px;
        .position {
          position: relative;
          .deepseek {
            width: 100%;
            height: 100%;
          }
          .bg {
            width: 75px;
            height: 68px;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
      
      .item1 {
        font-weight: 400;
        font-size: 18px;
        margin-bottom: 10px;
        span {
          font-weight: 600;
        }
      }
      .item2 {
        margin-bottom: 18px;
        .itemTit {
          font-weight: 500;
          font-size: 18px;
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          .colors {
            color: #3E61FF;
          }
          .round {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #fff;
            border: 1px solid #3E61FF;
            margin-right: 5px;
          }
        }
        .itemCont {
          padding-left: 13px;
        }
      }
      .item2:last-child {
        margin-bottom: 0;
      }
    }
    .button-block {
      width: 100%;
      text-align: center;
      margin-top: 22px;
      display: flex;
      justify-content: flex-end;
      .floatLeft {
        .el-button {
          margin: 0 10px;
          padding: 0 20px;
        }
      }
      .floatRight {
        flex: 1;
        text-align: right;
        .el-button {
          margin: 0 10px;
          padding: 0 20px;
        }
      }
    }
  }

  .steps-content.step3 {
    .steps-content-item {
      margin-bottom: 30px;
      &-tit {
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        span {
          flex: 1;
        }
      }
      &-cont {
        display: flex;
        flex-wrap: wrap;
        .item {
          height: 40px;
          line-height: 40px;
          border-radius: 4px;
          border: 1px solid #DAE2EA;
          padding: 0 20px;
          font-weight: 400;
          font-size: 18px;
          .colors {
            color: #FF3E3E;
          }
        }
      }
      &-tit2 {
        font-weight: 400;
        font-size: 14px;
        margin: 10px 0;
      }
      .roleDescription {
        border-radius: 4px;
        border: 1px solid #DAE2EA;
        background: #F5F6F9;
        padding: 10px 20px;
        color: #9DA8B6;
      }
    }
  }

  .steps-content.step2, .steps-content.step3 {
    .button-block {
      width: 100%;
      text-align: center;
      margin-top: 22px;
      display: flex;
      justify-content: flex-end;
      .floatLeft {
        .el-button {
          padding: 0 20px;
        }
      }
      .floatRight {
        flex: 1;
        text-align: right;
        .el-button {
          margin-left: 20px;
          padding: 0 20px;
        }
      }
    }
  }

  .el-carousel__item {
    overflow: scroll;
  }
</style>
