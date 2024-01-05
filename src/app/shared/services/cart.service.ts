import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CartType} from "../../../types/cart.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  count: number = 0;

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartType> {
    return this.http.get<CartType>(environment.api + 'cart', {withCredentials: true});
  }
// флаг {withCredentials: true} добавляет к запросу на сервер отправку необходимых нам cookie (по умолчанию Angular их не добавляет)
  updateCart(productId: string, quantity: number): Observable<CartType> {
    return this.http.post<CartType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true});
  }

  getCartCount(): Observable<{count: number}> {
    return this.http.get<{count: number}>(environment.api + 'cart/count', {withCredentials: true});
  }


}
