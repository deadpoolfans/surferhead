export interface ServerInfo {
    hostname: string;
    port: number;
    crossDomainPort: number;
    protocol: string;
    domain: string;
    cacheRequests: boolean;
    wss?: any;
}

export interface ServiceMessage {
    sessionId: string;
    cmd: string;
    disableResending?: boolean;
    allowRejecting?: boolean;
    referer?: string;
}

export interface StaticContent {
    content: string | Buffer;
    contentType: string;
    etag?: string;
    isShadowUIStylesheet?: boolean;
}

export interface RequestTimeout {
    page: number;
    ajax: number;
}

export interface ProxyOptions {
  hostname: string;
  port1: number;
  port2: number;
  ssl?: object;
  developmentMode?: boolean;
  cache?: boolean;
  disableHttp2?: boolean;
  disableCrossDomain?: boolean;
  nativeAutomation?: boolean;
}
