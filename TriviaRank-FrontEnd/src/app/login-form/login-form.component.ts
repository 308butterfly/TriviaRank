import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    )
    {
      this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    }

  get f(): any { if (this.form) { return this.form.controls; } }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form && this.form.invalid) {
        return;
    }

    if (this.f)
    {
      this.accountService.login(this.f.username.value, this.f.password.value)
        .pipe(
          catchError(err => {
            this.submitted = false;
            return of(err);
          })
        )
        .subscribe(p => {
          if (p.hasOwnProperty('username')) {
            localStorage.setItem('user', JSON.stringify(p));
            this.accountService.user = p;
            this.router.navigateByUrl('/home');
            console.log(`retrieved player ${p}`);
          }
        });
    }
  }
}
