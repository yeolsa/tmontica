import * as React from "react";
import "./styles.scss";

export interface IOrderListItemProps {
  orderId: number;
  name: string;
  date: string;
  status: string;
}

function OrderListItem(props: IOrderListItemProps) {
  const { orderId, name, date, status } = props;

  return (
    <li
      className={
        status === "준비완료"
          ? "orders-list__item orders-list__item--ready"
          : status === "픽업완료"
          ? "orders-list__item orders-list__item--pickuped"
          : "orders-list__item"
      }
    >
      <div className="orders-list__item-left">
        <span className="orders-list__item-number">{orderId}</span>
        <span className="orders-list__item-names">{name}</span>
      </div>
      <div className="orders-list__item-right">
        <span className="orders-list__item-date">{date}</span>
        <span className="orders-list__item-status">{status}</span>
      </div>
    </li>
  );
}

export default OrderListItem;
