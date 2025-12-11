'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                多功能爬虫小工具
              </Link>
            </div>
            
            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/request-sender" className="text-gray-700 hover:text-indigo-600 transition-colors">
                发送请求
              </Link>
              <Link href="/curl-converter" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Curl转换
              </Link>
              <Link href="/crypto-tool" className="text-gray-700 hover:text-indigo-600 transition-colors">
                AES加解密
              </Link>
              <Link href="/json-formatter" className="text-gray-700 hover:text-indigo-600 transition-colors">
                JSON格式化
              </Link>
              <Link href="/websocket-client" className="text-gray-700 hover:text-indigo-600 transition-colors">
                WebSocket测试
              </Link>
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* 移动端导航菜单 */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/request-sender" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  发送请求
                </Link>
                <Link href="/curl-converter" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  Curl转换
                </Link>
                <Link href="/crypto-tool" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  AES加解密
                </Link>
                <Link href="/json-formatter" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  JSON格式化
                </Link>
                <Link href="/websocket-client" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  WebSocket测试
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            多功能爬虫小工具
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            HTTP请求发送、Curl转换、代码生成一体化平台
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            title="📤 发送请求" 
            description="支持GET/POST/PUT/DELETE等HTTP方法，可自定义Headers和请求数据" 
            link="/request-sender"
            icon="🚀"
          />
          <FeatureCard 
            title="🔄 Curl转换" 
            description="将Curl命令转换为Python requests代码，支持一键解析剪切板内容" 
            link="/curl-converter"
            icon="💻"
          />
          <FeatureCard 
            title="🔒 AES加解密" 
            description="支持AES-CBC/AES-ECB模式加密解密，可生成随机密钥和IV" 
            link="/crypto-tool"
            icon="🔑"
          />
          <FeatureCard 
            title="📝 JSON格式化" 
            description="JSON文本格式化与压缩，树状结构展示" 
            link="/json-formatter"
            icon="📋"
          />
          <FeatureCard 
            title="🌐 WebSocket测试" 
            description="WebSocket客户端测试工具，支持连接、发送和接收消息" 
            link="/websocket-client"
            icon="📡"
          />
        </div>

        {/* 快捷操作 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">快捷操作</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleParseClipboardCurl}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              一键解析剪切板Curl
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// 功能卡片组件
function FeatureCard({ title, description, link, icon }: { 
  title: string; 
  description: string; 
  link: string;
  icon: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-500 mb-4">{description}</p>
        <Link 
          href={link}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          立即使用
          <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// 处理剪切板Curl解析
async function handleParseClipboardCurl() {
  try {
    // 读取剪切板内容
    const clipboardText = await navigator.clipboard.readText();
    
    if (!clipboardText) {
      alert('剪切板中没有内容');
      return;
    }
    
    if (!clipboardText.startsWith('curl')) {
      alert('剪切板中的内容不是有效的Curl命令');
      return;
    }
    
    // 这里应该调用后端API解析Curl命令
    // 为简化示例，我们直接跳转到请求发送页面
    // 实际应用中需要先发送到后端解析，然后跳转
    window.location.href = '/request-sender?from=clipboard';
  } catch (error) {
    alert('读取剪切板失败: ' + (error as Error).message);
  }
}