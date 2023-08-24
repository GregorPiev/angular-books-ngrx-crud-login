import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { logout } from 'src/app/auth/store/auth.action';
import { selectUser } from 'src/app/auth/store/auth.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user!: string;

  constructor(
    private store: Store,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUser();
  }

  logout(): void{
    this.store.dispatch(logout());
    this.checkUser();
  }

  checkUser() {
    this.store.pipe(select(selectUser))
      .subscribe((userStore: string) => {
        if (userStore !== "") {
          this.user = userStore;
        } else {
          this.user = '';
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
    })
  }

}
