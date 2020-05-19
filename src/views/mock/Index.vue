<template>
  <div class="page-mock">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="mock-main">
        <div class="mock-left">
          <a-button type="primary" @click="createCategory">添加分类</a-button>
          <a-tree
            class="mock-tree"
            show-icon
            draggable
            :blockNode="true"
            default-expand-all
            :tree-data="treeData">
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
      <CreateMockDialog :projectId="projectId" :categoryId="categoryId" v-model="showCreateMockDialog"></CreateMockDialog>
    </a-card>
  </div>
</template>

<script>
  import { Tree } from 'ant-design-vue'
  import ApiCategory from '@/api/category'
  import { RouteView } from '@/layouts'
  import { MethodTagColor, Method } from '@/utils/enum'
  import CreateMockDialog from '@/views/components/CreateMockDialog'
  const KeyAll = '0-0-0-0-0'
  export default {
    components: {
      RouteView,
      CreateMockDialog,
      'a-tree': Tree
    },
    data () {
      return {
        treeData: [],
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
        projectId: this.$route.params.projectId
      }
    },
    methods: {
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      async getCateList () {
        const { data } = await ApiCategory.list({ project_id: this.projectId })
        const { bean, code } = data
        if (code === 200) {
          bean.forEach((parent, m) => {
            parent.key = `${m}-${parent.id}`
            parent.title = parent.name
            parent.slots = { icon: 'folder' }
            parent.scopedSlots = { title: 'parent' }
            parent.showRightButton = false
            parent.children.forEach((child, n) => {
              child.key = `${m}-${parent.id}-${n}-${child.id}`
              child.title = child.url
              child.showRightButton = false
              child.scopedSlots = { title: 'child' }
            })
          })
          bean.unshift({
            key: KeyAll,
            title: '全部分类',
            slots: { icon: 'folder' },
            scopedSlots: { title: 'parent' }
          })
          this.treeData = bean
        }
      },
      mouseover (e) {
        if (e.eventKey !== KeyAll) {
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
              this.getCateList()
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
        if (item.eventKey === KeyAll) {
          categoryId = 'all'
        }
        this.$router.push({ name: 'mockList', params: { categoryId } })
      },
      toDetail (item) {
        this.$router.push({ name: 'mockDetail', params: { mockId: item.id } })
      }
    },
    created () {
      this.getCateList()
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
        border-right: 1px solid #e8e8e8;
        width: 300px;
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
      }
    }
  }
</style>
