'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestSender() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('content');
  const [responseContent, setResponseContent] = useState('响应内容将显示在这里...');
  const [responseHeaders, setResponseHeaders] = useState('响应头将显示在这里...');

  // 页面加载时检查是否有从其他页面传递过来的数据
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    
    if (from === 'clipboard') {
      // 这里应该从 sessionStorage 或其他地方获取解析后的数据
      // 为简化示例，我们不实现具体逻辑
    }
  }, []);

  // 发送请求
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      alert('请输入URL');
      return;
    }
    
    setIsLoading(true);
    setResponseContent('# 正在发送请求，请稍候...');
    setResponseHeaders('# 正在发送请求，请稍候...');
    
    try {
      // 解析 headers
      const headersObj: Record<string, string> = {};
      if (headers) {
        headers.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key && value) {
              headersObj[key] = value;
            }
          }
        });
      }
      
      // 发送请求到后端 API
      const response = await fetch('/api/request-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method,
          headers: headersObj,
          data: data || undefined,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 显示响应结果
        setResponseHeaders(`Status Code: ${result.data.status_code}\n\n${Object.entries(result.data.headers).map(([key, value]) => `${key}: ${value}`).join('\n')}`);
        setResponseContent(result.data.content);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setResponseHeaders(`请求失败: ${(error as Error).message}`);
      setResponseContent(`请求失败: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成 Python 代码
  const handleGenerateCode = async () => {
    if (!url) {
      alert('请输入URL');
      return;
    }
    
    try {
      // 解析 headers
      const headersObj: Record<string, string> = {};
      if (headers) {
        headers.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key && value) {
              headersObj[key] = value;
            }
          }
        });
      }
      
      // 发送请求到后端 API 生成代码
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsed_data: {
            url,
            method,
            headers: headersObj,
            data: data || undefined,
            form_data: {},
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResponseContent(result.code);
        setActiveResultTab('content');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`代码生成失败: ${(error as Error).message}`);
    }
  };

  // 清空所有字段
  const handleClearAll = () => {
    setUrl('');
    setMethod('GET');
    setHeaders('');
    setData('');
    setResponseContent('响应内容将显示在这里...');
    setResponseHeaders('响应头将显示在这里...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">发送请求</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSendRequest}>
            <div className="space-y-6">
              {/* URL 输入 */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL:
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="请输入URL..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* 方法选择 */}
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  方法:
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </div>
              
              {/* Headers 输入 */}
              <div>
                <label htmlFor="headers" className="block text-sm font-medium text-gray-700 mb-1">
                  Headers:
                </label>
                <textarea
                  id="headers"
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder="每行一个，格式：Key: Value"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* 数据输入 */}
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  数据:
                </label>
                <textarea
                  id="data"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="请求数据"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isLoading ? '请求中...' : '发送请求'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  生成Python代码
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  清空所有
                </button>
              </div>
            </div>
          </form>
          
          {/* 结果显示区域 */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveResultTab('content')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeResultTab === 'content'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  响应内容
                </button>
                <button
                  onClick={() => setActiveResultTab('headers')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeResultTab === 'headers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  响应头
                </button>
              </nav>
            </div>
            
            <div className="mt-4">
              {activeResultTab === 'content' ? (
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 whitespace-pre-wrap break-all">
                  {responseContent}
                </pre>
              ) : (
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 whitespace-pre-wrap break-all">
                  {responseHeaders}
                </pre>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}