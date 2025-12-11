import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parsed_data } = body;

    // 生成 Python 代码
    const code = generateRequestsCode(parsed_data);

    return NextResponse.json({
      success: true,
      code,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || '代码生成失败',
      },
      { status: 400 }
    );
  }
}

function generateRequestsCode(parsedData: any) {
  const codeLines: string[] = [];
  codeLines.push("import requests");
  codeLines.push("import json");
  codeLines.push("");

  // 添加URL
  codeLines.push(`url = "${parsedData.url}"`);
  codeLines.push("");

  // 添加headers
  if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
    codeLines.push("headers = {");
    for (const [key, value] of Object.entries(parsedData.headers)) {
      // 正确转义引号
      const escapedValue = (value as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      codeLines.push(`    "${key}": "${escapedValue}",`);
    }
    codeLines.push("}");
    codeLines.push("");
  }

  // 添加data
  if (parsedData.data) {
    // 尝试解析为JSON
    try {
      // 检查是否是JSON数据
      const strippedData = parsedData.data.trim();
      if (strippedData.startsWith('{') && strippedData.endsWith('}')) {
        // 修复JSON中的布尔值和null值，使其符合Python语法
        let fixedData = strippedData.replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None');
        // 验证修复后的数据是否是有效的Python字面量
        eval(fixedData); // 这会抛出异常如果数据无效
        codeLines.push("data = " + fixedData);
      } else {
        // 非JSON数据
        codeLines.push(`data = "${strippedData}"`);
      }
    } catch {
      // 如果解析失败，当作普通字符串处理
      codeLines.push(`data = "${parsedData.data}"`);
    }
    codeLines.push("");
  }

  // 添加form data
  if (parsedData.form_data && Object.keys(parsedData.form_data).length > 0) {
    codeLines.push("files = {");
    for (const [key, value] of Object.entries(parsedData.form_data)) {
      codeLines.push(`    "${key}": (None, "${value}"),`);
    }
    codeLines.push("}");
    codeLines.push("");
  }

  // 构建请求
  const method = parsedData.method.toLowerCase();
  codeLines.push("# 发送请求");

  if (method === "get") {
    if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
      codeLines.push("response = requests.get(url, headers=headers)");
    } else {
      codeLines.push("response = requests.get(url)");
    }
  } else if (method === "post") {
    const params = ["url"];
    if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
      params.push("headers=headers");
    }
    if (parsedData.data) {
      params.push(parsedData.data.trim().startsWith('{') ? "json=data" : "data=data");
    }
    if (parsedData.form_data && Object.keys(parsedData.form_data).length > 0) {
      params.push("files=files");
    }
    codeLines.push(`response = requests.post(${params.join(", ")})`);
  } else if (method === "put") {
    const params = ["url"];
    if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
      params.push("headers=headers");
    }
    if (parsedData.data) {
      params.push(parsedData.data.trim().startsWith('{') ? "json=data" : "data=data");
    }
    codeLines.push(`response = requests.put(${params.join(", ")})`);
  } else if (method === "delete") {
    if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
      codeLines.push("response = requests.delete(url, headers=headers)");
    } else {
      codeLines.push("response = requests.delete(url)");
    }
  } else {
    // 默认使用get
    if (parsedData.headers && Object.keys(parsedData.headers).length > 0) {
      codeLines.push("response = requests.get(url, headers=headers)");
    } else {
      codeLines.push("response = requests.get(url)");
    }
  }

  codeLines.push("");
  codeLines.push("# 输出响应");
  codeLines.push("print(f\"Status Code: {response.status_code}\")");
  codeLines.push("print(f\"Response: {response.text}\")");

  return codeLines.join("\n");
}