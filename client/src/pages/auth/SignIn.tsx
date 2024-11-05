import { Button, Card, Form, Input, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Link: TypographyLink } = Typography;

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const onFinish = (values: SignInFormData) => {
    console.log('Form değerleri:', values);
    // Burada giriş işlemlerini yapabilirsiniz
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: ''
    }}>
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
            <Button type="primary" htmlType="submit" block>
              Giriş Yap
            </Button>
          </Form.Item>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '16px'
          }}>
            <Link to="/sign-up">
              <TypographyLink style={{ fontSize: '13px' }}>
                Hesabınız yok mu? Kayıt olun
              </TypographyLink>
            </Link>
            <Link to="/forgot-password">
              <TypographyLink style={{ fontSize: '13px' }}>
                Şifremi unuttum
              </TypographyLink>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
