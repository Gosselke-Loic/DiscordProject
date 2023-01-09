import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { RoomModule } from "./room/room.module";
import { MessagesModule } from "./messages/messages.modules";
import { SharedModule } from "../shared/shared.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { NotificationModule } from "./notification/notification.module";

import { MainComponent } from "./main/main.component";

import { routes } from "./routes";

@NgModule({
    declarations: [MainComponent],
    imports: [
        SharedModule,
        UserModule,
        AuthModule,
        RoomModule,
        MessagesModule,
        NotificationModule,
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ],
    exports: [RouterModule, NotificationModule],
})
export class FeaturesModule {}