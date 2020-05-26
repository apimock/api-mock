import ApiCategory from '@/api/category'
import { CateKeyAll } from '@/utils/enum'

const mock = {
  namespaced: true,
  state: {
    projectId: '',
    categoryId: '',
    mockId: '',
    categoryTree: []
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
    }
  }
}

export default mock
