import { universities } from '../../data/universities.js';

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
    hasMore: true,
    filteredUniversities: []
  },

  onLoad() {
    this.loadInitialData();
  },

  // 加载初始数据
  loadInitialData() {
    this.setData({
      universities: universities,
      filteredUniversities: universities // 初始显示所有大学
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    // 如果输入框为空，恢复原始列表
    if (!e.detail.value.trim()) {
      this.setData({
        filteredUniversities: this.data.universities
      });
    }
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.loadInitialData(); // 重新加载数据
  },

  // 执行搜索
  onSearch() {
    const keyword = this.data.searchKeyword.toLowerCase().trim();
    if (!keyword) {
      this.filterUniversities();
      return;
    }

    let filtered = this.data.universities.filter(uni => 
      uni.name.toLowerCase().includes(keyword) ||
      uni.type.toLowerCase().includes(keyword) ||
      uni.location.toLowerCase().includes(keyword)
    );

    // 应用现有的筛选条件
    if (this.data.selectedRegion) {
      filtered = filtered.filter(uni => uni.location === this.data.selectedRegion);
    }
    if (this.data.selectedType) {
      filtered = filtered.filter(uni => uni.type === this.data.selectedType);
    }
    if (this.data.selectedLevel) {
      filtered = filtered.filter(uni => uni.level.includes(this.data.selectedLevel));
    }

    this.setData({
      filteredUniversities: filtered
    });
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
        { label: '北京市', value: '北京' },
        { label: '天津市', value: '天津' },
        { label: '上海市', value: '上海' },
        { label: '重庆市', value: '重庆' },
        { label: '河北省', value: '河北' },
        { label: '山西省', value: '山西' },
        { label: '辽宁省', value: '辽宁' },
        { label: '吉林省', value: '吉林' },
        { label: '黑龙江省', value: '黑龙江' },
        { label: '江苏省', value: '江苏' },
        { label: '浙江省', value: '浙江' },
        { label: '安徽省', value: '安徽' },
        { label: '福建省', value: '福建' },
        { label: '江西省', value: '江西' },
        { label: '山东省', value: '山东' },
        { label: '河南省', value: '河南' },
        { label: '湖北省', value: '湖北' },
        { label: '湖南省', value: '湖南' },
        { label: '广东省', value: '广东' },
        { label: '海南省', value: '海南' },
        { label: '四川省', value: '四川' },
        { label: '贵州省', value: '贵州' },
        { label: '云南省', value: '云南' },
        { label: '陕西省', value: '陕西' },
        { label: '甘肃省', value: '甘肃' },
        { label: '青海省', value: '青海' },
        { label: '台湾省', value: '台湾' },
        { label: '内蒙古自治区', value: '内蒙古' },
        { label: '广西壮族自治区', value: '广西' },
        { label: '西藏自治区', value: '西藏' },
        { label: '宁夏回族自治区', value: '宁夏' },
        { label: '新疆维吾尔自治区', value: '新疆' },
        { label: '香港特别行政区', value: '香港' },
        { label: '澳门特别行政区', value: '澳门' }
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
        { label: '农林类', value: '农林类' },
        { label: '医药类', value: '医药类' },
        { label: '师范类', value: '师范类' },
        { label: '语言类', value: '语言类' },
        { label: '财经类', value: '财经类' },
        { label: '政法类', value: '政法类' },
        { label: '体育类', value: '体育类' },
        { label: '艺术类', value: '艺术类' },
        { label: '民族类', value: '民族类' },
        { label: '军事类', value: '军事类' }
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
        { label: '双一流', value: '双一流' },
        { label: '双一流学科', value: '双一流学科' }
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
    this.filterUniversities(); // 改为调用筛选函数
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
  },

  // 处理筛选选项的选择
  onFilterSelect(e) {
    const value = e.detail;
    
    // 根据当前筛选标题判断是哪种筛选
    switch(this.data.filterTitle) {
      case '选择地区':
        this.setData({ selectedRegion: value });
        break;
      case '选择类型':
        this.setData({ selectedType: value });
        break;
      case '选择层次':
        this.setData({ selectedLevel: value });
        break;
    }

    this.filterUniversities();
    this.setData({ showFilter: false });
  },

  // 筛选大学列表
  filterUniversities() {
    let filtered = this.data.universities;

    // 地区筛选
    if (this.data.selectedRegion) {
      filtered = filtered.filter(uni => uni.location === this.data.selectedRegion);
    }

    // 类型筛选
    if (this.data.selectedType) {
      filtered = filtered.filter(uni => uni.type === this.data.selectedType);
    }

    // 层次筛选
    if (this.data.selectedLevel) {
      filtered = filtered.filter(uni => uni.level.includes(this.data.selectedLevel));
    }

    this.setData({
      filteredUniversities: filtered
    });
  }
}); 