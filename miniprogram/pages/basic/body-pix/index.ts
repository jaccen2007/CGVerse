// pages/basic/body-pix/index.ts
const app = getApp<IAppOption>();

import * as model from './body-pix/model';

const CANVAS_ID = 'canvas';

Page({

  ctx: null as any,

  /**
   * Page initial data
   */
  data: {
    cameraBlockHeight: app.globalData.systemInfo.screenHeight - app.globalData.menuHeaderHeight,
    predicting: false
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    //
  },

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: async function () {
    setTimeout(() => {
      this.ctx = wx.createCanvasContext(CANVAS_ID);
    }, 500);

    await this.initModel();

    const context = wx.createCameraContext();
    let count = 0;
    const listener = context.onCameraFrame((frame) => {
      count = count + 1;
      if (count === 3) {
        count = 0;
        this.executeClassify(frame);
      }
    })
    listener.start();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    model.dispose();
  },

  initModel: async function () {
    this.showLoadingToast();

    await model.load();

    this.hideLoadingToast();

    if (!model.isReady()) {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none'
      });
    }
  },

  executeClassify: async function (frame: any) {
    if (model.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, async () => {
        const segmentation = await model.detectBodySegmentation(frame, {width: app.globalData.systemInfo.screenWidth, height: this.data.cameraBlockHeight});
        const maskImageData = model.toMaskImageData(segmentation);
        wx.canvasPutImageData({
          canvasId: CANVAS_ID,
          data: maskImageData.data,
          x: 0,
          y: 0,
          width: maskImageData.width,
          height: maskImageData.height,
          complete: () => {
            this.setData({
              predicting: false
            })
          }
        });
      })
    }
  },

  showLoadingToast: function() {
    wx.showLoading({
      title: '拼命加载模型',
    })
  },

  hideLoadingToast: function() {
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'AI_CG - 人像分割'
    }
  }
})