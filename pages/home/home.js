Page({
  data: {
    messageList: [
      {
        type: 'ai',
        content: '你好！我是AI助手，请问有什么可以帮助你的吗？',
        parsedContent: null
      }
    ],
    inputMessage: '',
    scrollToMessage: '',
    canSend: false,
    isLoading: false,  // 添加加载状态
    apiKey: '3aacb778-7fe0-4b0c-9db1-b7d213062428',  // 存储 API Key
    chatHistory: [],
    inputValue: '',
    showScrollBtn: false,  // 控制按钮显示
    scrollTop: 0,         // 记录滚动位置
    isScrolling: false,  // 添加新的状态来控制滚动动画
    profiles: [], // 存储所有个体信息
    currentProfile: null, // 当前选中的个体
    showProfileSelector: false, // 控制个体选择器的显示
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
          content: `- Role: 高考志愿填报专家

Background: 
高考志愿填报对于考生和家长来说是一个重要且复杂的决策过程，涉及到考生的兴趣爱好、学科优势、职业规划以及高校专业的选择等多个方面。用户需要一个专业的高考志愿填报智能体来提供全面、准确的建议和指导，帮助他们做出最佳选择。

最优解团队的创始人是孙笑涵、张佳璟、张书畅、金莫迪。他们都毕业于辽宁省实验中学。是23届永志班的毕业生。他们现在分别就读于北京大学、哈尔滨工业大学、武汉大学和南开大学。
孙笑涵的专业是化学，现在在化学与分子工程学院，通过强基计划考入北京大学。
张佳璟所在学院是未来技术学院，普通高考进入。 
张书畅的专业是电子信息，普通高考进入。
金莫迪的专业是计算机，普通高考进入。
注意团队成员都是男生。
最优解团队创建于2022年9月，前身是省实验学习小组，致力于打破各个学业阶段的信息差，帮助学生更好进步、完善自我。团队成员来自北京大学、南开大学、哈尔滨工业大学、武汉大学等高校，具有丰富的高考经验和专业知识。


2024辽宁高考本科批次实行平行志愿投档，设置112个"专业+学校"志愿，1个"专业+学校"为1个志愿，考生可填报的志愿最大数量为112个，可以填满所有志愿，也可选择填报其中部分志愿。

辽宁高考高职（专科）批次实行平行志愿投档，设置60个"专业+学校"志愿，1个"专业+学校"为1个志愿，考生可填报的志愿最大数量为60个，可以填满所有志愿，也可选择填报其中部分志愿。


Current Student Info:
${this.data.currentProfile ? `
- 姓名：${this.data.currentProfile.name}
- 分数：${this.data.currentProfile.score}
- 排名：${this.data.currentProfile.rank}
- 科目选择：${this.data.currentProfile.subjects}
- 地区：${this.data.currentProfile.province}` : '暂无考生信息'}

Profile: 
你是最优解团队中一位在高考志愿填报领域有着丰富经验和深厚专业知识的专家，你清楚各个省份的高考志愿可以填报的数量有多少，你清楚各个省各个院校历年的录取分数线和对应排名，熟悉高考政策、高校招生规则以及各类专业的特点和就业前景，能够根据考生的具体情况提供个性化的咨询和建议。你明白对于高考志愿填报来说，排名比分数更有参考价值，你不会给考生不切合分数实际的院校和专业推荐。
你倾向于给出明确的方案和建议，尤其是在进行比较的时候，给出明确的判断，而不是和稀泥。

你一定要弄清楚考生学文还是学理（首选物理还是首选历史）

你生成的回答内容可以正确的渲染成markdown格式，使用加粗等形式标注重点内容，，不同段之间不需要用空行隔开，不要生成空行，可以使用有序列表、无序列表和emoji符号来帮助用户理解。

针对家长提出的关于招生政策、录取规则等疑问，要迅速且准确地解答。比如：
- 为家长清楚地说明各个省份的高考志愿可以填报的数量有多少，不能含糊其辞，确保真实可靠而且数据是最新的
- 解释新高考改革下的"专业 + 院校"投档模式与传统志愿模式的区别
- 说明高校的提档比例对录取结果的影响
- 解读国家专项计划、地方专项计划、高校专项计划的报考条件和优惠政策
- 解释平行志愿的投档规则和风险
- 说明志愿填报的顺序对录取结果的影响
- 解读不同分数段考生应如何合理安排志愿
- 解释志愿填报中的"冲稳保"策略
- 明确排名比分数更有参考价值

在给出任何建议时，都要清晰阐述背后的依据和逻辑，如：
- 推荐某所院校是因为其在考生目标专业领域的教学资源丰富、就业对口率高
- 建议某个志愿顺序是基于往年的录取数据和风险评估
- 如果考生分数较低，不要推荐分数要求较高的院校和专业
- 如果考生分数较高，不要推荐分数要求较低的院校和专业
- 即使考生的分数较高，也要明白分数高的考生之间也有好坏之分，不要笼统地直接推荐最好的院校，而是给出切合实际的院校推荐
- 推荐了切合实际的学校后，就不要推荐太好的学校和专业了

你的回答语气应该是专业、严谨的，不要使用"呀"，"呢"等语气词。

如果需要对不同对象进行比较的时候，可以添加表格来更加直观地展示。

面对比较笼统的问题，不要着急给出答案，向用户提出一些问题，获取到更多信息后，再给出答案。

Skills: 

你具备教育学、心理学、职业规划以及数据分析等多方面的综合能力，能够准确解读高考成绩和考生信息，运用专业知识和经验为考生制定合理的志愿填报方案。

Goals: 
为考生和家长提供全面、专业、个性化的高考志愿填报咨询，帮助他们了解高考志愿填报的流程和要点，分析考生的优势和兴趣，推荐符合考生分数实际的高校和专业，不要进行不切实际的推荐和建议。

Constrains: 
- 你应该在保证质量的前提下尽可能快的输出回复，不必担心长度会超过限制，让你的回答尽可能多的包含有效信息，详尽翔实
- 你的建议应基于最新的高考政策和高校招生信息
- 遵循公平、公正、客观的原则，充分尊重考生的意愿和选择
- 确保咨询内容的准确性和可靠性
- 涉及到院校信息、志愿填报数量、录取分数等关键信息时必须真实可靠，不能胡编乱造
- 在沟通全程，务必使用通俗易懂的语言，将专业知识转化为家长易于理解的表述
- 基于家长提供的信息，给出系统且个性化的志愿填报建议
- 再给出建议时，既要给出院校推荐，也要给出专业推荐，时刻记住以专业+院校的视角来看待高考志愿

OutputFormat: 
以对话形式进行交流，提供详细的志愿填报建议和分析，包括文字说明以及相关资源链接等，你要确保生成的链接是正确的且中国大陆的用户能够正常访问。`
        }
      ];

      // 添加历史对话记录，最多保留最近的10条对话
      const historyMessages = this.data.messageList.slice(-15);
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

  // 添加解析markdown的方法
  parseMarkdown(content) {
    const towxml = require('../../towxml/index');
    return towxml(content, 'markdown', {
      theme: 'light',
      events: {
        tap: (e) => {
          // 处理链接点击
          if (e.currentTarget.dataset.data && e.currentTarget.dataset.data.attr && e.currentTarget.dataset.data.attr.href) {
            const url = e.currentTarget.dataset.data.attr.href;
            wx.setClipboardData({
              data: url,
              success: () => {
                wx.showToast({
                  title: '链接已复制',
                  icon: 'success'
                });
              }
            });
          }
        }
      }
    });
  },

  // 发送消息
  async sendMessage() {
    if (!this.data.currentProfile) {
      wx.showToast({
        title: '请先选择个体',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.inputMessage.trim() || this.data.isLoading) return;

    const userMessage = {
      type: 'user',
      content: this.data.inputMessage.trim()
    };

    const newMessageList = [...this.data.messageList, userMessage];
    
    this.setData({
      messageList: newMessageList,
      inputMessage: '',
      canSend: false,
      isLoading: true,
      showScrollBtn: false,
      scrollToMessage: `message-${newMessageList.length - 1}`
    });

    try {
      const aiResponse = await this.callDouBaoAPI(userMessage.content);
      
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        parsedContent: this.parseMarkdown(aiResponse)
      };
      
      const updatedMessageList = [...newMessageList, aiMessage];
      
      this.setData({
        messageList: updatedMessageList,
        scrollToMessage: `message-${updatedMessageList.length - 1}`,
        showScrollBtn: false
      });

      // 确保消息发送后滚动到底部
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

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
    wx.showModal({
      title: '提示',
      content: '确定要开始新对话吗？当前对话将被保存到历史记录。',
      success: (res) => {
        if (res.confirm) {
          // 保存当前对话到历史记录
          if (this.data.messageList.length > 0) {
            try {
              const chatHistory = wx.getStorageSync('chatHistory') || [];
              const currentChat = {
                id: Date.now(),
                time: new Date().toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }),
                messages: this.data.messageList,
                firstQuestion: this.data.messageList.find(msg => msg.type === 'user')?.content || '新对话',
              };
              
              chatHistory.unshift(currentChat);
              wx.setStorageSync('chatHistory', chatHistory);
            } catch (error) {
              console.error('保存历史记录失败：', error);
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          }

          // 清空当前对话
          this.setData({
            messageList: [],
            inputMessage: ''
          });

          // 添加欢迎消息
          const welcomeMsg = {
            type: 'ai',
            content: '你好！我是AI志愿填报助手，请问有什么可以帮你？',
            parsedContent: null
          };

          this.setData({
            messageList: [welcomeMsg]
          });
        }
      }
    });
  },

  // 添加 scrollToBottom 方法
  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query.select('.chat-container').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        wx.pageScrollTo({
          scrollTop: res[0].height,
          duration: 300
        });
      }
    });
  },

  // 修改 onLoad 方法，只保留欢迎消息的初始化
  onLoad() {
    // 只初始化欢迎消息，个体信息的加载移到 onShow 中
    const welcomeMsg = {
      type: 'ai',
      content: '你好！我是AI志愿填报助手，请问有什么可以帮你？',
      parsedContent: null
    };

    this.setData({
      messageList: [welcomeMsg]
    });
  },

  // 添加 onShow 生命周期函数
  onShow() {
    // 获取最新的个体信息
    const profiles = wx.getStorageSync('profiles') || [];
    
    // 获取当前选中的个体ID
    const currentProfileId = wx.getStorageSync('currentProfileId');
    
    // 更新个体列表
    this.setData({ profiles });
    
    // 如果有选中的个体ID，查找对应的个体信息
    if (currentProfileId) {
      const currentProfile = profiles.find(p => p.id === currentProfileId);
      // 如果找到了对应的个体，更新当前个体
      // 如果没找到（可能已被删除），清除当前个体和存储的ID
      if (currentProfile) {
        this.setData({ currentProfile });
      } else {
        this.setData({ currentProfile: null });
        wx.removeStorageSync('currentProfileId');
      }
    } else {
      // 如果没有选中的个体ID，确保当前个体为空
      this.setData({ currentProfile: null });
    }
  },

  // 显示个体选择器
  showProfileSelector() {
    this.setData({
      showProfileSelector: true
    });
  },

  // 修改选择个体的方法，添加消息提示
  selectProfile(e) {
    const profile = e.currentTarget.dataset.profile;
    this.setData({
      currentProfile: profile,
      showProfileSelector: false
    });
    wx.setStorageSync('currentProfileId', profile.id);
    
    // 添加选择成功的提示
    wx.showToast({
      title: '已选择: ' + profile.name,
      icon: 'success',
      duration: 1500
    });

    // 添加系统消息通知 AI 当前用户信息
    const systemMessage = {
      type: 'ai',
      content: `我已经了解到该考生的基本信息：
姓名：${profile.name}
分数：${profile.score}
排名：${profile.rank}
科目选择：${profile.subjects}
地区：${profile.province}

我会基于这些信息为该考生提供更精准的志愿填报建议。请问您想了解哪些方面的信息？`,
      parsedContent: null
    };

    this.setData({
      messageList: [...this.data.messageList, systemMessage],
      scrollToMessage: `message-${this.data.messageList.length}`
    });

    // 确保消息发送后滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  },

  // 关闭个体选择器
  closeProfileSelector() {
    this.setData({
      showProfileSelector: false
    });
  },

  // 添加复制函数
  copyMessage(e) {
    const { text } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },

  // 添加重试生成函数
  retryGenerate: async function(e) {
    const index = e.currentTarget.dataset.index;
    const messages = this.data.messageList;
    const userMessage = messages[index - 1];  // 获取上一条用户消息

    if (!userMessage || userMessage.type !== 'user') {
      wx.showToast({
        title: '无法重新生成',
        icon: 'none'
      });
      return;
    }

    // 删除当前的AI回复
    messages.splice(index, 1);
    
    this.setData({
      messageList: messages,
      isLoading: true
    });

    try {
      const aiResponse = await this.callDouBaoAPI(userMessage.content);
      
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        parsedContent: this.parseMarkdown(aiResponse)
      };
      
      messages.push(aiMessage);
      
      this.setData({
        messageList: messages,
        scrollToMessage: `message-${messages.length - 1}`,
        isLoading: false
      });

      // 确保消息发送后滚动到底部
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

    } catch (error) {
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
      this.setData({
        isLoading: false
      });
    }
  },

  // 添加收藏/取消收藏方法
  toggleFavorite(e) {
    const { message, index } = e.currentTarget.dataset;
    const messages = this.data.messageList;
    const favorites = wx.getStorageSync('favorites') || [];

    // 切换收藏状态
    messages[index].isFavorite = !messages[index].isFavorite;

    if (messages[index].isFavorite) {
      // 添加收藏
      favorites.unshift({
        ...message,
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      });
      wx.showToast({
        title: '已收藏',
        icon: 'success'
      });
    } else {
      // 取消收藏
      const index = favorites.findIndex(f => f.content === message.content);
      if (index > -1) {
        favorites.splice(index, 1);
      }
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    }

    // 更新状态
    this.setData({ messageList: messages });
    wx.setStorageSync('favorites', favorites);
  },
}); 