import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Space, message } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
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

    const handleMenuClick: MenuProps['onClick'] = async (e) => {
        if (e.key === 'logout') {
            try {
                setIsLoggingOut(true);
                const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    navigate('/sign-in');
                } else {
                    message.error('Çıkış yapılırken bir hata oluştu');
                }
            } catch (error) {
                message.error('Çıkış yapılırken bir hata oluştu');
            } finally {
                setIsLoggingOut(false);
            }
        } else if (e.key === 'settings') {
            navigate('/dashboard/settings');
        }
    };

    const handleNavigation = ({ key }: { key: string }) => {
        navigate(key);
    };

    const menuItems = [
        {
            key: '/dashboard',
            icon: <UserOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/dashboard/settings',
            icon: <SettingOutlined />,
            label: 'Ayarlar',
        },
        {
            key: '/dashboard/profile',
            icon: <UserOutlined />,
            label: 'Profil',
        },
        {
            key: '/dashboard/users',
            icon: <UserOutlined />,
            label: 'Kişiler',
        },
    ];

    return (
        <>
            {isLoggingOut && <Loading />}
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
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={handleNavigation}
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
        </>
    );
};

export default App;