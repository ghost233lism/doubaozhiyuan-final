Page({
  data: {
    messageList: [],
    chatId: null,
    canvasWidth: 300,  // 默认宽度
    canvasHeight: 150  // 默认高度
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
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: '来看看我的AI对话',
      path: `/pages/history/detail/detail?id=${this.data.chatId}`
    };
  },

  // 保存为图片
  saveImage() {
    // 检查权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.doSaveImage();
            },
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        } else {
          this.doSaveImage();
        }
      }
    });
  },

  // 执行保存图片
  doSaveImage() {
    wx.showLoading({ title: '正在生成图片...' });

    const query = wx.createSelectorQuery();
    query.select('.message-list').boundingClientRect((rect) => {
      const width = rect.width;
      const height = rect.height;

      // 创建画布上下文
      const ctx = wx.createCanvasContext('shareCanvas');

      // 设置画布大小
      ctx.setFillStyle('#f5f5f5');
      ctx.fillRect(0, 0, width, height);

      // 绘制消息
      let y = 20;
      this.data.messageList.forEach((msg) => {
        const isAI = msg.type === 'ai';
        const padding = 20;
        const maxWidth = width * 0.6;
        const bubbleHeight = 80;

        // 绘制气泡
        ctx.setFillStyle(isAI ? '#ffffff' : '#07c160');
        const bubbleX = isAI ? 60 : width - maxWidth - 60;
        ctx.beginPath();
        ctx.rect(bubbleX, y, maxWidth, bubbleHeight);
        ctx.fill();

        // 绘制文本
        ctx.setFillStyle(isAI ? '#000000' : '#ffffff');
        ctx.setFontSize(14);
        const text = msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : '');
        ctx.fillText(text, bubbleX + padding, y + padding + 20);

        y += bubbleHeight + 20;
      });

      // 绘制完成后保存
      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                },
                fail: (error) => {
                  console.error('保存到相册失败：', error);
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  });
                }
              });
            },
            fail: (error) => {
              console.error('生成图片失败：', error);
              wx.hideLoading();
              wx.showToast({
                title: '生成图片失败',
                icon: 'none'
              });
            }
          });
        }, 200); // 添加延时确保绘制完成
      });
    }).exec();
  },

  // 保存为文档
  savePDF() {
    wx.showLoading({ title: '正在生成文档...' });

    try {
      // 获取当前对话的基本信息
      const chatHistory = wx.getStorageSync('chatHistory') || [];
      const chat = chatHistory.find(item => item.id === this.data.chatId);
      
      // 生成文档内容
      let content = '';
      
      // 添加标题和时间
      content += '高考志愿填报AI助手 - 对话记录\n';
      content += '═══════════════════════════\n\n';
      content += `对话时间：${chat ? chat.time : new Date().toLocaleString()}\n`;
      content += `导出时间：${new Date().toLocaleString()}\n`;
      content += '───────────────────────────\n\n';
      
      // 添加对话内容
      this.data.messageList.forEach((msg, index) => {
        const role = msg.type === 'ai' ? 'AI助手' : '我';
        const time = new Date(chat ? chat.time : Date.now()).toLocaleTimeString();
        
        // 添加发言人
        content += `${role}  ${time}\n`;
        // 添加消息内容（保持原有格式）
        content += `${msg.content}\n`;
        // 添加分隔线（除了最后一条消息）
        if (index < this.data.messageList.length - 1) {
          content += '\n───────────────────────────\n\n';
        }
      });
      
      // 添加页脚
      content += '\n\n═══════════════════════════\n';
      content += '由高考志愿填报AI助手生成\n';
      
      // 生成文件名
      const date = new Date();
      const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
      const timeStr = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
      const fileName = `AI助手对话记录_${dateStr}_${timeStr}.txt`;
      
      // 获取文件管理器
      const fs = wx.getFileSystemManager();
      
      // 写入临时文件
      fs.writeFileSync(
        `${wx.env.USER_DATA_PATH}/${fileName}`,
        content,
        'utf8'
      );

      // 复制到本地文件
      wx.shareFileMessage({
        filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
        success: () => {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        },
        fail: (error) => {
          console.error('保存文件失败：', error);
          wx.hideLoading();
          // 如果分享失败，尝试直接保存
          wx.saveFile({
            tempFilePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
            success: (res) => {
              wx.showToast({
                title: '已保存到本地',
                icon: 'success'
              });
            },
            fail: (err) => {
              console.error('保存到本地失败：', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      });

    } catch (error) {
      console.error('生成文档失败：', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
    }
  }
}); 