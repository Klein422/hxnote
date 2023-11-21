<template>
  <div id="notebookPage">
    <el-dialog
      title="创建笔记本"
      :visible.sync="DialogVisible.notebookDialogVisible"
      width="20%"
      center>
      <label>笔记本名</label>
      <el-input v-model="createNotebookBody.title"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible.notebookDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNotebookFun();DialogVisible.notebookDialogVisible = false">创 建</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="创建笔记"
      :visible.sync="DialogVisible.noteDialogVisible"
      width="20%"
      center>
      <label>标题</label>
      <el-input v-model="createNoteBody.title"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible.noteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNoteFun();DialogVisible.noteDialogVisible = false">创 建</el-button>
      </span>
    </el-dialog>

    <el-container style="height: 100%">
      <el-aside width="18%" style="border-right: rgb(240,243,245) 1px solid;text-align: left">
        <div class="searchContainer">
          <div class="search">
            <i class="el-icon-search" style="margin-left: 10px"></i>
            <input class="searchInput" placeholder="搜索笔记本">
          </div>
        </div>
        <el-dropdown trigger="click" style="margin: 20px 0 0 20px" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-circle-plus" style="cursor: pointer"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="notebookDialogVisible">添加笔记本</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="width: 100%;" v-for="notebook in notebookList" @click="currentNotebook.id = notebook.notebookId;getNoteList(notebook.notebookId)">
          <notebooks :notebook="notebook"></notebooks>
        </div>
      </el-aside>
      <el-aside v-if="currentNotebook.id" width="15%" style="border-right: rgb(240,243,245) 1px solid;text-align: left">
        <div class="searchContainer">
          <div class="search">
            <i class="el-icon-search" style="margin-left: 10px"></i>
            <input class="searchInput"  v-model="computedSearchNoteInput" placeholder="搜索笔记">
          </div>
        </div>
        <el-dropdown trigger="click" style="margin: 20px 0 0 20px" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-circle-plus" style="cursor: pointer"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="noteDialogVisible">添加笔记</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="width: 100%;" v-for="note in noteList" @click="currentNote = note">
          <note :note="note" ></note>
        </div>
      </el-aside>
      <el-container >
        <el-main v-if="this.currentNote.noteId">
          <el-header >
            <div class="header">
            <span style="position: absolute;left: 0;font-size: 20px">
              {{this.currentNote.title}}
            </span>
              <span style="position: absolute;right: 30px">
              <el-button @click="updateNoteFun">保存</el-button>
            </span>
            </div>
          </el-header>
          <el-main style="padding: 0;margin-top: 1px" >
            <editor :content.sync="currentNote.content">

            </editor>
          </el-main>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {createNotebook, getNotebooks} from "../../api/notebookApi";
  import Notebooks from "../../components/Notebooks/Notebooks";
  import note from "../note/note";
  import {createNote, getNotes, searchNote, updateNote} from "../../api/noteApi";
  import editor from "../editor/editor";
  export default {
    name: "",
    data() {
      return {
        notebookList: {},
        noteList: {},
        DialogVisible:{
          notebookDialogVisible:false,
          noteDialogVisible:false,
        },
        createNotebookBody:{
          title:""
        },
        createNoteBody:{
          title:"",
          content:""
        },
        currentNotebook:{
          id:0
        },
        currentNote:{

        },
        updateNoteBody:{
          title:"",
          content: ""
        },
        searchKey:{
          note:""
        }
      }
    },
    components: {
      Notebooks,
      note,
      editor
    },
    computed:{
      computedSearchNoteInput: {
        get() {
          return this.searchKey.note;
        },
        set(newValue) {
          this.searchKey.note=newValue
          if(newValue===''){
            this.getNoteList(this.currentNotebook.id)
          }
          else{
            this.searchNoteFun()
          }
        }
      }
    },
    methods: {
      getNotebooksList() {
        getNotebooks().then((res) => {
          this.notebookList = res.data
        });
      },
      getNoteList(id) {
        getNotes(id).then((res) => {
          this.noteList = res.data
        })
      },
      handleCommand(command){
        this.DialogVisible[command] =true;
      },
      createNotebookFun(){
        createNotebook(this.createNotebookBody).then((res)=>{
          if(res.status===200){
            this.getNotebooksList()
            this.$message({
              message:"创建成功",
              type:"success"
            })
          }
          else{
            this.$message({
              message:"创建失败",
              type:"error"
            })
          }
        })
      },
      createNoteFun(){
        createNote({
          notebookId:this.currentNotebook.id,
          title:this.createNoteBody.title,
          content:this.createNoteBody.content
        }).then((res)=>{
          if(res.status===200){
            this.getNoteList(this.currentNotebook.id)
            this.$message({
              message:"创建成功",
              type:"success"
            })
          }
          else{
            this.$message({
              message:"创建失败",
              type:"error"
            })
          }
        })
      },
      updateNoteFun(){
        updateNote(this.currentNote.noteId,{
          title:this.currentNote.title,
          content:this.currentNote.content.toString(),
          notebookId:this.currentNote.notebookId
        }).then((res)=>{
          if(res.status===200){
            this.$message({
              message:"保存成功",
              type:"success"
            })
            this.$router.go(0);
          }
          else{
            this.$message({
              message:"保存失败",
              type:"error"
            })
          }

        })
      },
      searchNoteFun(){
        searchNote(this.searchKey.note,this.currentNotebook.id).then((res)=>{
          if(res.status===200){
            this.noteList = res.data
          }
          else{

          }
        })
      }
    },
    mounted() {
      this.getNotebooksList();
    }
  }
</script>

<style scoped>
  #notebookPage {
    width: 100vw;
    height: 100vh;
    margin: 0;
  }

  #notebookPage .searchContainer {
    width: 60%;
    /*top: 20px;*/
    height: 35px;
    position: relative;
    margin: auto;
    padding: 20px;
    border-bottom: rgb(240, 243, 245) 1px solid;
  }

  #notebookPage .search {
    height: 100%;
    width: 100%;
    border-radius: 30px;
    border: none;
    background-color: rgb(244, 246, 247);
  }

  #notebookPage .searchInput {
    height: 90%;
    width: 50%;
    outline: none;
    border: none;
    background-color: rgb(244, 246, 247);
  }

  #notebookPage .searchContainer:focus-within .search {
    background-color: white;
    border: rgb(91, 137, 254) 1px solid;
  }

  #notebookPage .searchInput:focus {
    background-color: white;
  }

  #notebookPage .header{
    padding: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: rgb(240,243,245) 1px solid;
  }
</style>
