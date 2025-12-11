import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { curl_command } = body;

    // 解析 Curl 命令
    const parsedData = parseCurl(curl_command);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || '解析失败',
      },
      { status: 400 }
    );
  }
}

function parseCurl(curlCommand: string) {
  // 移除开头的curl关键字（如果存在）
  curlCommand = curlCommand.trim();
  if (curlCommand.startsWith('curl')) {
    curlCommand = curlCommand.substring(4).trim();
  }

  // 解析URL
  // 先尝试匹配带引号的URL
  let urlMatch = curlCommand.match(/(?:-X\s+(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+)?['"](https?:\/\/[^\s'"]+)['"]/);
  if (!urlMatch) {
    // 如果没有匹配到带引号的URL，尝试匹配不带引号的URL
    urlMatch = curlCommand.match(/(?:-X\s+(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+)?(https?:\/\/[^\s'">\\\(\)]+)/);
  }
  const url = urlMatch ? urlMatch[1] : "";

  // 解析HTTP方法
  const methodMatch = curlCommand.match(/-X\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i);
  let method = methodMatch ? methodMatch[1].toUpperCase() : "GET";

  // 如果没有明确指定-X参数，但有--data参数，则默认为POST
  if (!methodMatch && (curlCommand.includes('--data') || curlCommand.includes('--data-raw') || curlCommand.includes('-F'))) {
    method = "POST";
  }

  // 解析headers
  const headers: Record<string, string> = {};
  // 匹配带引号的header（单引号和双引号）
  const headerMatches = curlCommand.matchAll(/-H\s+['"]([^:\s]+):\s*([^\r\n'"]*)['"]/g);
  for (const match of headerMatches) {
    const key = match[1].trim().replace(/^['"]|['"]$/g, '');
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    headers[key] = value;
  }

  // 解析data
  let data: string | null = null;
  // 更精确地匹配 --data-raw 内容
  // 匹配单引号中的data（贪婪匹配直到下一个单引号）
  let dataMatch = curlCommand.match(/--data-raw\s+'((?:[^'\\]|\\.)*)'/);
  if (!dataMatch) {
    // 匹配双引号中的data（贪婪匹配直到下一个双引号）
    dataMatch = curlCommand.match(/--data-raw\s+"((?:[^"\\]|\\.)*)"/);
  }
  if (!dataMatch) {
    // 匹配不带引号的data (JSON格式)
    dataMatch = curlCommand.match(/--data-raw\s+(\{[^}]*\})/);
  }
  if (!dataMatch) {
    // 匹配其他不带引号的数据
    dataMatch = curlCommand.match(/--data-raw\s+([^\s'"]\S*)/);
  }

  if (dataMatch) {
    data = dataMatch[1];
    // 处理转义字符
    data = data.replace(/\\"/g, '"').replace(/\\'/g, "'");
  }

  // 解析form data
  const formData: Record<string, string> = {};
  // 匹配带引号的form data（单引号和双引号）
  const formMatches = curlCommand.matchAll(/-F\s+['"]([^=]+)=([^\r\n'"]*)['"]/g);
  for (const match of formMatches) {
    const key = match[1].trim().replace(/^['"]|['"]$/g, '');
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    formData[key] = value;
  }

  return {
    url,
    method,
    headers,
    data,
    form_data: formData,
  };
}