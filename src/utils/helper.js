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

// 同时下载多文件
export function downLoadAudio(mediaArr, callBack){
	uni.showLoading({title: '预下载音频资源', mask: true}) 
	let progress = 0;
	// 下载文件
	const downloadList = mediaArr.map(item => {
	  return new Promise((resolve, reject) => {
	    uni.downloadFile({
	      url: item.full_path,
	      success(res) {
	        // 下载成功
			const { apFilePath, tempFilePath, statusCode } = res
	        resolve({...item, tempFilePath});
	      },
	      fail(err) {
	        // 下载失败
			// reject(err);
			resolve(item);
	      },
	      complete() {
	        // 每个文件下载完成后更新进度
	        progress++;
	      }
	    });
	  });
	});
	// 判断所有文件是否下载成功
	Promise.all(downloadList).then(results => {
		// console.log('All files downloaded successfully:', results);
		callBack(results)
	}).catch(error => {
		uni.showToast({title: '部分音频资源下载失败', icon: 'none'})
	}).finally(()=>{
		uni.hideLoading()
	});
}