import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { take, tap } from "rxjs";
import Swal from "sweetalert2";
import { RecoverService } from "../../service/recover.service";

@Component({
    templateUrl: './recover-page.component.html',
    styleUrls: ['./recover-page.component.scss'],
})
export class RecoverPageComponent {
    recoverForm = this.formBuilder.group({
        email: '',
    });

    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private roomService: RecoverService,
    ) {}

    submit() {
        if(this.loading) {
            return;
        }

        this.loading = true;

        const clear = () => {
            this.loading = false;

            this.recoverForm.patchValue({ email: '' });
        };

        this.roomService
            .recoverPassword(this.recoverForm.value.email)
            .pipe(tap({next: () => clear, complete: () => clear}), take(1))
            .subscribe(() => {
                Swal.fire({
                    title: 'Good job!',
                    text: 'Check your email and change your password!',
                    icon: 'success',
                });
            });
    }
}