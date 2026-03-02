import React, { useMemo } from "react";
import { Modal, Card, Row, Col, Typography } from "antd";
import SalesReportChart from "./SalesReportChart";
import "./../css/ReportModal.css";
import { theme } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  items: any[];
}

export default function ReportModal(props: Props) {
  const { open, onClose, items } = props;
   const { useToken } = theme;
  const { token } = useToken();
  const isDark = token.colorBgBase == "#000" ? true : false;

  const totalSpending = useMemo(() => {
    return items.reduce(
      (sum, it) => sum + Number(it.quantity) * Number(it.price),
      0
    );
  }, [items]);

  const highestCostItem = useMemo(() => {
    if (!items.length) return null;
    return items.reduce((max, it) => {
      const t = Number(it.quantity) * Number(it.price);
      const mt = Number(max.quantity) * Number(max.price);
      return t > mt ? it : max;
    }, items[0]);
  }, [items]);

  const averageCost = useMemo(() => {
    if (!items.length) return 0;
    return totalSpending / items.length;
  }, [items, totalSpending]);

  const highestTotal = highestCostItem
    ? Number(highestCostItem.quantity) * Number(highestCostItem.price)
    : 0;

  return (
    <Modal
      title="Report"
      rootClassName={isDark ? "zeta-dark-modal" : ""}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      className="report-modal"
    >
      <Row gutter={16} className="report-cards">
        <Col xs={24} md={8}>
          <Card className={isDark? "report-card dark": "report-card"}>
            <Typography.Text className="report-card-title">
              Total Spending
            </Typography.Text>
            <div className="report-card-value">${totalSpending.toFixed(2)}</div>
            <Typography.Text className={isDark ? "report-card-sub-dark" : "report-card-sub"}>
              {items.length} Items in total
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className={isDark? "report-card dark": "report-card"}>
            <Typography.Text className="report-card-title">
              Highest Cost Item
            </Typography.Text>
            <div className="report-card-value">${highestTotal.toFixed(2)}</div>
            <Typography.Text className="report-card-sub">
              {highestCostItem
                ? `${highestCostItem.name} (${highestCostItem.quantity} Unit)`
                : "-"}
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className={isDark? "report-card dark": "report-card"}>
            <Typography.Text className="report-card-title">
              Average Cost
            </Typography.Text>
            <div className="report-card-value">${averageCost.toFixed(2)}</div>
            <Typography.Text className="report-card-sub">Per Item</Typography.Text>
          </Card>
        </Col>
      </Row>

      <div className="sales-title">Sales Report</div>

      <div className="report-amchart-wrap">
        <SalesReportChart items={items} />
      </div>
    </Modal>
  );
}