import {DeliveryType} from "./delivery.type";
import {PaymentType} from "./payment.type";
import {OrderStatusType} from "./order-status.type";

export type OrderType = {
  deliveryType: DeliveryType,
  firstName: string,
  fatherName?: string,
  lastName: string,
  phone: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,
  comment?: string,
  items?: {
    id: string,
    name: string,
    quantity: number,
    price: number,
    total: number
  }[],
  totalAmount?: number,
  status?: OrderStatusType, //статус заказа на странице order
  statusRus?: string, //для утилиты OrderStatusUtil
  color?: string //для утилиты OrderStatusUtil
}
