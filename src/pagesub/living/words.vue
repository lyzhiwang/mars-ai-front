<template>
  <view class="container-box" @click="show = false">
    <view class="header_box">
      <view class="tab_box">
        <u-subsection
          style="border-radius: 100rpx; height: 90rpx"
          :list="tab_list"
          :current="current"
          mode="button"
          activeColor="#2281FE"
          inactiveColor="#ffffff"
          bgColor="#699bff"
          fontSize="16px"
          pieceColor="#6379f7"
          @change="sectionChange"
        ></u-subsection>
      </view>
      <view v-if="current == 0" class="box_tip">
        <image
          src="/static/images/living/words/text_tips.png"
          class="text_tips"
        ></image>
        <view class="box_tip_right">
          <view class="right_tip"> 违禁词/关键词自动修改 </view>
          <view class="right_tips">
            AI回答涉及的违禁词或关键词将自动替换为您指定的替代词。
          </view>
        </view>
      </view>
      <view v-else class="box_tip">
        <image
          src="/static/images/living/words/text_tips.png"
          class="text_tips"
        ></image>
        <view class="box_tip_right">
          <view class="right_tip"> 违禁词/关键词固定回复</view>
          <view class="right_tips">
            如果用户的问题中包含违禁词或关键词将会按照您指定的话术回答。
          </view>
        </view>
      </view>
    </view>

    <view class="content_box">
      <view v-if="words_list && words_list.length > 0" class="list_box">
        <scroll-view
          scroll-y
          :style="{ height: scrollHeight + 'px' }"
          @scrolltolower="loadMore"
        >
          <view class="list_box_content">
            <view
              v-for="(item, index) in words_list"
              :key="index"
              class="content_item"
              @click="changeItem(item, index)"
            >
              <view class="content_item_one" >
                <view class="words"> 违禁词：{{ item.original_keyword }} </view>
                <view class="trash_icon" @click.stop="deleteItem(item, index)">
                  <u-icon
                    name="trash"
                    style="margin: 0 auto"
                    color="#ffffff"
                    size="18"
                  ></u-icon>
                </view>
              </view>
              <view class="content_item_two">{{ item.replace_keyword }}</view>
            </view>

            <view v-if="words_list.length > 9" class="loading_style">
              <u-loadmore :status="listStatus" />
            </view>

            <view class="reserve_a_seat"></view>
          </view>
        </scroll-view>
      </view>

      <view v-else class="none_bg_box">
        <image
          src="/static/images/living/words/none_bg.png"
          class="none_bg"
        ></image>
        <view class="none_text">暂无数据</view>
      </view>
    </view>

    <view class="btn_style">
      <u-button
        style="width: 650rpx"
        class="custom_style"
        type="primary"
        color="#2281FE"
        shape="circle"
        @click="isShowCustomer = true"
      >
        添加违禁词
      </u-button>
    </view>

    <u-popup
      :show="isShowCustomer"
      :round="6"
      mode="center"
      customStyle="width:80%"
      @close="closeService"
    >
      <view class="customer_service_box">
        <view class="box_title"> 添加违禁词/关键词以及替代词 </view>
        <view class="input_item">
          <u--input
            placeholder="请输入违禁词/关键词"
            v-model="form.original_keyword"
            maxlength="20"
            clearable
          ></u--input>
        </view>
        <view class="input_item">
          <u--input
            placeholder="请输入替代词"
            v-model="form.replace_keyword"
            maxlength="20"
            clearable
          ></u--input>
        </view>

        <view class="tip_title"> 作用： </view>
        <view v-if="current == 0" class="tip_text">
          AI回答涉及的违禁词或关键词将自动替换为您指定的替代词。
        </view>
        <view v-else class="tip_text">
          如果用户的问题中包含违禁词或关键词将会按照您指定的话术回答。
        </view>
        <view class="btn_box">
          <u-button
            class="btn_cancel"
            @click="isShowCustomer = false"
          >
            取消
          </u-button>
          <u-button
            class="btn_confirm"
            type="primary"
            color="#2281FE"
            @click="confirm"
          >
            确认
          </u-button>
        </view>
      </view>
    </u-popup>

    <!--  -->
    <!-- <view class=""></view> -->
  </view>
</template>

<script setup>
import { onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { 
  sjKeywordStore,
  sjKeywordUpdate,
  sjKeywordShow,
  sjKeywordDestroy,
  sjKeywordIndex 
} from '@/api';
import { value } from 'lodash-es';
const tab_list = ref([{ name: '违禁词自动修改' }, { name: '违禁词固定回复' }]);
const current = ref(0); // 切换索引

const words_list = ref([
  // {
  //   id: 1,
  //   original_keyword: '添加剂',
  //   replace_keyword: '质保三年',
  // },
  // {
  //   id: 2,
  //   original_keyword: '库存不足',
  //   replace_keyword: '咱们所有的套餐，数量有限，先到先得',
  // },
]);


const listStatus = ref('loadmore'); // 列表加载状态
const isShowCustomer = ref(false); // 是否显示添加/编辑弹窗

const isUpdate = ref(false); // 是否是编辑
const UpdateId = ref(-1); // 待编辑id

const scrollHeight = ref(0); // scroll-view 的高度

const form = ref({
  original_keyword: '', // 违禁词
  replace_keyword: '', // 替代词
  type:'' // 1自动修改 2固定回复
});
const pagination = ref({
  page: 1,
  size: 10,
});
const meta = ref({
  current_page: 1,
  last_page: 1,
  total: 100,
});

onShow(() => {
  initPagination();
  getList()
  uni.startPullDownRefresh();
  calculateScrollHeight();
});

onPullDownRefresh(() => {
  initPagination();
  getList()
  setTimeout(function () {
    uni.stopPullDownRefresh();
  }, 1000);
});

// 初始化
function initPagination() {
  pagination.value.page = 1;
  pagination.value.size = 10;
  words_list.value = []
  form.value = { original_keyword: '', replace_keyword: '', type:'' };
}

// 确认
function confirm() {
  if (form.value.original_keyword === '' || form.value.original_keyword.length <= 1) {
    uni.showToast({
      icon: 'none',
      title: '请填写违禁词/关键词！！！',
    });
    return;
  }
  if (form.value.replace_keyword === '' || form.value.replace_keyword.length <= 1) {
    uni.showToast({
      icon: 'none',
      title: '请输入替代词！！！',
    });
    return;
  }
  const params = {
    original_keyword: form.value.original_keyword,
    replace_keyword: form.value.replace_keyword,
    type: current.value === 0 ? 1 : 2 
  };
  if(isUpdate.value === false){
    sjKeywordStore(params).then((res) => {
      if (res.code === 0) {
        uni.showToast({
          icon: 'success',
          title: '添加成功！',
        });
        initPagination();
        getList();
        isShowCustomer.value = false;
      } else {
        uni.showToast({
          icon: 'none',
          title: res.message,
        });
      }
    });
  } else {
    const paramsTwo = {
      original_keyword: form.value.original_keyword,
      replace_keyword: form.value.replace_keyword,
      id: UpdateId.value,
      type: current.value === 0 ? 1 : 2 
    };
    sjKeywordUpdate(paramsTwo).then((res) => {
      if (res.code === 0) {
        uni.showToast({
          icon: 'none',
          title: '修改成功！',
        });
        initPagination();
        getList();
        isUpdate.value = false;
        isShowCustomer.value = false;
        UpdateId.value = -1
      } else {
        isUpdate.value = false;
        UpdateId.value = -1
        uni.showToast({
          icon: 'none',
          title: res.message,
        });
      }
    }).catch(err=>{
      isUpdate.value = false;
      UpdateId.value = -1
      uni.showToast({
        icon: 'none',
        title: res.message,
      });
    })
  }
}

// 删除
function deleteItem(item, index) {
  uni.showModal({
    title: '提示',
    content: '确认删除违禁词：' + item.original_keyword + ' 吗？',
    success: function (res) {
      if (res.confirm) {
        sjKeywordDestroy(item).then((res) => {
          if (res.code === 0) {
            uni.showToast({
              icon: 'none',
              title: '删除成功！',
            });
            initPagination();
            getList();
          } else {
            uni.showToast({
              icon: 'none',
              title: res.message,
            });
          }
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}

// 编辑
function changeItem(item, index) {
  form.value.original_keyword = item.original_keyword
  form.value.replace_keyword = item.replace_keyword
  isUpdate.value = true
  UpdateId.value = item.id
  isShowCustomer.value = true
}

// 切换
const sectionChange = (index) => {
  if (current.value === index) {
    //
  } else {
    current.value = index;
    initPagination();
    getList()
  } 
};

// 关闭弹窗
function closeService() {
  // isShowCustomer.value = false;
}

// 计算 scroll-view 的高度
function calculateScrollHeight() {
  const systemInfo = uni.getSystemInfoSync();
  // this.scrollHeight = systemInfo.windowHeight - 50; // 50 是顶部导航栏的高度
  scrollHeight.value = systemInfo.windowHeight - 200;
}

// 触底加载更多
function loadMore() {
  // console.log('触底加载更多');
  // console.log(words_list.value.length);
  // console.log(listStatus.value);
  if(listStatus.value === 'loading') return
  if(words_list.value.length > 9){
    // console.log('1111111111111111111111111');
    if (words_list.value.length < meta.value.total || pagination.value.page < meta.value.last_page) {
      listStatus.value = 'loading';
      getList()
      // console.log('2222222222222222222222222222222');
    } else {
      // console.log('3333333333333333333333333333333');
      listStatus.value = 'nomore';
    }
  } else {
    // console.log('44444444444444444444444444');
    listStatus.value = 'nomore';
  }
}

// 列表
function getList() {
  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
    type: current.value === 0 ? 1 : 2 
  };       
  sjKeywordIndex(params)
    .then((res) => {
      if (res && res.data) {
        const { list, total } = res.data;
        meta.value = res.meta;
        words_list.value = words_list.value.concat(list);
        if (words_list.value.length < total) {
          pagination.value.page = pagination.value.page + 1;
          listStatus.value = 'nomore';
        } else {
          listStatus.value = 'loadmore';
        }
        uni.stopPullDownRefresh();
      }
    })
    .catch((err) => {
      uni.stopPullDownRefresh();
    });
}
</script>

<style lang="scss" scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  overflow: auto;
  position: relative;
  .header_box {
    position: relative;
    width: 100%;
    height: 400rpx;
    background: linear-gradient(180deg, #3477ff 0%, #3477ff 50%, #ffffff 100%);
    padding-top: 140rpx;
    .tab_box {
      width: 94%;
      margin: 0 auto;
      // margin-top: 240rpx;
    }
    .box_tip {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 690rpx;
      height: 100rpx;
      margin: 0 auto;
      margin-top: 50rpx;
      background: #ffffff;
      border: 1rpx solid #ffffff;
      border-radius: 10rpx;
      .text_tips {
        width: 66rpx;
        height: 66rpx;
      }
      .box_tip_right {
        margin-left: 20rpx;
        .right_tip {
          font-size: 22rpx;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          letter-spacing: 2.2rpx;
        }
        .right_tips {
          margin-top: 10rpx;
          font-size: 18rpx;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #666666;
          letter-spacing: 0.9rpx;
        }
      }
    }
  }

  .content_box {
    position: relative;
    // border: 1rpx solid red;
    .list_box_content {
      .content_item {
        width: 680rpx;
        margin: 0 auto;
        margin-top: 30rpx;
        border-radius: 10rpx;
        overflow: hidden;
        // border: 1rpx solid #ffffff; 
        .content_item_one {
          padding: 0 30rpx;
          height: 80rpx;
          background: #e9eeff;
          // border-radius: 10px 10px 0px 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .words {
            font-size: 15px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #2281fe;
          }
          .trash_icon {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            background: #5e82fb;
            text-align: center;
            display: flex;
            align-items: center;
            justify-items: center;
          }
        }
        .content_item_two {
          padding: 0 30rpx;
          height: 80rpx;
          line-height: 80rpx;
          background-color: #ffffff;
          font-size: 13px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
        }
      }

      .reserve_a_seat{
        width: 100%;
        height: 200rpx;
      }
    }
    .loading_style {
      text-align: center;
      // color: #e0e0e0;
      display: flex;
      justify-content: center;
    }
    .none_bg_box {
      margin: 0 auto;
      width: 360rpx;
      height: 290rpx;
      margin-top: 300rpx;
      .none_bg {
        width: 360rpx;
        height: 290rpx;
      }
      .none_text {
        font-size: 26rpx;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #666666;
      }
    }
  }

  .btn_style {
    position: fixed;
    bottom: 100rpx;
    left: 0;
    width: 100%;
  }

  //

  .customer_service_box {
    width: 88%;
    height: 620rpx;
    margin: 0 auto;
    overflow: auto;
    .box_title {
      font-size: 34rpx;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: bold;
      text-align: center;
      color: #333333;
      width: 60%;
      margin: 0 auto;
      margin-top: 30rpx;
    }
    .input_item {
      padding: 0;
      margin: 0;
      margin-top: 20rpx;
    }
    .tip_title {
      font-size: 32rpx;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 42rpx;
      margin-top: 30rpx;
    }
    .tip_text {
      font-size: 26rpx;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 42rpx;
    }
    .btn_box {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 30rpx;
      .btn_cancel{
        width: 180rpx; 
        height: 72rpx;
        border-radius: 16rpx;
        font-size: 32rpx;
        color: #4F77FC;
        background-color: #e9eeff;
        letter-spacing: 4rpx;
      }
      .btn_confirm{
        width: 180rpx; 
        height: 72rpx;
        border-radius: 16rpx;
        font-size: 32rpx;
        letter-spacing: 4rpx;
      }
    }
  }
}
</style>

<style lang="scss">
.tab_box {
  :deep(.u-subsection__bar) {
    border-radius: 100rpx !important;
  }
  :deep(.u-subsection__item--0) {
    height: 80rpx;
  }
}
</style>
