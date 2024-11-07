import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

function UserInfoCard() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Kullanıcı bilgileri güncellendi')
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Kullanıcı Bilgileri</CardTitle>
        <CardDescription>Kullanıcı adınızı ve e-posta adresinizi güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
  )
}

function PasswordChangeCard() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Şifre değiştirildi')
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Şifre Değiştir</CardTitle>
        <CardDescription>Hesabınızın şifresini güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Mevcut Şifre</Label>
            <Input id="currentPassword" type="password" placeholder="Mevcut şifreniz" />
          </div>
          <div>
            <Label htmlFor="newPassword">Yeni Şifre</Label>
            <Input id="newPassword" type="password" placeholder="Yeni şifreniz" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
            <Input id="confirmPassword" type="password" placeholder="Yeni şifrenizi tekrar girin" />
          </div>
          <Button type="submit" className="w-full">Şifreyi Değiştir</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function DeleteAccountCard() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteAccount = () => {
    console.log('Hesap silindi')
    setShowDeleteConfirm(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-red-600">Tehlikeli Bölge</CardTitle>
        <CardDescription>Dikkat: Bu bölümdeki işlemler geri alınamaz.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">Hesabı Sil</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hesabınızı silmek istediğinizden emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>Evet, Hesabımı Sil</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default function Component() {
  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <div className="w-full">
        <UserInfoCard />
        <PasswordChangeCard />
        <DeleteAccountCard />
      </div>
    </div>
  )
}