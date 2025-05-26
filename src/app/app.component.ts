import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SampleProject';
  isUserLoggedIn: boolean = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkLoginStatus() {
    this.isUserLoggedIn = !!localStorage.getItem('activeUser');
  }

  logout() { // Add a logout method here if placing logout button in app.component
    localStorage.removeItem('activeUser');
    this.checkLoginStatus(); // Update status
    this.router.navigate(['/members']); // Navigate to login
  }
}
