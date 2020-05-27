<template>
  <div class="page-mock">
    <a-card :bordered="false" :bodyStyle="{ padding: '0', height: '100%' }" :style="{ height: '100%' }">
      <div class="mock-main">
        <div class="mock-left" ref="mockLeft" :style="{width: mockLeftWidth + 'px'}">
          <div class="content">
            <a-button type="primary" @click="createCategory">添加分类</a-button>
            <a-tree
              v-if="categoryTree.length"
              class="mock-tree"
              show-icon
              draggable
              :blockNode="true"
              :expanded-keys.sync="expandedKey"
              :tree-data="categoryTree">
              <a-icon slot="folder" type="folder" />
              <template slot="parent" slot-scope="item">
                <span class="tree-parent-item" @click="toList(item)" @mouseover="mouseover(item)" @mouseout="mouseout(item)">
                  <strong>{{ item.title }}</strong>
                  <a-button-group v-show="item.showRightButton" size="small" style="float:right">
                    <a-tooltip title="添加接口">
                      <a-button @click="addApi(item.dataRef.id)" icon="plus"></a-button>
                    </a-tooltip>
                    <a-tooltip title="修改分类">
                      <a-button @click="copyApi(item.dataRef.id)" icon="edit"></a-button>
                    </a-tooltip>
                    <a-tooltip title="删除分类">
                      <a-button @click="deleteApi(item.dataRef.id)" icon="delete"></a-button>
                    </a-tooltip>
                  </a-button-group>
                </span>
              </template>
              <template slot="child" slot-scope="item">
                <span class="tree-child-item" @click="toDetail(item)" @mouseover="mouseover(item)" @mouseout="mouseout(item)">
                  <strong :style="{color: methodTagColor(item.dataRef.method)}">{{ methodToString(item.dataRef.method) }}</strong>
                  <span>{{ item.dataRef.url }}</span>
                  <em v-show="item.showRightButton">
                    <a-button-group size="small">
                      <a-tooltip title="复制接口">
                        <a-button @click="copyApi(item.dataRef.id)" icon="copy"></a-button>
                      </a-tooltip>
                      <a-tooltip title="删除接口">
                        <a-button @click="deleteApi(item.dataRef.id)" icon="delete"></a-button>
                      </a-tooltip>
                    </a-button-group>
                  </em>
                </span>
              </template>
            </a-tree>
          </div>
          <div class="resize-hand"></div>
        </div>
        <div class="mock-right"><route-view></route-view></div>
      </div>
      <a-modal
        title="添加分类"
        :width="400"
        :visible="modalCreateCategory.show"
        @ok="createCategoryOk"
        @cancel="createCategoryCancel"
      >
        <a-form-model
          :model="formCategory"
          ref="formCategory"
          :label-col="modalCreateCategory.labelCol"
          :wrapper-col="modalCreateCategory.wrapperCol"
          :rules="modalCreateCategory.rules"
        >
          <a-form-model-item label="分类名" prop="name">
            <a-input v-model="formCategory.name" placeholder="please input name"/>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="description">
            <a-input v-model="formCategory.description" placeholder="please input description" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <CreateMockDialog :categoryId="categoryId" v-model="showCreateMockDialog"></CreateMockDialog>
    </a-card>
  </div>
</template>

<script>
  import { Tree } from 'ant-design-vue'
  import ApiCategory from '@/api/category'
  import { RouteView } from '@/layouts'
  import { MethodTagColor, Method, CateKeyAll } from '@/utils/enum'
  import CreateMockDialog from '@/views/components/CreateMockDialog'
  import { DragResizeBorder } from '@/utils/dragResizeBorder'
  import Vue from 'vue'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { MOCK_LEFT_WIDTH } from '@/store/mutation-types'
  export default {
    components: {
      RouteView,
      CreateMockDialog,
      'a-tree': Tree
    },
    data () {
      return {
        mockLeftWidth: Vue.ls.get(MOCK_LEFT_WIDTH) || 300,
        showCreateMockDialog: false,
        modalCreateCategory: {
          show: false,
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
          rules: {
            name: [
              { required: true, message: 'Please input name', trigger: 'blur' }
            ]
          }
        },
        formCategory: {
          name: '',
          description: ''
        },
        categoryId: '',
        expandedKey: [this.$route.params.categoryId]
      }
    },
    computed: {
      ...mapState('mock', ['projectId', 'categoryTree'])
    },
    methods: {
      ...mapMutations('mock', ['SET_PROJECT_ID', 'SET_CATEGORY_ID', 'SET_MOCK_ID']),
      ...mapActions('mock', ['getCategoryList']),
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      mouseover (e) {
        if (e.eventKey !== CateKeyAll) {
          e.dataRef.showRightButton = true
        }
      },
      mouseout (e) {
        e.dataRef.showRightButton = false
      },
      createCategory () {
        this.modalCreateCategory.show = true
      },
      createCategoryOk () {
        this.$refs.formCategory.validate(async valid => {
            if (!valid) {
              console.log('error submit!!')
              return false
            }
            const { data } = await ApiCategory.create({ ...this.formCategory, project_id: this.projectId })
            const { code, message } = data
            if (code === 200) {
              this.getCategoryList()
              this.$message.success('创建成功')
            } else {
              this.$message.error(message)
            }
            this.modalCreateCategory.show = false
          }
        )
      },
      createCategoryCancel () {
        this.modalCreateCategory.show = false
      },
      addApi (id) {
        this.categoryId = id
        this.showCreateMockDialog = true
      },
      copyApi (id) {
        console.info(id)
      },
      deleteApi (id) {
        console.info(id)
      },
      toList (item) {
        let categoryId = item.id
        if (item.eventKey === CateKeyAll) {
          categoryId = 'all'
        }
        this.$router.push({ name: 'mockList', params: { categoryId } })
      },
      toDetail (item) {
        let categoryId = item.parentId
        if (item.eventKey === CateKeyAll) {
          categoryId = 'all'
        }
        this.SET_MOCK_ID(item.id)
        this.$router.push({ name: 'mockDetail', params: { categoryId, mockId: item.id } })
      }
    },
    beforeRouteUpdate (to, from, next) {
      const { projectId, categoryId } = to.params
      this.SET_PROJECT_ID(projectId)
      this.SET_CATEGORY_ID(categoryId)
      this.expandedKey.splice(0, this.expandedKey.length)
      this.expandedKey.push(String(categoryId))
      next()
    },
    created () {
      const { projectId, categoryId } = this.$route.params
      this.SET_PROJECT_ID(projectId)
      this.SET_CATEGORY_ID(categoryId)
      this.getCategoryList()
    },
    mounted () {
      // eslint-disable-next-line no-new
      new DragResizeBorder('.mock-left', {
        change (width) {
          if (!isNaN(width)) {
            Vue.ls.set(MOCK_LEFT_WIDTH, width)
          }
        }
      })
    }
  }
</script>

<style lang="less">
  .page-mock{
    .mock-main{
      width: 100%;
      display: flex;
      height: 100%;
      overflow: auto;
      .mock-left{
        background: #fff;
        border-right: 1px solid #ddd;
        box-shadow: -1px 0 5px 2px #d2d2d2;
        display: flex;
        .content{
          flex: 1;
          overflow: hidden;
        }
        .resize-hand{
          width: 5px;
          height: 100%;
        }
        .mock-tree{
          margin-left: 20px;
          li{
            .ant-tree-node-content-wrapper{
              height: 30px;
              line-height:26px
            }
            position: relative;
          }
          .tree-parent-item{
            position: absolute;
            width: 220px;
            strong{
              font-weight: normal;
            }
          }
          .tree-child-item {
            display: flex;
            width: 220px;
            strong{
              margin-right: 10px;
              font-size: 12px;
            }
            span{
              flex: 1;
            }
            em{
            }
          }
        }
      }

      .mock-right{
        flex: 1;
        padding-left: 20px;
      }
    }
  }
</style>
