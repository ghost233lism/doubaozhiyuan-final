Page({
  data: {
    currentQuestion: 0,
    selectedOption: null,
    answers: [],
    questions: [
      {
        text: "在高中的课程中，你最感兴趣的是？",
        options: ["物理和数学", "生物和化学", "美术和音乐", "政治和历史", "语文和外语"]
      },
      {
        text: "在课余时间，你最常做的是？",
        options: ["研究编程或做实验", "参加志愿服务活动", "画画或听音乐", "关注时事新闻", "阅读文学作品"]
      },
      {
        text: "遇到难题时，你通常会？",
        options: ["独立思考寻找方法", "和同学互相帮助", "尝试不同解决方式", "分析原因找规律", "查阅资料总结"]
      },
      {
        text: "在小组活动中，你经常会？",
        options: ["负责技术性工作", "照顾同学的感受", "提供创意想法", "组织和协调大家", "整理和记录内容"]
      },
      {
        text: "你最向往的大学生活是？",
        options: ["做实验搞研究", "帮助他人成长", "参加艺术活动", "参与创业比赛", "投入学术研究"]
      },
      {
        text: "你最喜欢看什么类型的书籍/视频？",
        options: ["科技创新相关", "医疗卫生相关", "艺术设计相关", "商业财经相关", "人文社科相关"]
      },
      {
        text: "你理想的未来工作是？",
        options: ["科技研发工作", "医生或教师", "设计师或艺术家", "企业家或律师", "学者或作家"]
      },
      {
        text: "做作业时，你会特别在意？",
        options: ["解题思路的严谨", "与他人的交流", "作品的创意性", "效率和实用性", "条理和完整性"]
      },
      {
        text: "在选修课程时，你会优先考虑？",
        options: ["理科实验课", "生命科学课", "艺术创作课", "经济金融课", "人文讲座课"]
      },
      {
        text: "参加社团活动时，你更愿意？",
        options: ["加入科技创新社", "参与公益志愿社", "选择艺术兴趣社", "加入辩论演讲社", "参加读书写作社"]
      },
      {
        text: "你更喜欢的课堂形式是？",
        options: ["动手实践操作", "互动讨论交流", "自由发挥创作", "案例分析探讨", "系统理论学习"]
      },
      {
        text: "面对新事物时，你首先会？",
        options: ["研究其原理", "考虑其影响", "欣赏其特点", "分析其价值", "理解其意义"]
      },
      {
        text: "你更愿意花时间在？",
        options: ["解决数理难题", "关心他人需求", "培养艺术修养", "了解商业动态", "探索人文知识"]
      },
      {
        text: "你的朋友经常会？",
        options: ["请教你学习问题", "寻求你的建议", "欣赏你的创意", "和你讨论时事", "分享你的见解"]
      },
      {
        text: "你更向往哪种校园生活？",
        options: ["泡图书馆实验室", "参与社会实践", "沉浸艺术氛围", "组织校园活动", "研究学术课题"]
      }
    ]
  },

  selectOption(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedOption: index
    });

    // 保存答案
    const answers = [...this.data.answers];
    answers[this.data.currentQuestion] = index;
    this.setData({ answers });
  },

  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1,
        selectedOption: this.data.answers[this.data.currentQuestion - 1]
      });
    }
  },

  nextQuestion() {
    if (this.data.selectedOption === null) {
      wx.showToast({
        title: '请选择一个选项',
        icon: 'none'
      });
      return;
    }

    if (this.data.currentQuestion < this.data.questions.length - 1) {
      this.setData({
        currentQuestion: this.data.currentQuestion + 1,
        selectedOption: this.data.answers[this.data.currentQuestion + 1] || null
      });
    } else {
      this.completeTest();
    }
  },

  completeTest() {
    const result = this.analyzeAnswers();
    
    // 保存测试结果
    const pages = getCurrentPages();
    const applicationPage = pages[pages.length - 2];
    if (applicationPage) {
      const profiles = applicationPage.data.profiles;
      const lastProfile = profiles[profiles.length - 1];
      lastProfile.testResult = result;
      
      applicationPage.setData({ profiles });
      wx.setStorageSync('profiles', profiles);
    }

    // 显示结果并返回
    wx.showModal({
      title: '测试完成',
      content: `根据您的测试结果，建议考虑以下专业方向：\n\n${result.join('\n')}`,
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  },

  analyzeAnswers() {
    const answers = this.data.answers;
    const counts = [0, 0, 0, 0, 0];
    
    answers.forEach(answer => {
      counts[answer]++;
    });

    const types = [
      // 理工科技型
      ['计算机科学', '人工智能', '电子信息', '软件工程', '机械工程', '数学与应用数学', '自动化', '物理学'],
      // 医学生命型
      ['临床医学', '口腔医学', '生物工程', '药学', '护理学', '生物科学', '基础医学', '预防医学'],
      // 艺术设计型
      ['视觉传达设计', '数字媒体艺术', '产品设计', '建筑学', '环境设计', '服装设计', '工业设计', '动画'],
      // 经管法政型
      ['工商管理', '金融学', '法学', '国际经济与贸易', '会计学', '市场营销', '财务管理', '公共管理'],
      // 人文教育型
      ['汉语言文学', '教育学', '新闻学', '心理学', '历史学', '英语', '哲学', '社会学']
    ];

    // 找出前两个最高分的倾向
    const sortedIndices = counts.map((count, index) => ({count, index}))
      .sort((a, b) => b.count - a.count);
    
    const results = [];
    // 从得分最高的两个倾向中各选择2-3个专业方向
    sortedIndices.slice(0, 2).forEach(({index}) => {
      const typeOptions = types[index];
      const selectedCount = Math.min(Math.floor(Math.random() * 2) + 2, typeOptions.length);
      const shuffled = typeOptions.sort(() => 0.5 - Math.random());
      results.push(...shuffled.slice(0, selectedCount));
    });

    return [...new Set(results)].slice(0, 5);
  }
}); 