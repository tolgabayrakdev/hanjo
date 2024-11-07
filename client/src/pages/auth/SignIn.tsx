import { Button, Card, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const onFinish = async (values: SignInFormData) => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      if (res.status === 200) {
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard")
        }, 1000)
      } else if (res.status === 400) {
        messageApi.open({
          type: 'error',
          content: 'Hatalı kullanıcı adı veya Şifre!',
        })
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        messageApi.open({
          type: 'error',
          content: 'Beklenmeyen bir hata oluştu.',
        })
      }, 1000)
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ''
    }}>
      {contextHolder}
      <Card style={{ width: 400, padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Giriş Yap</Title>
        </div>

        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Lütfen email adresinizi giriniz!' },
              { type: 'email', message: 'Geçerli bir email adresi giriniz!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifre"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px'
          }}>
            <Link to="/sign-up">
              <div style={{ fontSize: '13px' }}>
                Hesabınız yok mu? Kayıt olun
              </div>
            </Link>
            <Link to="/forgot-password">
              <div style={{ fontSize: '13px' }}>
                Şifremi unuttum
              </div>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
