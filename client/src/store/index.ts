import Taro, { createContext } from '@tarojs/taro'
import { observable, action, decorate, runInAction } from 'mobx'
import {
  update,
  trade,
  login,
  getUser,
} from '../service/cloud'

class Index {
  userInfo = {
    openid: '',
    appid: '',
    newuser: false,
    answersheet: 0,
    balance: 0,
  }

  async getUser() {
    try {
      const res = await getUser()
      runInAction(() => {
        if (res.data) {
          this.userInfo = { ...res.data }
        }
      })
      return this.userInfo
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async login(payload) {
    const { status, data } = await login(payload)
      runInAction(() => {
        if(status === 0) {
          this.userInfo = { ...data }
        }
      })
   
  }

  async trade(payload) {
    const { status, message } = await trade(payload)
    if (status === 0) {
      await this.getUser()
    } else {
      throw new Error(message)
    }
  }

  checkAuth() {
    return Taro.getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        return true;
      } else {
        throw new Error('没有授权')
      }
    })
  }
  
  async update(payload) {
    const { status } = await update(payload)
    if (status === 0) {
      runInAction(async() => {
        await this.getUser()
      })
    } else {
      throw new Error('更新失败')
    }
  }

}

decorate(Index, {
  userInfo: observable,
  getUser: action.bound,
  update: action.bound,
  login: action.bound,
  trade: action.bound,
})

export default createContext(new Index())
