const majorAll = require('../../data/major_all.js')
const { majorData, allMajors } = majorAll

Page({
  data: {
    major: null,
    loading: true
  },

  onLoad(options) {
    const id = options.id
    this.loadMajorDetail(id)
  },

  loadMajorDetail(id) {
    // 从 allMajors 中查找对应的专业
    const majorBasic = allMajors.find(m => m.id === id)
    
    if (!majorBasic) {
      wx.showToast({
        title: '未找到专业信息',
        icon: 'none'
      })
      return
    }

    // 查找专业所属的一级学科和二级学科
    let categoryId, subcategoryId, majorDetail
    for (const [cId, subcategories] of Object.entries(majorData)) {
      for (const sub of subcategories) {
        const major = sub.majors.find(m => m.id === id)
        if (major) {
          categoryId = cId
          subcategoryId = sub.id
          majorDetail = major
          break
        }
      }
      if (categoryId) break
    }

    // 构建完整的专业信息
    const major = {
      id: id,
      name: majorDetail.name,
      code: `${categoryId}${subcategoryId.slice(-2)}${id.slice(-2)}`,
      category: this.getCategoryName(categoryId),
      subcategory: majorBasic.category,
      degree: this.getDegree(categoryId),
      length: '4年',
      description: majorDetail.description,
      courses: majorDetail.courses,
      careers: majorDetail.careers,
      stats: majorDetail.stats
    }

    setTimeout(() => {
      this.setData({
        major,
        loading: false
      })
    }, 500)
  },

  // 获取一级学科名称
  getCategoryName(categoryId) {
    const categoryNames = {
      '1': '哲学',
      '2': '经济学',
      '3': '法学',
      '4': '教育学',
      '5': '文学',
      '6': '历史学',
      '7': '理学',
      '8': '工学',
      '9': '农学',
      '10': '医学',
      '11': '管理学',
      '12': '军事学'
    }
    return categoryNames[categoryId] || '未知'
  },

  // 获取学位类型
  getDegree(categoryId) {
    const degreeMap = {
      '1': '哲学学士',
      '2': '经济学学士',
      '3': '法学学士',
      '4': '教育学学士',
      '5': '文学学士',
      '6': '历史学学士',
      '7': '理学学士',
      '8': '工学学士',
      '9': '农学学士',
      '10': '医学学士',
      '11': '管理学学士',
      '12': '军事学学士'
    }
    return degreeMap[categoryId] || '学士'
  },

  // 获取专业描述
  getDescription(majorName) {
    return `${majorName}是一门重要的学科，培养具备扎实的专业知识和实践能力的高级专门人才。毕业生能够在相关领域从事研究、开发、管理等工作。`
  },

  // 获取主要课程
  getCourses(category) {
    const commonCourses = ['高等数学', '大学英语', '计算机基础']
    const specificCourses = {
      '哲学类': ['哲学概论', '逻辑学', '伦理学'],
      '经济学类': ['微观经济学', '宏观经济学', '统计学'],
      '计算机类': ['数据结构', '操作系统', '计算机网络'],
      // ... 可以添加更多专业的课程
    }
    return [...commonCourses, ...(specificCourses[category] || [])]
  },

  // 获取就业方向
  getCareers(category) {
    const commonCareers = ['教师', '研究人员']
    const specificCareers = {
      '哲学类': ['出版工作者', '文化工作者'],
      '经济学类': ['经济分析师', '金融从业者'],
      '计算机类': ['软件工程师', '系统架构师', '数据分析师'],
      // ... 可以添加更多专业的就业方向
    }
    return [...commonCareers, ...(specificCareers[category] || [])]
  },

  goToSchool(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/school-detail/school-detail?id=${id}`
    })
  }
}) 