import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, method, headers, data } = body;

    // 根据方法发送请求
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(url, { headers });
        break;
      case 'POST':
        if (data && headers) {
          // 判断是否为JSON数据
          if (typeof data === 'object' || (typeof data === 'string' && data.startsWith('{'))) {
            try {
              const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
              response = await axios.post(url, jsonData, { headers });
            } catch (jsonError) {
              response = await axios.post(url, data, { headers });
            }
          } else {
            response = await axios.post(url, data, { headers });
          }
        } else if (data) {
          // 判断是否为JSON数据
          if (typeof data === 'object' || (typeof data === 'string' && data.startsWith('{'))) {
            try {
              const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
              response = await axios.post(url, jsonData);
            } catch (jsonError) {
              response = await axios.post(url, data);
            }
          } else {
            response = await axios.post(url, data);
          }
        } else if (headers) {
          response = await axios.post(url, {}, { headers });
        } else {
          response = await axios.post(url);
        }
        break;
      case 'PUT':
        if (data && headers) {
          // 判断是否为JSON数据
          if (typeof data === 'object' || (typeof data === 'string' && data.startsWith('{'))) {
            try {
              const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
              response = await axios.put(url, jsonData, { headers });
            } catch (jsonError) {
              response = await axios.put(url, data, { headers });
            }
          } else {
            response = await axios.put(url, data, { headers });
          }
        } else if (data) {
          // 判断是否为JSON数据
          if (typeof data === 'object' || (typeof data === 'string' && data.startsWith('{'))) {
            try {
              const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
              response = await axios.put(url, jsonData);
            } catch (jsonError) {
              response = await axios.put(url, data);
            }
          } else {
            response = await axios.put(url, data);
          }
        } else if (headers) {
          response = await axios.put(url, {}, { headers });
        } else {
          response = await axios.put(url);
        }
        break;
      case 'DELETE':
        response = await axios.delete(url, { headers });
        break;
      default:
        response = await axios.get(url, { headers });
    }

    // 返回响应结果
    return NextResponse.json({
      success: true,
      data: {
        status_code: response.status,
        headers: response.headers,
        content: response.data,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || '请求发送失败',
      },
      { status: 400 }
    );
  }
}