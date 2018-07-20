import { Component, OnInit } from '@angular/core';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title: string;

	constructor(private articleService: ArticleService) {
		this.title = 'Bienvenue sur mon blog réalisé avec Angular 6.0.3 !';
	}

	ngOnInit() {
	}
}