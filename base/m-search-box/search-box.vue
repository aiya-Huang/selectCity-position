<template>
  <div class="search_component"> 
     <div class="search-box">
      <i class="icon-search"></i>
      <input ref="query"  class="input_box" :placeholder="placeholder" v-model="query"/>
      <i class="close" @click="cancelEvent"></i>
      <button class="cancel" @click="cancelEvent">取消</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: "城市/拼音/首字母"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    cancelEvent() {
      this.query = "";
    }
  },
  // 把用户输入的内容以watch的形式暴露出去
  // query变化就去派发一个事件
  created() {
    this.$watch("query", newQuery => {
      this.$emit("query", newQuery);
    });
  }
};
</script>

<style scoped lang="less">
@import "../../common/less/mixin.less";
.search_component {
  position: fixed;
  height: 1rem;
  top:0;
  .search-box {
    width: 100%;
    padding: 0 0.2rem;
    height: 1rem;
    font-size: 0.28rem;
    color: #999;
    border-radius: 0.04rem;
    position: relative;
    background: #fff;
    display: flex;
    align-items: center;
    .icon-search {
      margin-left: 0.18rem;
      height: 0.3rem;
      width: 0.3rem;
      .bgimg("../../common/img/search_small.png");
      display: inline-block;
      position: absolute;
      left: 0.2rem;
      top: 50%;
      transform: translateY(-0.15rem);
    }
    .input_box {
      background:  #F5F5F9;
      font-size: 0.25rem;
      height: 0.6rem;
      display: inline-block;
      border: 0;
      border-radius: 0.1rem;
      color: #999990;
      width: 6.2rem;
      // vertical-align: 0.05rem;
      padding-left: 0.8rem;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
    }
    .cancel {
      height: 0.6rem;
      border: 0;
      font-size: 0.25rem;
      vertical-align: baseline;
      width: 1rem;
      color: #666666;
    }
    .close {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      background-color: #999;
      position: absolute;
      left: 5.7rem;
      position: absolute;
    }
    .close::after,
    .close::before {
      width: 0.35rem;
      position: absolute;
      height: 0.025rem;
      background-color: #fff;
      content: "";
      top: 0.2rem;
      left: 0.02rem;
      transform: rotate(45deg);
    }
    .close::after {
      width: 0.025rem;
      height: 0.35rem;
      left: 0.2rem;
      top: 0.03rem;
    }
  }
}
</style>
