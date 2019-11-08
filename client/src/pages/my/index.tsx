import Taro, { useContext } from '@tarojs/taro'
import { View, OpenData, Image, Text } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { userInfo } = useContext(store) as any

  return (
    <View className='container'>
      <View className='header'>
        <Image
          className='crown'
          src='http://cdn.geekbuluo.com/huangguan-min.png'
        />
        <View className='user-avatar'>
          <OpenData type='userAvatarUrl' />
        </View>
        <View className='user-nickname'>
          <OpenData type='userNickName' />
        </View>
        <View className='user-balance'>
          <Text>资源币：{userInfo.balance}</Text>
          <Text className='iconfont icon-jifenshangcheng' />
        </View>
      </View>
      <View className='body'>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/withdraw/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/datizhuanqian.png' />
            <View>我的资源</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/award/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/yuanbaojilu-min.png' />
            <View>操作记录</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        {/* <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/suggest/index' })}
        >
          <View className='left'>
           <Image src='http://cdn.geekbuluo.com/yijianxiang-min.png' />
            <View>意见反馈</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View> */}
      </View>
      
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的'
}

export default observer(Index)