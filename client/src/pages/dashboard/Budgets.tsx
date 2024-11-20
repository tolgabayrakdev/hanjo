import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"


interface Wallet {
    id: number
    name: string
    description: string
    initial_balance: number
    current_balance: number
    amount: number
}

interface Budget {
    id: number
    walletId: number
    title: string
    amount: number
    type: 'income' | 'expense'
    category: string
    date: string
}

// Kategorileri interface olarak tanımla
interface Categories {
    income: string[];
    expense: string[];
}

type BudgetType = 'income' | 'expense'

interface NewBudget {
    title: string
    amount: string
    type: BudgetType
    category: string
}

// Transaction interface'ini ekle
interface Transaction {
    id: number
    budget_id: number
    type: 'income' | 'expense'
    amount: string
    category: string
    description: string | null
    created_at: string
    updated_at: string | null
}

export default function Budgets() {
    const { toast } = useToast();
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [selectedWallet, setSelectedWallet] = useState<number | null>(null)
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    
    const [newWallet, setNewWallet] = useState({
        name: '',
        description: '',
        initialBalance: ''
    })

    const [newBudget, setNewBudget] = useState<NewBudget>({
        title: '',
        amount: '',
        type: 'expense',
        category: 'other'
    })

    // Kategorileri component içinde tanımla
    const categories: Categories = {
        income: ['Maaş', 'Yatırım', 'Satış', 'Kira Geliri', 'Diğer Gelir'],
        expense: ['Personel', 'Kira', 'Faturalar', 'Malzeme', 'Pazarlama', 'Ulaşım', 'Diğer Gider']
    }

    // Cüzdan değiştiğinde formu sıfırla
    useEffect(() => {
        setNewBudget({
            title: '',
            amount: '',
            type: 'expense',
            category: 'other'
        })
    }, [selectedWallet])

    useEffect(() => {
        // Fetch wallets when the component mounts
        fetchWallets()
    }, [])

    const fetchWallets = async () => {
        try {
            const response = await fetch('http://localhost:1234/api/v1/budgets',{
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json()
            setWallets(data)
        } catch (error) {
            console.error('Error fetching wallets:', error)
        }
    }

    const handleWalletSubmit = async () => {
        const wallet = {
            name: newWallet.name,
            description: newWallet.description,
            initialBalance: Number(newWallet.initialBalance) || 0,
            currentBalance: Number(newWallet.initialBalance) || 0,
            amount: Number(newWallet.initialBalance) || 0
        }

        try {
            const response = await fetch('http://localhost:1234/api/v1/budgets', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(wallet)
            })

            if (response.ok) {
                fetchWallets()
                setNewWallet({ name: '', description: '', initialBalance: '' })
                toast({
                    title: "Başarılı!",
                    description: "Yeni cüzdan başarıyla oluşturuldu.",
                    variant: "default"
                })
            } else {
                toast({
                    title: "Hata!",
                    description: "Cüzdan oluşturulurken bir hata oluştu.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Hata!",
                description: "Bir bağlantı hatası oluştu.",
                variant: "destructive"
            })
        }
    }

    // Bütçe işlemi ekleme fonksiyonunu güncelle
    const handleBudgetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedWallet) return

        setIsSubmitting(true)

        const transaction = {
            budget_id: selectedWallet,
            amount: Number(newBudget.amount),
            category: newBudget.category,
            description: newBudget.title
        }

        try {
            const endpoint = newBudget.type === 'income' 
                ? 'http://localhost:1234/api/v1/budget-transactions/income'
                : 'http://localhost:1234/api/v1/budget-transactions/expense'

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            })

            if (response.ok) {
                fetchTransactions(selectedWallet)
                fetchWallets()
                
                setNewBudget({
                    title: '',
                    amount: '',
                    type: 'expense',
                    category: categories.expense[0].toLowerCase()
                })

                toast({
                    title: "Başarılı!",
                    description: `${newBudget.type === 'income' ? 'Gelir' : 'Gider'} işlemi başarıyla eklendi.`,
                    variant: "default"
                })
            } else {
                toast({
                    title: "Hata!",
                    description: "İşlem eklenirken bir hata oluştu.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Hata!",
                description: "Bir bağlantı hatası oluştu.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Seçili cüzdanın işlemlerini getir
    const selectedWalletInfo = wallets.find(w => w.id === selectedWallet)

    // İşlemleri getiren fonksiyon
    const fetchTransactions = async (walletId: number) => {
        setIsTransactionsLoading(true)
        try {
            const response = await fetch('http://localhost:1234/api/v1/budget-transactions', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ budget_id: walletId })
            })
            
            if (!response.ok) {
                throw new Error('İşlemler getirilemedi')
            }
            
            const data = await response.json()
            
            // 1 saniye bekle, sonra verileri göster
            setTimeout(() => {
                setTransactions(data)
                setIsTransactionsLoading(false)
            }, 1000)
            
        } catch (error) {
            console.error('Error fetching transactions:', error)
            // Hata durumunda da 1 saniye bekle
            setTimeout(() => {
                setTransactions([])
                setIsTransactionsLoading(false)
                toast({
                    title: "Hata!",
                    description: "İşlem geçmişi yüklenirken bir hata oluştu.",
                    variant: "destructive"
                })
            }, 1000)
        }
    }

    // selectedWallet değiştiğinde işlemleri getirmek için useEffect ekleyelim
    useEffect(() => {
        if (selectedWallet) {
            fetchTransactions(selectedWallet)
        } else {
            setTransactions([]) // Cüzdan seçili değilse işlemleri temizle
            setIsTransactionsLoading(false) // Loading durumunu kapat
        }
    }, [selectedWallet]) // selectedWallet değiştiğinde çalışacak

    // Sayfalama için gerekli state'leri ekleyelim
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(transactions.length / itemsPerPage)

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="w-full p-3 space-y-6">
            <div className="flex flex-col gap-2">
                <h3 className='text-2xl font-bold'>Bütçe Yönetimi</h3>
                <p className="text-muted-foreground">
                    Cüzdanlarınızı ve bütçenizi yönetin.
                </p>
            </div>
            <Separator />

            {/* Cüzdan Ekleme Butonu */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Yeni Cüzdan Ekle</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni Cüzdan Oluştur</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cüzdan Adı</Label>
                            <Input
                                placeholder="Örn: İşyeri Giderleri"
                                value={newWallet.name}
                                onChange={e => setNewWallet({ ...newWallet, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Açıklama</Label>
                            <Input
                                placeholder="Cüzdan açıklaması"
                                value={newWallet.description}
                                onChange={e => setNewWallet({ ...newWallet, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Başlangıç Bakiyesi</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={newWallet.initialBalance}
                                onChange={e => setNewWallet({ ...newWallet, initialBalance: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleWalletSubmit} className="w-full">
                            Cüzdan Oluştur
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Cüzdan Listesi */}
            <div className="grid gap-4 md:grid-cols-3">
                {wallets.map(wallet => (
                    <Card 
                        key={wallet.id}
                        className={`cursor-pointer ${selectedWallet === wallet.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedWallet(wallet.id)}
                    >
                        <CardHeader>
                            <CardTitle>{wallet.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{wallet.description}</p>
                            <div className="text-2xl font-bold">
                                {(wallet.amount !== undefined ? Number(wallet.amount).toFixed(2) : '0.00')} ₺
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Başlangıç: {(wallet.initial_balance !== undefined ? Number(wallet.initial_balance).toFixed(2) : '0.00')} ₺
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedWallet && (
                <>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold">
                            {selectedWalletInfo?.name} - İşlemler
                        </h4>

                        {/* Gelir/Gider Ekleme Formu */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Yeni İşlem Ekle</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">İşlem Türü</Label>
                                            <Select
                                                value={newBudget.type}
                                                onValueChange={(value: BudgetType) => 
                                                    setNewBudget({ 
                                                        ...newBudget, 
                                                        type: value,
                                                        category: 'other'
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="İşlem türü seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="income">Gelir</SelectItem>
                                                    <SelectItem value="expense">Gider</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Tutar (₺)</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value={newBudget.amount}
                                                onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category">Kategori</Label>
                                            <Select
                                                value={newBudget.category}
                                                onValueChange={(value: string) => 
                                                    setNewBudget({ ...newBudget, category: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Kategori seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories[newBudget.type].map((category) => (
                                                        <SelectItem 
                                                            key={category} 
                                                            value={category.toLowerCase()}
                                                        >
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="title">Açıklama</Label>
                                            <Input
                                                id="title"
                                                placeholder="Örn: Market alışverişi"
                                                value={newBudget.title}
                                                onChange={e => setNewBudget({ ...newBudget, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        variant={newBudget.type === 'income' ? 'success' : 'destructive'}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                İşlem Ekleniyor...
                                            </div>
                                        ) : (
                                            `${newBudget.type === 'income' ? 'Gelir' : 'Gider'} Ekle`
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* İşlem Geçmişi */}
                        <Card>
                            <CardHeader>
                                <CardTitle>İşlem Geçmişi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isTransactionsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <div className="text-center text-muted-foreground">
                                            İşlem geçmişiniz yükleniyor...
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tarih</TableHead>
                                                    <TableHead>Kategori</TableHead>
                                                    <TableHead>Açıklama</TableHead>
                                                    <TableHead>Tutar</TableHead>
                                                    <TableHead>Tür</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transactions.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                            Henüz işlem bulunmuyor
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    currentTransactions.map((transaction) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell>
                                                                {new Date(transaction.created_at).toLocaleDateString('tr-TR')}
                                                            </TableCell>
                                                            <TableCell>{transaction.category}</TableCell>
                                                            <TableCell>{transaction.description || '-'}</TableCell>
                                                            <TableCell>{Number(transaction.amount).toFixed(2)} ₺</TableCell>
                                                            <TableCell>
                                                                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                                    {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>

                                        {/* Sayfalama */}
                                        {transactions.length > itemsPerPage && (
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-sm text-muted-foreground">
                                                    Toplam {transactions.length} işlem
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Önceki
                                                    </Button>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">
                                                            Sayfa {currentPage} / {totalPages}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Sonraki
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}
