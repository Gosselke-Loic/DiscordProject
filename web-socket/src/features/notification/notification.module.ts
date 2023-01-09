import { forwardRef, Module, OnModuleInit } from "@nestjs/common";
import { NotificationController } from "./controller/notification.controller";
import { WebNotificationService } from "./service/web-notification.service";
import { generateVAPIDKeys, setVapidDetails } from 'web-push';
import { notificationConfig } from "./config/notification.config";
import { AuthModule } from "../auth/auth.module";
import { environments } from "src/environments/environments";

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [NotificationController],
    providers: [WebNotificationService],
    exports: [WebNotificationService],
})
export class NotificationModule implements OnModuleInit {
    onModuleInit() {
        //tal vez modificar de nuevo a como estaba antes
        const vapid = notificationConfig.vapid;
        const { privateKey, publicKey } = generateVAPIDKeys();
        
        vapid.publicKey = publicKey;
        vapid.privateKey = privateKey;
    
        console.log(notificationConfig.vapid.subject)

        notificationConfig.save();
    }
}