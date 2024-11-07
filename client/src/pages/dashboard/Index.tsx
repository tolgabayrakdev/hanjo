import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function Index() {
    return (
        <div>
            <p>Index</p>

            <Card className="w-full mb-6">
                <CardHeader>
                    <CardTitle>Kullanıcı Bilgileri</CardTitle>
                    <CardDescription>Kullanıcı adınızı ve e-posta adresinizi güncelleyin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input id="username" placeholder="Yeni kullanıcı adı" />
                        </div>
                        <div>
                            <Label htmlFor="email">E-posta</Label>
                            <Input id="email" type="email" placeholder="Yeni e-posta adresi" />
                        </div>
                        <Button type="submit" className="w-full">Bilgileri Güncelle</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
