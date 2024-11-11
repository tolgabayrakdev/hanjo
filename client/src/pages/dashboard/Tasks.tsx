import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Search } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from 'lucide-react'
import { Eye } from 'lucide-react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

interface Task {
    id?: string
    title: string
    description: string
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    dueDate: string
}

// Öncelik badge'leri iin yardımcı fonksiyon
function PriorityBadge({ priority }: { priority: Task['priority'] }) {
    return (
        <Badge
            className={cn(
                "font-medium",
                priority === 'HIGH' && "bg-red-500 hover:bg-red-600",
                priority === 'MEDIUM' && "bg-yellow-500 hover:bg-yellow-600",
                priority === 'LOW' && "bg-green-500 hover:bg-green-600"
            )}
        >
            {priority === 'HIGH' && 'Yüksek'}
            {priority === 'MEDIUM' && 'Orta'}
            {priority === 'LOW' && 'Düşük'}
        </Badge>
    )
}

// Durum badge'i için yardımcı fonksiyon
function StatusBadge({ status }: { status: Task['status'] }) {
    return (
        <Badge
            className={cn(
                "font-medium",
                status === 'TODO' && "bg-slate-500 hover:bg-slate-600",
                status === 'IN_PROGRESS' && "bg-blue-500 hover:bg-blue-600",
                status === 'COMPLETED' && "bg-green-600 hover:bg-green-700"
            )}
        >
            {status === 'TODO' && 'Yapılacak'}
            {status === 'IN_PROGRESS' && 'Devam Ediyor'}
            {status === 'COMPLETED' && 'Tamamlandı'}
        </Badge>
    )
}

// Sayfalama için yeni komponentler
function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange
}: {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
                Toplam {totalItems} görevden {currentPage * itemsPerPage - itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} arası gösteriliyor
            </div>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Önceki
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Sonraki
                </Button>
            </div>
        </div>
    )
}

function TaskPreviewDialog({ task, open, onOpenChange }: {
    task: Task | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    if (!task) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Görev Detayları
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium mb-1">Başlık</h4>
                        <p className="text-sm text-muted-foreground">{task.title}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium mb-1">Açıklama</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <h4 className="text-sm font-medium mb-1">Durum</h4>
                            <StatusBadge status={task.status} />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-1">Öncelik</h4>
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium mb-1">Bitiş Tarihi</h4>
                        <p className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function Tasks() {
    const [tasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Web Sitesi Tasarımı',
            description: 'Şirket web sitesinin yeni tasarımının yapılması ve mobil uyumlu hale getirilmesi',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            dueDate: '2024-03-25'
        },
        {
            id: '2',
            title: 'Müşteri Raporları',
            description: 'Aylık müşteri memnuniyet raporlarının hazırlanması ve analiz edilmesi',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: '2024-03-28'
        },
        {
            id: '3',
            title: 'Personel Eğitimi',
            description: 'Yeni başlayan personel için oryantasyon programının hazırlanması',
            status: 'COMPLETED',
            priority: 'LOW',
            dueDate: '2024-03-22'
        },
        {
            id: '4',
            title: 'Güvenlik Güncellemesi',
            description: 'Sistemdeki güvenlik açıklarının kapatılması ve güvenlik duvarının güncellenmesi',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2024-03-24'
        },
        {
            id: '5',
            title: 'Yeni modül geliştirme',
            description: 'Uygulama için yeni modül geliştirilecek',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            dueDate: '2024-03-25'
        },
        {
            id: '6',
            title: 'Yazılım güncellemeleri kontrol et',
            description: 'Sistemdeki güncellemeleri kontrol et',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            dueDate: '2024-03-10'
        },
        {
            id: '7',
            title: 'Veritabanı optimizasyonu',
            description: 'Veritabanı sorgularını optimize et',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2024-03-19'
        },
        {
            id: '8',
            title: 'Dokümanları güncelle',
            description: 'Proje dokümanlarını güncelle ve paylaş',
            status: 'TODO',
            priority: 'LOW',
            dueDate: '2024-03-17'
        },
        {
            id: '9',
            title: 'Geri bildirimleri değerlendir',
            description: 'Kullanıcılardan gelen geri bildirimleri gözden geçir',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            dueDate: '2024-03-16'
        },
        {
            id: '10',
            title: 'Sosyal medya planı hazırla',
            description: 'Sosyal medya post planı oluştur',
            status: 'TODO',
            priority: 'LOW',
            dueDate: '2024-03-24'
        },
        {
            id: '11',
            title: 'API entegrasyonu tamamla',
            description: 'Dış servis ile API entegrasyonunu bitir',
            status: 'TODO',
            priority: 'HIGH',
            dueDate: '2024-03-22'
        },
        {
            id: '12',
            title: 'Tasarım geri bildirimi ver',
            description: 'Yeni tasarımlar hakkında geri bildirimde bulun',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            dueDate: '2024-03-11'
        },
        {
            id: '13',
            title: 'Müşteri memnuniyeti anketi oluştur',
            description: 'Müşteriler için anket hazırlanacak',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: '2024-03-20'
        },
        {
            id: '14',
            title: 'Teknik borçları temizle',
            description: 'Kodda teknik borçları düzenle ve temizle',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            dueDate: '2024-03-18'
        },
        {
            id: '15',
            title: 'Haftalık raporu hazırla',
            description: 'Ekip için haftalık ilerleme raporu oluştur',
            status: 'TODO',
            priority: 'LOW',
            dueDate: '2024-03-23'
        }
    ])

    const [isOpen, setIsOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const initialTaskState: Task = {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
    }

    const [formData, setFormData] = useState<Task>(initialTaskState)

    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

    const [searchQuery, setSearchQuery] = useState('')

    const [statusFilter, setStatusFilter] = useState<Task['status'] | 'ALL'>('ALL')
    const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'ALL'>('ALL')

    // Sayfalama için yeni state'ler
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10 // Her sayfada gösterilecek görev sayısı

    // Filtrelenmiş görevleri sayfalama ile birlikte hesapla
    const activeTasksFilter = (task: Task) => task.status !== 'COMPLETED'
    const completedTasksFilter = (task: Task) => task.status === 'COMPLETED'

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const activeTasks = filteredTasks.filter(activeTasksFilter)
    const completedTasks = filteredTasks.filter(completedTasksFilter)


    // Filtre değiştiğinde ilk sayfaya dön
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter, priorityFilter])

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Form gönderme işlemleri burada yapılacak
        setIsOpen(false)
        setFormData(initialTaskState)
        setSelectedTask(null)
    }

    const editTask = (task: Task) => {
        setSelectedTask(task)
        setFormData(task)
        setIsOpen(true)
    }

    const handleDelete = (task: Task) => {
        // Silme işlemi burada yapılacak
        setTaskToDelete(null)
    }

    const [previewTask, setPreviewTask] = useState<Task | null>(null)

    return (
        <div className="p-4">
            <Tabs defaultValue="active" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="active" className="relative">
                            Aktif Görevler
                            <Badge variant="secondary" className="ml-2 h-6 w-8">
                                {activeTasks.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Tamamlanan Görevler
                            <Badge variant="secondary" className="ml-2 h-6 w-8">
                                {completedTasks.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setSelectedTask(null)
                                        setFormData(initialTaskState)
                                    }}
                                >
                                    Yeni Görev Ekle
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedTask ? 'Görevi Düzenle' : 'Yeni Görev'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Başlık</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Açıklama</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Durum</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => handleInputChange('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Durum seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TODO">Yapılacak</SelectItem>
                                                <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                                                <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Öncelik</Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value) => handleInputChange('priority', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Öncelik seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Düşük</SelectItem>
                                                <SelectItem value="MEDIUM">Orta</SelectItem>
                                                <SelectItem value="HIGH">Yüksek</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate">Bitiş Tarihi</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button type="submit">
                                            {selectedTask ? 'Güncelle' : 'Ekle'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            İptal
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Durum Filtrele
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Durum</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                        <DropdownMenuRadioItem value="ALL">Tümü</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="TODO">Yapılacak</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="IN_PROGRESS">Devam Eden</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="COMPLETED">Tamamlanan</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Öncelik Filtrele
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Öncelik</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                                        <DropdownMenuRadioItem value="ALL">Tümü</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="HIGH">Yüksek</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="MEDIUM">Orta</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="LOW">Düşük</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Görevlerde ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <TabsContent value="active" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                        {statusFilter !== 'ALL' && (
                            <Badge variant="secondary" className="gap-1">
                                Durum: {statusFilter === 'TODO' ? 'Yapılacak' : statusFilter === 'IN_PROGRESS' ? 'Devam Eden' : 'Tamamlanan'}
                                <button
                                    onClick={() => setStatusFilter('ALL')}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {priorityFilter !== 'ALL' && (
                            <Badge variant="secondary" className="gap-1">
                                Öncelik: {priorityFilter === 'HIGH' ? 'Yüksek' : priorityFilter === 'MEDIUM' ? 'Orta' : 'Düşük'}
                                <button
                                    onClick={() => setPriorityFilter('ALL')}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Öncelik</TableHead>
                                <TableHead>Bitiş Tarihi</TableHead>
                                <TableHead>İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                                            ? 'Arama kriterine uygun aktif görev bulunamadı'
                                            : 'Aktif görev bulunmuyor'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activeTasks
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((task) => (
                                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setPreviewTask(task)}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{task.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {task.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={task.status} />
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={task.priority} />
                                            </TableCell>
                                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            editTask(task)
                                                        }}
                                                    >
                                                        Düzenle
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setTaskToDelete(task)
                                                        }}
                                                    >
                                                        Sil
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>

                    {activeTasks.length > 0 && (
                        <Pagination
                            totalItems={activeTasks.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Öncelik</TableHead>
                                <TableHead>Tamamlanma Tarihi</TableHead>
                                <TableHead>İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completedTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Tamamlanan görev bulunmuyor
                                    </TableCell>
                                </TableRow>
                            ) : (
                                completedTasks
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((task) => (
                                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setPreviewTask(task)}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{task.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {task.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={task.priority} />
                                            </TableCell>
                                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPreviewTask(task)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setTaskToDelete(task)
                                                        }}
                                                    >
                                                        Sil
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>

                    {completedTasks.length > 0 && (
                        <Pagination
                            totalItems={completedTasks.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Görevi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(taskToDelete!)}>
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <TaskPreviewDialog
                task={previewTask}
                open={!!previewTask}
                onOpenChange={(open) => !open && setPreviewTask(null)}
            />
        </div>
    )
}