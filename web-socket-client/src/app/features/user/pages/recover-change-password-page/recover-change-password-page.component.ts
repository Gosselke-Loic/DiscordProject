import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, mergeMap, take } from "rxjs";
import Swal from "sweetalert2";
import { ChangePasswordBody, RecoverService } from "../../service/recover.service";

@Component({
    templateUrl: './recover-change-password-page.component.html',
    styleUrls: ['./recover-change-password-page.component.scss'],
})
export class RecoverChangePasswordPageComponent implements OnDestroy, OnInit {
    changePasswordForm = this.formBuilder.group({
        password: '',
        confirmPassword: '',
    });

    code: string;

    paramsSubscription: Subscription;

    loading = true;

    constructor(
        private formBuilder: FormBuilder,
        private recoverService: RecoverService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params
            .pipe(
                mergeMap(({ code }) => {
                    this.code = code;

                    return this.recoverService.validateCode(this.code).pipe(take(1));
                })
            )
            .subscribe({
                next: () => (this.loading = false),
                complete: () => this.router.navigate(['/']),
            });
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
    }

    submit() {
        if(this.loading) {
            return;
        }

        this.loading = true;

        const clear = () => {
            this.loading = false;

            this.changePasswordForm.patchValue({
                password: '',
                confirmPassword: '',
            });
        };

        this.recoverService
            .changePassword(this.code, this.changePasswordForm.value as ChangePasswordBody)
            .pipe(take(1))
            .subscribe({ next: () => {
                this.loading = false;

                Swal.fire({
                    title: 'Good job!',
                    text: 'Your password was sucessfully updated!',
                    icon: 'success',
                });

                this.router.navigate(['/login']);
            }, complete: () => clear});
    }
}