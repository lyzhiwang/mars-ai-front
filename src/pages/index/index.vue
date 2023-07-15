<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<!-- <u-button text="渐变色按钮" color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button> -->
		<!-- <TransitionGroup name="list" tag="view" class="container">
			
		</TransitionGroup> -->
		<!-- <movable-area class="DragSort">
			<movable-view direction="vertical">
				<view 
					v-for="item in list"
					:draggable="true" 
					:key="item.id"
					class="item" 
					@dragstart="dragstart($event, i)" 
					@dragenter="dragenter($event, i)" 
					@dragend="dragend" 
					@dragover="dragover"
				>
					{{item.name}}
				</view>
			</movable-view>
		</movable-area> -->
		<view class="container">
		    <view
		      class="item"
		      v-for="(item, index) in list"
		      :key="item.id"
		      :ref="'item-' + index"
		      :data-index="index"
		      :style="{ transform: 'translateY(' + item.translateY + 'px)' }"
		      @touchstart="onTouchStart(index, $event)"
		      @touchmove="onTouchMove($event)"
		      @touchend="onTouchEnd"
		    >
		      {{ item.name }}
		    </view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onReady } from '@dcloudio/uni-app'
const title = ref('hello')
const list = ref([
	{ name: 'a', id: 1, translateY: 0, startY: 0 },
	{ name: 'b', id: 2, translateY: 0, startY: 0 },
	{ name: 'c', id: 3, translateY: 0, startY: 0 },
	{ name: 'd', id: 4, translateY: 0, startY: 0 },
	{ name: 'e', id: 5, translateY: 0, startY: 0 },
])
let dragIndex = 0;// 拖拽的元素索引值
let curIndex = -1;

onLoad(()=>{
	// console.log(111)
})

function dragstart(e) {
	e.stopPropagation();
	dragIndex = index;
	setTimeout(() => {
		e.target.classList.add('moveing');
	}, 0);
}
function dragenter(e) {
	e.preventDefault();
	// 拖拽到原位置时不触发
	if (dragIndex !== index) {
		// 拖拽的元素
		const source = state.list[dragIndex];
		// 删除原位置上的元素
		list.value.splice(dragIndex, 1);
		// 添加到拖拽位置
		list.value.splice(index, 0, source);
		// 更新节点位置
		dragIndex = index;
		// console.log(state.list, 'mmm');
	}
}
function dragover(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
}
function dragend(e) {
	e.target.classList.remove('moveing');
}
function onTouchStart(index, event) {
      list.value.forEach((item) => {
        item.translateY = 0;
      });
      curIndex = index;
      list.value[index].startY = event.touches[0].clientY;
}
function onTouchMove(event) {
      const {
        clientY
      } = event.touches[0];
      const translateY = clientY - list.value[curIndex].startY;
      list.value[curIndex].translateY = translateY;
      if (translateY > 0) {
        for (let i = curIndex + 1, len = list.value.length; i < len; i++) {
          const distance = i - curIndex;
          if (list.value[i].translateY !== distance * 60) {
            list.value[i].translateY = distance * 60;
          }
        }
      } else if (translateY < 0) {
        for (let i = curIndex - 1; i >= 0; i--) {
          const distance = curIndex - i;
          if (list.value[i].translateY !== distance * -60) {
            list.value[i].translateY = distance * -60;
          }
        }
      }
}
function onTouchEnd() {
	const curItem = list.value[curIndex];
	const curY = curItem.translateY;
	const distance = Math.round(curY / 60);
	const targetIndex = curIndex + distance;
	if (targetIndex >= 0 && targetIndex < list.value.length && targetIndex !== curIndex) {
		const moveItem = list.value.splice(curIndex, 1)[0];
		list.value.splice(targetIndex, 0, moveItem);
		// th$forceUpdate();
	} else {
		list.value[curIndex].translateY = 0;
	}
	curIndex = -1;
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.2s ease;
}
.DragSort {
	width: 100%;
	.item {
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		// background-color: #f5f6f8;
		background-color: skyblue;
		text-align: center;
		margin: 30rpx;
		color: #fff;
		font-size: 36rpx;
	}

	.container {
		position: relative;
		padding: 0;
	}

	.moveing {
		opacity: 0;
	}
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  border-bottom: 2rpx solid #eee;
  text-align: center;
  background-color: green;
  font-size: 32rpx;
  user-select: none;
}
</style>
