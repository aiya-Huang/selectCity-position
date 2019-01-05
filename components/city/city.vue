<template lang="html">
  <!-- <transition name="slide"> -->
    <div class="xin-widget-citys animated">
      <!-- 搜索框 -->
      <SearchBox class="search" @query="query" :placeholder="placeholder"></SearchBox>
      <!-- 当前定位城市 -->
      <div class="currentCity" v-if="queryCity===''">
        <ul>
          <div class="box">
            <h2>定位城市</h2>
            <i class="line"></i>
          </div>
          <li class="positionCity" :class="{active: positionCity != '正在定位...'}" @click="goBack">{{positionCity}}</li>
        </ul>
      </div>
      <!-- 热门城市 -->
      <div class="hotCity">
        <div class="title">热门城市</div>
        <div class="contentList">
          <ul>
            <li v-for="(item,index) in hotCityList" :key="index" class="hotCityItem" :class="{active: tabChose == index}" @click="selectSearchItem(item,index)">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <!-- 城市选择 -->
      <div :data="searchList" class="searchlist" v-if="queryCity !== ''" :class="{'bg':searchList.length === 0}">
        <div>
          <ul v-if="searchList.length!==0">
            <!--  -->
            <li class="bdb666" v-for="item in searchList" @click="selectSearchItem(item)">{{item.name}}</li>
          </ul>
            <img v-else src="../../common/img/404.png" class="nomatch"/>
        </div>
      </div>
      <CityList class="city" v-if="queryCity===''" @selectItem="selectItem"></CityList>
      <div id="js-container" class="amap_container_custom" style="display:none;">正在加载数据 ...</div>

    </div>

    
  <!-- </transition> -->

  
</template>

<script>
// import Scroll from "../../base/m-scroll/scroll.vue";
import SearchBox from "../../base/m-search-box/search-box.vue";
import { citylist } from "../../common/js/city";
import CityList from "../../base/city-list/city-list.vue";
import { changeTitle } from "../../common/js/dom.js";
import { mapMutations } from "vuex";
import { getURLParams } from "@/utils";
import remoteLoad from "@/utils/remoteLoad.js";
export default {
  components: {
    SearchBox,
    CityList
    // Scroll
  },
  data() {
    return {
      city: [],
      letterList: [],
      searchList: [], //搜索结果
      queryCity: "",
      placeholder: "城市/拼音/首字母",
      tabChose: -1, //默认显示默认城市
      hotCityList: [
        {
          name: "北京",
          zip: "010"
        },
        {
          name: "上海",
          zip: "021"
        },
        {
          name: "深圳",
          zip: "0755"
        },
        {
          name: "广州",
          zip: "020"
        },
        {
          name: "重庆",
          zip: "023"
        },
        {
          name: "哈尔滨",
          zip: "0451"
        },
        {
          name: "沈阳",
          zip: "024"
        },
        {
          name: "成都",
          zip: "028"
        },
        {
          name: "郑州",
          zip: "0371"
        },
        {
          name: "苏州",
          zip: "0512"
        },
        {
          name: "厦门",
          zip: "0592"
        },
        {
          name: "南京",
          zip: "025"
        },
        {
          name: "武汉",
          zip: "027"
        },
        {
          name: "杭州",
          zip: "0571"
        },
        {
          name: "株洲",
          zip: "0731"
        },
        {
          name: "长沙",
          zip: "0731"
        }
      ],
      /************定位相关****************/
      positionCity: "正在定位...",
      AMapUI: null,
      AMap: null,
      MapKey: "	58a4454ac7dc9cb7665b2052fec80589"
    };
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(
        `https://webapi.amap.com/maps?v=1.4.8&key=${this.MapKey}`
      );
      await remoteLoad("https://webapi.amap.com/ui/1.0/main.js");
      this.initMap();
    }
  },
  methods: {
    hide() {
      this.$router.back();
    },
    query(newVal) {
      this._search(newVal);
      this.queryCity = newVal;
    },
    // 搜索
    _search(newVal) {
      var reg = new RegExp(newVal == "" ? "xxyy" : newVal, "ig");
      var _arr = [];
      for (var i in this.letterList) {
        for (var j = 0; j < this.letterList[i].length; j++) {
          if (
            reg.test(this.letterList[i][j]["name"]) ||
            reg.test(this.letterList[i][j]["firstLetter"])
          ) {
            _arr.push(this.letterList[i][j]);
          }
        }
      }

      this.searchList = _arr;
    },
    // 序列化数组
    _formatCityList(arr) {
      var letterArr = {};
      for (var i = 0; i < arr.length; i++) {
        if (!(arr[i]["initial"] in letterArr)) {
          letterArr[arr[i]["initial"]] = [];
          for (var j = 0; j < arr[i].list.length; j++) {
            letterArr[arr[i]["initial"]].push(arr[i].list[j]);
          }
        } else {
          for (var j = 0; j < arr[i].list.length; j++) {
            letterArr[arr[i]["initial"]].push(arr[i].list[j]);
          }
        }
      }
      this.letterList = letterArr;
    },
    // 给数组添首字母
    _addFirstLetter(citylist) {
      for (var i = 0; i < citylist.length; i++) {
        for (var j = 0; j < citylist[i].list.length; j++) {
          citylist[i].list[j]["firstLetter"] = citylist[i].initial;
        }
      }
      this._formatCityList(citylist);
    },
    selectItem(item) {
      this.afterSelect(item);
    },
    selectSearchItem(item, index) {
      this.afterSelect(item);
      this.tabChose = index;
      // console.log(item);
    },
    // 选择之后的操作
    afterSelect(item) {
      this.$router.back();
      this.setCity(item.name);
      this.setCityId(item.zip);
    },
    ...mapMutations({
      setCity: "SET_CITY",
      setCityId: "SET_CITYID"
    }),
    goBack(){
      if(this.positionCity != '正在定位...'){
        this.setCity('');
        this.$router.go(-1)
      }
    },
    /************定位相关****************/
    // 初始化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);

      // AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
      let mapConfig = {
        zoom: 16,
        cityName: this.MapCityName
      };
      if (this.lat && this.lng) {
        mapConfig.center = [this.lng, this.lat];
      }
      let map = new AMap.Map("js-container", mapConfig);

      if (!(this.lat && this.lng)) {
        // 加载定位功能
        this.loadLocation(AMap, map);
      }
    },
    // 获取地理定位
    loadLocation(amap, AMap) {
      const self = this;
      // 创建地图
      AMap.plugin("AMap.Geolocation", function() {
        let gd_geolocation = new amap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 4000, // 超过10秒后停止定位，默认：无穷大
          zoomToAccuracy: false, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition: "LB"
        });
        AMap.addControl(gd_geolocation);
        gd_geolocation.getCurrentPosition();
        if (!amap.event) return; // 解决监听对象undefined报错问题
        // 获取地理坐标
        amap.event.addListener(gd_geolocation, "complete", function(data) {
          // 获取城市定位
          AMap.plugin("AMap.Geocoder", function() {
            // 逆地理编码 实例化Geocoder
            let geocoder = new amap.Geocoder({
              radius: 1000,
              extensions: "all",
              city: ""
            });
            let source = [data.position.lng, data.position.lat];
            // 根据地理坐标获取城市名字
            geocoder.getAddress(source, function(status, result) {
              if (status === "complete" && result.info === "OK") {
                // console.log(result.regeocode.addressComponent.city);
                self.positionCity = result.regeocode.addressComponent.city;
                self.$session.set('positionCity',result.regeocode.addressComponent.city)

              } else {
                console.log("北京");
              }
            });
          });
        });
      });
    }
  },
  mounted() {
    this._addFirstLetter(citylist);
    changeTitle("选择城市");
  }
};
</script>

<style lang="less" scoped>
.xin-widget-citys {
  background: #f5f5f9;
  width: 100%;
  .currentCity {
    margin-top: 1rem;
    padding: 0 0.2rem;
    margin-bottom: 0.3rem;
    ul {
      .box {
        // background-color: pink;
        height: 0.6rem;
        line-height: 0.6rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.1rem;
        h2 {
          font-size: 0.25rem;
          color: #999;
          margin-right: 0.3rem;
          font-family: PingFangSC-Regular;
        }
        .line {
          display: block;
          width: 5.6rem;
          height: 1px;
          background-color: #dbd9d9;
        }
      }

      .positionCity {
        text-align: center;
        width: 20%;
        padding: 0.1rem 0;
        font-size: 0.25rem;
        color: #666666;
        letter-spacing: 0;
        border: 0.025rem solid #e3e3e3;
        border-radius: 8px;
        background-color: #fff;
        &.active {
          color: #fc5e55;
          border: 0.025rem solid #fc5e55;
        }
      }
    }
  }
  // 热门城市选择
  .hotCity {
    padding: 0 0.2rem;
    .title {
      font-size: 0.25rem;
      color: #999;
      font-family: PingFangSC-Regular;
      margin-bottom: 0.22rem;
    }
    .contentList {
      ul {
        display: flex;
        flex-wrap: wrap;
        .hotCityItem {
          width: 20%;
          padding: 0.1rem 0;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 0.25rem;
          color: #666666;
          letter-spacing: 0;
          border: 0.025rem solid #e3e3e3;
          border-radius: 0.1rem;
          background-color: #fff;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
          &.active {
            color: #fc5e55;
            border: 0.025rem solid #fc5e55;
          }
        }
      }
    }
  }
  .searchlist {
    position: fixed;
    top: 1rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    background: #fff;

    ul {
      li {
        font-size: 0.28rem;
        color: #323232;
        width: 6.56rem;
        margin: 0 auto;
        height: 0.82rem;
        line-height: 0.82rem;
        border-bottom: 1px solid #f6f4f4;
        // z-index: 100;
      }
    }
    .nomatch {
      display: block;
      margin: 0 auto;
      margin-top: 2.04rem;
      width: 2.09rem;
      height: 1.95rem;
    }
  }
  .bg {
    background: #f6f4f4;
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
