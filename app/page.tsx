"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Bot,
  ChevronRight,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Wine,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Item = {
  id: number
  name: string
  category: string
  stock: number
  min: number
  bottleSize: string
  cost: number
  supplier: string
  image: string
}

const drinksDataset: Item[] = [
  { id: 1, name: "Absolut Vodka", category: "Vodka", stock: 12, min: 4, bottleSize: "700ml", cost: 11.5, supplier: "Aegean Spirits", image: "🍸" },
  { id: 2, name: "Grey Goose Vodka", category: "Vodka", stock: 6, min: 3, bottleSize: "700ml", cost: 28, supplier: "Premium Brands", image: "🍸" },
  { id: 3, name: "Jack Daniel's Whiskey", category: "Whiskey", stock: 8, min: 3, bottleSize: "700ml", cost: 18, supplier: "Brown Cellars", image: "🥃" },
  { id: 4, name: "Jameson Irish Whiskey", category: "Whiskey", stock: 7, min: 3, bottleSize: "700ml", cost: 17, supplier: "Brown Cellars", image: "🥃" },
  { id: 5, name: "Bacardi Rum", category: "Rum", stock: 9, min: 3, bottleSize: "700ml", cost: 14, supplier: "Island Drinks", image: "🏝️" },
  { id: 6, name: "Captain Morgan Rum", category: "Rum", stock: 5, min: 3, bottleSize: "700ml", cost: 15, supplier: "Island Drinks", image: "🏝️" },
  { id: 7, name: "Bombay Sapphire Gin", category: "Gin", stock: 6, min: 3, bottleSize: "700ml", cost: 19, supplier: "Blue River Dist.", image: "🌿" },
  { id: 8, name: "Tanqueray Gin", category: "Gin", stock: 5, min: 3, bottleSize: "700ml", cost: 18, supplier: "Blue River Dist.", image: "🌿" },
  { id: 9, name: "Patron Tequila", category: "Tequila", stock: 4, min: 2, bottleSize: "700ml", cost: 35, supplier: "Agave House", image: "🌵" },
  { id: 10, name: "Jose Cuervo Tequila", category: "Tequila", stock: 6, min: 2, bottleSize: "700ml", cost: 16, supplier: "Agave House", image: "🌵" },
  { id: 11, name: "Jagermeister", category: "Liqueur", stock: 5, min: 2, bottleSize: "700ml", cost: 15, supplier: "Night Trade", image: "🍷" },
  { id: 12, name: "Baileys Irish Cream", category: "Liqueur", stock: 4, min: 2, bottleSize: "700ml", cost: 14, supplier: "Night Trade", image: "🍷" },
]

const navItems = [
  "Dashboard",
  "Inventory",
  "Consumption",
  "Orders",
  "AI Assistant",
]

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
})

export default function Page() {
  const [items, setItems] = useState(drinksDataset)
  const [prompt, setPrompt] = useState("")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to Cavaapp. I can help you monitor stock, reduce losses, and prepare smarter reorders for your bar inventory.",
    },
  ])

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q)
    )
  }, [items, search])

  const lowItems = items.filter((i) => i.stock <= i.min)
  const urgentItems = items.filter((i) => i.stock < i.min)
  const totalUnits = items.reduce((a, b) => a + b.stock, 0)
  const totalValue = items.reduce((a, b) => a + b.stock * b.cost, 0)

  function adjustStock(id: number, amount: number) {
    setItems((current) =>
      current.map((i) =>
        i.id === id ? { ...i, stock: Math.max(0, i.stock + amount) } : i
      )
    )
  }

  function askAgent(customPrompt?: string) {
    const userPrompt = (customPrompt ?? prompt).trim()
    if (!userPrompt) return

    const text = userPrompt.toLowerCase()
    let response = ""

    if (
      text.includes("reorder") ||
      text.includes("order") ||
      text.includes("παραγ")
    ) {
      response = lowItems.length
        ? "Recommended reorder list: " +
          lowItems
            .map((i) => `${i.name} (${i.stock} left, reorder ${Math.max(i.min * 2 - i.stock, 0)})`)
            .join(", ")
        : "All bottles are above the minimum threshold right now."
    } else if (
      text.includes("summary") ||
      text.includes("overview") ||
      text.includes("σύνοψη")
    ) {
      response = `Inventory summary: ${items.length} labels, ${totalUnits} total bottles, ${lowItems.length} low-stock items, ${urgentItems.length} urgent shortages, estimated value ${money.format(totalValue)}.`
    } else if (
      text.includes("value") ||
      text.includes("worth") ||
      text.includes("αξία")
    ) {
      response = `Current estimated inventory value is ${money.format(totalValue)}.`
    } else if (
      text.includes("supplier") ||
      text.includes("προμηθευ")
    ) {
      response = "Suppliers in active inventory: " + [...new Set(items.map((i) => i.supplier))].join(", ")
    } else if (
      text.includes("loss") ||
      text.includes("απώλ") ||
      text.includes("λάθος")
    ) {
      response = "To reduce losses: record every bottle movement, only reorder below threshold, check start/end of shift counts, and keep supplier recommendations centralized."
    } else {
      response = "Try asking: 'What should I reorder today?', 'Give me an inventory summary', or 'How can I reduce losses?'"
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userPrompt },
      { role: "ai", text: response },
    ])
    setPrompt("")
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white xl:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                  <Wine className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">Cavaapp</p>
                  <p className="text-sm text-slate-500">Bar inventory platform</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4" />
                  AI Status
                </div>
                <p className="mt-2 text-xl font-semibold">Online</p>
                <p className="mt-1 text-sm text-slate-300">
                  Monitoring stock, reorder signals and usage.
                </p>
              </div>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      activeTab === item
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </button>
                ))}
              </div>
            </nav>

            <div className="border-t border-slate-200 p-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold">Cavaapp Mobile Ready</p>
                <p className="mt-1 text-sm text-slate-500">
                  Responsive layout for desktop, tablet and phone.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-slate-200 p-2 xl:hidden"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div>
                  <p className="text-lg font-bold tracking-tight md:text-2xl">Cavaapp</p>
                  <p className="text-xs text-slate-500 md:text-sm">
                    Inventory control for bars & restaurants
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {activeTab}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Live Inventory
                </Badge>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveTab(item)
                        setMobileMenuOpen(false)
                      }}
                      className={`rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                        activeTab === item
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mx-auto max-w-7xl p-4 md:p-6">
            <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm text-white/90">
                    <Sparkles className="h-4 w-4" />
                    Cavaapp Smart Inventory
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                      Manage your bar inventory with clarity
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                      Built for real venues. Track bottle stock, monitor consumption,
                      avoid ordering mistakes, and keep your cava organized across web and mobile.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <HeroMetric title="Labels" value={String(items.length)} />
                  <HeroMetric title="Low stock" value={String(lowItems.length)} />
                  <HeroMetric title="Inventory value" value={money.format(totalValue)} />
                </div>
              </div>
            </section>

            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Bottles"
                value={String(totalUnits)}
                subtitle="Across the full inventory"
                icon={<Package className="h-5 w-5" />}
              />
              <StatCard
                title="Urgent Shortages"
                value={String(urgentItems.length)}
                subtitle="Below minimum threshold"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <StatCard
                title="Top Category"
                value={topCategory(items)}
                subtitle="Most represented bottle type"
                icon={<Wine className="h-5 w-5" />}
              />
              <StatCard
                title="Reorder Signals"
                value={String(lowItems.length)}
                subtitle="Items needing close attention"
                icon={<ShoppingCart className="h-5 w-5" />}
              />
            </section>

            <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle className="text-2xl">Inventory</CardTitle>
                        <CardDescription>
                          The cava of the store, with bottles, suppliers, costs and live stock.
                        </CardDescription>
                      </div>

                      <div className="relative w-full lg:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search bottle, category, supplier"
                          className="rounded-xl border-slate-200 pl-9"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {filteredItems.map((item) => {
                        const low = item.stock <= item.min
                        const urgent = item.stock < item.min

                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                    {item.image}
                                  </div>

                                  <div className="min-w-0">
                                    <h3 className="truncate text-lg font-semibold text-slate-900">
                                      {item.name}
                                    </h3>

                                    <div className="mt-1 flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="rounded-full">
                                        {item.category}
                                      </Badge>
                                      <Badge variant="outline" className="rounded-full">
                                        {item.bottleSize}
                                      </Badge>
                                      {low && (
                                        <Badge
                                          variant={urgent ? "destructive" : "secondary"}
                                          className="rounded-full"
                                        >
                                          {urgent ? "Urgent" : "Low"}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                                  <InfoPill label="Stock" value={`${item.stock} bottles`} />
                                  <InfoPill label="Minimum" value={`${item.min} bottles`} />
                                  <InfoPill label="Unit Cost" value={money.format(item.cost)} />
                                  <InfoPill label="Supplier" value={item.supplier} />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start lg:self-center">
                                <Button
                                  variant="outline"
                                  className="rounded-xl"
                                  onClick={() => adjustStock(item.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-xl"
                                  onClick={() => adjustStock(item.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Quick Actions</CardTitle>
                      <CardDescription>
                        Simple actions for staff to avoid stock mistakes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ActionBox
                        title="Opening stock check"
                        text="Review all low items before service begins."
                      />
                      <ActionBox
                        title="Consumption update"
                        text="Deduct bottles after usage or drink preparation."
                      />
                      <ActionBox
                        title="Receive supplier order"
                        text="Add new bottles after delivery."
                      />
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Reorder Priorities</CardTitle>
                      <CardDescription>
                        The most important products to restock first.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {lowItems.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                          No urgent reorder priorities right now.
                        </div>
                      ) : (
                        lowItems.slice(0, 4).map((item) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="font-medium">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              Stock {item.stock} / Min {item.min} • {item.supplier}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      <CardTitle className="text-2xl">Cavaapp AI Assistant</CardTitle>
                    </div>
                    <CardDescription>
                      Ask practical questions and get help with stock, orders and loss prevention.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="max-h-[360px] space-y-3 overflow-auto rounded-2xl bg-slate-50 p-3">
                      {messages.map((m, i) => (
                        <div
                          key={i}
                          className={
                            m.role === "ai"
                              ? "rounded-2xl bg-white p-3 text-sm shadow-sm"
                              : "ml-8 rounded-2xl bg-slate-900 p-3 text-sm text-white"
                          }
                        >
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                            {m.role === "ai" ? "AI Agent" : "Manager"}
                          </p>
                          <p>{m.text}</p>
                        </div>
                      ))}
                    </div>

                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="What should I reorder today?"
                      className="rounded-xl"
                    />

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button className="rounded-xl" onClick={() => askAgent()}>
                        Ask Agent
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => askAgent("Give me an inventory summary")}
                      >
                        Quick Summary
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => askAgent("What should I reorder today?")}
                      >
                        Reorder Check
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => askAgent("How can I reduce losses?")}
                      >
                        Reduce Losses
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-xl">Cavaapp Insights</CardTitle>
                    <CardDescription>
                      Simple operational insights for managers and staff.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <InsightRow
                      icon={<AlertTriangle className="h-4 w-4" />}
                      text={`${lowItems.length} bottle labels need attention before next service.`}
                    />
                    <InsightRow
                      icon={<ShoppingCart className="h-4 w-4" />}
                      text={`${urgentItems.length} labels are already below minimum and should be reordered first.`}
                    />
                    <InsightRow
                      icon={<TrendingUp className="h-4 w-4" />}
                      text={`Current inventory value is ${money.format(totalValue)} across ${totalUnits} bottles.`}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-xl">Mobile Friendly</CardTitle>
                    <CardDescription>
                      Designed to be used on desktop, tablet and phone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <MobilePoint text="Responsive cards for small screens" />
                    <MobilePoint text="Collapsible navigation on mobile" />
                    <MobilePoint text="Big touch targets for staff usage" />
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function HeroMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <p className="text-xs text-slate-300">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <Card className="rounded-[22px] border-0 shadow-lg shadow-slate-200/70">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      </CardContent>
    </Card>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  )
}

function InsightRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3">
      <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>
      <p>{text}</p>
    </div>
  )
}

function ActionBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  )
}

function MobilePoint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
      {text}
    </div>
  )
}

function topCategory(items: { category: string }[]) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
}