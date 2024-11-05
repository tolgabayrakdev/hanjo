import { Button, Card, Form, Input, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Link: TypographyLink } = Typography;

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const onFinish = (values: SignUpFormData) => {
    console.log('Form değerleri:', values);
    // Burada kayıt işlemlerini yapabilirsiniz
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
            <Button type="primary" htmlType="submit" block>
              Kayıt Ol
            </Button>
          </Form.Item>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '16px'
          }}>
            <Link to="/sign-in">
              <TypographyLink style={{ fontSize: '13px' }}>
                Zaten hesabınız var mı? Giriş yapın
              </TypographyLink>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
