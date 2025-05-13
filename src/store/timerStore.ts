import { defineStore } from 'pinia';
import axios from 'axios';

export const useTimerStore = defineStore('timer', {
  state: () => ({
    isReporting: false, // 是否开启报时
    timenum: 30, // 报时间隔分钟数
    timerInterval: null as ReturnType<typeof setInterval> | null, // 定时器ID
    announcementLog: [] as string[], // 报时记录
    prefixText: "", // 前置文本
    suffixText: "", // 后置文本
    txtDisabled: false, // 按钮禁用状态
  }),
  actions: {
    // 启动定时器
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval); // 清除之前的定时器
      }
      console.log(`定时器启动，间隔 ${this.timenum} 分钟`);
      this.timerInterval = setInterval(() => {
        this.addCustomizeAudio();
      }, this.timenum * 60 * 1000); // 转换为毫秒
    },
    // 停止定时器
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      console.log("定时器已停止");
    },
    // 添加自定义音频（报时）
    async addCustomizeAudio() {
      this.txtDisabled = true;
      const content = `${this.prefixText}${this.formatCurrentTime()}${this.suffixText}`;
      
      try {
        const res = await axios.post('http://localhost:3201/api/CustomizeAudio', { txt: content });
        this.announcementLog.unshift(`已报时：${this.formatCurrentTime()}`);
      } catch (err) {
        console.error(err);
        ElMessage.error('生成失败');
      } finally {
        this.txtDisabled = false;
      }
    },
    // 格式化当前时间为“时点分”
    formatCurrentTime(): string {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return `${hours}点${minutes}分`;
    },
  },
});
