<template>
  <div class="page-mock">
    <div class="mock-header">
      <a-row type="flex" justify="space-between">
        <a-col class="left">
          <a-icon style="font-size: 20px; margin-right: 5px;" type="book"/>
          <a style="font-size: 20px">moon</a>
          <span style="font-size: 16px; margin: 0 5px">/</span>
          <a-dropdown v-if="project" :trigger="['click']">
            <a class="ant-dropdown-link" @click="onProjectDropdown" style="font-size: 20px">
              {{ project.name }} <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="true">
                <a-input-search v-model="projectSearch" placeholder="input search text" style="width: 200px" @search="onProjectSearch"/>
                <a-button @click="toProjectList" style="margin-left: 10px" icon="form" ></a-button>
              </a-menu-item>
              <a-menu-item :disabled="true">
                项目列表
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item v-for="(item, index) in projectList" :key="index">
                <router-link :to="{name: 'mock', params: { projectId: item.id }}" replace>{{ item.name }}</router-link>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a
            class="min-btn"
            v-if="baseURL"
            v-clipboard:copy="baseURL"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"><a-icon type="link"></a-icon> Base URL</a>
          <a class="min-btn"><a-icon type="import"></a-icon> 导入</a>
          <a class="min-btn"><a-icon type="export"></a-icon> 导出</a>
        </a-col>
        <a-col class="right">
          <a-button class="interaction" icon="control">动态</a-button>
          <a-button class="setting" icon="setting">设置</a-button>
        </a-col>
      </a-row>
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '0', height: '100%' }" :style="{ height: '100%' }">
      <Multipane layout="vertical" class="mock-main" @paneResizeStop="paneResizeStop">
        <div class="mock-left" ref="mockLeft" :style="{width:mockLeftWidth}">
          <div class="content">
            <a-row type="flex" :gutter="5">
              <a-col style="flex: 1">
                <a-input-search placeholder="Search" @change="onSearchCategory" />
              </a-col>
              <a-col>
                <a-button type="primary" @click="createCategory" icon="plus">添加分类</a-button>
              </a-col>
            </a-row>
            <a-tree
              v-if="categoryTree.length"
              class="mock-tree"
              show-icon
              draggable
              :blockNode="true"
              :expanded-keys.sync="expandedKeys"
              :selected-keys.sync="selectedKeys"
              :tree-data="categoryTree">
              <a-icon slot="folder" type="folder" theme="filled" style="color: #808080" />
              <template slot="parent" slot-scope="item">
                <span class="tree-parent-item" @click="toList(item)" @mouseover="mouseover(item)" @mouseout="mouseout(item)">
                  <strong>{{ item.title }}</strong>
                  <a-button-group v-show="item.showRightButton" size="small">
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
        </div>
        <MultipaneResizer></MultipaneResizer>
        <div class="mock-right"><route-view></route-view></div>
      </Multipane>
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
  import { Multipane, MultipaneResizer } from '@/views/components/vue-multipane'
  import { Tree } from 'ant-design-vue'
  import ApiCategory from '@/api/category'
  import { RouteView } from '@/layouts'
  import { MethodTagColor, Method, CateKeyAll } from '@/utils/enum'
  import CreateMockDialog from '@/views/components/CreateMockDialog'
  import Vue from 'vue'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { MOCK_LEFT_WIDTH } from '@/store/mutation-types'
  import ApiProject from '@/api/project'

  const getParentKey = (key, tree) => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }

  export default {
    components: {
      Multipane,
      MultipaneResizer,
      RouteView,
      CreateMockDialog,
      'a-tree': Tree
    },
    data () {
      return {
        projectList: [],
        projectSearch: '',
        mockLeftWidth: Vue.ls.get(MOCK_LEFT_WIDTH) || '300px',
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
        expandedKeys: [this.$route.params.categoryId],
        selectedKeys: this.$route.params.categoryId === 'all' ? [CateKeyAll] : this.$route.params.mockId ? [`${this.$route.params.categoryId}-${this.$route.params.mockId}`] : [this.$route.params.categoryId]
      }
    },
    computed: {
      ...mapState('mock', ['projectId', 'categoryTree', 'categoryTreeFlat', 'project', 'baseURL'])
    },
    methods: {
      ...mapMutations('mock', ['SET_PROJECT_ID', 'SET_CATEGORY_ID', 'SET_MOCK_ID']),
      ...mapActions('mock', ['getCategoryList', 'getProject']),
      paneResizeStop (pane, container, size) {
        Vue.ls.set(MOCK_LEFT_WIDTH, size)
      },
      async getProjectList (params) {
        const { data } = await ApiProject.list(params)
        const { bean, code } = data
        if (code === 200) {
          this.projectList = bean.data
        }
      },
      onProjectDropdown (e) {
        e.preventDefault()
        this.projectSearch = ''
        this.getProjectList()
      },
      onProjectSearch (value) {
        this.getProjectList({ keywords: value })
      },
      toProjectList () {
        this.$router.push({ name: 'project' })
      },
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
      onSearchCategory (e) {
        const value = e.target.value
        const expandedKeys = this.categoryTreeFlat
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, this.categoryTree)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(item) === i)
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
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
      },
      onCopySuccess (e) {
        this.$message.success('You just copied: ' + e.text)
      },
      onCopyError (e) {
        this.$message.error('Failed to copy texts')
      }
    },
    beforeRouteUpdate (to, from, next) {
      const { projectId, categoryId, mockId } = to.params
      this.SET_PROJECT_ID(projectId)
      this.SET_CATEGORY_ID(categoryId)
      this.expandedKeys.splice(0, this.expandedKeys.length)
      this.expandedKeys.push(String(categoryId))
      setTimeout(() => {
        this.selectedKeys = categoryId === 'all' ? [CateKeyAll] : mockId ? [`${categoryId}-${mockId}`] : [categoryId]
      }, 500)
      next()
    },
    created () {
      const { projectId, categoryId } = this.$route.params
      this.SET_PROJECT_ID(projectId)
      this.SET_CATEGORY_ID(categoryId)
      this.getProject()
      this.getCategoryList()
      this.getProjectList()
    }
  }
</script>

<style lang="less">
  .page-mock{
    .mock-header{
      height: 60px;
      line-height: 60px;
      padding: 0 20px;

      .left{
        .min-btn{
          margin-left: 20px;
        }
      }

      .right{
        button{
          margin-left: 20px;
        }
      }
    }

    .mock-main{
      width: 100%;
      display: flex;
      height: 100%;
      overflow: auto;

      .multipane-resizer {
        height: auto;
        &:before{
          display: block;
          content: "";
          width: 3px;
          height: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -20px;
          margin-left: -4.5px;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
      }

      .mock-left{
        min-width: 200px;
        width: 300px;
        max-width: 500px;
        margin-right: 5px;
        background: #f3f3f3;
        border: 1px solid #dadada;
        display: flex;
        .content{
          flex: 1;
          padding: 5px;
          overflow: hidden;
        }
        .mock-tree{
          margin-left: 10px;
          li{
            .ant-tree-node-content-wrapper{
              height: 30px;
              line-height:26px;
            }
            .ant-tree-node-content-wrapper:not(.ant-tree-node-selected):hover{
              background: #e8e8e8;
            }
            position: relative;
          }
          .tree-parent-item{
            position: absolute;
            display: inline-flex;
            width: calc(100% - 58px);
            strong{
              font-weight: normal;
              flex: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .tree-child-item {
            display: flex;
            strong{
              margin-right: 10px;
              font-size: 12px;
            }
            span{
              flex: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            em{
            }
          }
        }
      }

      .mock-right{
        flex: 1;
      }
    }
  }
</style>
