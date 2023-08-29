import { Component, Inject, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { Router } from '@angular/router';
import { invokeSaveNewBookApi } from '../store/books.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { setAPIStatus } from 'src/app/shared/store/app.action';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  titleConfirm?: string;
  messageConfirm?: string;

  bookForm: Books = {
    id: 0,
    author: '',
    name: '',
    cost: 0
  }

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private router: Router,
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  ngOnInit(): void{
    this.titleConfirm = this.data.title;
    this.messageConfirm = this.data.message;
  }

  save():void{
    this.store.dispatch(invokeSaveNewBookApi({newBook: this.bookForm}));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));

    apiStatus$.subscribe((apState) => {
      if(apState.apiStatus ==='success') {
        this.appStore.dispatch(
          setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: ''}})
        );
        this.onConfirm();
      }
    })

  };

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
