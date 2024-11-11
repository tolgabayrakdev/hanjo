import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface UserInfo {
  username: string;
  email: string;
}

const fetchUserInfo = async () => {
  const response = await fetch('http://localhost:1234/api/v1/auth/verify', {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Kullanıcı bilgileri alınamadı');
  }
  const data = await response.json();
  return {
    username: data.username,
    email: data.email
  };
};

function UserInfoCard() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedInfo, setEditedInfo] = useState<UserInfo>({ username: '', email: '' });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo();
        setUserInfo(data);
        setEditedInfo(data);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo({ ...userInfo });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:1234/api/v1/user-update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedInfo)
      });

      if (response.ok) {
        setUserInfo(editedInfo);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Güncelleme hatası:', errorData);
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>Kullanıcı adınızı ve e-posta adresinizi güncelleyin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Kullanıcı Adı</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Label>E-posta</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Kullanıcı Bilgileri</CardTitle>
        <CardDescription>Kullanıcı adınızı ve e-posta adresinizi güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Kullanıcı Adı</Label>
            <Input
              value={userInfo.username}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label>E-posta</Label>
            <Input
              value={userInfo.email}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
            <AlertDialogTrigger asChild>
              <Button onClick={handleEdit}>Düzenle</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kullanıcı Bilgilerini Düzenle</AlertDialogTitle>
                <AlertDialogDescription>
                  Bilgilerinizi güncelleyebilirsiniz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <Input
                      id="username"
                      name="username"
                      value={editedInfo.username}
                      onChange={(e) => setEditedInfo(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancel}>İptal</AlertDialogCancel>
                  <AlertDialogAction type="submit">Kaydet</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function PasswordChangeCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Form doğrulama
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/v1/user-update/change-password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: newPassword,
          currentPassword: currentPassword
        })
      });

      if (response.ok) {
        setIsOpen(false);
        resetForm();
        // Başarılı mesajı gösterilebilir
      } else {
        const data = await response.json();
        setError(data.message || 'Şifre değiştirme işlemi başarısız oldu.');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Şifre Değiştir</CardTitle>
        <CardDescription>Hesabınızın şifresini güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button>Şifre Değiştir</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Şifre Değiştir</AlertDialogTitle>
              <AlertDialogDescription>
                Yeni şifrenizi belirleyin. Güvenliğiniz için güçlü bir şifre seçin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {error && (
                  <div className="text-sm font-medium text-red-500 dark:text-red-400">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mevcut şifreniz"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifreniz"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancel}>İptal</AlertDialogCancel>
                <AlertDialogAction type="submit">Şifreyi Değiştir</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
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
            <Button variant="destructive">Hesabı Sil</Button>
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

export default function Settings() {
  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <div>
        <UserInfoCard />
        <PasswordChangeCard />
        <DeleteAccountCard />
      </div>
    </div>
  )
}