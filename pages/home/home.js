Page({
  data: {
    messageList: [
      {
        type: 'ai',
        content: '你好！我是AI助手，请问有什么可以帮助你的吗？'
      }
    ],
    inputMessage: '',
    scrollToMessage: '',
    canSend: false,
    isLoading: false,  // 添加加载状态
    apiKey: '3aacb778-7fe0-4b0c-9db1-b7d213062428',  // 存储 API Key
    chatHistory: [],
    inputValue: ''
  },

  // 添加键盘事件处理
  onKeyboardEvent(e) {
    // 检查是否按下 Enter 键
    if (e.detail.keyCode === 13) {
      // 如果同时按下 Shift 键，则插入换行
      if (e.detail.shiftKey) {
        return;
      }
      // 否则发送消息
      e.preventDefault(); // 阻止默认换行
      this.sendMessage();
    }
  },

  // 修改输入框内容改变事件
  onInputChange(e) {
    const inputValue = e.detail.value;
    this.setData({
      inputMessage: inputValue,
      canSend: !!inputValue.trim()
    });
  },

  // 调用豆包API
  async callDouBaoAPI(message) {
    return new Promise((resolve, reject) => {
      // 构建对话历史
      const messages = [
        {
          role: "system",
          content: "你是豆包，是由字节跳动开发的 AI 人工智能助手"
        }
      ];

      // 添加历史对话记录，最多保留最近的10条对话
      const historyMessages = this.data.messageList.slice(-10);
      historyMessages.forEach(msg => {
        messages.push({
          role: msg.type === 'ai' ? 'assistant' : 'user',
          content: msg.content
        });
      });

      // 添加当前用户消息
      messages.push({
        role: 'user',
        content: message
      });

      wx.request({
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        method: 'POST',
        header: {
          'Authorization': 'Bearer ' + this.data.apiKey,
          'Content-Type': 'application/json'
        },
        data: {
          model: "ep-20250201195204-4l74f",
          messages: messages,  // 使用完整的对话历史
          temperature: 0.7,
          max_tokens: 2000
        },
        success: (res) => {
          console.log('Success response:', res);
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices[0]) {
            let content = res.data.choices[0].message.content;
            content = content.split('\n')
              .map(paragraph => paragraph.trim())
              .filter(paragraph => paragraph !== '')
              .join('\n');
            resolve(content);
          } else {
            console.error('Error details:', {
              statusCode: res.statusCode,
              data: res.data,
              header: res.header
            });
            reject(new Error(`请求失败 (${res.statusCode})`));
          }
        },
        fail: (err) => {
          console.error('Request failed:', err);
          reject(err);
        }
      });
    });
  },

  // 发送消息
  async sendMessage() {
    if (!this.data.inputMessage.trim() || this.data.isLoading) return;

    const userMessage = {
      type: 'user',
      content: this.data.inputMessage.trim()
    };

    // 添加用户消息
    const newMessageList = [...this.data.messageList, userMessage];
    
    this.setData({
      messageList: newMessageList,
      inputMessage: '',
      canSend: false,
      isLoading: true,  // 设置加载状态
      scrollToMessage: `message-${newMessageList.length - 1}`
    });

    try {
      // 调用豆包API获取回复
      const aiResponse = await this.callDouBaoAPI(userMessage.content);
      
      const aiMessage = {
        type: 'ai',
        content: aiResponse
      };
      
      const updatedMessageList = [...newMessageList, aiMessage];
      
      this.setData({
        messageList: updatedMessageList,
        scrollToMessage: `message-${updatedMessageList.length - 1}`
      });
    } catch (error) {
      wx.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({
        isLoading: false
      });
    }
  },

  // 创建新对话
  createNewChat() {
    // 清空当前对话内容
    this.setData({
      chatHistory: [],
      inputValue: ''
    });

    // 添加欢迎消息
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