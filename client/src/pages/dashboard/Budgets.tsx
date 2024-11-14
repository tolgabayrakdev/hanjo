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

interface Wallet {
    id: number
    name: string
    description: string
    initialBalance: number
    currentBalance: number
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

export default function Budgets() {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [selectedWallet, setSelectedWallet] = useState<number | null>(null)
    const [budgets, setBudgets] = useState<Budget[]>([])
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

    // Yeni cüzdan ekleme
    const handleWalletSubmit = () => {
        const wallet: Wallet = {
            id: Date.now(),
            name: newWallet.name,
            description: newWallet.description,
            initialBalance: Number(newWallet.initialBalance),
            currentBalance: Number(newWallet.initialBalance)
        }
        setWallets([...wallets, wallet])
        setNewWallet({ name: '', description: '', initialBalance: '' })
    }

    // Bütçe işlemi ekleme fonksiyonunu güncelle
    const handleBudgetSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedWallet) return

        const budget: Budget = {
            id: Date.now(),
            walletId: selectedWallet,
            title: newBudget.title,
            amount: Number(newBudget.amount),
            type: newBudget.type,
            category: newBudget.category,
            date: new Date().toISOString()
        }

        // Cüzdanın bakiyesini güncelle
        const updatedWallets = wallets.map(wallet => {
            if (wallet.id === selectedWallet) {
                const balanceChange = budget.type === 'income' ? budget.amount : -budget.amount
                return {
                    ...wallet,
                    currentBalance: wallet.currentBalance + balanceChange
                }
            }
            return wallet
        })

        setBudgets([...budgets, budget])
        setWallets(updatedWallets)
        
        // Formu tamamen sıfırla
        setNewBudget({
            title: '',
            amount: '',
            type: 'expense',
            category: 'other'
        })
    }

    // Seçili cüzdanın işlemlerini getir
    const selectedWalletTransactions = budgets.filter(b => b.walletId === selectedWallet)
    const selectedWalletInfo = wallets.find(w => w.id === selectedWallet)

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
                            <div className="text-2xl font-bold">{wallet.currentBalance.toFixed(2)} ₺</div>
                            <p className="text-xs text-muted-foreground">
                                Başlangıç: {wallet.initialBalance.toFixed(2)} ₺
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
                                    >
                                        {newBudget.type === 'income' ? 'Gelir' : 'Gider'} Ekle
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tarih</TableHead>
                                            <TableHead>Başlık</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Tutar</TableHead>
                                            <TableHead>Tür</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedWalletTransactions.map((budget) => (
                                            <TableRow key={budget.id}>
                                                <TableCell>
                                                    {new Date(budget.date).toLocaleDateString('tr-TR')}
                                                </TableCell>
                                                <TableCell>{budget.title}</TableCell>
                                                <TableCell>{budget.category}</TableCell>
                                                <TableCell>{budget.amount.toFixed(2)} ₺</TableCell>
                                                <TableCell>
                                                    <span className={budget.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                        {budget.type === 'income' ? 'Gelir' : 'Gider'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}
