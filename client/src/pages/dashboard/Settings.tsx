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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              name="username"
              value={isEditing ? editedInfo.username : userInfo.username}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-100" : ""}
            />
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={isEditing ? editedInfo.email : userInfo.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-100" : ""}
            />
          </div>
          <div className="flex justify-start gap-2">
            {!isEditing ? (
              <Button type="button" onClick={handleEdit}>
                Düzenle
              </Button>
            ) : (
              <>
                <Button type="submit">Kaydet</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  İptal
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordChangeCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const res = await fetch('http://localhost:1234/api/v1/user-update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newPassword: newPassword,
            currentPassword: currentPassword
        })
        
      })
    } catch (error) {

    }
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
            <Input onChange={(e) => setCurrentPassword(e.target.value)} id="currentPassword" type="password" placeholder="Mevcut şifreniz" />
          </div>
          <div>
            <Label htmlFor="newPassword">Yeni Şifre</Label>
            <Input onChange={(e) => setNewPassword(e.target.value)} id="newPassword" type="password" placeholder="Yeni şifreniz" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
            <Input onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" type="password" placeholder="Yeni şifrenizi tekrar girin" />
          </div>
          <div className="flex justify-start">
            <Button type="submit">Şifreyi Değiştir</Button>
          </div>
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