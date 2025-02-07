Page({
  data: {
    feedbackTypes: ['功能建议', '使用问题', '内容相关', '其他'],
    selectedType: null,
    content: '',
    contact: '',
    isSubmitting: false,
    canSubmit: false
  },

  // 选择反馈类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type
    }, () => {
      this.updateSubmitButton();
    });
  },

  // 输入反馈内容
  onContentInput(e) {
    this.setData({
      content: e.detail.value
    }, () => {
      this.updateSubmitButton();
    });
  },

  // 输入联系方式
  onContactInput(e) {
    this.setData({
      contact: e.detail.value
    });
  },

  // 更新提交按钮状态
  updateSubmitButton() {
    const canSubmit = 
      this.data.selectedType !== null && 
      this.data.content.trim() !== '';
    
    this.setData({
      canSubmit
    });
  },

  // 提交反馈
  submitFeedback() {
    if (this.data.isSubmitting) return;
    
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
      return;
    }

    if (this.data.selectedType === null) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      });
      return;
    }

    this.setData({ isSubmitting: true });

    wx.showLoading({
      title: '提交中...',
    });

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};

    // 构建企业微信消息内容
    const message = `
收到新的用户反馈：
反馈类型：${this.data.feedbackTypes[this.data.selectedType]}
反馈内容：${this.data.content.trim()}
联系方式：${this.data.contact.trim() || '未提供'}
用户昵称：${userInfo.nickName || '匿名用户'}
提交时间：${new Date().toLocaleString()}
    `.trim();

    // 发送到企业微信
    wx.request({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4b2567b8-2c31-420e-a0b7-65d6d93a6ed8',
      method: 'POST',
      data: {
        "msgtype": "text",
        "text": {
          "content": message
        }
      },
      success: (res) => {
        console.log('请求成功，返回数据：', res.data);
        if (res.data.errcode === 0) {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.navigateBack();
              }, 2000);
            }
          });
        } else {
          console.error('提交失败，错误码：', res.data.errcode);
          throw new Error(res.data.errmsg || '提交失败');
        }
      },
      fail: (error) => {
        console.error('请求失败，错误信息：', error);
        wx.hideLoading();
        wx.showToast({
          title: `提交失败：${error.errMsg}`,
          icon: 'none',
          duration: 3000
        });
      },
      complete: () => {
        this.setData({ isSubmitting: false });
      }
    });
  }
}); 