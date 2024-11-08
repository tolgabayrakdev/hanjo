import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

const signUpSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUp() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: SignUpValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      })

      if (response.ok) {
        setStatus('Hesap başarıyla oluşturuldu! Yönlendiriliyorsunuz...')
        setTimeout(() => {
          navigate("/sign-in")
        }, 1000)
      } else if (response.status === 400) {
        const errorData = await response.json()
        setStatus(`Hesap oluşturulamadı: ${errorData.message || 'Bu e-posta veya kullanıcı adı zaten kullanılıyor.'}`)
        setIsLoading(false);
      } else {
        const errorData = await response.json()
        setStatus(`Hesap oluşturulamadı: ${errorData.message || 'Bir hata oluştu'}`)
        setIsLoading(false);
      }
    } catch (error) {
      setStatus('Bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Kayıt hatası:', error)
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Hesap Oluştur</CardTitle>
          <CardDescription>Yeni bir hesap oluşturmak için bilgilerinizi girin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="kullanıcı adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="ornek@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre Tekrar</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    "Giriş Yap"
                  )}
              </Button>
              {status && <p className="mt-2 text-sm text-center text-gray-600">{status}</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Zaten hesabınız var mı?{" "}
            <Link to="/sign-in" className="text-gray-600 hover:underline">
              Giriş Yap
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}