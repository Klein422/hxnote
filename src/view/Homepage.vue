<template>
  <div id="Homepage">
    <el-dialog
      :title="sign.login_register"
      :visible.sync="centerDialogVisible"
      width="20%"
      center>
      <div>
        <label>用户名</label>
        <el-input v-model="inputUsername"></el-input>
      </div>
      <div>
        <label>密码</label>
        <el-input v-model="inputPassword"></el-input>
      </div>
      <a @click="register.registerDialogVisible=true;centerDialogVisible = false" style="text-align: center;position:absolute;left: 50%;transform:translate(-50%);margin-top: 10px;cursor: pointer;color: blue">注册</a>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="login();centerDialogVisible = false">登 录</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="sign.login_register"
      :visible.sync="register.registerDialogVisible"
      width="20%"
      center
    >
      <div>
        <label>邮箱</label>
        <el-input v-model="register.input.email" aria-required="true"></el-input>
      </div>
      <div>
        <label>用户名</label>
        <el-input v-model="register.input.username" maxlength="15"></el-input>
      </div>
      <div>
        <label>密码</label>
        <el-input type="password" v-model="register.input.password" maxlength="15"></el-input>
      </div>
      <div>
        <label>验证码</label>
        <div style="display: flex">
          <el-input v-model="register.input.verificationCode" maxlength="6"></el-input>
          <el-button @click="sendCode" style="margin-bottom: 10px;">发送验证码</el-button>
        </div>

        <!-- 这里你可以根据实际情况添加获取验证码的逻辑 -->
      </div>
      <a @click="centerDialogVisible = true;register.registerDialogVisible=false" style="text-align: center;position:absolute;left: 50%;transform:translate(-50%);margin-top: 10px;cursor: pointer;color: blue">注册</a>
      <span slot="footer" class="dialog-footer">
      <el-button @click="register.registerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="registerFun();register.registerDialogVisible = false">注 册</el-button>
    </span>
    </el-dialog>
    <div class="center-box">
      <div class="header">
        <div class="left">HXNOTE</div>
        <div class="right">{{ this.LocalTime }}</div>
      </div>
      <div class="content">
        <div class="top">
          <div id="user">
            <div class="login" v-if="!isLogin" @click="centerDialogVisible = true">
              <p>未登录</p>
            </div>
            <div v-if="isLogin">

            </div>
          </div>
          <div id="notebooks" @click="$router.replace('/notebook')">
            <div class="center">
              <i class="el-icon-notebook-1">笔记本</i>
            </div>
          </div>
          <div id="team">
            <div class="center">
              <i class="el-icon-user">团队</i>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div id="common1">
            <div class="top">

            </div>
            <div class="bottom">

            </div>
          </div>
          <div id="common2">

          </div>
          <div id="common3">

          </div>
        </div>


      </div>
    </div>

  </div>
</template>

<script>
  import store from "../store";
  import {loginByUsername, registerUser, sendVerificationCode} from "../api/userApi";
  import {mapGetters, mapMutations} from "vuex";
  export default {
    name: "",
    data() {
      return {
        LocalTime: "",
        centerDialogVisible: false,
        inputUsername: "",
        inputPassword: "",
        sign:{
          login_register: "登录",

        },
        register:{
          registerDialogVisible:false,
          input:{
            email:"",
            username:"",
            password:"",
            verificationCode:""
          }
        }
      }
    },
    computed: {
      isLogin() {
        return store.getters.getToken !== undefined;
      },

    },
    mounted() {
      let that = this
      setInterval(function () {
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        }
        that.LocalTime = new Date().toLocaleString('zh-cn', options);
      }, 1000)
    },
    methods: {
      login () {
        loginByUsername(this.inputUsername,this.inputPassword).then((res)=>{
          store.commit('setToken', res.data.token);
          this.$message({
            message:res.data.message,
            type:"success"
          });
        });
      },
      registerFun () {
        if(!this.validateEmail(this.register.input.email)){
          this.$message({
            message:"邮箱格式不正确",
            type:"warning"
          })
          return;
        }
        if(this.register.input.username===""){
          this.$message({
            message:"请输入用户名",
            type:"warning"
          })
          return;
        }
        if(this.register.input.password===""){
          this.$message({
            message:"请输入密码",
            type:"warning"
          })
          return;
        }
        if(this.register.input.verificationCode===""){
          this.$message({
            message:"请输入验证码",
            type:"warning"
          })
          return;
        }
        registerUser(this.register.input.email,this.register.input.username,this.register.input.password,this.register.input.verificationCode).then((res)=>{
          if(res.status===200){
            this.$message({
              message:res.data,
              type:"success"
            })
          }
          else{
            this.$message({
              message:"注册失败",
              type:"error"
            })
          }
        });
      },
      sendCode () {
        if(this.validateEmail(this.register.input.email)){
          sendVerificationCode(this.register.input.email).then((res)=>{
            if(res.status === 200){
              this.$message({
                message:res.data,
                type:"success"
              })
            }
            else{
              this.$message({
                message:"发送失败",
                type:"error"
              })
            }
          });
        }
        else{
          this.$message({
            message:"邮箱格式不正确",
            type:"warning"
          })
        }
      },
      validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
    }
  }
</script>

<style scoped>
  label{
    font-size: 20px;
  }
  el-input{
    display: inline-block;
  }
  #Homepage {
    height: 100vh;
    width: 100vw;
    /*background-color: rgb(212, 217, 223);*/
  }

  #Homepage .center-box {
    position: absolute;
    height: 90%;
    width: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*background-color: rgba(0,0,0,0.1);*/
  }

  #Homepage .center-box .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 8%;
    width: 100%;
    /*background-color: rgba(0,0,0,0.1);*/
  }

  #Homepage .center-box .header .left {
    margin-left: 10px;
    width: 50%;
    text-align: left;
    color: rgb(82, 92, 101);
    font-size: 25px;
    font-weight: 700;
  }

  #Homepage .center-box .header .right {
    margin-right: 10px;
    width: 50%;
    text-align: right;
    font-size: 25px;
    color: rgb(82, 92, 101);
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: 700;
  }

  #Homepage .center-box .content {
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    position: absolute;
    text-align: left;
    height: 92%;
    width: 100%;
    /*background-color: rgba(0,0,0,0.1);*/
  }

  #Homepage .center-box .content * {
    transition: all 0.5s;
  }

  #Homepage .center-box .content .top {
    position: absolute;
    display: flex;
    width: 100%;
    height: 55%;
  }

  #Homepage .center-box .content .top #user {
    position: relative;
    width: 35%;
    height: 100%;
    margin-right: 1.25%;
    /*background-color: white;*/
    display: inline-block;
  }

  #Homepage .center-box .content .top #user .login {
    height: 60px;
    width: 150px;
    position: absolute;
    left: 50%;
    top: 50%;
    letter-spacing: 3px;
    font-family: 等线;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: black 1px solid;
    cursor: pointer;
    transition: color, border 0.3s;
  }

  #Homepage .center-box .content .top #user .login:hover {
    color: white;
    border: white 1px solid;
  }

  #Homepage .center-box .content .top #notebooks {
    width: 30%;
    height: 100%;
    margin-left: 1.25%;
    margin-right: 1.25%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-family: 等线;
    box-shadow: darkgrey 0 0 5px 0;
    background-color: #FFCCCC;
    cursor: pointer;
  }

  #Homepage .center-box .content .top #notebooks:hover {
    scale: 1.04;
  }

  #Homepage .center-box .content .top #team {
    width: 30%;
    height: 100%;
    margin-left: 1.25%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-family: 等线;
    box-shadow: darkgrey 0 0 5px 0;
    background-color: #CCCCFF;
    /*display: inline-block;*/
  }

  #Homepage .center-box .content .top #team:hover {
    scale: 1.04;
  }

  #Homepage .center-box .content .bottom {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 40%;
  }

  #Homepage .center-box .content .bottom #common1 {
    position: relative;
    width: 25%;
    height: 100%;
    margin-right: 1.25%;
    display: inline-block;
  }

  #Homepage .center-box .content .bottom #common1 .top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 45%;
    border-radius: 20px;
    box-shadow: darkgrey 0 0 5px 0px;
    background-color: white;
  }

  #Homepage .center-box .content .bottom #common1 .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 45%;
    border-radius: 20px;
    box-shadow: darkgrey 0 0 5px 0px;
    background-color: white;
  }

  #Homepage .center-box .content .bottom #common1 div:hover {
    scale: 1.04;
  }

  #Homepage .center-box .content .bottom #common2 {
    width: 30%;
    height: 100%;
    margin-left: 1.25%;
    margin-right: 1.25%;
    border-radius: 20px;
    box-shadow: darkgrey 0 0 5px 0px;
    background-color: white;
    display: inline-block;
  }

  #Homepage .center-box .content .bottom #common3 {
    width: 40%;
    height: 100%;
    margin-left: 1.25%;
    border-radius: 20px;
    box-shadow: darkgrey 0 0 5px 0px;
    background-color: white;
    display: inline-block;
  }

  #Homepage .center-box .content .bottom #common3:hover {
    scale: 1.04;
  }

</style>
