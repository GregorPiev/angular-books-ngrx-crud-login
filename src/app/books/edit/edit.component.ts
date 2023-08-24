import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { invokeUpdateBookAPI } from '../store/books.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { selectBookById } from '../store/books.selector';
import { setAPIStatus } from '../../shared/store/app.action';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  bookForm: Books = {
    id: 0,
    author: '',
    name: '',
    cost: 0,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>
  ) { }

  ngOnInit(): void {
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((param) => {
        const id = Number(param.get('id'));
        return this.store.pipe(select(selectBookById(id)));
      })
    );

    fetchData$.subscribe((data) => {
      if (data) {
        this.bookForm = { ...data };
      }
      else {
        this.router.navigate(['/books']);
      }
    })
  }

  update() {
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm } })
    );

    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({
            apiStatus: { apiResponseMessage: '', apiStatus: '' }
          })
        );
        this.router.navigate(['/books']);
      }
    });
  }
}
