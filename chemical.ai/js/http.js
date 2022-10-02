function $axios() {
  // var baseUrl = 'http://192.168.0.113:10300'
  var baseUrl = ''
  // 创建axios 实例
  var service = axios.create({
    baseURL: baseUrl, // api的base_url
    timeout: 15000 // 请求超时时间
  })
  // 配置请求头
  service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  service.defaults.withCredentials = true
  // request 拦截器
  service.interceptors.request.use(
    function (config) {
      // 这里可以自定义 config
      return config
    },
    function (error) {
      console.log('error:', error)
      Promise.reject(error)
    }
  )
  // response 拦截器
  service.interceptors.response.use(
    function (response) {
      // 这里处理一些 response 返回逻辑
      var res = response.data
      return res
    },
    function (error) {
      console.log('error:', error)
      return Promise.reject(error)
    }
  )
  window.http = service
}

// 初始化axios
$axios()
