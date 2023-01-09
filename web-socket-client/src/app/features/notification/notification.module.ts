import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { PushNotificationComponent } from "./components/push-notification.component";

@NgModule({
    declarations: [PushNotificationComponent],
    imports: [CommonModule, SharedModule],
    exports: [PushNotificationComponent],
})
export class NotificationModule {}