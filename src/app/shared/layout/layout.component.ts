import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";
import {CategoryType} from "../../../types/category.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit{

  categories: CategoryType[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.getCategories().
    subscribe((categories: CategoryType[]) => {
      this.categories = categories;
    })
  }
}
