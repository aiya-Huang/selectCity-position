<template lang="html">
  <!-- @scroll="scroll" -->
  <div class="citylist" :data="city" ref="cityList" :listenScroll="listenScroll" :probetype="probetype">
    <!-- 城市列表 -->
    <div>
      <div v-for="(item,index) in city" class="allCity" ref="listGroup">
        <h2>{{item.initial}}</h2>
        <ul>
          <li v-for="city in item.list" @click="selectItem(city)">
              {{city.name}}
          </li>
        </ul>
      </div>
    </div>
    <!-- 右边字母导航 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart">
      <ul>
        <li class="starCity" @click="goHotCity">热</li>
        <li v-for="(item,index) in city" class="item"  :data-index="index">
          {{item.initial}}
        </li>
      </ul>
    </div>
    <!-- 固定导航 -->
    <div class="list-fixed" v-show="isScroll" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </div>
</template>

<script>
import Scroll from "../../base/m-scroll/scroll.vue";
import { citylist } from "../../common/js/city";
import { getData } from "../../common/js/dom";
const TITLE_HEIGHT = 20;
export default {
  components: {
    Scroll
  },
  data() {
    return {
      city: [],
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      isScroll:false
    };
  },
  created() {       
    this.touch = {};
    this.listenScroll = true;
    this.listenHeight = [];
    this.probetype = 3;
  },
  computed: {
    // 右边导航与表头导航一致
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.city[this.currentIndex]
        ? this.city[this.currentIndex].initial
        : "";
    }
  },
  mounted() {
    this.city = citylist;
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    goHotCity(){
      window.scrollTo(0,80)
    },
    // 监听滚动，导航发生相应改变
    handleScroll(){
      const scroll = document.documentElement.scrollTop || document.body.scrollTop;
      let heightArr = []
      this.$refs.listGroup.map(item=>{
        heightArr.push(item.offsetTop)
      })
      for (let index = 0; index < heightArr.length; index++) {
        if(scroll >= heightArr[index]-5){
          this.currentIndex = index
        }
      }
      if(scroll >= heightArr[0]-5){
        this.isScroll = true
      }else{
        this.isScroll = false
      }
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 获取点击字母索引，并调用滚动事件
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      // console.log(anchorIndex);
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      // this.$refs.singerlist.scrollToElement(this.$refs.listGroup[anchorIndex],0);
      this._scrollTo(anchorIndex);
    },
    // 联动滚动
    _scrollTo(index) {
      if (!index && index != 0) {
        return;
      }
      // 点击右边字母跳到指定位置并高亮
      this.scrollY = -this.listenHeight[index] - 1;
      // 获取指定字母距离顶部的高度
      const scrollHeight = this.$refs.listGroup[index].offsetTop + 8
      // 让页面进行相应的滚动高度
      window.scrollTo(0,scrollHeight)
      // this.$refs.cityList.scrollToElement(this.$refs.listGroup[index], 0);
    },
    // 将每一个字母开头的城市高度存到数组中
    _calculateHeight() {
      this.listenHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listenHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listenHeight.push(height);
        // console.log(this.listenHeight);
      }
    },
    selectItem(item) {
      this.$emit("selectItem", item);
    }
  },
  watch: {
    city() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 滚动到中间部分
      const listenHeight = this.listenHeight;
      // console.log(listenHeight);
      // 滚动到头部以上
      if (newY >= -25) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listenHeight.length - 1; i++) {
        let height1 = listenHeight[i];
        let height2 = listenHeight[i + 1];
        // 如果没在下限，且在height1和height2之间
        if (-newY >= height1 && -newY <= height2) {
          this.currentIndex = i;        
          this.diff = height2 + newY;
          return;
        }
      }
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
    
  }
};
</script>
<style lang="less" scoped>
.citylist {
  // position: fixed;
  // top: 8rem;
  width: 100%;
  bottom: 0;
  overflow: hidden;
  background: #fff;
  // padding-top: .45rem;
  .allCity {
    width: 100%;
    padding: 0 0.3rem;
    ul {
      width: 100%;
      li {
        font-size: 0.25rem;
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #f6f4f4;
        font-family: PingFangSC-Regular;
        color: #666666;
        letter-spacing: 0;
      }
    }
    h2 {
      // background: #f6f4f4;
      // padding-left: 0.34rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border-bottom: 1px solid #f6f4f4;
      font-size: 0.28rem;
      color: #fc5e55;
      font-family: PingFangSC-Regular;
    }
  }
  .list-shortcut {
    position: fixed;
    z-index: 31;
    right: 0.1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.3rem;
    border-radius: 0.1rem;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 0.25rem;
    .starCity{
      color: #fc5e55;
    }
    .item {
      padding: 0.05rem 0;
      font-size: 0.25rem;
    }

  }
  .list-fixed {
    background: #fff;
    z-index: 30;
    position: fixed;
    top: 1rem;
    width: 100%;
    border-bottom: 0.015rem solid #f6f4f4;
    .fixed-title {
      height: 0.6rem;
      line-height: 0.5rem;
      padding-left: 0.34rem;
      color: #fc5e55;
      font-family: PingFangSC-Regular;
      font-size: 0.3rem;
      
    }
  }
}
</style>
