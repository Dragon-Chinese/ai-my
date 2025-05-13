import api from '../index'

export default {
  // 后端获取路由数据
  routeList: () => api.get('app/route/list', {
    baseURL: '/mock/',
  }),

  // 登录
  login: (data: any) => api.post('api/keyData', data),

  // 基于文件系统路由模式下，后端获取导航菜单数据
  menuList: () => api.get('app/menu/list', {
    baseURL: '/mock/',
  }),

  // 获取声音模型
  get_list_tts: () => api.get('api/list_tts'),

  // /api/list_tts

  set_all_model: (data: any) => api.post('api/set_all_model', data),
  

  getConfig: (data: any) => api.post('api/get_config_data', data),

  setConfig: (data: any) => api.post('api/set_config', data),

  setNoRead: (data: any) => api.post('api/no_read', data),

  setProIndex: (data: any) => api.post('api/setProIndex', data),

  start_fetching: (data: any) => api.post('api/start_fetching', data),

  stop_fetching: (data: any) => api.post('api/stop_fetching', data),

  interrupt_zindex1: (data: any) => api.post('api/interrupt_zindex1', data),

  wx_login: (data: any) => api.post('api/wx_login', data),

  zhipu_ai_write: (data: any) => api.post('api/zhipu_ai_write', data),

  test_banned: (data: any) => api.post('api/test_banned', data),

  dy_banned: (data: any) => api.post('api/dy_banned', data),

  set_banned: (data: any) => api.post('api/set_banned', data),

  set_continuous_text_model: (data: any) => api.post('api/set_continuous_text_model', data),

  set_continuous_text_user: (data:any) => api.post('api/set_continuous_text_user', data),

  stop_continuous_text_user: (data: any) => api.post('api/stop_continuous_text_user', data),

  ds_test: (data: any) => api.post('api/ds_test', data),

  frame: (data: any) => api.post('api/frame', data),

  set_continuous_text_type: (data: any) => api.post('api/set_continuous_text_type', data),

  sovitsData: (data: any) => api.post('api/sovitsData', data),

  stop_continuous_text_to_speech: (data: any) => api.post('api/stop_continuous_text_to_speech', data),

  UserLikesData: (data: any) => api.post('api/UserLikesData', data),

  stop_speech: (data: any) => api.post('api/stop_speech', data),

  UserLovesData: (data: any) => api.post('api/UserLovesData', data),

  UserWelcomesData: (data: any) => api.post('api/UserWelcomesData', data),

  UserGiftsData: (data: any) => api.post('api/UserGiftsData', data),

  CustomizeAudio: (data: any) => api.post('api/CustomizeAudio', data),

  bai_ying: (data: any) => api.post('api/bai_ying', data),
  
  get_dom: (data: any) => api.post('api/get_dom', data),

  shop_txt: (data: any) => api.post('api/shop_txt', data),

  shop_save: (data: any) => api.post('api/shop_save', data),

  start_live: (data: any) => api.post('api/start_live', data),

  stop_live_speech: (data: any) => api.post('api/stop_live_speech', data),

  start_live_now: (data: any) => api.post('api/start_live_now', data),

  zhipu_ai_write_shop: (data: any) => api.post('api/zhipu_ai_write_shop', data),

  win: (data: any) => api.post('api/win', data),

  v3_tts: () => api.get('api/v3_tts'),

  v3_tts_files: (data: any) => api.get('api/v3_tts_files', {
    params: data,
  }),

  set_sovits_weights: (data: any) => api.post('api/set_sovits_weights', data),

  set_gpt_weights: (data: any) => api.post('api/set_gpt_weights', data),
  // v3_tts_files
  // zhipu_ai_write_shop
  // api/start_fetching
  // api/stop_fetching
}
