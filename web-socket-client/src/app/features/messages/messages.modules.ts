import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessagesComponent } from "./components/messages.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DirectMessagePageComponent } from "./pages/direct-message-page.component";

@NgModule({
    declarations: [DirectMessagePageComponent, MessagesComponent],
    imports: [CommonModule, SharedModule],
    exports: [MessagesComponent, DirectMessagePageComponent]
})
export class MessagesModule {}