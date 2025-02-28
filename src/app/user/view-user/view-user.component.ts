import { AsyncPipe, DatePipe } from '@angular/common'
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { IUser, User } from '../user/user'

@Component({
  selector: 'app-view-user',
  template: `
    @if (currentUser$ | async; as currentUser) {
      <div>
        <mat-card appearance="outlined">
          <mat-card-header>
            <div mat-card-avatar><mat-icon>account_circle</mat-icon></div>
            <mat-card-title>{{ currentUser.fullName }}</mat-card-title>
            <mat-card-subtitle>{{ currentUser.role }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><span class="mat-input bold">E-mail</span></p>
            <p>{{ currentUser.email }}</p>
            <p><span class="mat-input bold">Date of Birth</span></p>
            <p>{{ currentUser.dateOfBirth | date: 'mediumDate' }}</p>
          </mat-card-content>
          @if (editMode) {
            <mat-card-actions>
              <button mat-button mat-raised-button (click)="editUser(currentUser._id)">
                Edit
              </button>
            </mat-card-actions>
          }
        </mat-card>
      </div>
    }
  `,
  styles: `
      .bold {
        font-weight: bold;
      }
    `,
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, AsyncPipe, DatePipe],
})
export class ViewUserComponent implements OnInit, OnChanges {
  @Input() user!: IUser
  readonly currentUser$ = new BehaviorSubject(new User())

  get editMode() {
    return !this.user
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.route.snapshot.data['user']) {
      this.currentUser$.next(this.route.snapshot.data['user'])
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentUser$.next(User.Build(changes['user'].currentValue))
  }

  editUser(id: string) {
    this.router.navigate(['/user/profile', id])
  }
}
