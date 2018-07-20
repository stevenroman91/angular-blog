import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Article } from './article';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private subject:BehaviorSubject<Array<Article>>; 
  private apiUrl : string ; 

  constructor(private httpClient: HttpClient) { 
    this.subject = new BehaviorSubject(new Array()) ;  
    this.apiUrl = ENV.apiUrl + '/article' ;
  }

  get articles() : Observable<Array<Article>>{
    return this.subject.asObservable();
  } 

  loadMock(){
    this.httpClient.get<Array<Article>>(ENV.mockUrl)
			.subscribe((list) => {
				this.subject.next(list);
			});
  }

  list():Observable<Array<Article>> {
    this.httpClient.get<Array<Article>>(this.apiUrl)
			.subscribe((list) => 
				this.subject.next(list));
			
    return this.articles ;
  }

  // Renvoyer un observable sur un seul article crée 
  create(article: Article):Observable<Article>{
    let result = new Subject<Article>() ;
    this.httpClient.post<Article>(this.apiUrl, article)
      .subscribe((newArticle) => {
        // Si HTTP POST success --> result.next(new Article) && result.complete 
        this.republish(null, newArticle) ;
        result.next(newArticle);
        result.complete() ;
      }, (response:HttpErrorResponse) => {
       // sinon si erreur --> result.error(errorMessage)
       result.error(response.message) ;
      });
    
    
    return result ;    
  }

  read(id: number):Observable<Article>{
    let result = new Subject<Article>();
    this.httpClient.get<Article>(this.apiUrl + `/${id}`)
    .subscribe(
      (article) => result.next(article),
      (response:HttpErrorResponse)=>result.error(response.message));
    return result ;
  }

  update(article: Article):Observable<Article>{
    let result = new Subject<Article>();
    this.httpClient.put<Article>(this.apiUrl,article)
    .subscribe((updateArticle) => {
        this.republish(article.id,updateArticle);
        result.next(updateArticle);
        result.complete();
    },(resp:HttpErrorResponse)=>result.error(resp.message)
    );
    return result ;
  }

  delete(id: number):Observable<void>{
    let result = new Subject<void>();
    this.httpClient.delete(this.apiUrl + `/${id}`).subscribe(
      ()=> {
         this.republish(id,null);
         result.complete();
      },
      (response: HttpErrorResponse) => result.error(response.message)
    );
    return result; 
  }

  private republish(id:number, article:Article){
    let currentArticles = this.subject.value.slice() ; 
    if (id === null){
      // Creation
      currentArticles.push(article);
    } else {
      // Recuperation de l'indice de l'article a mettre a jour ou supprimer
      let index = currentArticles.findIndex((a) => a.id === id);
      if (index >= 0 && article) {
        //MAJ
        currentArticles.splice(index, 1, article);

      } else if (index >= 0) {
        // Suppression
        currentArticles.splice(index, 1);
      } else {
        console.log(`Impossible de traiter une operation sur un article inexistant (id=${id})`)
      }
    }
    // Recuperer la nouvelle liste a jour 
    this.subject.next(currentArticles) ;
  }


}
