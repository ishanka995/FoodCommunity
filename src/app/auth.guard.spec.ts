import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: any;
  let mockLocalStorage: any;

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null)
      // No need for setItem or removeItem for these tests
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Import RouterTestingModule for router-related services
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(AuthGuard);

    // Override localStorage methods for testing
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in (activeUser exists in localStorage)', () => {
    mockLocalStorage.getItem.and.returnValue(JSON.stringify({ FName: 'Test', LName: 'User' })); // Simulate a logged-in user
    
    // Mock ActivatedRouteSnapshot and RouterStateSnapshot as needed by canActivate
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = {} as RouterStateSnapshot;

    const canActivate = guard.canActivate(dummyRoute, dummyState);
    expect(canActivate).toBeTrue();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('activeUser');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and navigate to /members if user is not logged in (activeUser is null)', () => {
    mockLocalStorage.getItem.and.returnValue(null); // Simulate no user is logged in
    
    const dummyRoute = {} as ActivatedRouteSnapshot;
    // Provide a URL for the RouterStateSnapshot as the guard uses it for returnUrl
    const dummyState = { url: '/profile' } as RouterStateSnapshot;

    const canActivate = guard.canActivate(dummyRoute, dummyState);
    expect(canActivate).toBeFalse();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('activeUser');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/members'], { queryParams: { returnUrl: '/profile' } });
  });

  it('should prevent activation if activeUser in localStorage is an empty string (or invalid JSON)', () => {
    mockLocalStorage.getItem.and.returnValue(''); // Simulate an empty string, which is falsy but might not be null
    
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/testpage' } as RouterStateSnapshot;

    const canActivate = guard.canActivate(dummyRoute, dummyState);
    expect(canActivate).toBeFalse(); // Or true depending on how robust the check is. Given current impl, it relies on truthy/falsy
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/members'], { queryParams: { returnUrl: '/testpage' } });
  });
});
