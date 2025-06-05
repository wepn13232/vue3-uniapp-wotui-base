/**
 * 适配 Vue3 + Vite4 + UniApp 的 HTTP 请求封装
 * 支持环境变量、组合式API集成、多端兼容
 */
/**/
import { useOuthStore } from "@/store/outh";

// 类型定义（根据业务调整）
interface CommonResponse<T = any> {
  code: number; // 业务状态码（200=成功）
  message: string; // 提示信息
  body: T; // 业务数据
  [key: string]: any; // 扩展字段
}

// 发起请求类型定义
interface RequestConfig {
  url: string;
  data?: any;

  [key: string]: any;
}

// 默认配置
const DEFAULT_CONFIG: Record<string, any> = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 超时时间
  header: {
    "X-Client-Platform": uni.getSystemInfoSync().platform, // 自动获取端类型（h5/mp-weixin/app）
  },
};

class Http {
  private baseURL: string;

  constructor() {
    this.baseURL = DEFAULT_CONFIG.baseURL;
  }

  /**
   * 核心请求方法
   */
  private async request<T>(config: RequestConfig): Promise<CommonResponse<T>> {
    // ============== 请求前处理 ==============
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    const outhStore = useOuthStore();

    // 动态注入token
    const token = outhStore.token;

    if (token) {
      mergedConfig.header = {
        ...mergedConfig.header,
        Authorization: `Bearer ${ token }`,
      };
    }

    // 拼接完整URL
    mergedConfig.url = `${ this.baseURL }${ mergedConfig.url }`;

    // ============== 发起请求 ==============
    const response = await uni.request(mergedConfig);
    const { statusCode, data } = response as any;

    // ============== 请求后处理 =============
    // 网络层错误（HTTP状态码非2xx）
    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`网络错误：${ statusCode }`);
    }

    // 业务层校验（根据实际业务码调整）
    if (data.code !== 200) {
      throw new Error(`业务错误：${ data.message } code:${ data.code }`);
    }

    // 目前直接把接口结构的body进行返回，后续要考虑兼容文件流格式
    return data.body || ("" as T);
  }

  // 快捷方法（GET/POST/PUT/DELETE）
  async get<T>(config: RequestConfig) {
    return this.request<T>({ ...config, method: "GET" }).catch((error) =>
      this.handleError(error)
    );
  }

  async post<T>(config: RequestConfig) {
    return this.request<T>({ ...config, method: "POST" }).catch((error) =>
      this.handleError(error)
    );
  }

  // ============== 错误处理 ==============
  private handleError(error: any) {
    let message = "请求失败";
    console.log(error);

    // 业务层错误
    const code = error.message?.split("code:")[1];
    if (code === "401") {
      message = "登录已过期，请重新登录";
    } else if (code === "500") {
      message = "服务器异常";
    }

    // 显示提示（支持Vue3的toast组件）
    uni.showToast({ title: message, icon: "none" });
  }
}

// 实例化并导出（单例模式）
export const http = new Http();
