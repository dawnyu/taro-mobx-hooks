import Taro, {
  useContext,
  useDidShow,
  useState,
  useShareAppMessage,
  useRouter,
} from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtModal, AtTabs, AtTabsPane } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import Record from './Record'
import { getUserinfo } from '@/utils'
import tilkujilu from '@/assets/images/tilkujilu.png'
import feidie from '@/assets/images/feidie-min.png'
import qiandao from '@/assets/images/qiandao.png'
import {
  getGoods,
  getConfig,
  getGood,
  getFriend,
  receiveGood,
  isReject,
  openRedEnvelope,
  login,
} from '@/service/cloud'
import './index.scss'
import moment from 'moment'

function Index() {
  const { userInfo, getUser, } = useContext(store) as any

  useShareAppMessage(() => {
    return {
      title: '这里学习资源太棒啦，想与你分享~',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'http://cdn.geekbuluo.com/res/share.jpg'
    }
  })
  const router: any = useRouter()
  const [current, setCurrent] = useState(1)
  const [showOpenRedEnvelopeModal, setShowOpenRedEnvelopeModal] = useState(false)
  const [goods, setGoods] = useState()
  const [shareGood, setShareGood] = useState()
  const [firend, setFriend] = useState()
  const [getShow, setGetShow] = useState(false) // 是否弹出领取
  const [award, setAward] = useState(0)
  const [firstScreen, setFirstScreen] = useState(false)

  const params: any = {
    page: 1,
    pageSize: 10,
  }

  useDidShow(async () => {
   try {
     const config = await getConfig()
     const isAuth = Taro.getStorageSync('isAuth')
     const user = await getUser()
     const isGave = router.params.superior && router.params.share && router.params.goodId
     if (!user.data) {
       //如果用户不存在
       login({ superior: Taro.getStorageSync('superior') }) //创建临时用户，只有openid
     }
     const isNewUser = config.data.open === 0 && !isAuth && !user.userid
     if (isGave) {
       // 说明是好友赠送资源来的
       const { superior, share, goodId } = router.params
       const reject = await isReject({
         benefactor: superior, share, goodId
       })
       if (!reject.data) {
         const { data: good } = await getGood({ goodId: router.params.goodId })
         const friend = await getFriend({ friend: router.params.superior })
         setFriend(friend.data)
         setShareGood(good)
         setGetShow(true)
       }
     } else if (isNewUser && !isGave) {
       const firsthb = await Taro.getStorageSync('firsthb')
       if (firsthb && !moment(firsthb).isSame(new Date(), 'day')) {
         setFirstScreen(true)
         Taro.setStorage({ key: 'firsthb', data: '' })
       } else if (!firsthb) {
         setFirstScreen(true)
       }
     }
   } catch (error) {
   }
    query(current)
  })

  const query = (s) => {
    Taro.showLoading({
      title: '加载中'
    })
    params.status = s
    getGoods(params).then(({ data, status, message }) => {
      Taro.hideLoading()
      if (status === 0) {
        setGoods(data)
      } else {
        Taro.showToast({
          title: message,
          icon: 'none',
        })
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }

  const rejectGift = async() => {
    setGetShow(false)
    const { message: title, status} = await receiveGood({
      benefactor: router.params.superior,
      goodId: shareGood.id,
      status: 1
      })
    if (status === 1) {
      Taro.showToast({
        title,
        icon: 'none',
      })
    }
  }

  const receiveGift = async(userinfo) => {
    setGetShow(false)
    getUserinfo(userinfo, async() => {
       await receiveGood({
        benefactor: router.params.superior,
        goodId: shareGood.id,
        status: 0
      })
    })
  }

  const closeFirstScreen = () => {
    setFirstScreen(false)
    Taro.setStorageSync('firsthb', moment().format('YYYY-MM-DD HH:mm:ss'))
  }

  const tabsHandle = (index) => {
    setGoods([])
    setCurrent(index)
    query(index)
  }

  //关闭红包授权
  const closeOpenHandle = (userinfo) => {
    getUserinfo(userinfo, async() => {
        const {data, message, status} = await openRedEnvelope({})
      if (status === 0) {
        setAward(data)
        setFirstScreen(false)
        setShowOpenRedEnvelopeModal(true)
      } else {
        Taro.showToast({
          title: message,
          icon: 'none'
        })
      }
        
    })
  }

  // 底部菜单授权
  // const authAndNavigateTo = (userinfo, url) => getUserinfo(userinfo, () => Taro.navigateTo({ url }))
  const authAndNavigateTo = (url) => Taro.navigateTo({ url })
  const tabList = [{ title: '最新' }, { title: '推荐' }, { title: '收藏' }]
  return (
    <View className='container'>
      <View>
        <AtTabs
          current={current}
          tabList={tabList}
          swipeable={false}
          onClick={(i) => tabsHandle(i)}
        >
          <AtTabsPane current={current} index={0}>
            <Record good={goods}/>
          </AtTabsPane>
          <AtTabsPane current={current} index={1} >
            <Record good={goods} />
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <Record good={goods} />
            {goods && goods.length === 0 &&
              <View className='no-record'>
                <View className='bg'>
                  <Text>还没有关注的资源哦</Text>
                </View>
              </View>
            }
          </AtTabsPane>
        </AtTabs>
      </View>
      <View className='nav'>
        <View
          className='nav-item'
          onClick={() => authAndNavigateTo('/pages/mission/index')}
        >
          <Image src={qiandao} />
          <View>签到</View>
        </View>
        <View
          className='nav-item'
          onClick={() => authAndNavigateTo('/pages/classify/index')}
        >
          <Image src={tilkujilu} />
          <View>分类</View>
        </View>
        <View
          className='nav-item'
          onClick={() => authAndNavigateTo('/pages/my/index')}
        >
          <Image src={feidie} />
          <View>我的</View>
        </View>
      </View>
     {
        firstScreen &&
        <View className='first-screen'>
          <Text className='text'>幸运奖励</Text>
          <Text className='text1'>最高获得20资源币</Text>
          <Button
              openType='getUserInfo'
              onGetUserInfo={closeOpenHandle}
              type='primary'
              lang='zh_CN'
          />
          <View
            className='close-first-screen'
            onClick={() => closeFirstScreen()}>点击关闭</View>
        </View>
     }
     {
      <AtModal
        isOpened={showOpenRedEnvelopeModal}
        closeOnClickOverlay
      >
        {
          <View className='atmodal-content'>
            <View className='atmodal-content-label'>
              <View className='atmodal-content-label-text'>
                  恭喜您获得<Text>{award}</Text>资源币
              </View>
            </View>
            <View
              onClick={() => setShowOpenRedEnvelopeModal(false)}
              className='at-icon at-icon-close'/>
          </View>}
      </AtModal>
     }
      {
        <AtModal
          isOpened={getShow}
        >
          {
            <View className='atmodal-good'>
              <View className='atmodal-good-label'>
                <View>
                  <Image className='avatarUrl' src={firend.avatarUrl} />
                  <View className='nickName'>收到好友 <Text>@{firend.nickName}</Text> 分享资源</View>
                  <View className='share-title'>{shareGood.category}相关{shareGood.type}课程：</View>
                  <View className='share-title'>《{shareGood.title}》</View>
                  <View className='share-button'>
                    <Button
                      className='button jujue'
                      onClick={rejectGift}>
                      残忍拒绝
                    </Button>
                    <Button
                      className='button auth'
                      openType='getUserInfo'
                      onGetUserInfo={receiveGift}
                      type='primary'
                      lang='zh_CN'
                      >
                      立即收下
                </Button>
                  </View>
                </View>
              </View>
            </View>}
        </AtModal>
      }
    </View>
  )
}
Index.config = {
  disableScroll: true,
}

export default observer(Index)