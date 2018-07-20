import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Article } from '../article';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnChanges {
	@Input() article: Article;
	@Output() onCreate: EventEmitter<Article>;
	@Output() onUpdate: EventEmitter<Article>;
	private model: Article;

	constructor() {
		this.model = new Article();
		this.onCreate = new EventEmitter();
		this.onUpdate = new EventEmitter();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.article.currentValue) {
			this.model = this.article;
		} else {
			this.model = new Article();
		}
	}

	submit(form: NgForm) {
		let data: Article = JSON.parse(JSON.stringify(this.model));
		if (this.article) {
			this.onUpdate.emit(data)
		} else {
			this.onCreate.emit(data);
		}
		form.resetForm();
	}

}
