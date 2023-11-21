<template>
  <div style="height: 100%">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height:600px; overflow-y: hidden;"
      v-model="computedContent"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import config from '../../../config/index'
  export default Vue.extend({
    components: { Editor, Toolbar },
    data() {
      const that = this
      return {
        editor: null,
        html: '<p>hello</p>',
        toolbarConfig: { },
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            uploadImage:{
              server: '/api/notePicture/upload',
              // 单个文件的最大体积限制，默认为 2M
              maxFileSize: 5 * 1024 * 1024, // 1M

              // 最多可上传几个文件，默认为 100
              maxNumberOfFiles: 20,

              // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
              allowedFileTypes: ['image/*'],

              // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
              meta: {
                // token: 'xxx',
                // otherKey: 'yyy'
              },

              // 将 meta 拼接到 url 参数中，默认 false
              metaWithUrl: false,

              // 自定义增加 http  header
              headers: {
                // Accept: 'text/x-json',
                token: this.$store.state.user.token
              },

              // 跨域是否传递 cookie ，默认为 false
              withCredentials: true,

              // 超时时间，默认为 10 秒
              timeout: 10 * 1000, // 5 秒
              onSuccess(file, res) {
                that.$message({
                  message:"上传成功",
                  type:"success"
                })
              },
              // 单个文件上传失败
              onFailed(file, res) {
                that.$message({
                  message:res.message,
                  type:"error"
                })
              },
              onError(file, err, res) {               // JS 语法
                that.$message({
                  message:"网络错误",
                  type:"error"
                })
              },
            }
          }
        },
        mode: 'default', // or 'simple'
      }
    },
    props:
      ['content']
    ,
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
    },
    watch:{
      content(newV,oldV){
        // console.log(this.editor.getHtml())

        // this.content = this.content;
      }
    },
    computed:{
      computedContent: {
        get() {
          return this.content;
        },
        set(newValue) {
          this.$emit('update:content', this.editor&&this.editor.getHtml());
        }
      }
    },
    mounted() {
      // 模拟 ajax 请求，异步渲染编辑器
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
    }
  })
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
