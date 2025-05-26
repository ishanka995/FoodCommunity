import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  gender = ['Male', 'Female'];
  RegisterForm: FormGroup;
  loginForm: FormGroup;
  loginError: string | null = null;
  loginSuccess: string | null = null;
  registrationError: string | null = null;
  registrationSuccess: string | null = null;
  userNameValidation = /[a-zA-Z]{3,10}/;
  MobileValidation = /[0-9]{10}/;
  constructor(private router: Router) { // Inject in constructor
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      loginEmail: new FormControl(null, [Validators.required, Validators.email]),
      loginPassword: new FormControl(null, [Validators.required])
    });

    this.RegisterForm = new FormGroup({
      FName: new FormControl(null, [
          Validators.required,
          this.UserNameValidator.bind(this)
        ]
      ),
      LName: new FormControl(null, [
          Validators.required,
          this.UserNameValidator.bind(this)
        ]
      ),
      signupEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]
      ),
      password: new FormControl(null, Validators.required),
      MobileNo: new FormControl('', [
        Validators.required,
        this.MobileNumberValidation.bind(this)
      ]),
      Gender: new FormControl('Male', Validators.required),
      hobbies: new FormArray([])
    });
  }

  onLoginSubmit() {
    this.loginError = null;
    this.loginSuccess = null;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (user: any) => user.signupEmail === this.loginForm.value.loginEmail && user.password === this.loginForm.value.loginPassword
    );

    if (foundUser) {
      localStorage.setItem('activeUser', JSON.stringify(foundUser));
      this.loginSuccess = 'Login successful! Redirecting...';
      this.router.navigate(['/profile']);
    } else {
      this.loginError = 'Invalid email or password.';
    }
    this.loginForm.reset();
  }

  RegSubmit() {
    this.registrationError = null;
    this.registrationSuccess = null;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.signupEmail === this.RegisterForm.value.signupEmail);

    if (existingUser) {
      this.registrationError = 'Email already exists. Please try a different email.';
    } else {
      const newUser = {
        FName: this.RegisterForm.value.FName,
        LName: this.RegisterForm.value.LName,
        signupEmail: this.RegisterForm.value.signupEmail,
        password: this.RegisterForm.value.password, // Ensure this is added to the form
        MobileNo: this.RegisterForm.value.MobileNo,
        Gender: this.RegisterForm.value.Gender
        // Not storing hobbies for simplicity, but you could if needed
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      this.registrationSuccess = 'Registration successful! You can now log in.';
      this.RegisterForm.reset();
      this.RegisterForm.patchValue({ Gender: 'Male' });
      (this.RegisterForm.get('hobbies') as FormArray).clear();
    }
  }

  AddHobbies() {
    (this.RegisterForm.get('hobbies') as FormArray).push(new FormControl(null));
  }

  UserNameValidator(control: FormControl) {
    if (!this.userNameValidation.test(control.value)) {
      return {'Name is invalid': true};
    }
    return null;
  }
  MobileNumberValidation(control: FormControl) {
   if (!this.MobileValidation.test(control.value)) {
     return{NumberInvalid: true};
   }
   return null;
  }

}
