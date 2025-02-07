Page({
  data: {
    userInfo: null,
    hasUserInfo: false
  },

  onLoad() {
    // 检查是否已有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  // 获取用户信息
  getUserProfile() {
    // 推荐使用 wx.getUserProfile 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途
      success: (res) => {
        console.log('获取用户信息成功：', res.userInfo);
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败：', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 导航到我的收藏
  navigateToFavorites() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到历史记录
  navigateToHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到意见反馈
  navigateToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 导航到关于我们
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清理中...',
          });
          
          try {
            // 清除本地数据
            wx.clearStorageSync();
            
            // 重新检查登录状态
            this.setData({
              userInfo: null,
              hasUserInfo: false
            });
            
            wx.hideLoading();
            wx.showToast({
              title: '清除成功',
              icon: 'success',
              duration: 2000
            });
          } catch (error) {
            console.error('清除缓存失败：', error);
            wx.hideLoading();
            wx.showToast({
              title: '清除失败',
              icon: 'error'
            });
          }
        }
      }
    });
  }
}); 