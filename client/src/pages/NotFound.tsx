import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full flex items-center justify-center flex-col">
            <p className="text-xl font-bold mb-1">Üzgünüz, aradığınız sayfa bulunamadı.</p>
            <Button onClick={() => navigate(-1)}>
                Geri Dön
            </Button>
        </div>
    )
}
