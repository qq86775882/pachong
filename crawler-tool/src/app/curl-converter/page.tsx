'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CurlConverter() {
  const router = useRouter();
  const [curlCommand, setCurlCommand] = useState('');
  const [result, setResult] = useState('');
  const [showGoToRequest, setShowGoToRequest] = useState(false);

  // 解析 Curl 命令
  const handleParseCurl = async () => {
    if (!curlCommand.trim()) {
      alert('请输入Curl命令');
      return;
    }
    
    try {
      // 发送请求到后端 API 解析 Curl
      const response = await fetch('/api/parse-curl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curl_command: curlCommand,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 生成 Python 代码
        const codeResponse = await fetch('/api/generate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parsed_data: result.data,
          }),
        });
        
        const codeResult = await codeResponse.json();
        
        if (codeResult.success) {
          setResult(codeResult.code);
          setShowGoToRequest(true);
        } else {
          throw new Error(codeResult.error);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`解析失败: ${(error as Error).message}`);
    }
  };

  // 解析剪切板内容
  const handleParseClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (!clipboardText) {
        alert('剪切板中没有内容');
        return;
      }
      
      if (!clipboardText.startsWith('curl')) {
        alert('剪切板中的内容不是有效的Curl命令');
        return;
      }
      
      setCurlCommand(clipboardText);
      
      // 自动触发解析
      setTimeout(() => {
        handleParseCurl();
      }, 100);
    } catch (error) {
      alert(`读取剪切板失败: ${(error as Error).message}`);
    }
  };

  // 复制代码到剪切板
  const handleCopyCode = async () => {
    if (!result) {
      alert('没有代码可复制');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(result);
      alert('代码已复制到剪切板');
    } catch (error) {
      alert(`复制失败: ${(error as Error).message}`);
    }
  };

  // 清空所有字段
  const handleClearAll = () => {
    setCurlCommand('');
    setResult('');
    setShowGoToRequest(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Curl转换</h1>
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
          <div className="space-y-6">
            {/* Curl 命令输入 */}
            <div>
              <label htmlFor="curlCommand" className="block text-sm font-medium text-gray-700 mb-1">
                Curl命令:
              </label>
              <textarea
                id="curlCommand"
                value={curlCommand}
                onChange={(e) => setCurlCommand(e.target.value)}
                placeholder="请输入Curl命令，例如：curl -X GET 'https://httpbin.org/get' -H 'Accept: application/json'"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleParseCurl}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                解析Curl命令
              </button>
              <button
                onClick={handleParseClipboard}
                className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                解析剪切板内容
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                清空
              </button>
            </div>
            
            {/* 转到请求发送按钮 */}
            {showGoToRequest && (
              <div className="pt-4">
                <button
                  onClick={() => router.push('/request-sender?from=curl')}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  转到发送请求
                </button>
              </div>
            )}
            
            {/* 转换结果 */}
            <div className="pt-6">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
                转换结果 (Python requests代码):
              </label>
              <div className="relative">
                <textarea
                  id="result"
                  value={result}
                  readOnly
                  placeholder="转换后的Python代码将显示在这里..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                />
                {result && (
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    复制代码
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}