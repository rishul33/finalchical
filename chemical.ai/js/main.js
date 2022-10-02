/*--------------------------------------------------
Project:        zhihua-portal
Version:        1.0
Author:         Ray
-----------------------------------------------------

    JS INDEX
    ================================================
    * preloader js
    * One Page Scroll
    * slick Menu js 
    * slick Nav
    * testimonial slider
    * Counter
    * bottom to top
    ================================================*/

;(function ($) {
  // 加载babel兼容IE下不识别Promise
  if (!window.Promise) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://cdn.polyfill.io/v2/polyfill.min.js'
    head.appendChild(script)
  }

  /*====================================
        preloader js
      ======================================*/
  $('html').css('overflow', 'hidden')
  $(window).on('load', function () {
    $('html').css('overflow', 'auto')
    // 页面加载成功埋点
    firstLoadBury()
  })

  /** 埋点 **/
  /**
   * @description: 埋点方法
   * @param {number} 埋点id
   * @return {*}
   */
  function buryPointById(id) {
    http({
      url: 'Home/SaveUserEvents',
      method: 'get',
      params: { id: id }
    })
  }
  // 每一次进入系统重新埋点记录一次
  function firstLoadBury() {
    var firstLoad = sessionStorage.getItem('firstLoad')
    if (!firstLoad) {
      sessionStorage.setItem('firstLoad', false)
      buryPointById(1)
    }
  }
  // 招聘跳转埋点
  $('.recruitment').on('click', function () {
    buryPointById(2)
  })

  /* ==================================================
            Nice Select Init
         ===============================================*/
  $('select').niceSelect()

  /*====================================
        sticky menu js
      ======================================*/
  var windows = $(window)
  var sticky = $('.header-fixed')
  windows.on('scroll', function (e) {
    scrollActive()
    var scroll = windows.scrollTop()
    if (scroll < 50) {
      sticky.removeClass('stick')
      $('.firstImg').show()
      $('.secondImg').hide()
    } else {
      sticky.addClass('stick')
      $('.firstImg').hide()
      $('.secondImg').show()
    }
  })
  /*====================================
           One Page Scroll
======================================*/

  // Select all »a« elements with a parent class »links« and add a function that is executed on click
  $('.navbar-nav .nav-item a').on('click', function (e) {
    // Define variable of the clicked »a« element (»this«) and get its href value.
    $(this).parent().siblings().removeClass('active')
    $(this).parent().addClass('active')
    // $(this).parent()
    var href = $(this).attr('href')
    // Run a scroll animation to the position of the element which has the same id like the href value.
    $('html, body').animate(
      {
        scrollTop: $(href).offset().top
      },
      '300'
    )

    // Prevent the browser from showing the attribute name of the clicked link in the address bar
    e.preventDefault()
  })

  /*====================================
        slick nav
    ======================================*/
  var logo_path = $('.mobile-menu').data('logo')
  $('.navbar-nav').slicknav({
    appendTo: '.mobile-menu',
    removeClasses: true,
    label: '',
    closedSymbol: '<i class="fa fa-angle-right"><i/>',
    openedSymbol: '<i class="fa fa-angle-down"><i/>',
    brand:
      '<a class="navbar-brand" href="index.html"><img src="' +
      logo_path +
      '" class="img-fluid logoImgSize firstImg" alt="logo"><img src="https://www-static.chemicalai.cn/assets/images/logo2.svg" class="img-fluid logoImgSize secondImg" alt="logo" /></a>',
    closeOnClick: true
  })

  /*====================================
            Testimonial slider
        ======================================*/

  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: '.slider-nav'
  })
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    arrows: true,
    centerMode: true,
    variableWidth: true,
    infinite: true,
    focusOnSelect: true,
    cssEase: 'linear',
    touchMove: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: true,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 400,
        settings: {
          arrows: true,
          slidesToShow: 1
        }
      }
    ]
  })

  /*====================================
        counter
    ======================================*/
  $('.counter').counterUp({
    delay: 10,
    time: 1000
  })

  /*====================================
     bottom to top
 ======================================*/

  var btn = $('#btn-to-top')
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show')
    } else {
      btn.removeClass('show')
    }
  })
  btn.on('click', function (e) {
    e.preventDefault()
    $('html, body').animate(
      {
        scrollTop: 0
      },
      '300'
    )
  })
  // Contact us
  // 提示语消息配置
  Qmsg.config({
    showClose: false,
    timeout: 3000
  })

  $('.btn-send').on('click', function () {
    // 必填项校验 后端对应参数
    var domArr = ['name', 'lastName', 'focusOfResponsibility', 'industry', 'expectation', 'phone', 'email']
    var params = {}
    for (var i = 0; i < domArr.length; i++) {
      var value = $('#' + domArr[i])
        .val()
        .trim()
      if (!value) {
        return Qmsg.warning('Please fill in all the required fields.')
      }
      params[domArr[i]] = value
    }
    // 手机号校验
    var phoneVal = $('#phone').val().trim()
    var phoneReg = /^\d{3,20}$/
    // 邮箱校验
    var emailVal = $('#email').val().trim()
    var emailReg = new RegExp('^\\s*([A-Za-z0-9_-]+(\\.\\w+)*@(\\w+\\.)+\\w{2,5})\\s*$')
    if (!phoneReg.test(phoneVal) && !emailReg.test(emailVal)) {
      return Qmsg.warning('Your phone number and emial address are invalid. Please enter a valid phone number and emial address.')
    }
    if (!emailReg.test(emailVal) && phoneReg.test(phoneVal)) {
      return Qmsg.warning('Your email address is invalid. Please enter a valid address.')
    }
    if (!phoneReg.test(phoneVal) && emailReg.test(emailVal)) {
      return Qmsg.warning('Your phone number is invalid. Please enter a valid phone number.')
    }

    // message
    params.message = $('#message').val().trim()
    // 显示loading
    $('html').css('overflow', 'hidden')
    http({
      url: '/Articles/SendEmail',
      method: 'post',
      data: params
    })
      .then(function (res) {
        // 只要接口正常返回，直接显示成功提示
        $('.tip-mask').removeClass('hide')
        // setTimeout(function(){
        //   $(".tip-mask").addClass("hide");
        // }, 3000);
      })
      .finally(function () {
        $('html').css('overflow', 'auto')
      })
  })

  /* Video */
  // 点击播放视频
  $('.laptop .pulse-css span').on('click', function (e) {
    $('html').css('overflow', 'hidden')
    $('.video-mask').show()
    $('.video-wrapper').show()
    $('#bili').attr('src', 'https://player.bilibili.com/player.html?aid=854803361&bvid=BV1AL4y1T7Cv&cid=741158503&page=1&high_quality=1')
    var width = $('.video-content').width()
    var autoHeight = width / 1.57
    $('.video-content').height(autoHeight)
  })

  // 点击蒙版、X关闭视频
  $('.video-wrapper, .close-btn').on('click', function (e) {
    $('html').css('overflow', 'auto')
    $('.video-mask').hide()
    $('.video-wrapper').hide()
    $('#bili').attr('src', '')
  })

  // 点击视频
  $('.video-content').on('click', '#myVideo', function (e) {
    e.stopPropagation()
  })

  // 跳转详情页
  $('.blog-btn').on('click', function () {
    var url = $(this).data('url')
    // 第三方网站打开新页签
    if (~url.indexOf('http')) {
      window.open(url)
      return
    }
    window.location.href = url
  })

  //  solution 切换
  $('.change-tab div').on('click', function () {
    var key = $(this).data('key')
    if (key === 2) {
      $('.chemLab').show()
      $('.chemAirs').hide()
    } else {
      $('.chemAirs').show()
      $('.chemLab').hide()
    }
  })

  // 底部icon跳转
  $('.footer-icon i').on('click', function () {
    var url = $(this).data('url')
    // window.location.href = url
    window.open(url)
  })
  // ip地址
  // console.log(returnCitySN["cip"])
  var owlCarouselConfig = {
    items: 3,
    itemsDesktop: [1199, 2],
    itemsDesktopSmall: [769, 2],
    itemsMobile: [768, 1],
    pagination: false,
    navigationText: false,
    autoPlay: false,
    rewindNav: false,
    navigation: true,
    navigationText: [' ', ' ']
  }
  var bannerCarousel = {
    items: 1,
    loop: true,
    itemsDesktop: [1199, 1],
    itemsDesktopSmall: [769, 1],
    itemsMobile: [768, 1],
    margin: 0,
    autoPlay: 6000,
    autoPlayHoverPause: true,
    pagination: false,
    navigationText: false,
    navigation: false,
    navigationText: [' ', ' ']
  }

  if ($(window).width() > 768) {
    var carouselConfig = {
      items: 1,
      loop: true,
      itemsDesktop: [1199, 1],
      itemsDesktopSmall: [769, 1],
      itemsMobile: [768, 1],
      margin: 0,
      autoPlay: 6000,
      autoPlayHoverPause: true,
      pagination: false,
      navigationText: false,
      navigation: true,
      navigationText: [' ', ' ']
    }
    if ($('#banner-header').length) {
      $('#banner-header').addClass('owl-carousel').owlCarousel(carouselConfig)
    }
  } else {
    $('.hero-title2').addClass('col-lg-7')
    $('.hero-text1').addClass('col-lg-7')
    if ($('#banner-header').length) {
      $('#banner-header').addClass('owl-carousel').owlCarousel(bannerCarousel)
    }
  }

  // 对应导航高亮
  var domList = ['header', 'Features', 'Video', 'Case', 'News', 'Contact']
  function scrollActive() {
    try {
      domList.forEach(function (id) {
        var $item = $('#' + id)
        var windowScrollTop = $(window).scrollTop()
        var domScrollTop = $item.offset().top

        //判断元素顶部是否在窗口中
        if (domScrollTop <= windowScrollTop + 1) {
          var idStr = '#' + id
          $('.navbar-nav li').removeClass('active')
          $('.navbar-nav li a[href="' + idStr + '"]')
            .parent('li')
            .addClass('active')
        }
      })
    } catch (e) {}
  }
  $(window)
    .on('resize', function () {
      scrollActive()
      try {
        if ($(window).width() > 768) {
          if ($(window).width() < 1220) {
            var bannerList = $('#banner-header .owl-item').toArray()
            for (var j = 0; j < bannerList.length; j++) {
              bannerList[j].style.width = '100%'
            }
          }
          if ($(window).width() < 1280) {
            $('.hero-text1').addClass('col-lg-7')
          }
          $('#news-slider').addClass('owl-carousel').owlCarousel(owlCarouselConfig)
          $('#loadingMore').css('display', 'none')
        } else {
          $('#news-slider').trigger('destroy.owl.carousel').removeClass('owl-carousel')
          $('#loadingMore').css('display', 'block')
          var domList = $('.news-item-card').toArray()
          if (domList.length > 3) {
            for (var i = 3; i < domList.length; i++) {
              domList[i].style.display = 'none'
            }
          }
        }
      } catch (e) {}
    })
    .trigger('resize')

  $('#loadingMore').on('click', function () {
    var domList = $('.news-item-card').toArray()
    if (domList.length > 3) {
      for (var i = 3; i < domList.length; i++) {
        domList[i].style.display = 'block'
      }
      $('#loadingMore').css('display', 'none')
    }
  })
  // 点击返回按钮关闭弹窗
  $('.return-btn').on('click', function () {
    $('.tip-mask').addClass('hide')
  })
})(jQuery)

// F12彩蛋
try {
  console.log('一个软件，要经历过几番更新，才能抵达用户面前？\n一位新人，要经历怎样的磨炼，才能站在技术之巅？\n期待你与智化科技一同塑造化学的未来！\n\n')
  console.log('%c武汉智化科技招聘简历投递：https://www.zhipin.com/gongsi/4fd0d35f110251491Hd-3dy9GQ~~.html?ka=job-detail-company-logo_custompage', 'color:#2ab989')
} catch (e) {}
