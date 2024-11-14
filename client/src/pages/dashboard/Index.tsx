import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Separator } from "@/components/ui/separator"

interface Task {
    id: number
    title: string
    description: string
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    due_date: string
    user_id: number
    created_at: string
    updated_at: string | null
}

export default function Index() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:1234/api/v1/tasks', {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                setTasks(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Error fetching tasks:', error)
                setTasks([])
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [])

    // Task durumlarına göre sayıları hesapla
    const taskStats = {
        total: tasks.length,
        completed: tasks.filter((task: Task) => task.status === 'COMPLETED').length,
        inProgress: tasks.filter((task: Task) => task.status === 'IN_PROGRESS').length,
        todo: tasks.filter((task: Task) => task.status === 'TODO').length,
    }

    // Priority'ye göre grupla
    const priorityStats = {
        high: tasks.filter((task: Task) => task.priority === 'HIGH').length,
        medium: tasks.filter((task: Task) => task.priority === 'MEDIUM').length,
        low: tasks.filter((task: Task) => task.priority === 'LOW').length,
    }

    const taskStatusData = [
        { name: 'Tamamlanan', value: taskStats.completed, color: '#22c55e' },
        { name: 'Devam Eden', value: taskStats.inProgress, color: '#3b82f6' },
        { name: 'Bekleyen', value: taskStats.todo, color: '#f59e0b' },
    ]

    // Görevleri aylara göre grupla fonksiyonunu güncelle
    const getMonthlyData = () => {
        const monthlyTasks = tasks.reduce((acc: { [key: string]: number }, task) => {
            const date = new Date(task.due_date)
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
            acc[monthYear] = (acc[monthYear] || 0) + 1
            return acc
        }, {})

        const monthNames = [
            'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
            'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
        ]

        // Tüm aylar için veri oluştur
        const allMonths = monthNames.map((name, index) => ({
            name,
            total: 0,
            month: index + 1
        }))

        // Var olan verileri ekle
        Object.entries(monthlyTasks).forEach(([key, value]) => {
            const [month] = key.split('/')
            const monthIndex = parseInt(month) - 1
            if (monthIndex >= 0 && monthIndex < 12) {
                allMonths[monthIndex].total = value
            }
        })

        return allMonths
    }

    if (loading) {
        return <div className="w-full p-3">Yükleniyor...</div>
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="w-full p-3">
                <h1 className="text-2xl font-bold mb-6">Anasayfa</h1>
                <p>Henüz görev bulunmamaktadır.</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Görevleriniz ve istatistiklerinize genel bakış.
                </p>
            </div>
            <Separator />

            {/* İstatistikler Bölümü */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    İstatistikler
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M8 6h13" />
                                <path d="M8 12h13" />
                                <path d="M8 18h13" />
                                <path d="M3 6h.01" />
                                <path d="M3 12h.01" />
                                <path d="M3 18h.01" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskStats.total}</div>
                            <div className="flex mt-2 space-x-2 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                                    Yüksek: {priorityStats.high}
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                                    Orta: {priorityStats.medium}
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                    Düşük: {priorityStats.low}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tamamlanan Görevler</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskStats.completed}</div>
                            <p className="text-xs text-muted-foreground">
                                Tamamlanma Oranı: {((taskStats.completed / taskStats.total) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Devam Eden Görevler</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
                            <p className="text-xs text-muted-foreground">
                                Aktif Görevler: {((taskStats.inProgress / taskStats.total) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M2 12h20M2 12l10-10m-10 10l10 10" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskStats.todo}</div>
                            <p className="text-xs text-muted-foreground">
                                Bekleyen İşler: {((taskStats.todo / taskStats.total) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Separator />

            {/* Grafikler Bölümü */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    Görev Analizi
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Görev Durumları</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={taskStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => [`${value} Görev`, '']}
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '6px',
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Aylık Görev İstatistikleri</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getMonthlyData()}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '6px',
                                        }}
                                        formatter={(value) => [`${value} Görev`, '']}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="currentColor"
                                        radius={[4, 4, 0, 0]}
                                        className="fill-primary"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Separator />

            {/* Kişiler Bölümü */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    Kişiler
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toplam Kişi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Sistemde kayıtlı toplam kişi sayısı
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktif Kişiler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">
                                Son 30 günde aktif olan kişi sayısı
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Yeni Kişiler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                Son 7 günde eklenen kişi sayısı
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
