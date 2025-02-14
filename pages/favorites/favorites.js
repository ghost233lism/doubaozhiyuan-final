const app = getApp();

Page({
  data: {
    favorites: []
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({ favorites });
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