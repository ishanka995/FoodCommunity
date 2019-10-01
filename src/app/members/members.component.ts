import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  // @ts-ignore
  @ViewChild('f') signUpform: NgForm;
  gender = ['Male', 'Female'];
  RegisterForm: FormGroup;
  userNameValidation = /[a-zA-Z]{3,10}/;
  MobileValidation = /[0-9]{10}/;
  constructor() {
  }

  ngOnInit() {
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
      MobileNo: new FormControl('', [
        Validators.required,
        this.MobileNumberValidation.bind(this)
      ]),
      Gender: new FormControl('Male', Validators.required),
      hobbies: new FormArray([])
    });
  }

  onSubmit() {
    console.log(this.signUpform);
    this.signUpform.reset();
  }

  RegSubmit() {
    console.log(this.RegisterForm);
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
