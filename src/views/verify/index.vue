<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import useSettingsStore from '@/store/modules/settings'
  import router from '@/router'
  import { useStore } from '@/store/all' // 使用命名导入


  const baseWidth = 1920;
  const baseHeight = 1080;
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5));
  const loading = ref(false)
  const appRef = ref(null);
  const drawTiming = ref(null);
  const secretKey = ref('')
  const store = useStore();
  const resize = function () {
    clearTimeout(drawTiming.value);
    drawTiming.value = setTimeout(() => {
      calcRate();
    }, 200);
  };

  const calcRate = function () {
    if (!appRef.value) return;
    const widthScale = window.innerWidth / 1920; // 基准宽度为1920px
    const offsetX = ((window.innerHeight / widthScale) - window.innerHeight) / 2;
    appRef.value.style.height = `${window.innerHeight / widthScale}px`;
    appRef.value.style.transform = `scale(${widthScale})`;
    appRef.value.style.transformOrigin = 'right center'; // 设置变换的原点为左上角
    appRef.value.style.position = 'absolute';
    appRef.value.style.right = `0px`;
    appRef.value.style.top = `${-offsetX}px`;
    appRef.value.style.width = `1920px`;
  };

  onMounted(() => {
    const key = localStorage.getItem('keyy')
    if(key) {
      secretKey.value = key
    }
    window.addEventListener('resize', resize);
    resize(); // 初始调用
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
  });

  const version = ref("0.0.1");

  const emits = defineEmits<{
    onLogin: [account?: string]
  }>()
  const onSubmit = () => {
    console.log(store)
    loading.value = true
    localStorage.setItem('keyy', secretKey.value)
    store.login(secretKey.value, version.value ).then((res) => {
     
      // emits('onLogin', secretKey.value)
      master_configuration()
      // if (secretKey.value.remember) {
      //   localStorage.setItem('login_account', secretKey.value.account)
      // }
      // else {
      //   localStorage.removeItem('login_account')
      // }
    }).finally(() => {
      loading.value = false
    })
  }
  const master_configuration = () => {
    // router.push('/sovits_configuration/index')
    router.push('/master_configuration/index')
  }
  
</script>

<template>
  <div class="verify appRef" ref="appRef">
    <div class="logo">
      <img src="@/assets/images/verify/logo.png" alt="">
    </div>
    <!-- <div class="verify-content"> -->
      <div class="content-left">
        <img class="text" src="@/assets/images/verify/text.png" alt="">
        <!-- <div class="text1">国内首款集成Deepseek</div>
        <div class="text2">人工智能助播工具</div> -->
      </div>
      <div class="content-right">
        <div class="pentagon">
          <div class="item welcome">
            <img src="@/assets/images/verify/welcome.png" alt="">
          </div>

          <el-form
            ref="formRef"
            label-width="auto"
            class="demo-ruleForm"
          >
            <div class="item formItem">
              <el-input
                type="text"
                autocomplete="off"
                placeholder="请输入密钥"
                v-model="secretKey"
              />
            </div>
            <div class="item formItem">
              <!-- <LoginForm
                v-if="formType === 'login'"
                :account
                @on-login="router.push(redirect)"
                @on-register="(val) => { formType = 'register'; account = val }"
                @on-reset-password="(val) => { formType = 'resetPassword'; account = val }"
              /> -->
              <!-- <el-button color="#3E61FF" @click="onSubmit">验证</el-button> -->
              <el-button style="width: 100%; height: 60px; font-size: 20px;" color="#3E61FF" @click="onSubmit()">验证</el-button>
            </div>
          </el-form>
          <div class="item">
            <!-- <a class="link" href="">加入代理</a> -->
          </div>
          <div class="contactUs"></div>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
  .appRef {
    position: absolute;
    right: 50%;
    top: 50%;
    // width: 1920px;
    // height: 1080px;
    transform-origin: top right; // 与 JavaScript 中的设置保持一致
    background: url(@/assets/images/verify/verifyBg.png);
  }

  .verify {
    width: 100%;
    height: 100vh;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0 85px;
    display: flex;
    align-items: center;
    // padding-left: 119px;
    // padding-right: 85px;
  }
  .logo {
    width: 211px;
    height: 106px;
    position: absolute;
    top: 13px;
    left: 19px;
    img {
      width: 100%;
      height: auto;
    }
  }
  .verify-content {
    // width: 100%;
    // height: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // gap: 152px;
    // padding-left: 138px;
    // padding-right: 85px;
    
  }
  .content-left {
      margin-right: 170px;
      color: #001989;
      .text1 {
        font-family: Alimama ShuHeiTi, Alimama ShuHeiTi;
        font-weight: bold;
        font-size: 80px;
      }
      .text2 {
        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 54px;
      }
    }
    .content-right {
      width: 694px;
      height: 838px;
      box-sizing: border-box;
      // height: 748px;
      background: url(@/assets/images/verify/verify_l_bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      // padding: 64px;
      // background: #fff;
      box-shadow: 0px -6px 25.9px 0px #3E61FF1A;
      position: relative;
      .pentagon {
        overflow: hidden;
        position: absolute;
        left: 63px;
        bottom: 51px;
        .item.welcome {
          margin-bottom: 40px;
          img {
            width: 224px;
            height: 44px;
          }
        }
        .item.formItem {
          width: 490px;
          height: 60px;
          margin-bottom: 20px;
          .el-input {
            width: 100%;
            height: 60px;
            font-size: 20px;
          }
          .el-button {
            width: 100%;
            height: 60px;
            font-size: 20px;
          }
        }
        .item .link {
          font-size: 20px;
          text-decoration: underline;
          color: #3E61FF;
        }
      }
      .contactUs {
        font-size: 16px;
        color: #303E52;
        margin-top: 105px;
      }
    }


  // @media (max-width: 1023px) {
  @media (max-width: 1023px) {
    // .verify-content {
    //   width: 100%;
    //   height: 100%;
    //   display: block;
    //   padding-left: 0;
    //   padding-right: 0;
    //   margin-top: 126px;
    // }
    // .content-left {
    //   // display: none;
    //   // padding: 0 50px;
    //   // margin-bottom: 30px;
    //   margin: auto;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }
    // .content-right {
    //   // display: none;
    //   // padding: 0 50px;
    //   // margin-bottom: 30px;
    //   margin: auto;
    // }
  }
</style>