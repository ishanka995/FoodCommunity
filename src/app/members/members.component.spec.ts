import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { MembersComponent } from './members.component';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let mockRouter: any;
  let mockLocalStorage: any;

  beforeEach(async(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem').and.returnValue(null),
      removeItem: jasmine.createSpy('removeItem').and.returnValue(null)
    };

    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This calls ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('RegisterForm Validation', () => {
    it('FName should be invalid if empty', () => {
      component.RegisterForm.controls['FName'].setValue('');
      expect(component.RegisterForm.controls['FName'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['FName'].errors['required']).toBeTruthy();
    });

    it('FName should be invalid if less than 3 characters (UserNameValidator)', () => {
      component.RegisterForm.controls['FName'].setValue('ab');
      expect(component.RegisterForm.controls['FName'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['FName'].errors['Name is invalid']).toBeTruthy();
    });

    it('FName should be valid if 3 or more characters (UserNameValidator)', () => {
      component.RegisterForm.controls['FName'].setValue('abc');
      expect(component.RegisterForm.controls['FName'].valid).toBeTruthy();
    });

    it('LName should be invalid if empty', () => {
      component.RegisterForm.controls['LName'].setValue('');
      expect(component.RegisterForm.controls['LName'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['LName'].errors['required']).toBeTruthy();
    });

    it('LName should be invalid if less than 3 characters (UserNameValidator)', () => {
      component.RegisterForm.controls['LName'].setValue('xy');
      expect(component.RegisterForm.controls['LName'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['LName'].errors['Name is invalid']).toBeTruthy();
    });
    
    it('LName should be valid if 3 or more characters (UserNameValidator)', () => {
      component.RegisterForm.controls['LName'].setValue('xyz');
      expect(component.RegisterForm.controls['LName'].valid).toBeTruthy();
    });

    it('signupEmail should be invalid if empty', () => {
      component.RegisterForm.controls['signupEmail'].setValue('');
      expect(component.RegisterForm.controls['signupEmail'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['signupEmail'].errors['required']).toBeTruthy();
    });

    it('signupEmail should be invalid for incorrect email format', () => {
      component.RegisterForm.controls['signupEmail'].setValue('test');
      expect(component.RegisterForm.controls['signupEmail'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['signupEmail'].errors['email']).toBeTruthy();
    });

    it('signupEmail should be valid for correct email format', () => {
      component.RegisterForm.controls['signupEmail'].setValue('test@example.com');
      expect(component.RegisterForm.controls['signupEmail'].valid).toBeTruthy();
    });

    it('MobileNo should be invalid if empty', () => {
      component.RegisterForm.controls['MobileNo'].setValue('');
      expect(component.RegisterForm.controls['MobileNo'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['MobileNo'].errors['required']).toBeTruthy();
    });

    it('MobileNo should be invalid for incorrect mobile number format (MobileNumberValidation)', () => {
      component.RegisterForm.controls['MobileNo'].setValue('123');
      expect(component.RegisterForm.controls['MobileNo'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['MobileNo'].errors['NumberInvalid']).toBeTruthy();
    });

    it('MobileNo should be valid for correct 10-digit mobile number format', () => {
      component.RegisterForm.controls['MobileNo'].setValue('1234567890');
      expect(component.RegisterForm.controls['MobileNo'].valid).toBeTruthy();
    });

    it('password should be invalid if empty', () => {
      component.RegisterForm.controls['password'].setValue('');
      expect(component.RegisterForm.controls['password'].valid).toBeFalsy();
      expect(component.RegisterForm.controls['password'].errors['required']).toBeTruthy();
    });

    it('password should be valid if not empty', () => {
      component.RegisterForm.controls['password'].setValue('password123');
      expect(component.RegisterForm.controls['password'].valid).toBeTruthy();
    });
  });

  describe('LoginForm Validation', () => {
    it('loginEmail should be invalid if empty', () => {
      component.loginForm.controls['loginEmail'].setValue('');
      expect(component.loginForm.controls['loginEmail'].valid).toBeFalsy();
      expect(component.loginForm.controls['loginEmail'].errors['required']).toBeTruthy();
    });

    it('loginEmail should be invalid for incorrect email format', () => {
      component.loginForm.controls['loginEmail'].setValue('test');
      expect(component.loginForm.controls['loginEmail'].valid).toBeFalsy();
      expect(component.loginForm.controls['loginEmail'].errors['email']).toBeTruthy();
    });

    it('loginEmail should be valid for correct email format', () => {
      component.loginForm.controls['loginEmail'].setValue('test@example.com');
      expect(component.loginForm.controls['loginEmail'].valid).toBeTruthy();
    });

    it('loginPassword should be invalid if empty', () => {
      component.loginForm.controls['loginPassword'].setValue('');
      expect(component.loginForm.controls['loginPassword'].valid).toBeFalsy();
      expect(component.loginForm.controls['loginPassword'].errors['required']).toBeTruthy();
    });

    it('loginPassword should be valid if not empty', () => {
      component.loginForm.controls['loginPassword'].setValue('password123');
      expect(component.loginForm.controls['loginPassword'].valid).toBeTruthy();
    });
  });

  describe('RegSubmit (Registration)', () => {
    beforeEach(() => {
      // Reset spies and mock return values before each test in this describe block
      mockLocalStorage.getItem.calls.reset();
      mockLocalStorage.setItem.calls.reset();
      component.registrationSuccess = null;
      component.registrationError = null;
    });

    it('should successfully register a new user and set success message', () => {
      mockLocalStorage.getItem.and.returnValue('[]'); // No existing users
      component.RegisterForm.setValue({
        FName: 'New', LName: 'User', signupEmail: 'new@example.com',
        password: 'password', MobileNo: '1234567890', Gender: 'Male', hobbies: []
      });
      component.RegSubmit();

      const expectedUser = {
        FName: 'New', LName: 'User', signupEmail: 'new@example.com',
        password: 'password', MobileNo: '1234567890', Gender: 'Male'
      };
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('users', JSON.stringify([expectedUser]));
      expect(component.registrationSuccess).toBe('Registration successful! You can now log in.');
      expect(component.registrationError).toBeNull();
      // Check if form is reset (one way to check: FName is null or empty)
      expect(component.RegisterForm.controls['FName'].value).toBeNull();
    });

    it('should set error message if email already exists', () => {
      const existingUsers = [{ FName: 'Old', LName: 'User', signupEmail: 'old@example.com', password: 'oldpassword' }];
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(existingUsers));
      component.RegisterForm.setValue({
        FName: 'New', LName: 'User', signupEmail: 'old@example.com', // Existing email
        password: 'password', MobileNo: '1234567890', Gender: 'Male', hobbies: []
      });
      component.RegSubmit();

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(component.registrationError).toBe('Email already exists. Please try a different email.');
      expect(component.registrationSuccess).toBeNull();
    });
  });

  describe('onLoginSubmit (Login)', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.calls.reset();
      mockLocalStorage.setItem.calls.reset();
      mockRouter.navigate.calls.reset();
      component.loginSuccess = null;
      component.loginError = null;
    });

    it('should set activeUser, success message, and navigate on successful login', () => {
      const users = [{ FName: 'Test', LName: 'User', signupEmail: 'test@example.com', password: 'password' }];
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(users)); // Mock 'users'
      component.loginForm.setValue({ loginEmail: 'test@example.com', loginPassword: 'password' });
      component.onLoginSubmit();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('activeUser', JSON.stringify(users[0]));
      expect(component.loginSuccess).toBe('Login successful! Redirecting...');
      expect(component.loginError).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
      expect(component.loginForm.controls['loginEmail'].value).toBeNull(); // Form reset
    });

    it('should set error message and not set activeUser on failed login (wrong password)', () => {
      const users = [{ FName: 'Test', LName: 'User', signupEmail: 'test@example.com', password: 'password' }];
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(users));
      component.loginForm.setValue({ loginEmail: 'test@example.com', loginPassword: 'wrongpassword' });
      component.onLoginSubmit();

      expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(jasmine.stringMatching('activeUser'), jasmine.any(String));
      expect(component.loginError).toBe('Invalid email or password.');
      expect(component.loginSuccess).toBeNull();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should set error message if user not found', () => {
      mockLocalStorage.getItem.and.returnValue('[]'); // No users in storage
      component.loginForm.setValue({ loginEmail: 'nouser@example.com', loginPassword: 'password' });
      component.onLoginSubmit();

      expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(jasmine.stringMatching('activeUser'), jasmine.any(String));
      expect(component.loginError).toBe('Invalid email or password.');
      expect(component.loginSuccess).toBeNull();
    });
  });
});
