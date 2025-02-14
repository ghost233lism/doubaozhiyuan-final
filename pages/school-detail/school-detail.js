import { universities } from '../../data/universities.js';

Page({
  data: {
    school: null,
    loading: true,
    activeTab: 'school',
    selectedMajor: null,
    selectedCategory: null,
    selectedSubcategory: null,
    majorCategories: [
      {
        name: "工学",
        isExpanded: false,
        subcategories: [
          {
            name: "计算机类",
            isExpanded: false,
            majors: [
              {
                name: "计算机科学与技术",
                code: "080901",
                introduction: "计算机科学与技术是研究计算机系统结构、软件理论与技术、计算机应用技术等领域的一门学科。本专业培养具备计算机硬件、软件与应用系统的设计、开发、应用和管理等方面的知识和能力的高级专门人才。",
                courses: [
                  "计算机组成原理",
                  "数据结构与算法",
                  "操作系统",
                  "计算机网络",
                  "数据库系统",
                  "软件工程",
                  "人工智能导论"
                ],
                career: "毕业生主要面向IT行业、互联网企业、科研院所等单位，从事软件开发、系统架构、算法研究、技术管理等工作。就业方向包括：软件工程师、系统架构师、算法工程师、技术主管等。",
                features: [
                  "理论基础扎实",
                  "实践能力强",
                  "就业前景广阔",
                  "薪资待遇优厚"
                ]
              },
              {
                name: "软件工程",
                code: "080902",
                introduction: "软件工程是研究软件开发、维护和管理的学科。本专业培养具备软件开发、测试、维护和项目管理等方面的知识和能力的高级专门人才。",
                courses: [
                  "软件工程导论",
                  "软件需求分析",
                  "软件设计与实现",
                  "软件测试与质量保证",
                  "软件项目管理",
                  "软件工程实践"
                ],
                career: "毕业生主要面向IT行业、互联网企业、科研院所等单位，从事软件开发、系统架构、项目管理等工作。就业方向包括：软件工程师、系统架构师、项目经理等。",
                features: [
                  "理论与实践结合",
                  "创新能力培养",
                  "就业前景广阔",
                  "薪资待遇优厚"
                ]
              },
              {
                name: "人工智能",
                code: "080903",
                introduction: "人工智能是研究如何让计算机系统具有智能行为的学科。本专业培养具备人工智能系统设计、开发和应用等方面的知识和能力的高级专门人才。",
                courses: [
                  "人工智能导论",
                  "机器学习",
                  "深度学习",
                  "自然语言处理",
                  "计算机视觉",
                  "人工智能实践"
                ],
                career: "毕业生主要面向IT行业、互联网企业、科研院所等单位，从事人工智能系统设计、开发和应用等工作。就业方向包括：人工智能工程师、机器学习工程师、自然语言处理工程师等。",
                features: [
                  "理论与实践结合",
                  "创新能力培养",
                  "就业前景广阔",
                  "薪资待遇优厚"
                ]
              },
              {
                name: "网络工程",
                code: "080904",
                introduction: "网络工程是研究计算机网络系统设计、建设、维护和管理的学科。本专业培养具备网络系统设计、建设、维护和应用等方面的知识和能力的高级专门人才。",
                courses: [
                  "网络工程导论",
                  "网络系统设计",
                  "网络设备配置与管理",
                  "网络安全",
                  "网络应用开发",
                  "网络工程实践"
                ],
                career: "毕业生主要面向IT行业、互联网企业、科研院所等单位，从事网络系统设计、建设、维护和应用等工作。就业方向包括：网络工程师、网络架构师、网络安全工程师等。",
                features: [
                  "理论与实践结合",
                  "创新能力培养",
                  "就业前景广阔",
                  "薪资待遇优厚"
                ]
              }
            ]
          },
          {
            name: "电子信息类",
            isExpanded: false,
            majors: [
              {
                name: "电子信息工程",
                code: "080701",
                introduction: "电子信息工程是研究电子技术和信息系统的设计、开发和应用的专业...",
                courses: [
                  "电路分析",
                  "模拟电子技术",
                  "数字电子技术",
                  "信号与系统",
                  "通信原理",
                  "电子系统设计"
                ],
                career: "毕业生可在电子信息产业、通信行业等领域就业...",
                features: [
                  "理论基础扎实",
                  "实践能力强",
                  "就业方向广",
                  "发展前景好"
                ]
              },
              // ... 其他专业
            ]
          }
        ]
      },
      {
        name: "理学",
        subcategories: [
          {
            name: "数学类",
            majors: ["数学与应用数学", "信息与计算科学"]
          },
          {
            name: "物理学类",
            majors: ["物理学", "应用物理学"]
          }
        ]
      },
      {
        name: "经济学",
        subcategories: [
          {
            name: "经济学类",
            majors: ["经济学", "国际经济与贸易"]
          },
          {
            name: "金融学类",
            majors: ["金融学", "保险学", "投资学"]
          }
        ]
      }
    ]
  },

  onLoad(options) {
    const schoolId = options.id;
    console.log('接收到的schoolId:', schoolId); // 添加调试日志
    this.loadSchoolDetail(schoolId);

    // 默认展开第一个大类
    const categories = this.data.majorCategories;
    categories[0].isExpanded = true;
    
    this.setData({
      majorCategories: categories
    });
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