<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useStore } from '@/store/all' // 使用命名导入
import { toast } from 'vue-sonner'

const textarea = ref('')
const use_frame = ref(false)
const use_zhipu = ref(false)
const stop_speech_loop = ref(false)
const readType = ref("2")
const textVal1 = ref('感谢 {user_name} 的点赞')
const textVal2 = ref('感谢 {user_name} 的关注')
const textVal3 = ref('欢迎 {user_name} 老哥进入直播间')
const textVal4 = ref('感谢 {user_name} 的礼物')
const store = useStore();
import xunhuan from '@/assets/icons/suiji.svg'
import xunhuan_active from '@/assets/icons/xunhuan.svg'
import suiji from '@/assets/icons/suiji.svg'
import suiji_active from '@/assets/icons/xunhuan.svg'
import router from '@/router'
const tabList = reactive([
  { text: '按顺序循环朗读', icon: xunhuan, activeIcon: xunhuan_active, isActive: true },
  { text: '随机挑选句子', icon: suiji, activeIcon: suiji_active, isActive: false }
])

const broadcastTabChange = (index) => {
  for (let item of tabList) { item.isActive = false }
  tabList[index].isActive = true
  if (index) {
    readType.value = "1"
  } else {
    readType.value = "2"
  }
}

// 监听 readType 的变化
watch(use_frame, async (newVal, oldVal) => {
  submitFormFrame(newVal)
})

watch(use_zhipu, async (newVal, oldVal) => {
  submitForm(newVal)
})

watch(readType, async (newVal, oldVal) => {
  console.log('readType changed:', newVal)
  await store.set_continuous_text_type(newVal).then(res => {
    toast.success('提示', {
      description: "切换成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "切换失败",
    })
  })
  // await axios.post('http://localhost:3201/api/set_continuous_text_type', { type: readType.value }).then(res => {
  //   ElMessage.success("更改成功");
  // }).catch(err => {
  //   ElMessage.error(err.response.data.message);
  // });
})

const getSovits = async () => {
  stop_speech_loop.value = true
  // 先按照换行符拆分文本，每一行都视为一个独立的段落
  const lines = textarea.value.split('\n').filter(line => line.trim() !== '');
  let sentences = [];

  // 对每个段落再按照句号、感叹号、问号拆分成完整的句子
  lines.forEach(line => {
    const parts = line.match(/[^。！？]+[。！？]+|[^。！？]+$/g);
    if (parts) {
      sentences.push(...parts);
    } else {
      sentences.push(line);
    }
  });

  // 过滤掉空字符串和少于两个字的句子
  sentences = sentences.filter(sentence => {
    const trimmed = sentence.trim();
    return trimmed !== '' && trimmed.length >= 2;
  });

  // 新增逻辑：如果切分后的句子字符数少于50个字，则向后追加下一个句子
  let combinedSentences = [];
  let tempSentence = "";
  for (let i = 0; i < sentences.length; i++) {
    // 将当前句子追加到临时句子中
    tempSentence += sentences[i];
    // 如果累计后的字符数达到或超过50字，则保存，并重置tempSentence
    if (tempSentence.length >= 50) {
      combinedSentences.push(tempSentence);
      tempSentence = "";
    }
  }
  // 如果最后还有未满50字的剩余句子，也加入数组
  if (tempSentence) {
    combinedSentences.push(tempSentence);
  }

  // 保存原始输入内容到 localStorage
  localStorage.setItem('AudioManager', textarea.value);
  console.log(combinedSentences)
  await store.sovitsData(combinedSentences).then(res => {
    toast.success('提示', {
      description: "正在开始",
    })
  }).catch(err => {
    stop_speech_loop.value = false
  })

  // await axios.post('http://localhost:3201/api/sovitsData', { result: combinedSentences })
  //   .then(res => {
  //     ElMessage.success("已开启");
  //   })
  //   .catch(err => {
  //     ElMessage.error(err.response.data.message);
  //     store.initData.stop_speech_loop = false;
  //   });
}

const submitFormFrame = async (newVal) => {
  console.log('submit!')
  store.initData.frame = newVal
  await store.frame(newVal).then(res => {
    toast.success('提示', {
      description: "操作成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "操作失败",
    })
  })
}

const submitForm = async (newVal) => {
  // 添加防御性判断

  await store.zhipu_ai_write(store.initData.zhipu_api_key, store.initData.zhipu_model, store.initData.zhipu_system, newVal).then(res => {
    toast.success('提示', {
      description: "设置成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "设置失败",
    })
  })

}


const stop_axios = async () => {
  stop_speech_loop.value = false
  await store.stop_continuous_text_to_speech().then(res => {
    toast.success('提示', {
      description: "已关闭",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "关闭失败",
    })
  })
}

const addClick = () => {
  textarea.value += "\n\n现在是{now_time}，活动还有5分钟就结束了，大家快来抢购。"
}

onMounted(() => {
  use_frame.value = store.initData.frame
  use_zhipu.value = store.initData.use_zhipu
  stop_speech_loop.value = store.initData.stop_speech_loop
  const savedData = localStorage.getItem('AudioManager');
  if (savedData) {
    textarea.value = savedData;
  }

  const savedData1 = localStorage.getItem('UserLikes');
      if (savedData1) {
        textVal1.value = savedData1;
      }
      const savedData2 = localStorage.getItem('UserLoves');
      if (savedData2) {
        textVal2.value = savedData2;
      }

      const savedData3 = localStorage.getItem('UserWelcomes');
      if (savedData3) {
        textVal3.value = savedData3;
      }

      const savedData4 = localStorage.getItem('UserGifts');
      if (savedData4) {
        textVal4.value = savedData4;
      }
})

const getSovits1 = async () => {
      // 使用正则表达式通过换行符和句号来分段
      let segments = textVal1.value.split(/[\n]+/);
      store.initData.UserLikesOff = true
      // 输出结果，移除空白段
      let result = segments.filter(segment => segment.trim() !== '');

      // 保存输入内容到 localStorage
      localStorage.setItem('UserLikes', textVal1.value);

      await store.UserLikesData(result).then(res => {
        toast.success('提示', {
          description: "已开启点赞感谢",
        })
      }).catch(err => {
        store.initData.UserLikesOff = false
      })

      
    }

    const getSovits2 = async () => {
      // 使用正则表达式通过换行符和句号来分段
      let segments = textVal2.value.split(/[\n]+/);
      store.initData.UserLovesOff = true
      // 输出结果，移除空白段
      let result = segments.filter(segment => segment.trim() !== '');

      // 保存输入内容到 localStorage
      localStorage.setItem('UserLoves', textVal2.value);

      await store.UserLovesData(result).then(res => {
        toast.success('提示', {
          description: "已开关注赞感谢",
        })
      }).catch(err => {
        store.initData.UserLovesOff = false
      })

      console.log(result)     
    }

    const getSovits3 = async () => {
      // 使用正则表达式通过换行符和句号来分段
      let segments = textVal3.value.split(/[\n]+/);
      store.initData.UserWelcomesOff = true
      // 输出结果，移除空白段
      let result = segments.filter(segment => segment.trim() !== '');

      // 保存输入内容到 localStorage
      localStorage.setItem('UserWelcomes', textVal3.value);

      await store.UserWelcomesData(result).then(res => {
        toast.success('提示', {
          description: "已开欢迎赞感谢",
        })
      }).catch(err => {
        console.log(err)
        store.initData.UserWelcomesOff = false
      })

      console.log(result)

      
    }


    const getSovits4 = async () => {
      // 使用正则表达式通过换行符和句号来分段
      let segments = textVal4.value.split(/[\n]+/);
      store.initData.UserGiftsOff = true
      // 输出结果，移除空白段
      let result = segments.filter(segment => segment.trim() !== '');
      localStorage.setItem('UserGifts', textVal4.value);

      await store.UserGiftsData(result).then(res => {
        toast.success('提示', {
          description: "已开礼物感谢",
        })
      }).catch(err => {
        console.log(err)
        store.initData.UserGiftsOff = false
      })

      console.log(result)

      // 保存输入内容到 localStorage
      
    }

    const stopSovits = async (id: any) => {
      await store.stop_speech(id).then(res => {
        store.initData[id] = false
        toast.success('提示', {
          description: "已关闭",
        })
      }).catch(err => {
        toast.error('提示', {
          description: "关闭失败",
        })
      })
      }

      const configMain = () => {
        router.push('/intelligent_rewriting/index')
      }

</script>

<template>
  <div style="padding: 16px;">
    <div class="PageMain">
      <div class="grid-content">
        <div class="grid-content-title">主话术设置</div>
        <div class="grid-content-set">
          <!-- 主话术实时重写 -->
          <div class="grid-content-set-item">
            <div class="switch-block">
              <div class="switch-block-item">
                <span class="span">主话术实时重写</span>
                <el-switch v-model="use_zhipu" />
              </div>
              <a class="link" href="javascript:;" @click="configMain">配置</a>
            </div>
            <div class="subtitle">是否开启AI文案实时重写功能，每次开播建议重新开关注主话术</div>
          </div>
          <!-- 音频抽帧去重 -->
          <div class="grid-content-set-item">
            <div class="switch-block">
              <div class="switch-block-item">
                <span class="span">音频抽帧去重</span>
                <el-switch v-model="use_frame" />
              </div>
            </div>
            <div class="subtitle">不开重写可打开这个进行去重</div>
          </div>
          <!-- 添加时间播报 -->
          <div class="grid-content-set-item">
            <div class="switch-block">
              <div class="switch-block-item">
                <span class="span">添加时间播报</span>
              </div>
              <a class="link" href="javascript:;" @click="addClick">添加至主话术</a>
            </div>
            <div class="subtitle">例如：现在是14：55分，还有5分钟活动就结束了</div>
          </div>
        </div>
        <div class="grid-content-broadcast">
          <div class="grid-content-broadcast-top">
            <div class="grid-content-broadcast-tab">
              <div class="item" v-for="(item, index) in tabList" :key="index" :class="{ active: item.isActive }"
                @click="broadcastTabChange(index)">
                <img v-if="item.isActive" class="icon" :src="item.activeIcon" alt="">
                <img v-else class="icon" :src="item.icon" alt="">
                <span>{{ item.text }}</span>
              </div>
            </div>
            <div class="grid-content-broadcast-btns">
              <el-button color="#3E61FF"  @click="getSovits">{{!stop_speech_loop ? '开始朗读' : '更新话术'}}</el-button>
              <el-button @click="stop_axios">停止</el-button>
            </div>
          </div>
          <div class="grid-content-broadcast-bottom">
            <el-input type="textarea" autocomplete="off" v-model="textarea" placeholder="请输入内容"
              style="height: 281px;" />
          </div>
        </div>
      </div>
      <div class="script-setting">
        <el-row :gutter="16">
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="script-setting-content">
              <div class="script-setting-content-title">点赞感谢话术设置</div>
              <div class="script-setting-content-text">
                <el-input type="textarea" style="height: 350px;"  placeholder="一个折行算一句" v-model="textVal1" />
              </div>
              <div class="grid-content-broadcast-btns">
                <el-button color="#3E61FF" :disabled="store.initData.UserLikesOff" @click="getSovits1">开始点赞感谢</el-button>
                <el-button @click="stopSovits('UserLikesOff')">停止</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="script-setting-content">
              <div class="script-setting-content-title">欢迎话术设置</div>
              <div class="script-setting-content-text">
                <el-input type="textarea" style="height: 350px;"  placeholder="一个折行算一句" v-model="textVal3" />
              </div>
              <div class="grid-content-broadcast-btns">
                <el-button color="#3E61FF"  :disabled="store.initData.UserWelcomesOff" @click="getSovits3">开始欢迎</el-button>
                <el-button @click="stopSovits('UserWelcomesOff')">停止</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="script-setting-content">
              <div class="script-setting-content-title">关注感谢话术设置</div>
              <div class="script-setting-content-text">
                <el-input type="textarea" style="height: 350px;" placeholder="一个折行算一句" v-model="textVal2" />
              </div>
              <div class="grid-content-broadcast-btns">
                <el-button color="#3E61FF" :disabled="store.initData.UserLovesOff" @click="getSovits2">开始关注感谢</el-button>
                <el-button @click="stopSovits('UserLovesOff')" >停止</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="script-setting-content">
              <div class="script-setting-content-title">礼物感谢话术设置</div>
              <div class="script-setting-content-text">
                <el-input type="textarea" style="height: 350px;"  placeholder="一个折行算一句" v-model="textVal4" />
              </div>
              <div class="grid-content-broadcast-btns">
                <el-button color="#3E61FF" :disabled="store.initData.UserGiftsOff" @click="getSovits4">开始礼物感谢</el-button>
                <el-button @click="stopSovits('UserGiftsOff')" >停止</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.grid-content-broadcast-bottom {
  height: auto !important;
  overflow-y: hidden !important;
}

.grid-content {
  &-title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 15px;
  }

  &-set {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;

    &-item {
      border: 1px solid #3E61FF;
      border-radius: 8px;
      padding: 16px;
      padding-top: 10px;
      box-sizing: border-box;

      .switch-block {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .switch-block-item {
          flex: 1;
          text-align: left;
          margin-right: 20px;

          .span {
            margin-right: 20px;
            font-size: 18px;
            font-weight: 500;
            color: #303e52;
          }
        }
      }

      .subtitle {
        font-size: 14px;
        margin-top: 7px;
        color: #666666;
      }
    }
  }

  &-broadcast {
    border: 1px solid #DAE2EA;
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;

    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid #F5F6F9;
    }

    &-tab {
      display: flex;
      align-items: center;
      gap: 10px;

      .item {
        border: 1px solid #DAE2EA;
        border-radius: 4px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        font-size: 16px;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          width: 18px;
          height: 18px;
        }
      }

      .item.active {
        color: #3E61FF;
        border-color: #3E61FF;
      }
    }

    &-btns {
      .el-button {
        padding: 0 20px;
      }
    }

    &-bottom {
      margin-top: 20px;
      height: 168px;
      box-sizing: border-box;
      overflow-y: scroll;

      &-item {
        font-size: 18px;
        line-height: 28px;
        color: #303E52;
      }
    }
  }
}

.script-setting-content {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  color: #303E52;

  &-title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
  }

  &-text {
    margin-bottom: 20px;

    .el-textarea__inner {
      padding: 20px !important;
    }
  }

  .grid-content-broadcast-btns {
    margin-bottom: 30px;
  }
}
</style>
