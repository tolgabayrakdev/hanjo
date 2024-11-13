import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Örnek veriler
const DUMMY_CONTACTS = [
  {
    id: 1,
    name: "Ahmet",
    surname: "Yılmaz",
    email: "ahmet@example.com",
    phone_number: "0532 111 2233"
  },
  {
    id: 2,
    name: "Ayşe",
    surname: "Demir",
    email: "ayse@example.com",
    phone_number: "0533 444 5566"
  },
  {
    id: 3,
    name: "Mehmet",
    surname: "Kaya",
    email: "mehmet@example.com",
    phone_number: "0535 777 8899"
  },
];

export default function Contacts() {
  const [contacts] = useState(DUMMY_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
  });
  const [editingContact, setEditingContact] = useState<typeof DUMMY_CONTACTS[0] | null>(null);

  const handleEdit = (contact: typeof DUMMY_CONTACTS[0]) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      surname: contact.surname,
      email: contact.email,
      phone_number: contact.phone_number,
    });
    setIsEditDialogOpen(true);
  };

  const filteredContacts = contacts.filter(contact =>
    Object.values(contact).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            placeholder="Kişilerde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <form className="space-y-4">
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
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
              <Button type="submit" className="w-full">Kaydet</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Düzenleme Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kişiyi Düzenle</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
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
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
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
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-100">
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.surname}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone_number}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
