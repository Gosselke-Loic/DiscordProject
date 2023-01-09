import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { take } from "rxjs";
import { AuthService } from "../../service/auth.service";

@Component({
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
    registerForm = this.formBuilder.group({
        username: '',
        password: '',
        email: '',
    })

    loading = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
    ) {}

    submit() {
        this.loading = true;

        const user = this.registerForm.value;

        this.authService
            .register(user)
            .pipe(take(1))
            .subscribe({
                next: () => this.authService.redirectToCallback(),
                complete: () => {
                    this.loading = false;

                    this.registerForm.patchValue({
                        password: '',
                    })
                }
            })
    }
}