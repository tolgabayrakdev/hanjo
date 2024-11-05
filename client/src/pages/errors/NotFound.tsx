import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <Typography.Title level={3}>
                404 - Not found
            </Typography.Title>
            <Button type="primary" onClick={() => navigate(-1)}>
                Geri Dön
            </Button>
        </div>
    )
}
