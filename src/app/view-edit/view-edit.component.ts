import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'blog-view-edit',
	templateUrl: './view-edit.component.html',
	styleUrls: ['./view-edit.component.css']
})
export class ViewEditComponent implements OnInit {
	article: Article;

	constructor(private articleService: ArticleService,
		private route: ActivatedRoute, private location: Location) { }

	ngOnInit() {
		// FIXME: Mauvaise pratique -> subscribe dans subscribe...
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('id')) {
				let id: number = parseInt(paramMap.get('id'));
				this.articleService.read(id)
					.subscribe((article) => this.article = article);
			} else {
				this.article = undefined;
			}
		});
	}

	create(article: Article) {
		this.articleService.create(article)
			.subscribe({
				next: (newArticle) => console.log(`Article ${newArticle} créé !`),
				error: (errorMessage) => console.log(`Impossible de créer l'article ${article} : ${errorMessage}`),
				complete: () => {
					console.log('Création du nouvel article terminée avec succès !');
					this.location.back();
				}
			});
	}

	update(article: Article) {
		this.articleService.update(article)
			.subscribe({
				complete: () => {
					console.log(`Article d'id ${article.id} mis à jour avec succès`);
					this.location.back();
				},
				error: (message) => console.log(`Impossible de mettre à jour l'article : ${message}`)
			});
	}

}
