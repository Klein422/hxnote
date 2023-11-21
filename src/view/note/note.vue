<template>
  <div id="note">
    <el-dialog
      :title="this.note.title +'的历史记录'"
      :visible.sync="DialogVisible.NoteVersionDialogVisible"
      width="80%"
      top="5vh"
      >
      <div class="noteVersion">
        <el-container>
          <el-aside class="left">
<!--            <ul class="infinite-list" v-infinite-scroll="loadVersion" style="overflow:auto">-->
<!--              <li v-for="i in count" class="infinite-list-item">{{ i }}</li>-->
<!--            </ul>-->
            <div v-for="(version,index) in noteVersion" class="version" @click="chooseVersion(index)">
              <div class="time">
                {{version.createdAt}}
              </div>
              <div class="title">
                {{version.title}}
              </div>
            </div>
          </el-aside>
          <el-main class="right" v-html="this.noteVersion[this.currentVersionIndex]?this.noteVersion[this.currentVersionIndex].content:''">
          </el-main>
          <el-button class="replace" @click="replaceNoteFun">
            恢复
          </el-button>

        </el-container>
      </div>
    </el-dialog>
    <span style="position: absolute;right: 10px;">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" style="text-align: right">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="del">删除笔记</el-dropdown-item>
          <el-dropdown-item command="ver">历史记录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
    <div class="title">
      {{note.title}}
    </div>
    <div class="content" v-html="note.content">

    </div>
    <div class="time">
      {{note.modifiedTime.substring(0,this.note.modifiedTime.lastIndexOf('T'))}}
    </div>
  </div>
</template>

<script>
  import {deleteNote, getNoteVersion, replaceNote} from "../../api/noteApi";

  export default {
    name: "",
    data() {
      return {
        DialogVisible: {
          NoteVersionDialogVisible: false,
        },
        noteVersion:[
          {content:""}
        ],
        currentVersionIndex:0
      }
    },
    props:{
      note:{},
    },
    methods:{
      chooseVersion(index){
        this.currentVersionIndex=index;

      },
      deleteNoteFun(){
        deleteNote(this.note.noteId).then((res)=>{
          if(res.status === 200){
            this.$message({
              message:"删除成功",
              type:"success"
            })
            this.$router.go(0)
          }
          else{
            this.$message({
              message: "删除失败",
              type:"error"
            })
          }
        })
      },
      replaceNoteFun(){
        replaceNote(this.noteVersion[this.currentVersionIndex].versionId).then((res)=>{
          if(res.status===200){
            this.$message({
              message: "恢复成功",
              type:"success"
            })
          }
          else{
            this.$message({
              message: res.data,
              type:"error"
            })
          }
        })
      },
      parseHTML(content) {
        // 使用 DOMParser 解析 HTML 字符串
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(content, 'text/html');

        // 获取解析后的 HTML 内容
        const parsedContent = parsedHTML.documentElement.innerHTML;

        return parsedContent;
      },
      handleCommand(command){
        if(command==="del"){
          this.deleteNoteFun();
        }
        else if(command==="edit"){

        }
        else if("ver"===command){
          this.DialogVisible.NoteVersionDialogVisible = true
          getNoteVersion(this.note.noteId).then((res)=>{
            if(res.status!==200){
              this.$message({
                message:"获取失败",
                type:"error"
              })
              return;
            }
            this.noteVersion = res.data;
          });
        }
      },
      loadVersion(){

      }
    }
  }
</script>

<style scoped>
  #note{
    position: relative;
    font-size: 15px;
    font-family: 等线;
    text-align: left;
    width: 85%;
    /*height: 100px;*/
    background-color: rgba(244,246,247);
    border-radius: 10px;
    padding: 10px;
    margin: auto;
    margin-top: 30px;
    box-shadow: darkgrey 0 0 10px -3px;
    cursor: pointer;

  }
  #note:hover{
    background-color: rgb(220,220,220);
  }

  #note .title{
    font-weight: 700;
  }
  #note .content{
    font-size: 13px;
    line-height: 20px;
    height: 60px;
    margin-top: 10px;
    color: rgb(122,133,153);
    overflow: hidden; /* 隐藏溢出部分 */
    word-break: break-word;
    text-overflow: ellipsis; /* 使用省略号显示溢出部分 */
  }
  #note .time{
    margin-top: 5px;
    color: rgb(169,178,194);
  }

  .noteVersion {
    height: 75vh;
    border-top: darkgrey 1px solid;
    position: relative;
  }

  .noteVersion .left {
    position: relative;
    width: 25%;
    height: 75vh;
    border-right: darkgrey 1px solid;
  }

  .version {
    width: 90%;
    height: 50px;
    border-bottom: darkgrey 1px dashed;
  }
  .version .time{
    width: 100%;
    height: 50%;
  }
  .version .title{
    width: 100%;
    height: 50%;
  }

  .noteVersion .right {
    position: relative;
    right: 0;
    width: 75%;
    height: 75vh;
  }

  .noteVersion .replace {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #5b89fe;
    color: white;
  }
</style>
