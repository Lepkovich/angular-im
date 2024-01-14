import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchField = new FormControl();
  showedSearch: boolean = false;
  products: ProductType[] = [];
  isLogged: boolean = false;
  count: number = 0;

  @Input() categories: CategoryWithTypeType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private productService: ProductService,
              private cartService: CartService) {
    this.isLogged = authService.isLoggedIn()
  }

  ngOnInit() {

    this.searchField.valueChanges
      .pipe(
        debounceTime(500) //подождем полсекунды прежде чем вызывать subscribe
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
            });
        } else {
          this.products = [];
        }
      })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;

      });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы')
    this.router.navigate(['/']);
  }

  // changedSearchValue(newValue: string) {
  //     this.searchValue = newValue;
  //     if (this.searchValue && this.searchValue.length > 2) {
  //       this.productService.searchProducts(this.searchValue)
  //         .subscribe((data: ProductType[]) => {
  //           this.products = data;
  //         });
  //     } else {
  //       this.products = [];
  //     }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue(''); //очистили строку поиска
    this.products = []; //очистили найденные продукты
  }

  changeShowedSearch(value: boolean) {
    setTimeout(() => {
      //задержим скрытие блока поиска чтобы успел сработать обработчик клика
      this.showedSearch = value;
    }, 100)
  }
}
