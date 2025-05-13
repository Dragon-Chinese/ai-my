<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useTimerStore } from '@/store/timerStore' // 使用命名导入
import { toast } from 'vue-sonner'
import { useStore } from '@/store/all' // 使用命名导入
const store = useTimerStore(); // 使用 Pinia Store
const timenum = ref<number>(store.timenum); // 初始时间间隔
const timeT = ref<string>(''); // 当前时间
const txt = ref("");
const txtDisabled = ref(false); // 用于控制按钮的文本
const store1 = useStore();
// 更新当前时间
const updateTime = () => {
  timeT.value = store.formatCurrentTime();
};

// 启动定时器
const startTimer = () => {
  store.startTimer(); // 调用 Pinia Store 中的 startTimer
};

// 停止定时器
const stopTimer = () => {
  store.stopTimer(); // 调用 Pinia Store 中的 stopTimer
};

// 监听报时开关变化
watch(() => store.isReporting, (newVal) => {
  if (newVal) {
    store.addCustomizeAudio(); // 立即生成一次报时
    startTimer(); // 启动定时器
  } else {
    stopTimer(); // 关闭定时器
    // ElMessage.info("报时已关闭");
    toast.info('提示', {
            description: "报时已关闭",
          })
  }
});

// 每分钟更新一次当前时间
onMounted(() => {
  updateTime();
  setInterval(updateTime, 60 * 1000); // 每分钟更新一次时间
});

const changeTime = () => {
  store.timenum = timenum.value; // 更新间隔时间
  console.log(`时间间隔更新为：${store.timenum} 分钟`);
  if (store.isReporting) {
    store.stopTimer(); // 停止旧的定时器
    startTimer(); // 重新启动定时器以应用新的时间间隔
  }
}

const addCustomizeAudio = async () => {
    if(!txt.value) return
      txtDisabled.value = true
      await store1.CustomizeAudio(txt.value).then(res => {
          toast.success('提示', {
            description: "正在生成中...",
          })
          txtDisabled.value = false
          txt.value = ""
        }).catch(err => {
          txtDisabled.value = false
          toast.error('提示', {
            description: "失败",
          })
        })
      // await axios.post('http://localhost:3201/api/CustomizeAudio', { txt: txt.value })
      //   .then(res => {
      //     console.log(res);
      //     txt.value = ""
      //     txtDisabled.value = false
      //     ElMessage.success(res.data.message);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     txtDisabled.value = false
      //     ElMessage.error(err.response.data.message);
      //   });
    };

</script>

<template>
  <div style="padding: 16px;" class="gutter-setting">
    <el-row :gutter="16">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="gutter-setting-content" style="min-height: 90vh;">
          <div class="gutter-setting-content-title">报时</div>
          <div class="gutter-setting-content-set chime">
            <el-form ref="formRef2" :model="validateForm2" label-width="auto" class="demo-ruleForm">
              <div class="gutter-setting-content-subtitle">每隔几分钟报时</div>
              <div class="chime-minute">
                <el-input type="number'" autocomplete="off" v-model="timenum" placeholder="请输入" @change="changeTime" />
                <span>分钟</span>
              </div>
              <div class="gutter-setting-content-subtitle">报时内容</div>
              <div class="chime-content">
                <el-input type="number'" autocomplete="off" v-model="store.prefixText" placeholder="请输入前置内容（可不填）" />
                <span>{{ timeT }}</span>
                <el-input type="number'" autocomplete="off" v-model="store.suffixText" placeholder="请输入后置内容（可不填）" />
              </div>
              <div class="button-block" style="margin-bottom: 30px;">
                <el-button color="#3E61FF" @click="store.isReporting = !store.isReporting;">{{ store.isReporting ? "关闭报时"
                  : "开启报时"}}</el-button>
              </div>
            </el-form>
            <div class="gutter-setting-content-subtitle">报时记录</div>
            <div class="table-block" style="margin-top: 0;">
              <el-table :data="store.announcementLog" border style="width: 100%;" max-height="550px">
                <!-- <el-table-column prop="log" label="报时内容" show-overflow-tooltip /> -->
                <!-- <el-table-column prop="chimeTime" label="报时时间" show-overflow-tooltip /> -->
                <el-table-column>
                  <template #default="scope">

                    {{ scope.row }}

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="gutter-setting-content" style="min-height: 90vh;">
          <div class="gutter-setting-content-title">插话</div>
          <div class="input-block">
            <el-input
              type="textarea"
              autocomplete="off"
              v-model="txt"
              placeholder="请输入内容"
              rows="24"
            />
          </div>
          <div class="button-block" style="margin-bottom: 4px">
            <el-button color="#3E61FF" @click="addCustomizeAudio()">{{txtDisabled.value ? "生成中...." : "生成"}}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.gutter-setting-content {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  color: #303E52;

  &-title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 20px;
  }

  &-subtitle {
    font-weight: 500;
    font-size: 16px;
    color: #303E52;
    margin-bottom: 20px;
  }

  &-set {
    .table-block {
      margin-top: 30px;
      margin-bottom: 20px;
    }

    .grid-content-broadcast-btns {
      .el-button {
        padding: 0 20px;
      }
    }
  }
}

.gutter-setting-content-set.chime {
  .chime-minute {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .el-input {
      width: 201px;
      height: 40px;
    }

    span {
      font-size: 16px;
      margin-left: 10px;
    }
  }

  .chime-content {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .el-input {
      flex: 1;
      height: 40px;
    }

    span {
      padding: 0 20px;
      font-size: 18px;
    }
  }
}
</style>
