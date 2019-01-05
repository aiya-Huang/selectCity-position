import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { initial } from "common/js/config";
const state = {
  selectCity: initial.city,
  selectCommunity: initial.community,
  hasSelCityID: -1
};

// 城市和小区
// const SET_CITY = "SET_CITY";
// // const SET_COMMUNITY = "SET_COMMUNITY";
// // 城市id
// const SET_CITYID = "SET_CITYID";

const mutations = {
  // 城市
  SET_CITY(state, selectCity) {
    state.selectCity = selectCity;
  },
  // 小区
  // [types.SET_COMMUNITY](state, selectCommunity) {
  //   state.selectCommunity = selectCommunity;
  // },
  // 城市id
  SET_CITYID(state, hasSelCityID) {
    state.hasSelCityID = hasSelCityID;
  }
};
const getters = {
  selectCity: state => state.selectCity,
  selectCommunity: state => state.selectCommunity,
  hasSelCityID: state => state.hasSelCityID,
};

export default new Vuex.Store({
  state,
  mutations,
  getters
});
