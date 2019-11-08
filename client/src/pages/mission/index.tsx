import Taro, { useContext,
  useDidShow,
  useState,
  useShareAppMessage} from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtProgress, AtModal } from 'taro-ui'
import Calendar from '@/components/Calendar'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getFriends, getSign, sign } from '@/service/cloud'
import moment from 'moment'

import './index.scss'

async function Index() {
  const { userInfo } = useContext(store) as any
  const [invite, setInvite] = useState(0)
  const [current, setCurrent] = useState(0)
  const [signInfo, setSignInfo] = useState({
    todaySign: null,
    sum: 0,
    list: []
  })
  const [modal, setModal] = useState({
    show: false,
    title: '',
    text: ''
  })

  useShareAppMessage(() => {
    return {
      title: '这里的学习资源全免费，你要不要一起来学习下',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'http://cdn.geekbuluo.com/res/20191024013531.jpg'
    }
  })

  useDidShow(async() => {
    getFriends({
      openid: userInfo.openid,
      day: moment().startOf('day').format()
    }).then(res => {
      if (res.status === 0 && res.data) {
        setInvite(res.data.length)
      }
    })
    const { data, status } = await getSign()
    if (status === 0) {
      setSignInfo(data)
    }
  })


  const signHandle = async() => {
    const { data, status, message } = await sign({})
    if (status === 0) {
      setModal({
        show: true,
        title: '签到成功',
        text: `获取${data}资源币`
      })
      const {status, data: sign} = await getSign()
      if (status === 0) {
        setSignInfo(sign)
      }
    } else {
      setModal({
        show: true,
        title: '',
        text: message
      })
    }
   
  }
  return (
    <View className='container'>
      <View>
        {signInfo.todaySign === false && 
        <View className='sign'>
          <View onClick={signHandle}>签到</View>
        </View>}
        {signInfo.todaySign === true && 
        <View className='issign'>
          <Text>{signInfo.sum}</Text>
          <Text>连续签到天数</Text>
        </View>}
        <View className='tabs-header'>
          <Text
            className={current === 0 ? 'actived' : ''}
            onClick={() => setCurrent(0)}>每日任务</Text>
          <Text
            className={current === 1 ? 'actived' : ''}
            onClick={() => setCurrent(1)}>签到日历</Text>
        </View>
        {current === 0 && 
          <View className='body'>
            <View className='item'>
              <Image src='http://cdn.geekbuluo.com/1bf360a2147943ed1bb863e4f607979a-min.png' />
              <View className='right'>
                <View className='right-top'>
                  <Text>邀请好友
                      <Text className='right-top-add'>+20
                      <Text className='iconfont icon-jifenshangcheng'></Text>
                    </Text>
                  </Text>
                  <Text>{invite}/2 {invite > 1 && <Text className='over'>【已完成】</Text>}</Text>
                </View>
                <AtProgress percent={invite === 0 ? 5 : invite * 50} isHidePercent color='#FFC82C' />
              </View>
              <Button
                className='share'
                openType='share' />
            </View>
        </View>}
        {current === 1 && 
        <View>
          <Calendar
            extraInfo={
              signInfo.list.map(item => {
                return {
                  value: item,
                  text: '签',
                  color: 'yellow'
                }
              })
            }
            mode='normal'
            hideArrow={true}
            selectedDateColor="#346fc2"
          />
        </View>}
      </View>
      <AtModal
        isOpened={modal.show}
        closeOnClickOverlay
      >
        {
          <View className='atmodal-content'>
            <View className='atmodal-content-label'>
              <View className='atmodal-content-label-title'>
                {modal.title}
              </View>
              <View className='atmodal-content-label-text'>
                {modal.text}
              </View>
            </View>
            <View
              onClick={() => setModal({show: false, text: '', title: ''})}
              className='at-icon at-icon-close' />
          </View>}
      </AtModal>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '任务'
}

export default observer(Index)