import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{

  favoriteProducts: FavoriteType[] = [];
  product!: FavoriteType;
  count: number = 1;
  cart: CartType | null = null;
  serverStaticPath = environment.serverStaticPath;
  isProductInCart: boolean = false;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,
              ) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }

        this.favoriteProducts = data as FavoriteType[];
        console.log(this.favoriteProducts);

        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error) {
              throw new Error((cartData as DefaultResponseType).message);
            }
            const cartDataResponse = cartData as CartType;
            console.log(cartDataResponse);

            if (cartDataResponse && cartDataResponse.items.length > 0) {
              this.favoriteProducts = this.favoriteProducts.map(product => {
                if (cartDataResponse) {
                  const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
                  if (productInCart) {
                    product.countInCart = productInCart.quantity
                  }
                }
                return product;
              })
            }

          })
      });

  }

  removeFromFavorites(id: string): void {
      this.favoriteService.removeFavorite(id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            //..
            throw new Error(data.message);
          }
          this.favoriteProducts = this.favoriteProducts.filter(item => item.id !== id)

        })
  }

  updateCount(id: string, count: number) {
    if (this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.cart = data as CartType;
          this.updateFavoriteProducts(id, count);
        })
    }
  }

  addToCart(id: string) {
    this.cartService.updateCart(id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;
        this.updateFavoriteProducts(id, 1);

      })
  }

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        // this.countInCart = 0;
        // this.count = 1;
      })
  }

  updateFavoriteProducts (id: string, count: number) {
    this.favoriteProducts = this.favoriteProducts.map(product => {
      if (product.id === id) {
        return { ...product, countInCart: count };
      }
      return product;
    });
  }
}
