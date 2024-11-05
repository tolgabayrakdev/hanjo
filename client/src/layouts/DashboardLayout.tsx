import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Kullanıcı menüsü için items
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Ayarlar',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Çıkış Yap',
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            // Çıkış yapma işlemi buraya gelecek
            console.log('Çıkış yapılıyor...');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '16px 0'
                }}>
                    {!collapsed && 'HANJO'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
                        <Button type="text" style={{ marginRight: '16px' }}>
                            <Space>
                                <UserOutlined />
                                tolga123@gmail.com
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;