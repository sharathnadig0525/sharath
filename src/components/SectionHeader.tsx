import React from "react";
import { Button } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import "./../css/SectionHeader.css";

interface SectionHeaderProps {
  title: string;
  rightText?: string;
  onRightClick?: () => void;
}

export default function SectionHeader({
  title,
  rightText,
  onRightClick,
}: SectionHeaderProps) {

  return (
    <div className="section-header">
      <div className="section-header-left">
        <img src="/static/icons/cart.svg" alt="Cart" />
        <span className="section-title">{title}</span>
      </div>

      <div className="section-header-right">
        {rightText ? (
          <Button
            className="section-btn"
            icon={<BarChartOutlined />}
            onClick={onRightClick}
          >
            {rightText}
          </Button>
        ) : null}
      </div>
    </div>
  );
}