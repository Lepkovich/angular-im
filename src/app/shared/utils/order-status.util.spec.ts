import {OrderStatusUtil} from "./order-status.util";

describe('order status util', () => {

  it('should return name and color with no name and status', () => {
    const result  = OrderStatusUtil.getStatusAndColor(null);
    expect(result.name).not.toBe('');
    expect(result.color).not.toBe('');
  });








})
