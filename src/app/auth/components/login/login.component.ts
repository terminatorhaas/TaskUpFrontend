import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

/*
Component for Login of User
*/
@Component({
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

	//Login Form
	loginForm: FormGroup;
	submitted = false;
	returnUrl: string;
	error: string;

	//Errors for Form
	error_messages = {
		'email': [
		  { type: 'required', message: 'Email ist benötigt.' },
		  { type: 'email', message: 'gib eine valide Email ein.' }
		],
	
		'password': [
		  { type: 'required', message: 'Passwort ist benötigt.' }
		],
	}
	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService
	) {
		//Validators
		this.loginForm = this.formBuilder.group({
			email: new FormControl('', Validators.compose([
			  Validators.required,
			  Validators.email
			])),
			password: new FormControl('', Validators.compose([
			  Validators.required
			])),
		});
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
		// get login status
		console.log("currentUser"+ this.authService.currentUserValue)
		if(this.authService.currentUserValue!=null){
			this.router.navigate(["/"]);
		}

	}

	//fast way to get loginControls
	get f() {
		return this.loginForm.controls;
	}

	//submit to get logged in
	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.authService
			.login(this.f.email.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					this.error = '';
					console.log("current User: " + this.authService.currentUserValue);
					this.router.navigate([this.returnUrl]);
					console.log(this.returnUrl);
				},
				error => {
					this.error = error;
				}
			);
	}
}
