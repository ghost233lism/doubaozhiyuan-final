Page({
  data: {
    currentTab: 'university', // university 或 major
    searchKeyword: '',
    showFilter: false,
    filterTitle: '',
    filterOptions: [],
    selectedRegion: '',
    selectedType: '',
    selectedLevel: '',
    universities: [],
    majors: [],
    page: 1,
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.loadInitialData();
  },

  // 加载初始数据
  loadInitialData() {
    // 这里调用后端接口获取数据
    // 示例数据
    this.setData({
      universities: [
        {
          id: 1,
          name: '清华大学',
          logo: '/images/university/tsinghua.png',
          location: '北京',
          type: '综合类',
          level: '985/211',
          tags: ['世界一流', 'C9联盟']
        },
        // ... 更多数据
      ],
      majors: [
        {
          id: 1,
          name: '计算机科学与技术',
          category: '工学',
          employmentRate: '98.5%',
          degreeType: '本科'
        },
        // ... 更多数据
      ]
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.loadInitialData();
  },

  // 执行搜索
  onSearch() {
    // 实现搜索逻辑
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
      page: 1,
      hasMore: true
    });
    this.loadInitialData();
  },

  // 显示筛选弹窗
  showRegionFilter() {
    this.setData({
      showFilter: true,
      filterTitle: '选择地区',
      filterOptions: [
        { label: '全部地区', value: '' },
        { label: '北京', value: '北京' },
        { label: '上海', value: '上海' },
        // ... 更多选项
      ]
    });
  },

  showTypeFilter() {
    this.setData({
      showFilter: true,
      filterTitle: '选择类型',
      filterOptions: [
        { label: '全部类型', value: '' },
        { label: '综合类', value: '综合类' },
        { label: '理工类', value: '理工类' },
        // ... 更多选项
      ]
    });
  },

  showLevelFilter() {
    this.setData({
      showFilter: true,
      filterTitle: '选择层次',
      filterOptions: [
        { label: '全部层次', value: '' },
        { label: '985工程', value: '985' },
        { label: '211工程', value: '211' },
        // ... 更多选项
      ]
    });
  },

  // 隐藏筛选弹窗
  hideFilter() {
    this.setData({
      showFilter: false
    });
  },

  // 选择筛选选项
  selectFilterOption(e) {
    const value = e.currentTarget.dataset.value;
    const title = this.data.filterTitle;
    
    if (title === '选择地区') {
      this.setData({ selectedRegion: value });
    } else if (title === '选择类型') {
      this.setData({ selectedType: value });
    } else if (title === '选择层次') {
      this.setData({ selectedLevel: value });
    }
    
    this.hideFilter();
    this.loadInitialData(); // 重新加载数据
  },

  // 加载更多
  loadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({
      loading: true,
      page: this.data.page + 1
    });

    // 实现加载更多逻辑
    setTimeout(() => {
      this.setData({
        loading: false,
        // hasMore: false // 如果没有更多数据了
      });
    }, 1000);
  },

  // 跳转到院校详情
  navigateToUniversityDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/university/detail/detail?id=${id}`
    });
  },

  // 跳转到专业详情
  navigateToMajorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/major/detail/detail?id=${id}`
    });
  }
}); 