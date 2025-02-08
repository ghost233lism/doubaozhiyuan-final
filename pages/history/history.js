Page({
  data: {
    chatHistory: []
  },

  onShow() {
    this.loadChatHistory();
  },

  loadChatHistory() {
    try {
      const chatHistory = wx.getStorageSync('chatHistory');
      this.setData({
        chatHistory: Array.isArray(chatHistory) ? chatHistory : []
      });
    } catch (error) {
      console.error('读取历史记录失败：', error);
      wx.showToast({
        title: '读取历史记录失败',
        icon: 'none'
      });
      this.setData({ chatHistory: [] });
    }
  },

  // 查看历史对话详情
  viewChatDetail(e) {
    const chatId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/history/detail/detail?id=${chatId}`
    });
  },

  // 删除历史记录
  deleteChatHistory(e) {
    const chatId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            let chatHistory = wx.getStorageSync('chatHistory') || [];
            chatHistory = chatHistory.filter(chat => chat.id !== chatId);
            wx.setStorageSync('chatHistory', chatHistory);
            this.setData({ chatHistory });
          } catch (error) {
            console.error('删除历史记录失败：', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
}); 