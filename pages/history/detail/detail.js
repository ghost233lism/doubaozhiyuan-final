Page({
  data: {
    messageList: [],
    chatId: null
  },

  onLoad(options) {
    const chatId = parseInt(options.id);
    this.setData({ chatId });
    this.loadChatDetail();
  },

  loadChatDetail() {
    try {
      const chatHistory = wx.getStorageSync('chatHistory') || [];
      const chat = chatHistory.find(item => item.id === this.data.chatId);
      if (chat) {
        this.setData({
          messageList: chat.messages
        });
      } else {
        wx.showToast({
          title: '未找到对话记录',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('读取对话详情失败：', error);
      wx.showToast({
        title: '读取对话详情失败',
        icon: 'none'
      });
    }
  }
}); 