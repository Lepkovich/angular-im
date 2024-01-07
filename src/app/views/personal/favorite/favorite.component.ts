import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }

        this.products = data as FavoriteType[];

      })
  }

  removeFromFavorites(id: string): void {
      this.favoriteService.removeFavorite(id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            //..
            throw new Error(data.message);
          }
          this.products = this.products.filter(item => item.id !== id)

        })
  }
}
