import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Article } from '../article';
import { NgForm } from '@angular/forms';

let ID_COUNT: number = 0;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
	@Input() article: Article;
	@Output() onCreate: EventEmitter<Article>;
	@Output() onUpdate: EventEmitter<Article>;
	private model: Article;

	constructor() {
		this.model = new Article();
		this.model.id = ++ID_COUNT;
		this.onCreate = new EventEmitter();
		this.onUpdate = new EventEmitter();
	}

	ngOnInit() {
		if (this.article) {
			this.model = this.article;
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
