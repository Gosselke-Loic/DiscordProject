import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared/shared.module";
import { MessagesModule } from "../messages/messages.modules";
import { RoomService } from "./service/room.service";

import { JoinRoomDialogComponent } from "./components/join-room-dialog/join-room-dialog.component";
import { UpsertRoomDialogComponent } from "./components/upsert-room-dialog/upsert-room-dialog.component";
import { RoomItemComponent } from "./components/room-item/room-item.component";
import { RoomPageComponent } from "./pages/room-page/room-page.component";
import { RoomsPageComponent } from "./pages/rooms-pages/rooms-page.component";

@NgModule({
    declarations: [
        RoomsPageComponent,
        UpsertRoomDialogComponent,
        JoinRoomDialogComponent,
        RoomPageComponent,
        RoomItemComponent,
    ],
    imports: [CommonModule, SharedModule, MessagesModule],
    providers: [RoomService],
    exports: [RoomPageComponent, RoomPageComponent],
})
export class RoomModule {}