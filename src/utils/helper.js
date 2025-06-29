import { useUserStore } from '@/stores'
import { last, shuffle, nth } from 'lodash-es'

export const goTo = (url, cb) => {
  const user = useUserStore()
  const complete = cb ? cb : () => { }
  if (user.isLogin) {
    uni.navigateTo({ url, complete })
  } else {
    uni.showModal({
      title: '提示',
      content: '您还未登录，请先登录',
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({ url: '/pagesub/login/index' })
        }
      },
      complete,
    })
  }
}

// 随机播放函数
export function randomArr (data) {
  // 先获取最后一个元素
  const lastOne = last(data)
  // 创建新的随机数组
  // let newArr = uni.$u.randomArray(data)
  let newArr = shuffle(data)
  const first = nth(newArr, 0)
  if (first === lastOne) {
    const second = nth(newArr, 1)
    newArr[0] = second
    newArr[1] = first
  }
  return newArr
}

// 同时下载多文件
export function downLoadAudio (mediaArr, callBack) {
  uni.showLoading({ title: '预下载音频资源', mask: true })
  let progress = 0
  // 下载文件
  const downloadList = mediaArr.map((item) => {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: item.full_path,
        success (res) {
          // 下载成功
          const { apFilePath, tempFilePath, statusCode } = res
          console.log('res', res)
          resolve({ ...item, tempFilePath })
        },
        fail (err) {
          // 下载失败
          // reject(err);
          resolve(item)
        },
        complete () {
          // 每个文件下载完成后更新进度
          progress++
        },
      })
    })
  })
  // 判断所有文件是否下载成功
  Promise.all(downloadList)
    .then((results) => {
      // console.log('All files downloaded successfully:', results);
      callBack(results)
    })
    .catch((error) => {
      uni.showToast({ title: '部分音频资源下载失败', icon: 'none' })
    })
    .finally(() => {
      uni.hideLoading()
    })
}

// 检测小程序权限
export function checkPermissions (permiss, callback) {
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting[`scope.${permiss}`]) {
        // 无权限先获取授权
        uni.authorize({
          scope: `scope.${permiss}`,
          success () {
            console.log('授权成功')
            callback()
          },
          fail () {
            uni.showToast({ title: '授权失败', icon: 'error' })
          },
        })
      } else {
        // 有权限直接执行回调函数
        callback()
      }
    },
  })
}

// 检测APP权限
export function checkAppPermissions (permiss, callback) {
  const appAuthSetting = uni.getAppAuthorizeSetting()
  if (appAuthSetting[permiss] === 'authorized') {
    if (callback) callback()
  } else {
    // 没有相关权限
    uni.showModal({
      title: '获取权限失败',
      content: '没有对应的APP权限,是否跳转到权限设置？',
      success: function (res) {
        if (res.confirm) {
          uni.openAppAuthorizeSetting({
            success (res) {
              console.log(res)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  }
}

// 生成32为id
export function generateUUID () {
  const timestamp = Date.now().toString(16) // 当前时间戳（精度：毫秒）
  const randomPart = 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
  return (timestamp + randomPart).slice(0, 32)
}

// 计算字符数

export function calculateCharacterCount (text) {
  // 用正则将多个空白字符替换为一个空格
  const content = text.replace(/\s+/gu, ' ').trim();

  // 统计所有字符数量（包括中文、英文、标点），空格会被保留一个
  const count = [...content].length;

  return count;
}


// 用于记录每个用户的上次触发时间（单位：时间戳）
const userTriggerMap = new Map();
/**
 * 每个用户每分钟只能触发一次
 * @param {string} username - 当前用户的唯一标识
 * @returns {boolean} 是否允许触发
 */
export function canTrigger (username) {
  const now = Date.now(); // 当前时间戳，单位：毫秒
  const lastTriggerTime = userTriggerMap.get(username);

  if (!lastTriggerTime || (now - lastTriggerTime) > 60 * 1000) {
    userTriggerMap.set(username, now); // 更新触发时间
    return true; // 允许触发
  }

  return false; // 一分钟内重复触发，拒绝
}
