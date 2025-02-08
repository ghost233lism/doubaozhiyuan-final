Page({
  // ... 其他代码 ...

  // 创建新对话
  createNewChat() {
    // 清空当前对话内容
    this.setData({
      chatHistory: [],
      inputValue: ''
    });

    // 可以添加一个欢迎消息
    const welcomeMsg = {
      role: 'assistant',
      content: '你好！我是AI志愿填报助手，请问有什么可以帮你？'
    };

    this.setData({
      chatHistory: [welcomeMsg]
    });

    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  }
}); 