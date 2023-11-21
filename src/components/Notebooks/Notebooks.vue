<template>
  <div id="notebook">
    <el-dialog
      title="修改信息"
      :visible.sync="DialogVisible.editDialogVisible"
      width="20%"
      center>
      <label>笔记本名</label>
      <el-input v-model="editNotebookBody.title"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible.editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNotebookFun();DialogVisible.editDialogVisible = false">修 改</el-button>
      </span>
    </el-dialog>

    <span style="position: absolute;right: 10px;">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" style="text-align: right">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="del">删除笔记本</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
    <span style="font-size: 18px;font-weight: 700">{{notebook.title}}</span>
   <br><br>
    创建时间:{{notebook.createdTime}}<br><br>
    上次修改时间:{{notebook.modifiedTime}}

  </div>
</template>

<script>
  import {delNotebook, editNotebook} from "../../api/notebookApi";

  export default {
    name: "",
    data (){
      return {
        DialogVisible:{
          editDialogVisible:false,
        },
        editNotebookBody:{
          title:""
        }
      }
    },
    props:{
      notebook:{

      }
    },
    methods:{
      deleteNotebook(){
        delNotebook(this.notebook.notebookId).then((res)=>{
          if(res.status === 200){
            this.$message({
              message:res.data,
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
      editNotebookFun(){
        editNotebook(this.notebook.notebookId,this.editNotebookBody).then((res)=>{
          if(res.status===200){
            this.$message({
              message:"修改成功",
              type:"success"
            })
            this.$router.go(0)
          }
          else{
            this.$message({
              message:res.data,
              type:"error"
            })
          }
        });
      },
      handleCommand(command) {
        if("del"===command){
          this.deleteNotebook();
        }
        else if("edit"===command){
          this.DialogVisible.editDialogVisible = true;
        }
      }
    },
    mounted() {
      this.editNotebookBody.title = this.notebook.title;
    }
  }
</script>

<style scoped>
  #notebook {
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
  }
  #notebook:hover{
    cursor: pointer;
    background-color: rgb(220, 220, 220);
  }
</style>
