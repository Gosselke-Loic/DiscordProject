import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from "./material/material.module";
import { ErrorDialogComponent } from "./components/error-dialog/error-dialog.component";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";

@NgModule({
    declarations: [ConfirmDialogComponent, ErrorDialogComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    exports: [
        ConfirmDialogComponent,
        ErrorDialogComponent,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
    ],
})
export class SharedModule {}