
import api from '@/api/modules/app' // 改为直接导入api，而不是store
//这里官网是单独导出  是可以写成默认导出的  官方的解释为大家一起约定仓库用use打头的单词 固定统一小仓库的名字不易混乱
export const useStore = defineStore("data", {
  state: () => {
    return ({
      title: "随播AI",
      adminMsg: "",
      startCountTime: "",
      isLogin: false,
      time: '',
      name: '',
      initData: { 
        "py/object": "modules.config.Config", 
        "liveId": "", 
        "UserLikesOff": false, 
        "UserLovesOff": false, 
        "UserWelcomesOff": false, 
        "UserGiftsOff": false, 
        "UserKeysOff": false,
        "UserKeysData":  [],
        "config_data": { "ref_audio_path": "", "prompt_text": "" }, 
        "sovits_weights": "", 
        "gpt_weights": "", 
        "UserGiftsData": [], 
        "UserWelcomesData": [], 
        "UserLovesData": [], 
        "sovitsData": [], 
        "UserLikesData": [], 
        "stop_speech_loop": false, 
        "keyData": { "version": "", "List": [] },

        "welcomes_pro" : 0,
        "loves_pro" : 0,
        "likes_pro" : 0,
        "gifts_pro" : 0,
        "keys_pro" : 0,
        "mains_pro" : 0,

        "welcomes_index" : 0,
        "loves_index" : 0,
        "likes_index" : 0,
        "gifts_index" : 0,
        "keys_index" : 0,
        "mains_index" : 0,

        "speed_factor": 0,
        "text_split_method": 'cut5',

        "welcomes_space" : 30,
        "loves_space" : 30,
        "likes_space" : 30,
        "gifts_space" : 30,
        "keys_space" : 30,
        "keys_ai" : 0,
        "mains_space" : 1,
        "all_space" : 0.3,
        "all_space_last": 0.5,

        "api_key": "",
        "model": "",
        "system": "",
        "UserAiOff": false,
        "BaseUrl": "https://ark.cn-beijing.volces.com/api/v3",

        "use_zhipu": false,
        "zhipu_system": "",
        "zhipu_api_key": "",
        "zhipu_model": "",
        "no_name": [],
        "ds_list": [],
        "qrcode": "",
        "qrStatus": 1,
        "shop_list": [],
        "shop_id": "",
        "open_page": false,
        "live": false,
        "live_see": false,
        "use_zhipu_shop": false,
        "BannedList": [],
        "BannedType": false,
        "ref_audio_path": "",
        "nfe_step": "32",
        "interrupt_zindex1": true,
        "prompt_text": "",
        "frame": false
        }
    }) //为了避免出错，返回的值用()包起来
  },
  actions: {
    //开关分享
    OpenOff() {
    },

    async set_gpt_weights (path: any) {
      try {
        const res = await api.set_gpt_weights({path}) // 直接调用api
        console.log('set_gpt_weights data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_sovits_weights (path: any) {
      try {
        const res = await api.set_sovits_weights({path}) // 直接调用api
        console.log('set_sovits_weights data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async v3_tts_files (folder_path: any) {
      try {
        const res = await api.v3_tts_files({folder_path}) // 直接调用api
        console.log('v3_tts_files data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async v3_tts () {
      try {
        const res = await api.v3_tts() // 直接调用api
        console.log('v3_tts data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async win (isWin: any) {
      try {
        const res = await api.win({isWin})// 直接调用api
        console.log('win data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async zhipu_ai_write_shop (zhipu_api_key: any, zhipu_model: any, zhipu_system: any, use_zhipu_shop: any) {
      try {
        const res = await api.zhipu_ai_write_shop({zhipu_api_key, zhipu_model, zhipu_system, use_zhipu_shop})// 直接调用api
        console.log('zhipu_ai_write_shop data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async start_live_now (id: any) {
      try {
        const res = await api.start_live_now({id})// 直接调用api
        console.log('start_live_now data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async stop_live_speech () {
      try {
        const res = await api.stop_live_speech({})// 直接调用api
        console.log('stop_live_speech data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async start_live () {
      try {
        const res = await api.start_live({})// 直接调用api
        console.log('start_live data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async shop_save (data: any) {
      try {
        const res = await api.shop_save({data})// 直接调用api
        console.log('shop_save data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async shop_txt (txt: any) {
      try {
        const res = await api.shop_txt({txt})// 直接调用api
        console.log('shop_txt data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async get_dom () {
      try {
        const res = await api.get_dom({})// 直接调用api
        console.log('get_dom data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async bai_ying (path: any) {
      try {
        const res = await api.bai_ying({path})// 直接调用api
        console.log('bai_ying data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },
    
    async CustomizeAudio (txt: any) {
      try {
        const res = await api.CustomizeAudio({txt})// 直接调用api
        console.log('CustomizeAudio data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async UserGiftsData (result: any) {
      try {
        const res = await api.UserGiftsData({result})// 直接调用api
        console.log('UserGiftsData data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async UserWelcomesData (result: any) {
      try {
        const res = await api.UserWelcomesData({result})// 直接调用api
        console.log('UserWelcomesData data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async UserLovesData (result: any) {
      try {
        const res = await api.UserLovesData({result})// 直接调用api
        console.log('UserLovesData data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async stop_speech (id: any) {
      try {
        const res = await api.stop_speech({id})// 直接调用api
        console.log('id data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async UserLikesData (result: any) {
      try {
        const res = await api.UserLikesData({result})// 直接调用api
        console.log('UserLikesData data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async stop_continuous_text_to_speech () {
      try {
        const res = await api.stop_continuous_text_to_speech({})// 直接调用api
        console.log('stop_continuous_text_to_speech data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async sovitsData (result: any) {
      try {
        const res = await api.sovitsData({result})// 直接调用api
        console.log('sovitsData data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_continuous_text_type (type: any) {
      try {
        const res = await api.set_continuous_text_type({type})// 直接调用api
        console.log('frame data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async frame (use_frame: any) {
      try {
        const res = await api.frame({use_frame})// 直接调用api
        console.log('frame data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },   

    async ds_test (name: any, content: any) {
      try {
        const res = await api.ds_test({name, content})// 直接调用api
        console.log('ds_test data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async stop_continuous_text_user () {
      try {
        const res = await api.stop_continuous_text_user({})// 直接调用api
        console.log('stop_continuous_text_user data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_continuous_text_user (system: any) {
      try {
        const res = await api.set_continuous_text_user({system})// 直接调用api
        console.log('set_continuous_text_user data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_continuous_text_model (api_key: any, model: any, BaseUrl:any) {
      try {
        const res = await api.set_continuous_text_model({api_key, model, BaseUrl})// 直接调用api
        console.log('set_continuous_text_model data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_banned (type: any) {
      try {
        const res = await api.set_banned({type})// 直接调用api
        console.log('set_banned data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },
    
    async dy_banned (list: any) {
      try {
        const res = await api.dy_banned({list})// 直接调用api
        console.log('dy_banned data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },
    
    async test_banned (msg: any) {
      try {
        const res = await api.test_banned({msg})// 直接调用api
        console.log('test_banned data:', res)
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async zhipu_ai_write (zhipu_api_key: any, zhipu_model: any, zhipu_system: any, use_zhipu: any) {
      try {
        const res = await api.zhipu_ai_write({zhipu_api_key, zhipu_model, zhipu_system, use_zhipu})// 直接调用api
        console.log('interrupt_zindex1 data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async wx_login () {
      try {
        const res = await api.wx_login({})// 直接调用api
        console.log('wx_login data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_interrupt (interrupt: any) {
      try {
        const res = await api.interrupt_zindex1({interrupt})// 直接调用api
        console.log('interrupt_zindex1 data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async start_fetching (live_id: any) {
      try {
        const res = await api.start_fetching({live_id})// 直接调用api
        console.log('start_fetching data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async stop_fetching () {
      try {
        const res = await api.stop_fetching()// 直接调用api
        console.log('stop_fetching data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async setProIndex (result: any) {
      try {
        const res = await api.setProIndex({result})// 直接调用api
        console.log('setConfig data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async setNoRead (no_name: any) {
      try {
        const res = await api.setNoRead({no_name})// 直接调用api
        console.log('setConfig data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async setConfig (ref_audio_path: any, prompt_text: any) {
      try {
        const res = await api.setConfig({ref_audio_path, prompt_text})// 直接调用api
        console.log('setConfig data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async set_all_model(val: any) {
      api.set_all_model({model: val})
    },

    // 获取声音模型
    async get_list_tts() {
      try {
        const res = await api.get_list_tts() // 直接调用api
        console.log('get_list_tts data:', res)

        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    //登录
    async login(key: any, version: any) {
      try {
        const res = await api.login({key, version}) // 直接调用api
        this.adminMsg = res.message // 根据实际响应结构调整
        this.time = res.time
        this.name = res.message
        this.isLogin = true
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    },

    async logout() {
      this.isLogin = false
    },

    //获取配置
    async getConfig() {
      try {
        const res = await api.getConfig({}) // 直接调用api
        this.initData = res.data // 根据实际响应结构调整
      
        return res
      } catch (err) {
        console.error('Failed to get config:', err)
        throw err
      }
    }
  }
})
// if (typeof window !== 'undefined') {
//   const store = useStore()
//   // 立刻拉取一次
//   store.getConfig()
//   // 每 10s 刷新一遍
//   setInterval(() => {
//     store.getConfig()
//   }, 10_000)
// }