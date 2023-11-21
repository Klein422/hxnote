import Vue from 'vue'
import Vuex from "vuex";

Vue.use(Vuex)


const localStoragePlugin = store => {
  // 当 store 初始化时从本地存储中读取状态
  if (sessionStorage.getItem('store')) {
    const storedData = JSON.parse(sessionStorage.getItem('store'));
    const storedTime = storedData ? storedData.__expirationTime : null;

    // 检查缓存是否过期
    if (storedTime && new Date().getTime() < storedTime) {
      store.replaceState(storedData);
    } else {
      // 缓存过期，清除本地存储
      sessionStorage.removeItem('store');
    }
  }

  // 在每次 mutation 之后将状态保存到本地存储中
  store.subscribe((mutation, state) => {
    // 设置缓存过期时间为 1 小时
    const expirationTime = new Date().getTime() + 720 * 60 * 1000;
    const dataToStore = { ...state, __expirationTime: expirationTime };
    sessionStorage.setItem('store', JSON.stringify(dataToStore));
  });
};




export default new Vuex.Store({
  state:{
    user:{
      token: undefined
    }
  },
  getters:{
    getToken(state){
      return state.user.token
    }
  },
  mutations:{
    setToken(state,token){
      state.user.token = token;
    }
  },
  plugins:[localStoragePlugin]
})
