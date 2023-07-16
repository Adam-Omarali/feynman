import React, { MouseEventHandler } from "react";
import "../../../styles/menu-item.css";
import "remixicon/fonts/remixicon.css";

export default ({
  icon,
  title,
  action,
  isActive = null,
}: {
  icon?: string;
  title?: string;
  action?: MouseEventHandler<HTMLButtonElement>;
  isActive?: Function | null;
}) => (
  <button
    className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
    onClick={action}
    title={title}
  >
    <i className={"remixicon-" + icon}></i>
  </button>
);
