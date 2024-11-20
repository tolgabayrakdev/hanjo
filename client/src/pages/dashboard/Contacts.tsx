import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Contact {
    id: number
    name: string
    surname: string
    email: string
    phone: string
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Sayfa başına gösterilecek kişi sayısı
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContact, setPreviewContact] = useState<Contact | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:1234/api/v1/contacts', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Kişiler yüklenirken bir hata oluştu');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Kişiler yüklenirken hata:', error);
      // Burada bir hata bildirimi gösterebilirsiniz
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      surname: contact.surname,
      email: contact.email,
      phone: contact.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContact) return;

    try {
      const response = await fetch(`http://localhost:1234/api/v1/contacts/${deletingContact.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Kişi silinirken bir hata oluştu');

      await fetchContacts(); // Listeyi yenile
      setIsDeleteDialogOpen(false);
      setDeletingContact(null);
    } catch (error) {
      console.error('Kişi silinirken hata:', error);
      // Burada bir hata bildirimi gösterebilirsiniz
    }
  };

  const handlePreview = (contact: Contact) => {
    setPreviewContact(contact);
    setIsPreviewDialogOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    // Arama terimindeki boşlukları kaldır ve küçük harfe çevir
    const searchTermLower = searchTerm.toLowerCase().replace(/\s+/g, '');
    
    // Tam eşleşme için birleştirilmiş ad-soyad
    const fullName = `${contact.name}${contact.surname}`.toLowerCase().replace(/\s+/g, '');
    // Ayrı ayrı ad ve soyad araması için
    const nameMatch = contact.name?.toLowerCase().includes(searchTermLower);
    const surnameMatch = contact.surname?.toLowerCase().includes(searchTermLower);
    const fullNameMatch = fullName.includes(searchTermLower);
    const emailMatch = contact.email?.toLowerCase().includes(searchTermLower);
    const phoneMatch = contact.phone?.toLowerCase().includes(searchTermLower);

    return nameMatch || surnameMatch || fullNameMatch || emailMatch || phoneMatch;
  });

  // Sayfalama için hesaplamalar
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Table komponenti üstüne pagination kontrollerini ekleyin
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Yeni fonksiyonu ekleyin (diğer fonksiyonların yanına)
  const resetFormData = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone: '',
    });
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // 2 saniye sonra ikonu eski haline döndür
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1234/api/v1/contacts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Kişi eklenirken bir hata oluştu');

      await fetchContacts(); // Listeyi yenile
      setIsAddDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error('Kişi eklenirken hata:', error);
      // Burada bir hata bildirimi gösterebilirsiniz
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      const response = await fetch(`http://localhost:1234/api/v1/contacts/${editingContact.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Kişi güncellenirken bir hata oluştu');

      await fetchContacts(); // Listeyi yenile
      setIsEditDialogOpen(false);
      setEditingContact(null);
      resetFormData();
    } catch (error) {
      console.error('Kişi güncellenirken hata:', error);
      // Burada bir hata bildirimi gösterebilirsiniz
    }
  };

  return (
    <div className="p-3">
      <h3 className='text-2xl font-bold mb-6'>Kişiler</h3>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Kişilerde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (open) {
              resetFormData();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kişi Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kişi Ekle</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddContact}>
              <Input
                placeholder="Ad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Soyad"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Telefon"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Button type="submit" className="w-full">Kaydet</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Düzenleme Modal */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              resetFormData();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kişiyi Düzenle</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateContact}>
              <Input
                placeholder="Ad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Soyad"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Telefon"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Button type="submit" className="w-full">Güncelle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Ad</TableHead>
              <TableHead className="font-semibold">Soyad</TableHead>
              <TableHead className="font-semibold">E-posta</TableHead>
              <TableHead className="font-semibold">Telefon</TableHead>
              <TableHead className="text-right font-semibold">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="text-gray-500 text-sm">Kişiler yükleniyor...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Kişi bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              currentContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePreview(contact)}
                >
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.surname}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(contact)}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Önceki
        </Button>
        {pageNumbers.map(number => (
          <Button
            size="sm"
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kişiyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingContact?.name} {deletingContact?.surname} kişisini silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Kişi Detayları</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Ad</span>
                <span className="text-lg">{previewContact?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Soyad</span>
                <span className="text-lg">{previewContact?.surname}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">E-posta</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{previewContact?.email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-gray-100"
                    onClick={() => handleCopyEmail(previewContact?.email || '')}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Telefon</span>
                <span className="text-lg">{previewContact?.phone}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
