import { useUserStore } from '@/stores'
import { last, shuffle, nth } from 'lodash-es'

export const goTo = url => {
	const user = useUserStore()
	if(user.isLogin){
		uni.navigateTo({url})
	}else{
		uni.showModal({
			title: '提示',
			content: '您还未登录，请先登录',
			success: function (res) {
				if (res.confirm) {
					uni.navigateTo({ url: '/pagesub/login/index' })
				}
			}
		})
	}
}

// 随机播放函数
export function randomArr(data){
  // 先获取最后一个元素
  const lastOne = last(data)
  // 创建新的随机数组
  // let newArr = uni.$u.randomArray(data)
  let newArr = shuffle(data)
  const first = nth(newArr, 0)
  if(first===lastOne){
    const second = nth(newArr, 1)
    newArr[0] = second
    newArr[1] = first
  }
  return newArr
}