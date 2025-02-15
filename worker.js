// worker.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 解析请求的 URL
  const url = new URL(request.url)

  // 根据路径处理不同的请求
  if (url.pathname === '/') {
    // 返回一个简单的 HTML 页面
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DocsAnthropic2API</title>
        </head>
        <body>
          <h1>Welcome to DocsAnthropic2API</h1>
          <p>This is a simple Cloudflare Worker example.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  } else if (url.pathname === '/api') {
    // 处理 API 请求
    return new Response(JSON.stringify({ message: 'Hello from the API!' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } else {
    // 处理 404 错误
    return new Response('Not Found', { status: 404 })
  }
}