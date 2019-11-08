import Taro, { useState } from '@tarojs/taro'
import { View, OpenData } from '@tarojs/components'
import { AtTextarea, AtButton } from 'taro-ui'
import { suggest } from '@/service/cloud'
import './index.scss'

function Index() {
  const [value, setValue] = useState()
  const submit = async() => {
    if (value && value.length < 5) {
      Taro.showToast({
        title: '要详细点哦~',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    const { status } = await suggest({ data: value })
    if (status === 0) {
      await new Promise(r => {
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(r, 2000)
          }
        })
      })
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
  return (
    <View className='container'>
      <View className='header'>
        <View className='user-avatar'>
          <OpenData type='userAvatarUrl' />
        </View>
      </View>
      <View className='body'>
        <AtTextarea
          value={value}
          className='textarea'
          maxLength={200}
          onChange={(e: any) => setValue(e.target.value)}
          placeholder='感谢您的反馈和建议。。。'
        />
      </View>
      <AtButton
        type='secondary'
        disabled={!value}
        onClick={submit}
      >提交</AtButton>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '意见反馈'
}

export default Index