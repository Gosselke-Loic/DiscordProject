import { INestApplicationContext } from "@nestjs/common";
import { ServerOptions } from 'socket.io';
import { createAdapter, RedisAdapter } from "@socket.io/redis-adapter";
import { CustomSocketIoAdapter } from "./custom-socket-io.adapter";
import { createClient } from "@redis/client";

export class RedisIoAdapter extends CustomSocketIoAdapter {
    private redisAdapter: (nsp: any) => RedisAdapter;
  
    constructor(host: string, app: INestApplicationContext) {
        super(app);
        
        const pubClient = createClient({ url: host });
        const subClient = pubClient.duplicate();
        this.redisAdapter = createAdapter(pubClient, subClient);
    }
  
    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options);
    
        server.adapter(this.redisAdapter as any);
    
        return server;
    }
}