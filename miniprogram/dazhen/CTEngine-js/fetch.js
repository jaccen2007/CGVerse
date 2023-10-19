function fetch(options) {
  return new Promise((resolve, reject) =>{
      wx.request({
        url: options,
        data: options.data,
        method: options.method,
        responseType: "arraybuffer", //此处是请求文件流，必须带入的属性
        success:resolve,
        fail:reject
    })
  })
}
export default {
  fetch
}