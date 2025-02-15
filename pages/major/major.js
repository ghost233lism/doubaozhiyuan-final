const majorAll = require('../../data/major_all.js')
const { majorData, allMajors } = majorAll

Page({
  data: {
    searchKey: '',
    pageAnimation: '',
    currentCategory: '',
    categories: [
      { id: '1', name: '哲学' },
      { id: '2', name: '经济学' },
      { id: '3', name: '法学' },
      { id: '4', name: '教育学' },
      { id: '5', name: '文学' },
      { id: '6', name: '历史学' },
      { id: '7', name: '理学' },
      { id: '8', name: '工学' },
      { id: '9', name: '农学' },
      { id: '10', name: '医学' },
      { id: '11', name: '管理学' },
      { id: '12', name: '军事学' }
    ],
    currentSubcategories: [],
    expandedSubcategory: '',
    allMajors: [], // 存储所有专业的数组
    searchResults: [], // 存储搜索结果
    showSearchResults: false // 控制是否显示搜索结果
  },

  onLoad() {
    // 默认选中第一个分类
    this.selectCategory({ currentTarget: { dataset: { id: '1' } } })
    this.setData({ allMajors })
  },

  onSearchInput(e) {
    const searchKey = e.detail.value.trim()
    this.setData({ searchKey })
    
    if (searchKey) {
      // 执行搜索
      const searchResults = this.data.allMajors.filter(major => 
        major.name.includes(searchKey) || major.category.includes(searchKey)
      )
      this.setData({
        searchResults,
        showSearchResults: true,
        expandedSubcategory: '' // 搜索时收起展开的二级分类
      })
    } else {
      this.setData({
        showSearchResults: false
      })
    }
  },

  clearSearch() {
    this.setData({
      searchKey: '',
      showSearchResults: false
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/major-detail/major-detail?id=${id}`
    })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === 'university') {
      this.setData({
        pageAnimation: 'slide-right'
      })
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/university/university'
        })
      }, 300)
    }
  },

  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ currentCategory: categoryId })
    this.loadSubcategories(categoryId)
  },

  loadSubcategories(categoryId) {
    this.setData({
      currentSubcategories: majorData[categoryId] || [],
      expandedSubcategory: ''
    })
  },

  toggleSubcategory(e) {
    const subcategoryId = e.currentTarget.dataset.id
    this.setData({
      expandedSubcategory: this.data.expandedSubcategory === subcategoryId ? '' : subcategoryId
    })
  }
}) 