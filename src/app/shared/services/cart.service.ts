import { Injectable } from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  count: number = 0;
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }
// флаг {withCredentials: true} добавляет к запросу на сервер отправку необходимых нам cookie (по умолчанию Angular их не добавляет)

  updateCart(productId: string, quantity: number): Observable<CartType  | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.count = 0;
            (data as CartType).items.forEach(item => {
              this.count += item.quantity;
            }); //обновили кол-во товаров в корзине
            this.count$.next(this.count); //передали его в subject
          }
        })
      );
  }

  getCartCount(): Observable<{count: number}  | DefaultResponseType> {
    return this.http.get<{count: number}  | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            this.count = (data as {count: number}).count; //обновили кол-во товаров в корзине
            this.count$.next(this.count); //передали его в subject
          }
        })
      );
  }


}
