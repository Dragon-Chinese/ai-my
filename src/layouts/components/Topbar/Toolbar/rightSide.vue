<script setup lang="ts">
import { useStore } from '@/store/all' // 使用命名导入
defineOptions({
  name: 'ToolbarRightSide',
})
const store = useStore();
const time = ref('')
const name = ref('')
const remainingTime = ref('')
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

onMounted(() => {
    startCountdown(store.time)
    name.value = store.name
})

</script>

<template>
  <div class="flex items-center">
    <div class="tags">
      <div class="tags-item">
        <span>剩余时间：</span>
        <span class="color33"> {{ remainingTime }} </span>
        
      </div>
      <div class="tags-item">
        <span class="color22"> {{ name }} </span>
      </div>
      
    </div>
  </div>
</template>

<style lang="scss">
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

    .color22 {
      color: #00b155;
      font-weight: 600;
    }

    .color33 {
      color: #3e61ff;
      font-weight: 600;
    }
  }
}
</style>
