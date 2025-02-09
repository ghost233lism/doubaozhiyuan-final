Page({
  data: {
    profiles: [], // 存储所有个体信息
    showAddModal: false, // 控制添加个体弹窗
    showProvinceModal: false, // 控制选择省份弹窗
    currentStep: 0, // 当前步骤
    provinces: [
      '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
      '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
      '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
      '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
    ],
    formData: {
      name: '',
      province: '',
      score: '',
      rank: '',
      interests: [],
      skipTest: false
    },
    interestDirections: [
      '理工类', '文史类', '经管类', '医学类', '艺术类', '教育类', 
      '农学类', '法学类', '体育类'
    ],
    interestAreas: ['计算机科学', '人工智能', '商科', '艺术设计', '工程', '医学', '法律', '其他'],
    selectedInterests: {}  // 用于存储选中状态
  },

  onLoad() {
    // 从本地存储加载已有的个体信息
    const profiles = wx.getStorageSync('profiles') || [];
    this.setData({ profiles });
  },

  // 显示添加个体弹窗
  showAddProfile() {
    this.setData({
      showAddModal: true,
      currentStep: 0,
      formData: {
        name: '',
        province: '',
        score: '',
        rank: '',
        interests: [],
        skipTest: false
      }
    });
  },

  // 关闭所有弹窗
  closeModals() {
    this.setData({
      showAddModal: false,
      showProvinceModal: false
    });
  },

  // 处理输入变化
  handleInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 显示省份选择器
  showProvinceSelector() {
    this.setData({
      showProvinceModal: true
    });
  },

  // 选择省份
  selectProvince(e) {
    const province = e.currentTarget.dataset.province;
    this.setData({
      'formData.province': province,
      showProvinceModal: false
    });
  },

  // 处理兴趣方向选择
  handleInterestSelect(e) {
    const interest = e.currentTarget.dataset.interest;
    const interests = this.data.formData.interests;
    const index = interests.indexOf(interest);
    
    if (index === -1) {
      // 最多选择3个方向
      if (interests.length >= 3) {
        wx.showToast({
          title: '最多选择3个方向',
          icon: 'none'
        });
        return;
      }
      interests.push(interest);
    } else {
      interests.splice(index, 1);
    }
    
    this.setData({
      'formData.interests': interests
    });
  },

  // 切换是否跳过测试
  toggleSkipTest() {
    this.setData({
      'formData.skipTest': !this.data.formData.skipTest
    });
  },

  // 下一步
  nextStep() {
    const { currentStep, formData } = this.data;
    
    // 验证当前步骤的数据
    if (!this.validateCurrentStep()) {
      return;
    }

    if (currentStep < 4) {
      this.setData({
        currentStep: currentStep + 1
      });
    } else {
      this.submitProfile();
    }
  },

  // 验证当前步骤的数据
  validateCurrentStep() {
    const { currentStep, formData, selectedInterests } = this.data;
    
    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) {
          wx.showToast({
            title: '请输入姓名',
            icon: 'none'
          });
          return false;
        }
        break;
      case 1:
        if (!formData.province) {
          wx.showToast({
            title: '请选择省份',
            icon: 'none'
          });
          return false;
        }
        break;
      case 2:
        if (!formData.score || !formData.rank) {
          wx.showToast({
            title: '请输入分数和排名',
            icon: 'none'
          });
          return false;
        }
        break;
      case 3:
        const selectedCount = Object.values(selectedInterests).filter(v => v).length;
        if (selectedCount === 0) {
          wx.showToast({
            title: '请至少选择一个兴趣方向',
            icon: 'none'
          });
          return false;
        }
        break;
    }
    return true;
  },

  // 提交个体信息
  submitProfile() {
    const profiles = [...this.data.profiles, {
      ...this.data.formData,
      id: Date.now() // 使用时间戳作为临时ID
    }];
    
    // 保存到本地存储
    wx.setStorageSync('profiles', profiles);
    
    this.setData({
      profiles,
      showAddModal: false
    });

    // 如果不跳过测试，跳转到测试页面
    if (!this.data.formData.skipTest) {
      wx.navigateTo({
        url: '/pages/personality-test/personality-test'
      });
    }

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除个体
  deleteProfile(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const profiles = this.data.profiles.filter(p => p.id !== id);
          this.setData({ profiles });
          wx.setStorageSync('profiles', profiles);
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  toggleInterest(e) {
    const index = e.currentTarget.dataset.index;
    const selectedInterests = this.data.selectedInterests;
    
    // 检查是否已经选择了3个
    const currentSelectedCount = Object.values(selectedInterests).filter(v => v).length;
    if (!selectedInterests[index] && currentSelectedCount >= 3) {
      wx.showToast({
        title: '最多选择3个方向',
        icon: 'none'
      });
      return;
    }
    
    selectedInterests[index] = !selectedInterests[index];
    
    // 更新formData中的interests数组
    const selectedItems = this.data.interestAreas.filter((_, idx) => selectedInterests[idx]);
    
    this.setData({
      selectedInterests,
      'formData.interests': selectedItems
    });
  }
}); 