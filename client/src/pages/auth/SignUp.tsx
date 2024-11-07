import { Button, Card, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();


  const onFinish = async (values: SignUpFormData) => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password
        })
      });
      if (res.status === 201) {
        messageApi.open({
          type: 'success',
          content: 'Hesap olusturuldu.',
        });
        setTimeout(() => {
          setLoading(false);
          navigate("/sign-in")
        }, 1000)
      } else {
        messageApi.open({
          type: 'error',
          content: 'Hesap olusturulurken bir hata oluştu.',
        });
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Hesap olusturulurken bir hata oluştu.',
      });
      setLoading(false);
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
          <Title level={2}>Kayıt Ol</Title>
        </div>

        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Lütfen kullanıcı adınızı giriniz!' },
              { min: 3, message: 'Kullanıcı adı en az 3 karakter olmalıdır!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Kullanıcı Adı"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Lütfen email adresinizi giriniz!' },
              { type: 'email', message: 'Geçerli bir email adresi giriniz!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Lütfen şifrenizi giriniz!' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifre"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Lütfen şifrenizi tekrar giriniz!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Girdiğiniz şifreler eşleşmiyor!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifreyi Tekrar Girin"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Kayıt Ol
            </Button>
          </Form.Item>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px'
          }}>
            <Link to="/sign-in">
              <div style={{ fontSize: '13px' }}>
                Zaten hesabınız var mı? Giriş yapın
              </div>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
