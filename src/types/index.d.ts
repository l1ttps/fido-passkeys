export interface CreateElysiaServer {
  controllers: any[];
  middlewares?: any[];
  prefix?: string;
  port?: number | string;
}
