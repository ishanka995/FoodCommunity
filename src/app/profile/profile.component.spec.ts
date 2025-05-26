import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockRouter: any;
  let mockLocalStorage: any;

  const mockUser = { FName: 'Test', LName: 'User', signupEmail: 'test@example.com' };

  beforeEach(async(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem').and.returnValue(null), // Not strictly needed for these tests
      removeItem: jasmine.createSpy('removeItem').and.returnValue(null)
    };

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [RouterTestingModule], // For routerLink in template if any, and router services
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    // Override localStorage methods
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    // spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem); // Not needed here
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here if ngOnInit relies on localStorage being set first
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set currentUser if activeUser exists in localStorage and not navigate', () => {
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(mockUser));
      fixture.detectChanges(); // Trigger ngOnInit

      expect(component.currentUser).toEqual(mockUser);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('activeUser');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /members if activeUser does not exist in localStorage', () => {
      mockLocalStorage.getItem.and.returnValue(null);
      fixture.detectChanges(); // Trigger ngOnInit

      expect(component.currentUser).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('activeUser');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/members']);
    });

    it('should navigate to /members if activeUser in localStorage is invalid JSON', () => {
      mockLocalStorage.getItem.and.returnValue('invalid JSON');
      // Spy on JSON.parse and make it throw an error for this specific case
      const originalJSONParse = JSON.parse;
      spyOn(JSON, 'parse').and.callFake((text) => {
        if (text === 'invalid JSON') {
          // Simulate the error that occurs with invalid JSON
          throw new SyntaxError('Unexpected token i in JSON at position 0');
        }
        // Fallback to original behavior for other JSON strings
        return originalJSONParse(text);
      });
      
      fixture.detectChanges(); // ngOnInit

      // Expect currentUser to be null because JSON.parse failed and it should be handled
      expect(component.currentUser).toBeNull(); 
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/members']);
      
      // Restore original JSON.parse to avoid interference with other tests
      (JSON.parse as jasmine.Spy).and.callThrough(); 
    });
  });

  describe('logout', () => {
    it('should remove activeUser from localStorage and navigate to /', () => {
      // Ensure component is initialized as if a user was logged in
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(mockUser));
      fixture.detectChanges(); // ngOnInit will set currentUser

      component.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('activeUser');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      // Optionally, check if currentUser is also cleared in the component
      // expect(component.currentUser).toBeNull(); // This behavior is not explicitly defined but could be a good practice
    });

    it('should navigate to / even if activeUser was not initially in localStorage', () => {
      mockLocalStorage.getItem.and.returnValue(null);
      fixture.detectChanges(); // ngOnInit will attempt to navigate

      component.logout(); // Call logout directly

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('activeUser'); 
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
