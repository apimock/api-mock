import ApiCategory from '@/api/category'
import { CateKeyAll, Method, defaultMockForm } from '@/utils/enum'
import ApiMock from '@/api/mock'
import { jsonParse } from '@/utils'

const mock = {
  namespaced: true,
  state: {
    projectId: '',
    categoryId: '',
    mockId: '',
    categoryTree: [],
    detail: null,
    mockForm: null,
    tabActiveKey: 'preview',
    tabPanes: [{ title: '预 览', key: 'preview', icon: 'compass' }],
    showBodyParamsTab: false,
    reqTabActiveKey: 'query'
  },

  mutations: {
    SET_PROJECT_ID (state, projectId) {
      state.projectId = projectId
    },
    SET_CATEGORY_ID (state, categoryId) {
      state.categoryId = categoryId
    },
    SET_MOCK_ID (state, mockId) {
      state.mockId = mockId
    },
    SET_CATEGORY_TREE (state, data) {
      state.categoryTree = data
    },
    SET_DETAIL (state, data) {
      state.detail = data
    },
    SET_MOCK_FORM (state, data) {
      state.mockForm = data
    },
    SET_TAB_ACTIVE_KEY (state, data) {
      state.tabActiveKey = data
    },
    SET_TAB_PANES (state, data) {
      state.tabPanes = data
    },
    SET_SHOW_BODY_PARAMS_TAB (state, data) {
      state.showBodyParamsTab = data
    },
    SET_REQ_TAB_ACTIVE_KEY (state, data) {
      state.reqTabActiveKey = data
    }
  },

  actions: {
    async getCategoryList ({ commit, state }) {
      const { data } = await ApiCategory.list({ project_id: state.projectId })
      const { bean, code } = data
      if (code === 200) {
        bean.forEach((parent, m) => {
          parent.key = `${parent.id}`
          parent.title = parent.name
          parent.slots = { icon: 'folder' }
          parent.scopedSlots = { title: 'parent' }
          parent.showRightButton = false
          // this.expandedKey.push(parent.key)
          parent.children.forEach((child, n) => {
            child.key = `${parent.id}-${child.id}`
            child.title = child.url
            child.showRightButton = false
            child.scopedSlots = { title: 'child' }
            child.parentId = parent.id
          })
        })
        bean.unshift({
          key: CateKeyAll,
          title: '全部分类',
          slots: { icon: 'folder' },
          scopedSlots: { title: 'parent' }
        })
        commit('SET_CATEGORY_TREE', bean)
      }
    },
    async getDetail ({ commit, state }, mockId) {
      const id = mockId || state.mockId
      const { data } = await ApiMock.detail({ id })
      const { code, bean } = data
      if (code === 200) {
        const mockForm = Object.assign(Object.create(null), defaultMockForm, bean)
        mockForm.headers = jsonParse(mockForm.headers) || []
        mockForm.query_params = jsonParse(mockForm.query_params) || []
        mockForm.body_params = jsonParse(mockForm.body_params) || []
        mockForm.method = Method[bean.method]
        commit('SET_MOCK_FORM', mockForm)
        commit('SET_MOCK_ID', id)
        commit('SET_DETAIL', bean)
        if (['post', 'put', 'delete', 'patch'].includes(mockForm.method)) {
          commit('SET_SHOW_BODY_PARAMS_TAB', true)
          commit('SET_REQ_TAB_ACTIVE_KEY', 'body')
        } else {
          commit('SET_SHOW_BODY_PARAMS_TAB', false)
          commit('SET_REQ_TAB_ACTIVE_KEY', 'query')
        }
      } else {
        this.$message.error('加载失败！')
      }
    }
  }
}

export default mock
