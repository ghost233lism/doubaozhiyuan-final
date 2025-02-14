const app = getApp();

Page({
  data: {
    favorites: []
  },

  onLoad: function() {
    this.loadFavorites();
  },

  loadFavorites: function() {
    const favorites = wx.getStorageSync('favorites') || [];
    // 为每条收藏添加展开状态和截断内容
    const processedFavorites = favorites.map(item => ({
      ...item,
      expanded: false,
      shortContent: this.truncateContent(item.content)
    }));
    this.setData({
      favorites: processedFavorites
    });
  },

  truncateContent: function(content) {
    const maxLength = 100; // 设置最大显示字符数
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  },

  toggleExpand: function(e) {
    const index = e.currentTarget.dataset.index;
    const favorites = this.data.favorites;
    favorites[index].expanded = !favorites[index].expanded;
    this.setData({
      favorites: favorites
    });
  },

  deleteFavorite: function(e) {
    const index = e.currentTarget.dataset.index;
    const favorites = this.data.favorites;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏吗？',
      success: (res) => {
        if (res.confirm) {
          favorites.splice(index, 1);
          this.setData({
            favorites: favorites
          });
          wx.setStorageSync('favorites', favorites);
        }
      }
    });
  },

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

  removeFavorite(e) {
    const { index } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条收藏吗？',
      success: (res) => {
        if (res.confirm) {
          let favorites = this.data.favorites;
          favorites.splice(index, 1);
          this.setData({ favorites });
          wx.setStorageSync('favorites', favorites);
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
}); 