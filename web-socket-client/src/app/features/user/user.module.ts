import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { RecoverChangePasswordPageComponent } from "./pages/recover-change-password-page/recover-change-password-page.component";
import { RecoverPageComponent } from "./pages/recover-page/recover-page.component.";
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component";

@NgModule({
    declarations: [
        SettingsPageComponent,
        RecoverPageComponent,
        RecoverChangePasswordPageComponent,
    ], 
    imports: [CommonModule, SharedModule],
    exports: [
        SettingsPageComponent,
        RecoverPageComponent,
        RecoverChangePasswordPageComponent,
    ]
})
export class UserModule {}