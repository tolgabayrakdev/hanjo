import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <h3 className="text-3xl font-bold">Hoşgeldiniz</h3>
      <div className="p-3">
        <Button className="mr-1" onClick={() => navigate("/sign-in")} variant="outline">
          Giriş Yap
        </Button>
        <Button onClick={() => navigate("/sign-up")} variant="outline">
          Kayıt Ol
        </Button>
      </div>

    </div>
  )
}
