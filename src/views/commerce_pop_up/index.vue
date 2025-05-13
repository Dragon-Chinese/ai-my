<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useStore } from '@/store/all' // 使用命名导入

const store = useStore();
const value1 = ref(false)
const value2 = ref(true)
const use_zhipu = ref(true)
const automaticExplain = ref(1)
const loading = ref(false)
const tableData = ref([])
const loadingTxt = ref('')
const live = ref(false)
const use_zhipu_shop = ref(false)
const live_see = ref(false)
const openBaiYing = async () => {
  loading.value = true
  loadingTxt.value = "正在打开百应后台..."
  await store.bai_ying("https://buyin.jinritemai.com/dashboard/live/control?").then(res => {
    toast.success('提示', {
      description: "已打开",
    })
    loading.value = false
    setTimeout(() => {
      getDom()
    }, 2000)
  }).catch(err => {
    loading.value = false
    toast.error('提示', {
      description: "打开失败",
    })
  })

}

watch(live_see, async (newVal, oldVal) => {
        submitwin(newVal)
    })

    const submitwin = async (val) => {

      await store.win(val).then(res => {
        toast.success('提示', {
          description: "设置成功",
        })
      }).catch(err => {
        toast.error('提示', {
          description: "设置失败",
        })
      })
        // await axios.post('http://localhost:3201/api/win', {isWin: val}).then(res => {
        //     ElMessage.success("配置成功");
        //   }).catch(err => {
        //     ElMessage.error("配置失败");
        //   });
    }

const write = async (val, index) => {
        loading.value = true
        loadingTxt.value = "正在智能写话术中..."
        await but_shop(val, index)
        loading.value = false
    }

      // 监听 readType 的变化
      watch(use_zhipu_shop, async (newVal, oldVal) => {
        submitEvent(newVal)
    })

const submitEvent = async (newVal) => {
  // 添加防御性判断

  await store.zhipu_ai_write_shop(store.initData.zhipu_api_key, store.initData.zhipu_model, store.initData.zhipu_system, newVal).then(res => {
    toast.success('提示', {
      description: "设置成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: "设置失败",
    })
  })

}

const getDom = async () => {
  loading.value = true
  loadingTxt.value = "正在获取商品信息&商品信息智能话术书写中..."
  try {
    const res = await store.get_dom()
    toast.success('提示', {
      description: res.data.message,
    })
    console.log('dadada', res)
    tableData.value = res.data;
    // 开始智能写话术，显示新的 loading 提示
    loadingTxt.value = "商品信息智能话术书写中..."
    // 收集所有 but_shop 异步任务
    const tasks = tableData.value.map((val, index) => {
      if (!val.Ai_txt) {
        return but_shop(val, index);
      } else {
        return Promise.resolve();
      }
    });
    // 等待所有 but_shop 任务完成
    await Promise.all(tasks);
  } catch (err) {
    console.log(err)
    toast.error('提示', {
      description: "重写话术出错",
    })
  } finally {
    // 所有任务完成后关闭 loading
    loading.value = false
  }
};

const but_shop = async (val, index) => {
  try {
    // const res = await axios.post('http://localhost:3201/api/shop_txt', { txt: val.side_panel_data || val.title });
    const res = await store.shop_txt(val.side_panel_data || val.title)
    // 将智能话术赋值给对应数据
    tableData.value[index].Ai_txt = res.data;
    sliceShop(index);
  } catch (err) {
    toast.error('提示', {
      description: err.response.data.message,
    })
  }
};

const sliceShop = async (index) => {
  // 按换行符拆分文本，过滤掉空行
  const lines = tableData.value[index].Ai_txt.split('\n').filter(line => line.trim() !== '');
  let sentences = [];

  // 对每个段落按照句号、感叹号、问号拆分成完整的句子
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

  // 新增逻辑：如果某个句子字符数不足50个字，则向后追加后面的句子
  let combinedSentences = [];
  let tempSentence = "";
  for (let i = 0; i < sentences.length; i++) {
    // 追加当前句子到临时变量中
    tempSentence += sentences[i];
    // 如果累计后的句子字符数达到或超过50字，则存入combinedSentences，并重置tempSentence
    if (tempSentence.length >= 50) {
      combinedSentences.push(tempSentence);
      tempSentence = "";
    }
  }
  // 如果最后还有不足50字的内容，也放入数组中
  if (tempSentence) {
    combinedSentences.push(tempSentence);
  }

  tableData.value[index].Ai_list = combinedSentences;
  saveShop();
}

const cancelShop = async () => {

  await store.shop_save([]).then(res => {
    tableData.value = []
    toast.success('提示', {
      description: "更改成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: err.response.data.message,
    })
  })
}

const saveShop = async () => {
  await store.shop_save(tableData.value).then(res => {
    toast.success('提示', {
      description: "操作成功",
    })
  }).catch(err => {
    toast.error('提示', {
      description: err.response.data.message,
    })
  })

}

const start_live = async () => {
        live.value = true

        await store.start_live().then(res => {
          live.value = false
          toast.success('提示', {
            description: "开启播报",
          })
        }).catch(err => {
          live.value = false
          toast.error('提示', {
            description: "开启播报错误",
          })
        })

    }

    const stop_live = async () => {

      await store.stop_live_speech().then(res => {
          live.value = false
          toast.success('提示', {
            description: "已停止",
          })
        }).catch(err => {
          live.value = false
          toast.error('提示', {
            description: "停止错误",
          })
        })
    }

    const start_live_now = async (val: any) => {
       

      await store.start_live_now(val.id).then(res => {
          toast.success('提示', {
            description: "切换讲解成功",
          })
        }).catch(err => {
          toast.error('提示', {
            description: "切换讲解错误",
          })
        })
   }

onMounted(() => {
  tableData.value = store.initData.shop_list
  use_zhipu_shop.value = store.initData.use_zhipu_shop
  live.value = store.initData.live
  live_see.value = store.initData.live_see
})
</script>

<template>
  <div style="padding: 16px;">
    <div class="PageMain">
      <div class="grid-content" v-loading="loading" :element-loading-text="loadingTxt">
        <div class="tips">
          <div class="tips-cont">
            <img src="@/assets/icons/tishi.svg" alt="">
            <span>首次链接百应平台选择：</span>
            <span class="colors">达人入住 → 登录 ，</span>
            <span>登陆成功后关闭百应后台浏览器，再次连接即可成功，</span>
            <a class="colors" href="https://www.yuque.com/zhibaoai/cu4g1z/xdhwzp7apbq0qy0y?singleDoc# " target="_blank">点击查看使用教程视频</a>
          </div>
        </div>
        <div class="buttonBox flex">
          <el-button color="#3E61FF" :disabled="store.initData.open_page"
            @click="openBaiYing">{{ store.initData.open_page ? '已连接百应后台，请勿关闭浏览器' : '连接/绑定百应后台' }}</el-button>
          <el-button color="#3E61FF" :disabled="!store.initData.open_page" @Click="getDom">更新商品数据</el-button>
          <el-button color="#3E61FF" @click="cancelShop">一键清空</el-button>
          <el-button color="#3E61FF" :disabled="(!store.initData.open_page && !tableData.length) || live" @click="start_live">开启直播播报</el-button>
          <el-button color="#3E61FF" @click="stop_live">停止</el-button>
        </div>
        <div class="warnBox">恶意调用《智能写话术》账号将会被封禁！</div>
        <div class="switch-block">
          <div class="switch-block-item">
            <span>是否开启智能重写</span>
            <el-switch v-model="use_zhipu_shop" />
          </div>
          <div class="switch-block-item">
            <span>智能回复的内容包含链接的内容是否弹出对应商品弹窗</span>
            <el-switch v-model="live_see" />
          </div>
        </div>
      </div>


      <div v-if="tableData.length" class="goods" v-for="(item, index) in tableData" v-loading="loading" :element-loading-text="loadingTxt">
        <div class="goods-title">
          <div class="goods-title-left">
            <img :src="item.img_src" alt="">
            <div class="goods-title-text">
              <div class="link">{{ index + 1 }}号链接</div>
              <div class="name">商品名称：{{ item.title }}</div>
              <div class="id">商品ID： {{ item.id }}</div>
            </div>
          </div>
          <div class="radio-block">
            <el-checkbox v-model="item.see" @change="saveShop" label="是否自动讲解" size="large" />
          </div>
        </div>
        <div class="opi">
          <div class="opi-title">产品信息</div>
          <div class="opi-content">
            <div>{{ item.side_panel_data }}</div>
          </div>
        </div>
        <!-- 智能话术 -->
        <div class="script">
          <div class="script-title">智能话术</div>
          <div class="input-block">
            <el-input type="textarea" v-model="item.Ai_txt" style="height: 399px;" placeholder="请输入话术" />
          </div>
          <div class="buttonBox flex">
            <el-button color="#3E61FF" @click="write(item, index)">
              智能写话术
            </el-button>
            <el-button color="#3E61FF" @click="sliceShop(index)">
              保存
            </el-button>
            <el-button :type='store.initData.shop_id == item.id ? "warning" : "primary"' color="#3E61FF"   :disabled="store.initData.shop_id == item.id" @click="start_live_now(item)">
              {{store.initData.shop_id == item.id ? "讲解中..." : "讲解"}}
            </el-button>
          </div>
        </div>
      </div>
      <el-empty v-else :image-size="200" />

    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-content {
  .tips {
    display: inline-block;
    padding: 15px;
    margin-bottom: 20px;
    background: rgb(62 97 255 / 10%);
    border-radius: 4px;

    .tips-cont {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      img {
        margin-right: 10px;
      }

      .colors {
        font-size: 16px;
        color: #3e61ff;
      }

      a {
        border-bottom: 1px solid #3e61ff;
      }
    }
  }

  .buttonBox {
    margin-bottom: 20px;
    flex-wrap: wrap;
    row-gap: 10px;

    .btnDisabled {
      color: #303e52;
      background: #f5f6f9;
      border-color: #f5f6f9;
    }
  }

  .warnBox {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #ff3e3e;
  }

  .switch-block {
    display: flex;

    .switch-block-item {
      margin-right: 20px;

      span {
        margin-right: 10px;
        font-size: 16px;
        font-weight: 500;
        color: #303e52;
      }
    }
  }
}

.goods {
  box-sizing: border-box;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;

  .goods-title {
    display: flex;
    padding: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;

    .goods-title-left {
      display: flex;
      flex: 1;
    }

    img {
      width: 110px;
      height: 110px;
      overflow: hidden;
      border-radius: 8px;
    }

    &-text {
      margin-left: 10px;

      .link {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 600;
      }

      .name {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 500;
      }

      .id {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 400;
      }
    }
  }

  .opi {
    padding: 20px;
    padding-top: 0;
    border-bottom: 1px solid #eee;

    &-title {
      margin-bottom: 10px;
      font-family: "PingFang SC";
      font-size: 20px;
      font-weight: 600;
    }

    &-content {
      font-size: 18px;
      line-height: 28px;

      .li {
        display: flex;
        align-items: center;
        line-height: 28px;
      }

      .drop {
        display: block;
        width: 5px;
        height: 5px;
        margin-right: 10px;
        background: #303e52;
        border-radius: 50%;
      }
    }
  }

  .script {
    padding: 20px;
    border-bottom: 1px solid #eee;

    &-title {
      margin-bottom: 20px;
      font-family: "PingFang SC";
      font-size: 20px;
      font-weight: 600;
    }

    .input-block {
      margin-bottom: 20px;
    }
  }
}

.el-form-item__label-wrap {
  margin-left: 0 !important;
}
</style>
