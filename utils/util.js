function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function http(url, params, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: params ? params : {},
      header: {
        "Content-Type": "json",
        token: resl.data.token
      },
      method: method,
      success: function (res) {
        resolve(res.data);
      },
      error: function (err) {
        reject(err);
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  http: http
};

