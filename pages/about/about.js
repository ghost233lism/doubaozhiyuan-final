Page({
  data: {
    // 可以添加一些动态数据
  },

  // 复制邮箱
  copyEmail() {
    wx.setClipboardData({
      data: 'support@example.com',
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        });
      }
    });
  }
}); 