import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
import MicroApp from './microApp';

/** 菜单栏配置 */
const menus = [
  { key: 'home', label: 'Home', meta: { path: '/home' } },
  {
    key: 'docs',
    label: 'Docs',
    children: [
      { key: 'test1', label: 'Test1', meta: { path: '/docs/test1' } },
      { key: 'test2', label: 'Test2', meta: { path: '/docs/test2' } },
    ],
  },
  {
    key: 'demo1',
    label: 'Demo1',
    children: [
      { key: 'temp1', label: 'Temp1', meta: { path: '/demo1/temp1' } },
      { key: 'temp2', label: 'Temp2', meta: { path: '/demo1/temp2' } },
    ],
  },
  {
    key: 'demo2',
    label: 'Demo2',
    meta: { path: '/demo2' },
  },
];

const App: React.FC = () => {
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']); // 控制菜单栏的选中状态

  /** 菜单栏点击事件 */
  const handleClick = (e: any) => {
    setSelectedKeys([e.key]);
    navigate(e?.item?.props?.meta?.path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" selectedKeys={selectedKeys} mode="inline" items={menus} onClick={handleClick} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
              borderRadius: 16,
              margin: '16px 0',
            }}>
            {/* 这里渲染子路由 */}
            <Outlet />
            {/* 这里挂载微应用 */}
            <MicroApp />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>zxiaosi ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
