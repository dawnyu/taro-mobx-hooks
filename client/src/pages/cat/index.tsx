import Taro, { useDidShow, useState, useRouter} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { getGoods } from '@/service/cloud'
import Good from '@/components/Good'
import './index.scss'

function Index() {
  const [current, setCurrent] = useState(0)
  const [cats, setCats] = useState()
  const [goods, setGoods] = useState()
  const router = useRouter()
  useDidShow(async() => {
    const params = router.params
    Taro.setNavigationBarTitle({
      title: params.lang
    })
    const cats = JSON.parse(params.cat)
    setCats(cats)
    reload(+params.index, cats[params.index])
  })
  const params: any = {
    page: 1,
    pageSize: 10,
  }
 
  const reload = async(index, cat) => {
    setCurrent(index)
    params.type = cat.title
    const { data, status } = await getGoods(params)
    if (status === 0) {
      setGoods(data)
    }
  }

  return (
    <View className='container'>
      <AtTabs
        current={current}
        scroll
        tabList={cats}
        onClick={(val) => reload(val, cats[val])}>
        {cats && cats.map((item, index) => (
          <AtTabsPane key={item.id} current={current} index={index}>
            {goods && goods.map(good => (
              <Good
                key={good.id}
                data={good} />
            ))}
            {
              goods && goods.length === 0 &&
              <View className='no-record'>
                <View className='bg'>
                  <Text>该分类下还没资源哦</Text>
                </View>
              </View>
            }
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: ''
}

export default Index