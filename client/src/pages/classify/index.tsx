import Taro, { useDidShow, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import { getLangs, getCat } from '@/service/cloud'
import Content from './Content'
import './index.scss'

async function Index() {
  const [current, setCurrent] = useState(0)
  const [langs, setLangs] = useState([{
    title: '',
    type: 0
  }])
  const [cat, setCat] = useState()
  useDidShow(async () => {
    const localLangs = Taro.getStorageSync('localLangs')
    if (localLangs) {
      setLangs(JSON.parse(localLangs))
    } else {
      const { data } = await getLangs({})
      const list = data.map(item => ({ title: item.title }))
      setLangs(list)
      Taro.setStorage({
        key: 'localLangs',
        data: JSON.stringify(list)
      })
    }
    const localCats = Taro.getStorageSync('localCats')
    if (localCats) {
      setCat(JSON.parse(localCats))
    } else {
      const { data: cat } = await getCat({})
      setCat(cat)
      Taro.setStorage({
        key: 'localCats',
        data: JSON.stringify(cat)
      })
    }
  })

  return (
    <View className='container'>
      <AtTabs
        current={current}
        scroll
        height='100%'
        tabDirection='vertical'
        swipeable={false}
        tabList={langs}
        onClick={(val) => setCurrent(val)}>
        {langs.map((item, index) => (
          <AtTabsPane tabDirection='vertical' key={index} current={current} index={index}>
            <Content cat={cat} index={index} lang={item.title} />
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '资源分类'
}

export default observer(Index)