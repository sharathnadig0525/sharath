import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { theme } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useShopping } from "../context/ShoppingContext";
import { ShoppingItem } from "../types";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

type SortKey = "name" | "quantity" | "price" | "date" | "total" | "categoryId" | "subCategoryId";


interface Props {
  data: ShoppingItem[];
  onSort: (key: SortKey) => void;
  sortState: { key: SortKey; order: "asc" | "desc" } | null;
}

export default function ShoppingTable({
  data,
  onSort,
  sortState,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { categories, subCategories } = useShopping();
  const { visible, handleScroll } = useInfiniteScroll(data, 15);
  const { useToken } = theme;
  const { token } = useToken();
  const isDark = token.colorBgBase === "#000" ? true : false;

  const zetaSortIcon = ({ sortOrder }: { sortOrder: SortOrder }): ReactNode => {
    if (sortOrder === "ascend") return <ArrowUpOutlined className="zeta-sort-icon active" />;
    if (sortOrder === "descend") return <ArrowDownOutlined className="zeta-sort-icon active" />;
    return !isDark ? <img src="static/icons/sort.svg" alt="Sort" /> : <img src="static/icons/sort-dark.svg" alt="Sort" />;
  };


  useEffect(() => {
    const body = wrapperRef.current?.querySelector(
      ".ant-table-body"
    ) as HTMLElement | null;

    if (!body) return;

    const onScroll = () => handleScroll(body);
    body.addEventListener("scroll", onScroll);

    return () => body.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  function isNew(createdAt: number) {
    return Date.now() - createdAt < 5 * 60 * 1000;
  }

  function getCategoryName(id: string) {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  }

  function getSubCategoryName(id: string) {
    const sub = subCategories.find((s) => s.id === id);
    return sub ? sub.name : id;
  }

  function getSortOrder(key: SortKey): SortOrder | undefined {
    if (!sortState || sortState.key !== key) return undefined;
    return sortState.order === "asc" ? "ascend" : "descend";
  }

  const columns: ColumnsType<ShoppingItem> = [
    {
      title: "Item Name",
      dataIndex: "name",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("name"),
      onHeaderCell: () => ({
        onClick: () => onSort("name"),
        style: { cursor: "pointer" },
      }),
      render: (text, record) => (
        <span>
          {text}
          {isNew(record.createdAt) && (
            <Tag color={"blue"} style={{
              border: "1px solid #C1DAFF",
              background: "#E3EEFF",
              color: "#1677FF",
              borderRadius: 4,
              padding: "0 8px",

              height: 16,
              lineHeight: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: 10,
              fontWeight: 500,
              marginLeft: 8
            }}>
              New
            </Tag>
          )
          }
        </span >
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("categoryId"),
      onHeaderCell: () => ({
        onClick: () => onSort("categoryId"),
        style: { cursor: "pointer" },
      }),
      render: (v) => getCategoryName(v),
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryId",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("subCategoryId"),
      onHeaderCell: () => ({
        onClick: () => onSort("subCategoryId"),
        style: { cursor: "pointer" },
      }),
      render: (v) => getSubCategoryName(v),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("quantity"),
      onHeaderCell: () => ({
        onClick: () => onSort("quantity"),
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("price"),
      onHeaderCell: () => ({
        onClick: () => onSort("price"),
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Total",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("total"),
      onHeaderCell: () => ({
        onClick: () => onSort("total"),
        style: { cursor: "pointer" },
      }),
      render: (_, r) => r.quantity * r.price,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
      sortIcon: zetaSortIcon,
      sortOrder: getSortOrder("date"),
      onHeaderCell: () => ({
        onClick: () => onSort("date"),
        style: { cursor: "pointer" },
      }),
      render: (v) => new Date(v).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  const [tableHeight, setTableHeight] = useState(400);
  useEffect(() => {
    function updateHeight() {
      setTableHeight(window.innerHeight - 350);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={wrapperRef}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={visible}
        pagination={false}
        scroll={{ y: tableHeight }}
      />
    </div>
  );
}