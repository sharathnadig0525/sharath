import React, { useMemo, useState, lazy, Suspense } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  message,
  Typography,
} from "antd";
import { theme } from "antd";
import SectionHeader from "../components/SectionHeader";
import ShoppingTable from "../components/ShoppingTable";
import { useShopping } from "../context/ShoppingContext";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./../css/ShoppingListPage.css";
import { Spin } from "antd";

type SortKey = "name" | "quantity" | "price" | "date" | "total" | "categoryId" | "subCategoryId";

export default function ShoppingListPage() {
  const { categories, subCategories, items, addItem } = useShopping();
  const { useToken } = theme;
  const { token } = useToken();
  const [form] = Form.useForm();
  const currencyOptions = [
    { label: "$", value: "USD" },
    { label: "₹", value: "INR", disabled: true },
    { label: "£", value: "GBP", disabled: true },
  ];
  const ReportModal = lazy(() => import("../components/ReportModal"));
  const isDark = token.colorBgBase === "#000" ? true : false;

  const [filters, setFilters] = useState({
    categoryId: "all",
    subCategoryId: "all",
    search: "",
  });

  const [sort, setSort] =
    useState<{ key: SortKey; order: "asc" | "desc" } | null>(null);

  const [showReport, setShowReport] = useState(false);


  const selectedCategory = Form.useWatch("categoryId", form);

  const subOptionsForForm = useMemo(() => {
    if (!selectedCategory) return [];
    return subCategories.filter(
      (s: any) => s.categoryId === selectedCategory
    );
  }, [selectedCategory, subCategories]);


  const filtered = useMemo(() => {
    let data = [...items];

    if (filters.search) {
      data = data.filter((it) =>
        it.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.categoryId !== "all") {
      data = data.filter((it) => it.categoryId === filters.categoryId);
    }

    if (filters.subCategoryId !== "all") {
      data = data.filter((it) => it.subCategoryId === filters.subCategoryId);
    }

    return data.map((it) => ({
      ...it,
      total: it.quantity * it.price,
    }));
  }, [items, filters]);


  const sorted = useMemo(() => {
    if (!sort) return filtered;

    const dir = sort.order === "asc" ? 1 : -1;

    return [...filtered].sort((a: any, b: any) => {
      if (sort.key === "name") {
        return a.name.localeCompare(b.name) * dir;
      }

      if (sort.key === "categoryId") {
        return a.categoryId.localeCompare(b.categoryId) * dir;
      }

      if (sort.key === "subCategoryId") {
        return a.subCategoryId.localeCompare(b.subCategoryId) * dir;
      }

      if (sort.key === "date") {
        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
        );
      }

      return (Number(a[sort.key]) - Number(b[sort.key])) * dir;
    });
  }, [filtered, sort]);


  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key)
        return { key, order: "asc" };
      if (prev.order === "asc")
        return { key, order: "desc" };
      return null;
    });
  }


  function onAdd(values: any) {
    if (!values.name) {
      message.error("Enter item name");
      return;
    }

    const dt =
      values.date && values.date.$d
        ? new Date(values.date.$d)
        : new Date();

    addItem({
      name: values.name,
      categoryId: values.categoryId,
      subCategoryId: values.subCategoryId,
      quantity: Number(values.quantity),
      price: Number(values.price),
      date: dt.toISOString(),
    });

    message.success("Item added");
    form.resetFields();
  }


  // function exportJSON() {
  //   const blob = new Blob(
  //     [JSON.stringify(sorted, null, 2)],
  //     { type: "application/json" }
  //   );

  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "shopping_list.json";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // }

  function exportCSV() {
    const headers = [
      "Item Name",
      "Category",
      "SubCategory",
      "Quantity",
      "Price",
      "Total",
      "Date",
    ];

    const rows = sorted.map((it: any) => [
      it.name,
      it.categoryId,
      it.subCategoryId,
      it.quantity,
      it.price,
      it.total,
      new Date(it.date).toLocaleDateString(),
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping_list.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const isSubCategoryEnabled = filters.categoryId !== "all";


  const categoryOptions = [
    { label: "Select Categories", value: "all" },
    ...categories.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => ({ label: c.name, value: c.id })),
  ];


  const subCategoryOptions = [
    { label: "Select Sub Categories", value: "all" },
    ...subCategories.sort((a: any, b: any) => a.name.localeCompare(b.name))
      .filter((s: any) => s.categoryId === filters.categoryId)
      .map((s: any) => ({ label: s.name, value: s.id })),
  ];

  return (
    <>
      <SectionHeader
        title="Shopping List Application"
        rightText="View Report"
        onRightClick={() =>
          setShowReport(!showReport)
        }
      />

      <div className={isDark ? "formSecionHeader-dark" : "formSecionHeader"}>
        <Form form={form} layout="vertical" onFinish={onAdd}>
          <div className="addItemGrid">
            <Form.Item
              name="name"
              label="Item Name"
              required={false}
              rules={[{ required: true }]}
              className="grid-name"
            >
              <Input placeholder="Enter Item Name" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="Category"
              required={false}
              rules={[{ required: true }]}
              className="grid-category"
            >
              <Select
                placeholder="Select"
                onChange={() => form.setFieldsValue({ subCategoryId: undefined })}
              >
                {categories.map((c: any) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="subCategoryId"
              label="Sub Category"
              required={false}
              rules={[{ required: true }]}
              className="grid-subcategory"
            >
              <Select placeholder="Select">
                {subOptionsForForm.map((s: any) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              initialValue={1}
              required={false}
              rules={[{ required: true }]}
              className="grid-qty"
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Price" required={false} className="grid-price">
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="price"
                  noStyle
                  initialValue={0}
                  required={false}
                  rules={[{ required: true }]}
                >
                  <Input type="number" placeholder="0" />
                </Form.Item>

                <Form.Item name="currency" noStyle initialValue="USD">
                  <Select options={currencyOptions} style={{ width: 72 }} />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              initialValue={dayjs()}
              required={false}
              rules={[{ required: true }]}
              className="grid-date"
            >
              <DatePicker style={{ width: "100%" }} placeholder="Select date" />
            </Form.Item>

            <div className="grid-btn">
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} style={{ fontSize: 14, fontWeight: 500 }}>
                Add Item
              </Button>
            </div>
          </div>
        </Form>
      </div>



      <div className="filterSectionHeader">
        <div className="totalItemsSection">
          <Typography.Text className="itemsCount">
            {filtered.length} Items
          </Typography.Text>
        </div>

        <div className="filtersection">
          <Typography.Text className="filterByLabel">Filter By</Typography.Text>

          <Select
            value={filters.categoryId}
            style={{ width: 180 }}
            options={categoryOptions}
            onChange={(v) =>
              setFilters({
                ...filters,
                categoryId: v,
                subCategoryId: "all",
              })
            }
          />

          <Select
            value={filters.subCategoryId}
            style={{ width: 180 }}
            options={subCategoryOptions}
            disabled={!isSubCategoryEnabled}
            onChange={(v) =>
              setFilters({
                ...filters,
                subCategoryId: v,
              })
            }
          />

          <Input
            className="toolbarControl searchControl"
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <Button
            className="exportBtn"
            icon={isDark ? <img
              src="/static/icons/export-light.svg"
              alt="export"
            /> : <img
              src="/static/icons/export.svg"
              alt="export"
            />}
            style={{ fontSize: 14, fontWeight: 500 }}
            onClick={exportCSV}
          >
            Export Data
          </Button>
        </div>
      </div>

      <ShoppingTable
        data={sorted}
        onSort={toggleSort}
        sortState={sort}
      />
      {showReport && (
        <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}>
      <Spin size="large" />
    </div>}>
          <ReportModal
            open={showReport}
            onClose={() => setShowReport(false)}
            items={filtered}
          />
        </Suspense>
      )}
    </>
  );
}