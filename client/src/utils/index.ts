import Taro, { useContext } from '@tarojs/taro'
import store from '@/store/index'
const { login } = useContext(store) as any
import { getUser } from '@/service/cloud'

export const getUserinfo = async ({ detail }, callback) => {
  const { authSetting } = await Taro.getSetting()
  if (authSetting['scope.userInfo']) {
    Taro.setStorageSync('isAuth', true)
    const { data: user } = await getUser()
    if (!user || !user.userid) {
      await login({ ...detail.userInfo, superior: Taro.getStorageSync('superior') })
    }
    callback()
  }
}