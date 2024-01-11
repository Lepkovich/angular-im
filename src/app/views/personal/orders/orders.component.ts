import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../shared/services/order.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {OrderType} from "../../../../types/order.type";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{

  orders: OrderType[] = [];

  constructor(private orderService: OrderService) {
  }
  ngOnInit() {
    this.orderService.getOrders()
      .subscribe((data: DefaultResponseType | OrderType[]) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.orders = data as OrderType[];
      })
  }
}
