import apiUser from '@/api/modules/user'
import router from '@/router'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const token = ref(localStorage.token ?? '')
    const isLogin = computed(() => {
      if (token.value) {
        return true
      }
      return false
    })

    // 登录
    async function login(data: any) {
      const res = await apiUser.login(data)
      console.log(res)
    }



    return {
      isLogin,
      login
    }
  },
)

export default useUserStore
