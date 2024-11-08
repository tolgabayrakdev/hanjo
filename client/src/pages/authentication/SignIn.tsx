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

const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignIn() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInValues) => {
    setIsLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.status === 200) {
        setStatus('Giriş başarılı! Yönlendiriliyorsunuz...')
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else if (response.status === 400) {
        setStatus('E-posta veya parola hatalı. Lütfen bilgilerinizi kontrol edin.')
        setIsLoading(false)
      } else if (response.status === 404) {
        setStatus('E-posta hatalı. Lütfen bilgilerinizi kontrol edin.')
        setIsLoading(false)
      }
      else {
        const errorData = await response.json()
        setStatus(`Giriş başarısız: ${errorData.message || 'Bir hata oluştu'}`)
        setIsLoading(false)
      }
    } catch (error) {
      setStatus('Bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Giriş hatası:', error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Hesabınıza giriş yapmak için bilgilerinizi girin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Button disabled={isLoading} className="w-full" type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    "Giriş Yap"
                  )}
                </Button>
                {status && <p className="mt-2 text-sm text-center text-gray-600">{status}</p>}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
              Şifremi Unuttum
            </Link>
            <div className="text-sm">
              Hesabınız yok mu?{" "}
              <Link to="/sign-up" className="text-gray-600 hover:underline">
                Hesap Oluştur
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}