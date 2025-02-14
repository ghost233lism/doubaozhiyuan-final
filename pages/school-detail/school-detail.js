import { getSchoolMajors } from '../../data/majors.js';
import { universities } from '../../data/universities.js';

Page({
  data: {
    school: null,
    loading: true,
    activeTab: 'school',
    selectedMajor: null,
    selectedCategory: null,
    selectedSubcategory: null,
    majorCategories: []
  },

  onLoad(options) {
    const schoolId = options.id;
    console.log('接收到的schoolId:', schoolId); // 添加调试日志
    this.loadSchoolDetail(schoolId);
    this.loadSchoolMajors(schoolId);
  },

  loadSchoolDetail(schoolId) {
    // 将 schoolId 转换为数字类型（如果universities中的id是数字类型）
    const id = parseInt(schoolId);
    console.log('查找的学校id:', id); // 添加调试日志
    
    // 从universities数据中查找对应的学校
    const school = universities.find(uni => uni.id === id);
    console.log('找到的学校数据:', school); // 添加调试日志
    
    if (school) {
      // 扩展学校数据，添加更多展示信息
      const enrichedSchool = {
        ...school,
        // 将tags数组转换为features格式
        features: [
          school.level, // 学校等级作为第一个特色
          ...(school.tags || []) // 将原有tags作为特色
        ],
        // 添加基本信息
        established: school.established || "暂无数据",
        students: school.students || "暂无数据",
        academicians: school.academicians || "暂无数据",
        keyLabs: school.keyLabs || "暂无数据",
        // 如果有专业数据就使用，没有则显示空数组
        majors: school.majors || []
      };

      this.setData({
        school: enrichedSchool,
        loading: false
      });
    } else {
      // 如果找不到学校数据，显示错误提示
      wx.showToast({
        title: '未找到该学校信息',
        icon: 'error'
      });
      
      // 2秒后返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },

  loadSchoolMajors(schoolId) {
    const majorsData = getSchoolMajors(parseInt(schoolId));
    if (majorsData) {
      // 为每个分类添加展开状态标记
      const categories = majorsData.categories.map(category => ({
        ...category,
        isExpanded: false,
        subcategories: category.subcategories.map(sub => ({
          ...sub,
          isExpanded: false
        }))
      }));

      // 默认展开第一个大类
      if (categories.length > 0) {
        categories[0].isExpanded = true;
      }

      this.setData({
        majorCategories: categories
      });
    }
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });

    // 当切换到专业详情标签时，如果没有选中的大类，则默认展开第一个
    if (tab === 'major' && !this.data.majorCategories.some(cat => cat.isExpanded)) {
      const categories = this.data.majorCategories;
      categories[0].isExpanded = true;  // 展开第一个大类
      
      this.setData({
        majorCategories: categories
      });
    }
  },

  // 点击专业大类
  onCategoryTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const categories = this.data.majorCategories;
    
    // 如果点击的是当前已展开的大类，则不做任何操作
    if (categories[index].isExpanded) {
      return;
    }
    
    // 关闭所有大类
    categories.forEach((category, idx) => {
      category.isExpanded = false;
      // 同时关闭所有二级分类
      category.subcategories.forEach(sub => {
        sub.isExpanded = false;
      });
    });
    
    // 只展开点击的大类
    categories[index].isExpanded = true;
    
    this.setData({
      majorCategories: categories,
      selectedMajor: null
    });
  },

  // 点击二级分类
  onSubcategoryTap: function(e) {
    const categoryIndex = e.currentTarget.dataset.categoryIndex;
    const subIndex = e.currentTarget.dataset.subIndex;
    const categories = this.data.majorCategories;
    
    // 切换当前点击的二级分类的展开状态
    categories[categoryIndex].subcategories[subIndex].isExpanded = 
      !categories[categoryIndex].subcategories[subIndex].isExpanded;
    
    this.setData({
      majorCategories: categories,
      selectedMajor: null
    });
  },

  // 点击具体专业
  onMajorTap: function(e) {
    const majorData = e.currentTarget.dataset.major;
    this.setData({
      selectedMajor: majorData
    });
  },

  // 添加返回列表的方法
  onBackToList: function() {
    this.setData({
      selectedMajor: null
    });
  }
}); 