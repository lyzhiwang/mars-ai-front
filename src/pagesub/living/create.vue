<template>
  <view class="container-box" @click="show = false">
    <image src="/static/images/living/c-bg.png" class="top-bg"></image>

    <view class="c-box">
      <view class="steps">
        <view class="line"></view>
        <view class="steps-box">
          <view class="item-box">
            <view class="round-box">
              <image src="/static/images/living/s-1.png" class="icon"></image>
            </view>
            <view>填写商家信息</view>
          </view>
          <view class="item-box">
            <view class="round-box">
              <image
                src="/static/images/living/s-2.png"
                class="icon icon1"
              ></image>
            </view>
            <view>填写直播信息</view>
          </view>

          <view class="item-box">
            <view class="round-box">
              <image
                src="/static/images/living/s-3.png"
                class="icon icon2"
              ></image>
            </view>
            <view>开始直播</view>
          </view>
        </view>
      </view>

      <view class="title-box">选择声音</view>

      <view class="content">
        <view class="cell">
          <view class="cell-left">主播音色</view>
          <view class="cell-right">
            <view class="timbre">未选择</view>
          </view>
        </view>
        <view class="cell">
          <view class="cell-left">副播音色</view>
          <view class="cell-right">
            <view class="timbre">未选择</view>
          </view>
        </view>
      </view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播语音场控</view>
          <view class="cell-right">
            <view class="control" @click="showControl = true">
              <view class="icon-box">
                <u-icon name="plus" color="#4F77FC" size="18"></u-icon>
              </view>
              自定义场控话术
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播间账号</view>
          <view class="cell-right">
            <u--input
              placeholder="请输入直播间账号"
              border="none"
              inputAlign="right"
              color="#4F77FC"
              v-model="form.number"
              clearable
            ></u--input>
          </view>
        </view>
        <view class="cell">
          <view class="cell-left">直播间名称</view>
          <view class="cell-right">
            <u--input
              placeholder="请输入直播间名称"
              border="none"
              inputAlign="right"
              color="#4F77FC"
              v-model="form.name"
              clearable
            ></u--input>
          </view>
        </view>
      </view>
      <view class="title-box">填写商家信息</view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">您的行业</view>
          <view class="cell-right Industry" @click.stop="show = !show">
            {{ form.type }}
            <u-icon name="arrow-down-fill" color="#4F77FC" size="22"></u-icon>
            <u-transition :show="show">
              <view class="select-box">
                <view
                  class="item"
                  v-for="(item, index) in Industry"
                  :key="index"
                  @click="selectIndustry(item)"
                  :class="{ active: form.type === item }"
                >
                  {{ item }}
                </view>
              </view>
            </u-transition>
          </view>
        </view>

        <template v-if="form.type === '实体店播'">
          <view class="cell-column">
            <view class="cell-title">1.您店铺的经营时间</view>
            <u--textarea
              v-model="form.shop.time"
              maxlength="-1"
              autoHeight
              placeholder="请填写店铺的经营时间"
            ></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">2.您店铺的地址</view>
            <u--textarea
              v-model="form.shop.address"
              autoHeight
              maxlength="-1"
              placeholder="请填写店铺的地址"
            ></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">3.您店铺的历史</view>
            <u--textarea
              v-model="form.shop.history"
              autoHeight
              maxlength="-1"
              placeholder="请填写店铺的历史"
            ></u--textarea>
          </view>
        </template>
        <template v-else>
          <view class="cell-column">
            <view class="cell-title">1.您的货源厂家名与厂家地址</view>
            <u--textarea
              v-model="form.shop.history"
              autoHeight
              maxlength="-1"
              placeholder="请填写店铺的历史"
            ></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">2.您的货源厂家的一些优势</view>
            <u--textarea
              v-model="form.shop.history"
              autoHeight
              maxlength="-1"
              placeholder="请填写店铺的历史"
            ></u--textarea>
          </view>
        </template>
      </view>
      <view class="title-box">填写直播信息</view>
      <view class="content">
        <view class="text-content">
          <u--textarea
            v-model="form.remark"
            height="400"
            count
            maxlength="1000"
            placeholder="请填写直播信息"
          ></u--textarea>
        </view>
      </view>
      <view class="tips-box">
        <view class="t-title">注意！</view>
        不是让你写话术，而是让您告知A1:
        您卖什么?|解决什么问题，为什么要卖?」电商包部?团购如何核销?|直播福利?|遇到售后如何解决?!若是电商产品如何使用?|商品链接说明(号链接是啥?2号...)团购店消费环境(有停车场?对近有商场?有吃的?)|客户给您的好评举一些例子|注意事项?!想和直播间用户说的话|大家常问的问题对应的答案把内容写上去就行，AI会自动生成话术!
      </view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播方式</view>
          <view class="cell-right">
            <view
              class="edit"
              :class="{ aEdit: form.is_edit }"
              @click="form.is_edit = !form.is_edit"
            >
              <view class="select-v">
                <view class="select-v-icon"></view>
              </view>
              修改AI话术
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-box">
      <view class="countdown">
        <image src="/static/images/living/b-1.png" class="icon"></image>
        <view class="time">倒计时</view>
      </view>

      <view class="btn">下一步</view>

      <view class="countdown">
        <image src="/static/images/living/b-2.png" class="icon1"></image>
        <view class="time">违禁词</view>
      </view>
    </view>
    <FieldControl
      :show="showControl"
      @close="showControl = false"
    ></FieldControl>
  </view>
</template>

<script setup>
import FieldControl from '@/components/living/FieldControl'

const showControl = ref(false) // 场控显示
const Industry = ref(['实体店播', '直播带货'])
const show = ref(false)
const form = ref({
  number: '',
  name: '',
  remark: '',
  type: '实体店播',
  is_edit: false,
  shop: {
    time: '',
    address: '',
    history: '',
  },
})

const selectIndustry = (item) => {
  form.value.type = item
}
</script>

<style lang="scss" scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  .top-bg {
    width: 100%;
    height: 448rpx;
  }
  .c-box {
    width: 100%;
    min-height: 500rpx;
    padding: 0 30rpx;
    padding-bottom: 80px; /* 预留底部栏高度 + 安全距离 */
    box-sizing: border-box;
    margin-top: -85rpx;
    position: relative;
    .steps {
      width: 100%;
      height: 136rpx;
      background: #ffffff;
      border-radius: 15rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 54rpx;
      box-sizing: border-box;
      position: relative;
      .line {
        width: 80%;
        border: 1px dashed #207efe;
        margin-top: -20rpx;
      }
      .steps-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 54rpx;
        box-sizing: border-box;
        position: absolute;
        .item-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 18rpx;
          font-weight: 400;
          color: #2281fe;
          line-height: 20rpx;
          .round-box {
            width: 68rpx;
            height: 68rpx;
            background: #f7f9ff;
            border: 1rpx solid #6185fb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6rpx;
            .icon {
              width: 37rpx;
              height: 33rpx;
            }
            .icon1 {
              width: 28rpx;
              height: 37rpx;
            }
            .icon2 {
              width: 37rpx;
              height: 35rpx;
            }
          }
        }
      }
    }
    .title-box {
      padding-top: 35rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
      letter-spacing: 2.8rpx;
    }
    .content {
      width: 690rpx;
      min-height: 95rpx;
      background: #ffffff;
      border-radius: 20rpx;
      margin-top: 20rpx;
      .cell {
        width: 100%;
        height: 98rpx;
        padding: 0 22rpx 0 35rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cell-left {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
        }
        .cell-right {
          width: 50%;
          display: flex;
          justify-content: flex-end;
          .edit {
            display: flex;
            align-items: center;
            font-size: 22rpx;
            font-weight: 400;
            color: #666666;
            .select-v {
              width: 26rpx;
              height: 26rpx;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1rpx solid #666666;
              margin-right: 10rpx;
            }
          }
          .aEdit {
            color: #416cfa;
            .select-v {
              border: 1rpx solid #416cfa;
            }
            .select-v-icon {
              width: 14rpx;
              height: 14rpx;
              border-radius: 50%;
              background-color: #416cfa;
            }
          }
          .control {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 26rpx;
            font-weight: 400;
            color: #4f77fc;
            .icon-box {
              width: 26rpx;
              height: 26rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1rpx solid #4f77fc;
              border-radius: 50%;
              margin-right: 8rpx;
            }
          }
          .timbre {
            width: 138rpx;
            height: 47rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f6f8fd;
            border-radius: 5rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: #666666;
          }
        }
        .Industry {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 26rpx;
          font-weight: 400;
          color: #4f77fc;
          position: relative;
          .select-box {
            position: absolute;
            top: 50rpx;
            right: -20rpx;
            width: 210rpx;
            height: 141rpx;
            background: #ffffff;
            border-radius: 20rpx;
            box-shadow: 0rpx 0rpx 5rpx NaNrpx rgba(90, 90, 90, 0.06);
            z-index: 9999;
            .item {
              width: 209rpx;
              height: 68rpx;
              border-radius: 20rpx;
              font-size: 28rpx;
              font-weight: 400;
              color: #666666;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .active {
              color: #2281fe;
              background: #e9eeff;
            }
          }
        }
      }

      .cell-column {
        width: 100%;
        min-height: 98rpx;
        padding: 0 44rpx 30rpx 35rpx;
        box-sizing: border-box;
        .cell-title {
          font-size: 26rpx;
          font-weight: 400;
          color: #666666;
          margin-bottom: 18rpx;
        }
        :deep(.u-textarea) {
          min-height: 143rpx;
          background: #fafbff;
          border: 1rpx solid #f5f6fa !important;
          border-radius: 20rpx;
          .uni-textarea-textarea {
            font-size: 24rpx;
            font-weight: 400;
            color: #666666;
            line-height: 45rpx;
          }
        }
      }
      // 文本域样式
      .text-content {
        width: 100%;
        padding: 30rpx 25rpx;
        box-sizing: border-box;
        :deep(.u-textarea) {
          height: 469rpx;
          background: #fafbff;
          border: 1rpx solid #f5f6fa !important;
          border-radius: 20rpx;
          .uni-textarea-textarea {
            font-size: 24rpx;
            font-weight: 400;
            color: #666666;
            line-height: 45rpx;
          }
        }
      }
    }
    .tips-box {
      width: 100%;
      padding: 20rpx 40rpx;
      box-sizing: border-box;
      font-size: 24rpx;
      color: #999999;
      line-height: 40rpx;
      .t-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #2281fe;
        margin-bottom: 20rpx;
      }
    }
  }

  .footer-box {
    width: 100%;
    min-height: 150rpx;
    background: #ffffff;
    border-radius: 30rpx 30rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #2281fe;
    padding: 0 58rpx;
    .btn {
      width: 400rpx;
      height: 100rpx;
      background: #2281fe;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      font-weight: 700;
      color: #ffffff;
    }
    .countdown {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 47rpx;
        height: 48rpx;
        margin-bottom: 8rpx;
      }
      .icon1 {
        width: 55rpx;
        height: 46rpx;
        margin-bottom: 6rpx;
      }
    }
  }
}
</style>
