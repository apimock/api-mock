import { jsonParse } from '@/utils'
import { KeyAll, KeyStar, Method, defaultMockForm, tabPaneObj } from '@/utils/enum'
import { getMockValue } from '~/common/mock'
import ApiProject from '@/api/project'
import ApiCategory from '@/api/category'
import ApiMock from '@/api/mock'

const treeFlat = (data, dataList) => {
  dataList = dataList || []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: node.title })
    if (node.children) {
      treeFlat(node.children, dataList)
    }
  }
  return dataList
}

const mock = {
  namespaced: true,
  state: {
    projectId: '',
    categoryId: '',
    mockId: '',
    project: null,
    baseURL: '',
    categoryList: [],
    categoryTree: [],
    categoryTreeFlat: [],
    detail: null,
    detailNotFound: false,
    mockValue: '',
    mockForm: null,
    tabActiveKey: 'preview',
    tabPanes: [tabPaneObj.preview],
    showBodyParamsTab: false
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
    SET_PROJECT (state, data) {
      state.project = data
    },
    SET_BASE_URL (state, data) {
      state.baseURL = data
    },
    SET_CATEGORY_LIST (state, data) {
      state.categoryList = data
    },
    SET_CATEGORY_TREE (state, data) {
      state.categoryTree = data
    },
    SET_CATEGORY_TREE_FLAT (state, data) {
      state.categoryTreeFlat = data
    },
    SET_DETAIL (state, data) {
      state.detail = data
    },
    SET_DETAIL_NOT_FOUND (state, data) {
      state.detailNotFound = data
    },
    SET_MOCK_VALUE (state, data) {
      state.mockValue = data
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
    }
  },

  actions: {
    async getProject ({ commit, state }, projectId) {
      const id = projectId || state.projectId
      const { data } = await ApiProject.getById({ id })
      const { code, bean } = data
      if (code === 200) {
        const { id, base_url: baseUrl } = bean
        const baseURL = `${location.origin}/mock/${id}${baseUrl}`
        const mockForm = { ...state.mockForm }
        mockForm.notify = !!bean.notify
        commit('SET_BASE_URL', baseURL)
        commit('SET_PROJECT', bean)
        commit('SET_MOCK_FORM', mockForm)
      } else {
        this._vm.$message.error('加载失败！')
      }
    },
    async getCategoryList ({ commit, state }, keywords) {
      const { data } = await ApiCategory.list({ project_id: state.projectId, keywords })
      const { bean, code } = data
      if (code === 200) {
        let treeData = []
        treeData = bean.slice()
        treeData.forEach((parent, m) => {
          parent.key = `${parent.id}`
          parent.title = parent.name
          parent.slots = { icon: 'folder' }
          parent.scopedSlots = { title: 'parent' }
          parent.showRightButton = false
          parent.children.forEach((child, n) => {
            child.key = `${parent.id}-${child.id}`
            child.title = child.url
            child.showRightButton = false
            child.scopedSlots = { title: 'child' }
            child.parentId = parent.id
          })
        })
        treeData.unshift({
          key: KeyAll,
          title: '全部接口',
          slots: { icon: 'appstore' },
          scopedSlots: { title: 'parent' }
        })
        treeData.unshift({
          key: KeyStar,
          title: '我的收藏',
          slots: { icon: 'star' },
          scopedSlots: { title: 'parent' }
        })
        const flat = treeFlat(treeData)
        commit('SET_CATEGORY_LIST', bean)
        commit('SET_CATEGORY_TREE', treeData)
        commit('SET_CATEGORY_TREE_FLAT', flat)
      }
    },
    async getDetail ({ commit, state }, mockId) {
      const id = mockId || state.mockId
      const { data } = await ApiMock.detail({ id })
      const { code, bean } = data
      if (code === 200) {
        const mockValue = getMockValue(bean.body)
        const mockForm = Object.assign(Object.create(null), defaultMockForm, bean)
        mockForm.headers = jsonParse(mockForm.headers) || []
        mockForm.query_params = jsonParse(mockForm.query_params) || []
        mockForm.body_params = jsonParse(mockForm.body_params) || []
        mockForm.method = Method[bean.method]
        mockForm.enable_script = !!bean.enable_script
        mockForm.notify = !!state.project.notify
        commit('SET_DETAIL_NOT_FOUND', false)
        commit('SET_MOCK_VALUE', mockValue)
        commit('SET_MOCK_FORM', mockForm)
        commit('SET_MOCK_ID', id)
        bean.headers = mockForm.headers
        bean.query_params = mockForm.query_params
        bean.body_params = mockForm.body_params
        commit('SET_DETAIL', bean)
        if (['post', 'put', 'delete', 'patch'].includes(mockForm.method)) {
          commit('SET_SHOW_BODY_PARAMS_TAB', true)
        } else {
          commit('SET_SHOW_BODY_PARAMS_TAB', false)
        }
      } else {
        commit('SET_DETAIL_NOT_FOUND', true)
        this._vm.$message.error('加载失败！')
      }
    },
    getMockValue ({ commit, state }) {
      const mockValue = getMockValue(state.detail.body)
      commit('SET_MOCK_VALUE', mockValue)
    },
    switchTab ({ commit, state }, key) {
      const data = [...state.tabPanes]
      if (key === 'advance') {
        if (!data.some((ele) => ele.key === key)) {
          data.push(tabPaneObj.advance)
        }
      } else {
        data.splice(0, 1)
        data.unshift(tabPaneObj[key])
      }
      commit('SET_TAB_PANES', data)
      commit('SET_TAB_ACTIVE_KEY', key)
    },
    resetTab ({ commit, state }) {
      if (!state.detail) return

      const data = [tabPaneObj.preview]
      if (state.detail.expect_count > 0 || state.detail.script) {
        data.push(tabPaneObj.advance)
      }
      commit('SET_TAB_PANES', data)
      commit('SET_TAB_ACTIVE_KEY', 'preview')
    }
  }
}

export default mock
