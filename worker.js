// worker.js
export default {
  async fetch(request, env) {
    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // 仅处理POST请求
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // 验证API密钥
      const apiKey = env.CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('Missing CLAUDE_API_KEY environment variable');
      }

      // 解析请求数据
      const requestData = await request.json();
      
      // 构造Anthropic API请求
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Anthropic-Version': '2023-06-01',
          'X-Api-Key': apiKey
        },
        body: JSON.stringify({
          model: requestData.model || 'claude-3-opus-20240229',
          max_tokens: requestData.max_tokens || 1024,
          messages: requestData.messages,
          temperature: requestData.temperature || 0.7,
          system: requestData.system || 'You are a helpful assistant.'
        })
      });

      // 处理API响应
      if (!anthropicResponse.ok) {
        throw new Error(`API request failed: ${anthropicResponse.status}`);
      }

      const responseData = await anthropicResponse.json();

      return new Response(JSON.stringify(responseData), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      // 错误处理
      console.error('Error:', error);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};