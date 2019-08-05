import * as React from "react";
import OrderListItem from "../OrderListItem";
import "./styles.scss";
import { getOrderAll } from "../../api/order";
import _ from "underscore";
import { TOrderAllRes, IOrder } from "../../types/order";
import { TCommonError } from "../../types/error";
import { CommonError } from "../../api/CommonError";

export interface IOrderListProps {
  handleOrderListItemClick(orderId: number): void;
}

export interface IOrderListState extends TOrderAllRes {}

class OrderList extends React.Component<IOrderListProps, IOrderListState> {
  state = {
    orders: []
  };

  async getOrderAll() {
    try {
      const data = await getOrderAll();

      if (!data) throw new Error("주문 내역이 존재하지 않습니다.");
      if (data instanceof CommonError) throw data;

      const { orders } = data;
      _.sortBy(orders, "orderId");
      orders.reverse();

      this.setState({
        orders
      });
    } catch (error) {
      if (!error.status) {
        alert("네트워크 오류 발생");
        return;
      }

      error.alertMessage();
    }
  }

  componentDidMount() {
    this.getOrderAll();
  }

  render() {
    const { handleOrderListItemClick } = this.props;
    const { orders } = this.state;
    return (
      <>
        <h1 className="orders-list__title">주문내역({orders.length})</h1>
        <div className="orders-list__content">
          <ul className="orders-list__items">
            {orders.length > 0
              ? _.map(orders, (o: IOrder) => {
                  const name =
                    o.menuNames.length > 0
                      ? `${o.menuNames[0]}${
                          o.menuNames.length > 1 ? `외 ${o.menuNames.length - 1}개` : ``
                        }`
                      : "";

                  const dateString = new Date(o.orderDate).toLocaleDateString();
                  return (
                    <OrderListItem
                      key={o.orderId}
                      orderId={o.orderId}
                      name={name}
                      date={dateString}
                      status={o.status}
                      handleOrderListItemClick={handleOrderListItemClick}
                    />
                  );
                })
              : ""}
          </ul>
        </div>
      </>
    );
  }
}

export default OrderList;