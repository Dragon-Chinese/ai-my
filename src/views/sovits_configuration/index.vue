<script lang="ts" setup>
import { CirclePlus } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue' // 添加了 onMounted
import { useStore } from '@/store/all' // 使用命名导入
import { toast } from 'vue-sonner'
const tagsList = reactive([
  { title: '密钥名称', value: '自用11' },
  { title: '到期时间', value: '108天 6小时 44分钟 38秒', class: 'color3' },
  { title: '音频文件3-10秒', value: '未上传', class: 'color1' },
  { title: '主线音频', value: '未开启', class: 'color1' },
  { title: '抖音直播间', value: '未连接/直播已结束', class: 'color1' },
  { title: '视频号直播间', value: '未连接/直播已结束', class: 'color1' },
  { title: '点赞感谢', value: '未开启', class: 'color1' },
  { title: '欢迎语', value: '未开启', class: 'color1' },
  { title: '礼物感谢', value: '未开启', class: 'color1' },
  { title: '智能回复', value: '未开启', class: 'color1' },
  { title: 'sovit训练模型', value: '未上传', class: 'color1' },
  { title: 'GPT训练模型', value: '未上传', class: 'color1' },
])
let musicUrl = ref('')
let musicUrlV3 = ref('')

const store = useStore();
let prompt_text = ref('') // 音频参考文字
let SpeedSpeech = ref(16) // 生成语速
let noiseStep = ref(8) // 降噪步数
let chatType = ref(1) // 回复弹幕或欢迎语触发方式
let linkRoom = ref('') // 链接直播间
const inputVisible = ref(false);
const interrupt = ref(true)
const remainingTime = ref('');
const audioUrl = ref("")
const tags = ref([])
const inputValue = ref('');
const all_space = ref(0.1)
const all_space_last = ref(0.1)
const likes_space = ref(0.1)
const welcomes_space = ref(0.1)
const loves_space = ref(0.1)
const gifts_space = ref(0.1)
const keys_ai = ref(0.1)
const list_v3 = ref([])
const gpt_weights = ref('')
const sovits = ref('')

const startCountdown = (targetTime) => {
  const targetDate = new Date(targetTime);
  const intervalId = setInterval(() => {
    const now = new Date();
    const timeDiff = targetDate - now;
    if (timeDiff <= 0) {
      clearInterval(intervalId);
      remainingTime.value = "已过期";
      admin.value = false;
    } else {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      remainingTime.value = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    }
  }, 1000);
  return intervalId;
};

const set_all_model = async () => {
  await store.set_all_model("V3")
};


function utcToBeijing(utc: string): string {
  const timestamp = Date.parse(utc)           // 解析 UTC 字符串为毫秒
  const bjTimestamp = timestamp + 8 * 3600e3  // 加 8 小时
  const d = new Date(bjTimestamp)

  const pad2 = (n: number) => n.toString().padStart(2, '0')

  const Y = d.getUTCFullYear()
  const M = pad2(d.getUTCMonth() + 1)
  const D = pad2(d.getUTCDate())
  const h = pad2(d.getUTCHours())
  const m = pad2(d.getUTCMinutes())
  const s = pad2(d.getUTCSeconds())

  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

const getConfig = () => {
  store.getConfig().then(res => {
    console.log(tagsList[0].value)

    tagsList[0].value = store.name
    tagsList[1].value = utcToBeijing(store.time)
    tagsList[2].value = store.initData.config_data.ref_audio_path ? "已上传" : "未上传"
    tagsList[2].class = store.initData.config_data.ref_audio_path ? "color2" : "color1"

    tagsList[3].value = store.initData.stop_speech_loop ? "已开启" : "未开启"
    tagsList[3].class = store.initData.stop_speech_loop ? "color2" : "color1"

    tagsList[4].value = store.initData.liveId ? "已连接" : "未连接"
    tagsList[4].class = store.initData.liveId ? "color2" : "color1"

    tagsList[5].value = !store.initData.qrStatus ? "已连接" : "未连接"
    tagsList[5].class = !store.initData.qrStatus ? "color2" : "color1"

    tagsList[6].value = store.initData.UserLikesOff ? "已开启" : "未开启"
    tagsList[6].class = store.initData.UserLikesOff ? "color2" : "color1"

    tagsList[7].value = store.initData.UserWelcomesOff ? "已开启" : "未开启"
    tagsList[7].class = store.initData.UserWelcomesOff ? "color2" : "color1"

    tagsList[8].value = store.initData.UserGiftsOff ? "已开启" : "未开启"
    tagsList[8].class = store.initData.UserGiftsOff ? "color2" : "color1"

    tagsList[9].value = store.initData.UserAiOff ? "已开启" : "未开启"
    tagsList[9].class = store.initData.UserAiOff ? "color2" : "color1"

    tagsList[10].value = store.initData.sovits_weights ? "已上传" : "未上传"
    tagsList[10].class = store.initData.sovits_weights ? "color2" : "color1"

    tagsList[11].value = store.initData.gpt_weights ? "已上传" : "未上传"
    tagsList[11].class = store.initData.gpt_weights ? "color2" : "color1"

    console.log(tagsList)
    musicUrlV3.value = store.initData.ref_audio_path || '';
    prompt_text.value = store.initData.prompt_text || "";

    SpeedSpeech.value = store.initData.speed_factor
    noiseStep.value = store.initData.nfe_step
    interrupt.value = store.initData.interrupt_zindex1
    tags.value = store.initData.no_name


    all_space.value = store.initData.all_space
    all_space_last.value = store.initData.all_space_last
    likes_space.value = store.initData.likes_space
    welcomes_space.value = store.initData.welcomes_space
    loves_space.value = store.initData.loves_space
    gifts_space.value = store.initData.gifts_space
    keys_ai.value = store.initData.keys_ai

    gpt_weights.value = store.initData.gpt_weights
    sovits.value = store.initData.sovits_weights
    
  })
}



onMounted(() => {
  getConfig()
  set_all_model()
  get_list_v3()
  linkRoom.value = localStorage.getItem('liveID')
  if (store.startCountTime) {
    startCountdown(store.startCountTime)
  }
})


const musicUrlChange = (e) => {
  // 去除扩展名
  const variable = e.filename.substring(0, e.filename.lastIndexOf("."));
  prompt_text.value = variable
  audioUrl.value = `http://localhost:3201/api/audioV3/${e.filename}`
  console.log(audioUrl.value)
}

const handleClose = async (tag: string) => {
  console.log(tag)
  const index = tags.value.indexOf(tag);
  if (index > -1) {
    tags.value.splice(index, 1);
  }
  await store.setNoRead(tags.value).then(res => {
    toast.success('提示', {
      description: "删除成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "操作失败",
    })
  })
};

const showInput = () => {
  inputVisible.value = true
}

const handleInputConfirm = async () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
  await store.setNoRead(tags.value).then(res => {
    toast.success('提示', {
      description: "添加成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "操作失败",
    })
  })

}

// 提取直播间ID的方法
const extractLiveID = async (url: string) => {
  // 直接从完整链接中提取直播间ID
  const match = url.match(/\/(\d+)$/);
  return match ? match[1] : null;
};

const connect = async (val: boolean) => {
  const liveID = await extractLiveID(linkRoom.value);
  if (!liveID) {
    toast.error('提示', {
      description: "无法提取直播间ID，请检查链接格式",
    })
    return;
  }
  store.initData.liveId = liveID
  localStorage.setItem('liveID', linkRoom.value)
  await store.start_fetching(liveID).then(res => {
    toast.success('提示', {
      description: "连接成功",
    })
    getConfig()
  }).catch(err => {
    toast.error('提示', {
      description: "连接失败",
    })
  })
};

const connectStop = async (val: boolean) => {
  store.initData.liveId = ""
  await store.stop_fetching().then(res => {
    toast.success('提示', {
      description: "断开成功",
    })
    getConfig()
  }).catch(err => {
    toast.error('提示', {
      description: "断开失败",
    })
  })
};

const setConfig = async () => {

  await store.setConfig(musicUrl.value, prompt_text.value).then(res => {
    console.log(res);
    toast.success('提示', {
      description: "设置成功",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "设置失败",
    })
  });
};

const setProIndex = async () => {
  var result = {
    speed_factor: SpeedSpeech.value,
    // text_split_method: text_split_method.value,
    welcomes_space: welcomes_space.value * 1,
    loves_space: loves_space.value * 1,
    likes_space: likes_space.value * 1,
    gifts_space: gifts_space.value * 1,
    keys_ai: keys_ai.value * 1,
    all_space: all_space.value * 1,
    nfe_step: noiseStep.value,
    all_space_last: all_space_last.value * 1
  }
  await store.setProIndex(result).then(res => {
    console.log(res);
    toast.success('提示', {
      description: "设置成功",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "设置失败",
    })
  });
}

// 监听 readType 的变化
watch(interrupt, async (newVal, oldVal) => {
  submitinterrupt()
})

const submitinterrupt = async () => {
  await store.set_interrupt(interrupt.value).then(res => {
    console.log(res);
    toast.success('提示', {
      description: "设置成功",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "设置失败",
    })
  });
}

const wx = async () => {
  store.initData.qrStatus = 10
  await store.wx_login().then(res => {
    console.log(res);
    toast.success('提示', {
      description: "获取成功，请及时扫码",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "获取失败",
    })
  });
}

const get_list_v3 = async () => {


  await store.v3_tts().then(res => {
    list_v3.value = res;
    console.log(res);
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "获取失败",
    })
  });
}

const v3_tts_files = async (val) => {

  await store.v3_tts_files(val).then(res => {
    console.log(res);
    processFiles(res)
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "获取失败",
    })
  });
}

const processFiles = (file) => {
  if (!file) return
  file.forEach(file => {
    const { absolute_path, filename } = file;
    // 将文件名统一转为小写，方便判断
    const lowerFilename = filename.toLowerCase();

    if (lowerFilename.endsWith('.ckpt')) {
      // ckpt 文件
      gpt_weights.value = absolute_path;
    } else if (lowerFilename.endsWith('.pth')) {
      // pth 文件
      sovits.value = absolute_path;
    } else {
      // 剩余的文件，比如 .wav 或其它格式
      musicUrl.value = absolute_path;

      // 去掉文件扩展名，获取文件名主体
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      prompt_text.value = nameWithoutExt;
      musicUrlChange({ filename });
    }
  });
}

const setSoVITS = async () => {
  await store.set_sovits_weights(sovits.value).then(res => {
    console.log(res);
    toast.success('提示', {
      description: "设置sovits模型成功",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "设置sivits失败",
    })
  });
};

const setGPT = async () => {
  await store.set_gpt_weights(gpt_weights.value).then(res => {
    console.log(res);
    toast.success('提示', {
      description: "设置gpt模型成功",
    })
  }).catch(err => {
    console.log(err);
    toast.error('提示', {
      description: "获取gpt失败",
    })
  });
};

const setAll = () => {
  setGPT();
  setSoVITS();
  setConfig();
}

</script>

<template>
  <div style="padding: 0 16px;">
    <div class="tags">
      <div v-for="(item, index) in tagsList" v-show="index > 1" :key="index" class="tags-item">
        <span>{{ item.title }}: </span>
        <span :class="item.class">{{ item.value }}</span>
      </div>
    </div>
    <div class="PageMain">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="grid-content min-height436">
            <!-- 选择音频 -->
            <div class="grid-content-item marginBottom40">
              <div class="grid-content-item-title flex">
                <div class="descriptions">选择音频文件3-10秒之间</div>
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="get_list_v3()" plain>刷新音频</el-button>
                  <!-- 直接在模板里用 $refs 出发播放 -->
                  <el-button color="#3E61FF" @click="$refs.audio.load(); $refs.audio.play()">
                    <img class="btn-icon" src="@/assets/icons/Vector.svg" alt="" />
                    试听
                  </el-button>
                </div>
              </div>

              <!-- 给 audio 一个 ref -->
              <audio ref="audio" style="height: 20px;" controls :src="audioUrl" v-show="audioUrl"></audio>

              <el-select v-model="musicUrlV3" filterable placeholder="请选择音频文件" @change="v3_tts_files"
                class="custom-select">
                <el-option v-for="item in list_v3" :key="item.absolute_path" :label="item.filename"
                  :value="item.absolute_path" />
              </el-select>
            </div>
            <!-- 音频参考文字 -->
            <div class="grid-content-item">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  音频参考文字
                </div>
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="setAll">
                    设置
                  </el-button>
                </div>
              </div>
              <el-input v-model="prompt_text" autosize type="textarea" show-word-limit style="height: 211px;"
                maxlength="80" placeholder="请输入音频参考文字" />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="grid-content min-height436">
            <!-- 生成语速 -->
            <div class="grid-content-item marginBottom16 border">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  生成语速
                </div>
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="setProIndex">
                    设置
                  </el-button>
                </div>
              </div>
              <div class="slider-block">
                <el-slider v-model="SpeedSpeech" :min="0.1" :max="1.65" :step="0.01" />
              </div>
            </div>
            <!-- 降噪步数 -->
            <!-- <div class="grid-content-item marginBottom16 border">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  降噪步数
                </div>
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="setProIndex">
                    设置
                  </el-button>
                </div>
              </div>
              <div class="slider-block">
                <el-slider v-model="noiseStep" :min="10" :max="40" :step="2" />
              </div>
            </div> -->
            <!-- 回复弹幕或欢迎语触发方式 -->
            <div class="grid-content-item border">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  回复弹幕或欢迎语触发方式
                </div>
              </div>
              <div class="radio-block">
                <div>
                  <el-radio v-model="interrupt" :value="true">
                    立即打断当前音频
                  </el-radio>
                </div>
                <div>
                  <el-radio v-model="interrupt" :value="false">
                    等待当前音频说完
                  </el-radio>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="grid-content min-height436">
            <div class="descriptions">
              添加场控，添加抖音昵称
            </div>
            <div class="tips-color-red">
              弹幕不会和以下这些人互动
            </div>
            <ElTag style="margin: 0 5px" v-for="item in tags" :key="item" @close="handleClose(item)" closable
              type="danger">
              {{ item }}
            </ElTag>
            <!-- {tags.value.map(tag => {
                        return <ElTag style="margin: 0 5px" onClose={() => handleClose(tag)} key={tag} closable type="danger">
                            {tag}
                        </ElTag>
                    })} -->
            <ElInput ref="InputRef" v-model="inputValue" class="w-20" placeholder="请输入抖音昵称" size="small"
              @KeyupEnter="handleInputConfirm" @Blur="handleInputConfirm" v-if="inputVisible" />
            <el-button v-else color="#3E61FF" type="primary" @click="showInput" :icon="CirclePlus" plain>
              添加抖音昵称
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="PageMain">
      <el-row :gutter="16">
        <!-- 链接直播间 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  链接直播间
                </div>
                <div class="radio-block">
                  <el-radio v-model="chatType" :value="1">
                    抖音
                  </el-radio>
                  <el-radio v-model="chatType" :value="2">
                    视频号
                  </el-radio>
                </div>
              </div>
              <div class="tips-color-blue">
                点赞，欢迎礼物感谢，DeepSeek，需链接到直播间确保开播后再去链接
              </div>
              <div v-if="chatType == 1">
                <el-input v-model="linkRoom" style="height: 50px; margin-bottom: 10px;"
                  placeholder="请输入抖音直播间链接，格式：https://live.douyin.com/288735743xxx" clearable />
                <div class="buttonBox flex">
                  <el-button color="#3E61FF" @click="connect" :disabled="store.initData.liveId == '' ? false : true">
                    连接
                  </el-button>
                  <el-button color="#3E61FF" @click="connectStop" :disabled="store.initData.liveId == '' ? true : false"
                    plain>
                    断开
                  </el-button>
                </div>
              </div>
              <div v-else>

                <div class="buttonBox flex">

                  <!-- qrStatus 为 0 或 undefined 时显示“已连接” -->
                  <p v-if="!store.initData.qrStatus">已连接</p>

                  <!-- qrStatus 等于 10 时显示“请稍后，获取中...” -->
                  <p v-if="store.initData.qrStatus === 10">请稍后，获取中...</p>

                  <!-- qrStatus 为 2 或 3 时显示二维码图片 -->
                  <img v-if="store.initData.qrStatus === 2 || store.initData.qrStatus === 3"
                    :src="`data:image/png;base64,${store.initData.qrcode}`" alt="二维码" />

                  <!-- qrStatus 等于 1 时显示获取二维码按钮 -->
                  <el-button v-if="store.initData.qrStatus === 1" type="primary" size="small" @click="wx">
                    获取二维码
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 每句话的间隔 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  每句话的间隔<span>（取中间值随机）</span>
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="all_space" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
                <span class="separate">~</span>
                <el-input v-model="all_space_last" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 点赞感谢多久触发一次 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  点赞感谢多久触发一次
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="likes_space" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 欢迎多久触发一次 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  欢迎多久触发一次
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="welcomes_space" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 关注感谢多久触发一次 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  关注感谢多久触发一次
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="loves_space" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 礼物感谢多久触发一次 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  礼物感谢多久触发一次
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="gifts_space" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <!-- Deep Seek多久触发一次 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="grid-content min-height234">
            <div class="grid-content-item marginBottom16">
              <div class="grid-content-item-title flex">
                <div class="descriptions">
                  Deep Seek多久触发一次
                </div>
              </div>
              <div class="input-block">
                <el-input v-model="keys_ai" style="max-width: 600px;" type="number" placeholder="请输入">
                  <template #append>
                    秒
                  </template>
                </el-input>
              </div>
              <div class="buttonBox flex">
                <el-button color="#3E61FF" @click="setProIndex">
                  应用
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss">
audio {
  margin-top: -10px;
  margin-bottom: 5px;
}

.marginBottom40 {
  margin-bottom: 30px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  font-size: 14px;

  &-item {
    padding: 5px 6px;
    background: #fff;
    border-radius: 4px;

    .color1 {
      color: #ff3e3e;
    }

    .color2 {
      color: #00b155;
    }

    .color3 {
      color: #3e61ff;
    }
  }
}

.grid-content {
  &-item {
    &-title {
      place-items: center center;
      margin-bottom: 15px;

      .descriptions {
        flex: 1;
      }

      .buttons {
        font-size: 14px;
      }
    }
  }

  .tips-color-red {
    margin-bottom: 15px;
    font-size: 18px;
    color: #ff3e3e;
  }

  .tips-color-blue {
    margin-bottom: 10px;
    font-size: 16px;
    color: #3e61ff;
  }
}
</style>
