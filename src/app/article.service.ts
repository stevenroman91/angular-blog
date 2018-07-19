import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from './article';
import { HttpClient } from '@angular/common/http';
import {  environment as ENV } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private subject: BehaviorSubject<Array<Article>>;

  constructor(private httpClient: HttpClient) {
    this.subject = new BehaviorSubject(new Array());
   }

  get articles(): Observable<Array<Article>>{
    return this.subject.asObservable();
  }

  loadMock(){
    this.httpClient.get<Array<Article>>(ENV.mockUrl)
			.subscribe((list) => {
				this.subject.next(list);
			});
  }
}
