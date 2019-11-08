import Taro from '@tarojs/taro'

const api = 'http://localhost:3005/api'
class Request {
  header = {
    'content-type': 'application/json'
  }

  // 暂时微信平台， 多平台此处需要优化
  async getOpenid() {
    const localOpenid = Taro.getStorageSync('openid')
    const localAppid = Taro.getStorageSync('appid')
    if (!localOpenid) {
      const { result: { openid, appid } }: any = await Taro.cloud.callFunction({ name: 'login' })
      Taro.setStorage({ key: 'openid', data: openid })
      Taro.setStorage({ key: 'appid', data: appid })
      return { openid, appid }
    } else {
      return {
        openid: localOpenid,
        appid: localAppid
      }
    }
    
  }

  get({action, data}) {
    data = {
      platform: Taro.getEnv(),
      ...data,
      ...this.getOpenid()
    }
    return new Promise((resolve) => {
      Taro.request({
        url: api,
        data: { action, ...data},
        method: 'GET',
        header: this.header
      }).then(res => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data)
        }
      })
    })
  }

  async post({action, data}) {
    data = {
      platform: Taro.getEnv(),
      action,
      ...data,
      ... await this.getOpenid()
    }
    return new Promise((resolve) => {
      Taro.request({
        url: api,
        data,
        method: 'POST',
        header: this.header
      }).then(res => {
        if (res.statusCode === 200 || res.statusCode === 201) resolve(res.data)
      })
    })
  }
}

export default new Request()


