$(function () {
  var url = window.location.href
  var originUrl = url.split('publicity')[0]
  // 移动端跳转 H5
  if (isMobile() && !url.includes('h5.html')) {
    window.location.href = originUrl + 'publicity/h5.html'
  } else if (!isMobile() && url.includes('h5.html')) {
    window.location.href = originUrl + 'publicity'
  }

  // 获取 url code值，并显示对应新闻
  var code = getUrlParam('code')
  code && showTab(code)

  // Tab点击
  $('.tab').on('click', function () {
    var code = $(this).data('code')
    showTab(code)
  })

  // 显示某个Tab
  function showTab(code) {
    var isLegal = [1, 2, 3, 4].includes(Number(code))
    if (isLegal) {
      $('.tab')
        .eq(code - 1)
        .addClass('active')
        .siblings()
        .removeClass('active')
      $('.content').children('div').hide()
      $('.news' + code).show()
    }
  }

  // 获取浏览器url中的参数
  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substring(1).match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    }
    return ''
  }

  // 判断是否移动端
  function isMobile() {
    var ua = navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isPc = !isPhone && !isAndroid && !isSymbian
    return isAndroid || isPhone
  }
})
