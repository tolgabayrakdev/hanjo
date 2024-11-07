"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link, useNavigate } from "react-router-dom"

// Zod şeması
const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignIn() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('')
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInValues) => {
    setStatus('Giriş yapılıyor...')
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `/api/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setStatus('Giriş başarılı! Yönlendiriliyorsunuz...')
        navigate("/dashboard")
      } else if (response.status === 400) {
        setStatus('E-posta veya parola hatalı. Lütfen bilgilerinizi kontrol edin.')
      } else {
        const errorData = await response.json()
        setStatus(`Giriş başarısız: ${errorData.message || 'Bir hata oluştu'}`)
      }
    } catch (error) {
      setStatus('Bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Giriş hatası:', error)
    }
  }

  return (
    <>

      <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
                <Button className="w-full" type="submit">
                  Giriş Yap
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