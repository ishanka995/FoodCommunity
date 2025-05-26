import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

interface User {
  FName: string;
  LName: string;
  signupEmail: string;
  // Add other fields if they are stored, like hobbies or gender
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    const activeUserString = localStorage.getItem('activeUser');
    if (activeUserString) {
      this.currentUser = JSON.parse(activeUserString);
    } else {
      // If no active user, redirect to login page or home.
      // For now, we can assume AuthGuard will handle this,
      // but as a fallback or for immediate effect:
      this.router.navigate(['/members']); // Or your login route
    }
  }

  logout(): void {
    localStorage.removeItem('activeUser');
    // Optionally, remove the whole 'users' list if you want to clear all data on logout for testing
    // localStorage.removeItem('users');
    this.router.navigate(['/']); // Navigate to home page or login page
  }
}
