import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [RegisterPageComponent, LoginPageComponent],
    imports: [CommonModule, SharedModule],
    exports: [RegisterPageComponent, LoginPageComponent]
})
export class AuthModule {}