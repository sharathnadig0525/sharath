import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

type Item = {
  name: string;
  quantity: number | string;
  price: number | string;
};

export default function SalesReportChart({ items }: { items: Item[] }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(() => {
    return (items || []).map((it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      return { name: it.name, qty, price, total: qty * price };
    });
  }, [items]);

  const averageCost = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((a, b) => a + b.total, 0) / data.length;
  }, [data]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    (root as any)._logo?.dispose?.();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "zoomX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 8,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 0,
      })
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "none" })
    );
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 55 });
    xRenderer.grid.template.set("visible", false);
    xRenderer.labels.template.setAll({
      fill: am5.color(0x6b7280),
      fontSize: 12,
      paddingTop: 10,
      centerX: am5.p50,
      textAlign: "center",
      oversizedBehavior: "truncate",
      maxWidth: 110,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: xRenderer,
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.setAll({ strokeOpacity: 0.12 });
    yRenderer.labels.template.setAll({
      fill: am5.color(0x6b7280),
      fontSize: 12,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        min: 0,
        extraMax: 0.15,
        numberFormat: "$#,###",
      })
    );

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      labelText:
        "[fontSize:12][bold]{name}[/]\n" +
        "Total: {total.formatNumber('$#,###.00')}\n" +
        "Price: {price.formatNumber('$#,###.00')} (per unit)\n" +
        "Qty: {qty}",
    });

    tooltip.set(
      "background",
      am5.RoundedRectangle.new(root, {
        fill: am5.color(0x111827),
        fillOpacity: 0.92,
        strokeOpacity: 0,
        cornerRadiusTL: 8,
        cornerRadiusTR: 8,
        cornerRadiusBL: 8,
        cornerRadiusBR: 8,
      })
    );
    tooltip.label.setAll({ fill: am5.color(0xffffff) });

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Total",
        xAxis,
        yAxis,
        categoryXField: "name",
        valueYField: "total",
        tooltip,
      })
    );

    series.columns.template.setAll({
      width: 32.392, // ✅ exact pixel width
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      fill: am5.color(0x93c5fd),
      fillOpacity: 0.95,
      strokeOpacity: 0,
    });

    series.columns.template.states.create("hover", {
      fill: am5.color(0x60a5fa),
      fillOpacity: 0.95,
    });

    xAxis.data.setAll(data);
    series.data.setAll(data);

    if (averageCost > 0) {
      const avgItem = yAxis.makeDataItem({ value: averageCost });
      const range = yAxis.createAxisRange(avgItem);

      range.get("grid")?.setAll({
        stroke: am5.color(0x3b82f6),
        strokeOpacity: 0.55,
        strokeWidth: 2,
        strokeDasharray: [6, 6],
      });

      range.get("label")?.setAll({
        text: `Avg $${averageCost.toFixed(2)}`,
        fill: am5.color(0x3b82f6),
        fontSize: 12,
        inside: true,
        paddingLeft: 8,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.75,
          cornerRadiusTL: 6,
          cornerRadiusTR: 6,
          cornerRadiusBL: 6,
          cornerRadiusBR: 6,
        }),
      });
    }

    chart.set("scrollbarX", undefined);

    const FIXED_VISIBLE = 13;

    const clamp = () => {
      const start = xAxis.getPrivate("startIndex");
      const end = xAxis.getPrivate("endIndex");
      if (start == null || end == null) return;

      const visible = end - start + 1;
      if (visible > FIXED_VISIBLE && data.length > FIXED_VISIBLE) {
        const s = Math.min(start, data.length - FIXED_VISIBLE);
        xAxis.zoomToIndexes(s, s + FIXED_VISIBLE - 1);
      }
    };

    root.events.once("frameended", () => {
      if (data.length > FIXED_VISIBLE) xAxis.zoomToIndexes(0, FIXED_VISIBLE - 1);
    });

    xAxis.events.on("boundschanged", clamp);
    xAxis.on("start", clamp);
    xAxis.on("end", clamp);

    return () => root.dispose();
  }, [data, averageCost]);

  return (
    <div style={{ width: "100%", height: 360 }}>
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}