import React, { useState } from "react";
import { Layout, ConfigProvider, Switch, theme } from "antd";
import { ShoppingProvider } from "./context/ShoppingContext";
import ShoppingListPage from "./pages/ShoppingListPage";
import "./App.css";

const { Header, Content } = Layout;

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Switch: {
            colorPrimaryHover: "#595959",
            colorTextQuaternary: "#595959"
          }
        }
      }}
    >
      <ShoppingProvider>
        <Layout className={darkMode ? "app app-dark" : "app"}>
          <Header className="app-header">
            <img src="static/icons/logo.svg" alt="ZETA" />

            <div className="app-toggle">
              Dark Mode
              <Switch
                checked={darkMode}
                onChange={(checked) => setDarkMode(checked)}
              />
            </div>
          </Header>

          <Content >
            <ShoppingListPage />
          </Content>
        </Layout>
      </ShoppingProvider>
    </ConfigProvider>
  );
}