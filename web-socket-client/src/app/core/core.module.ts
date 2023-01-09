import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainSocket } from "./socket/main-socket";
import { ErrorDIalogInterceptor } from "./interceptor/error-dialog.interceptor";

@NgModule({
    imports: [CommonModule],
    providers: [MainSocket, ErrorDIalogInterceptor],
})
export class CoreModule {}