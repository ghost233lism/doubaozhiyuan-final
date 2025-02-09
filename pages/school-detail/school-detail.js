import { universities } from '../../data/universities.js';

Page({
  data: {
    school: null,
    loading: true
  },

  onLoad(options) {
    const schoolId = options.id;
    console.log('接收到的schoolId:', schoolId); // 添加调试日志
    this.loadSchoolDetail(schoolId);
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
  }
}); 