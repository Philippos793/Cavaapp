"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Bot,
  ChevronRight,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Wine,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Item = {
  id: number
  name: string
  category: string
  bottles: number
  bottleSizeMl: number
  openBottleMl: number
  minBottles: number
  cost: number
  supplier: string
  image: string
}

type Message = {
  role: "ai" | "user"
  text: string
}

type ConsumptionLog = {
  id: number
  itemName: string
  amountMl: number
  reason: string
  time: string
}

type CocktailIngredient = {
  itemName: string
  ml: number
}

type Cocktail = {
  id: number
  name: string
  ingredients: CocktailIngredient[]
}

const navItems = [
  "Dashboard",
  "Inventory",
  "Consumption",
  "Orders",
  "AI Assistant",
] as const

const drinksDataset: Item[] = [
  {
    id: 1,
    name: "Absolut Vodka",
    category: "Vodka",
    bottles: 6,
    bottleSizeMl: 700,
    openBottleMl: 700,
    minBottles: 2,
    cost: 12,
    supplier: "Diageo",
    image: "🍸",
  },
  {
    id: 2,
    name: "Grey Goose Vodka",
    category: "Vodka",
    bottles: 3,
    bottleSizeMl: 700,
    openBottleMl: 520,
    minBottles: 1,
    cost: 28,
    supplier: "Bacardi",
    image: "🍸",
  },
  {
    id: 3,
    name: "Gin",
    category: "Gin",
    bottles: 4,
    bottleSizeMl: 700,
    openBottleMl: 610,
    minBottles: 2,
    cost: 18,
    supplier: "Diageo",
    image: "🌿",
  },
  {
    id: 4,
    name: "Campari",
    category: "Liqueur",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 430,
    minBottles: 1,
    cost: 18,
    supplier: "Campari Group",
    image: "🍷",
  },
  {
    id: 5,
    name: "Red Vermouth",
    category: "Vermouth",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 510,
    minBottles: 1,
    cost: 14,
    supplier: "Martini",
    image: "🍷",
  },
  {
    id: 6,
    name: "Tequila",
    category: "Tequila",
    bottles: 3,
    bottleSizeMl: 700,
    openBottleMl: 700,
    minBottles: 1,
    cost: 16,
    supplier: "Cuervo",
    image: "🌵",
  },
  {
    id: 7,
    name: "Cointreau",
    category: "Liqueur",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 390,
    minBottles: 1,
    cost: 24,
    supplier: "Remy Cointreau",
    image: "🍷",
  },
  {
    id: 8,
    name: "White Rum",
    category: "Rum",
    bottles: 4,
    bottleSizeMl: 700,
    openBottleMl: 640,
    minBottles: 2,
    cost: 14,
    supplier: "Bacardi",
    image: "🏝️",
  },
  {
    id: 9,
    name: "Aged Rum",
    category: "Rum",
    bottles: 3,
    bottleSizeMl: 700,
    openBottleMl: 440,
    minBottles: 1,
    cost: 20,
    supplier: "Havana Club",
    image: "🏝️",
  },
  {
    id: 10,
    name: "Whiskey",
    category: "Whiskey",
    bottles: 5,
    bottleSizeMl: 700,
    openBottleMl: 700,
    minBottles: 2,
    cost: 18,
    supplier: "Jameson",
    image: "🥃",
  },
  {
    id: 11,
    name: "Amaretto",
    category: "Liqueur",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 340,
    minBottles: 1,
    cost: 20,
    supplier: "Disaronno",
    image: "🍷",
  },
  {
    id: 12,
    name: "Cachaca",
    category: "Cachaca",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 590,
    minBottles: 1,
    cost: 16,
    supplier: "51",
    image: "🥃",
  },
  {
    id: 13,
    name: "Coffee Liqueur",
    category: "Liqueur",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 480,
    minBottles: 1,
    cost: 18,
    supplier: "Kahlua",
    image: "🍷",
  },
  {
    id: 14,
    name: "Triple Sec",
    category: "Liqueur",
    bottles: 2,
    bottleSizeMl: 700,
    openBottleMl: 560,
    minBottles: 1,
    cost: 12,
    supplier: "De Kuyper",
    image: "🍷",
  },
]

const cocktails: Cocktail[] = [
  {
    id: 1,
    name: "Negroni",
    ingredients: [
      { itemName: "Gin", ml: 35 },
      { itemName: "Campari", ml: 35 },
      { itemName: "Red Vermouth", ml: 20 },
    ],
  },
  {
    id: 2,
    name: "Margarita",
    ingredients: [
      { itemName: "Tequila", ml: 45 },
      { itemName: "Cointreau", ml: 25 },
    ],
  },
  {
    id: 3,
    name: "Cuba Libre",
    ingredients: [{ itemName: "White Rum", ml: 50 }],
  },
  {
    id: 4,
    name: "Mai Tai",
    ingredients: [
      { itemName: "White Rum", ml: 40 },
      { itemName: "Aged Rum", ml: 20 },
      { itemName: "Triple Sec", ml: 15 },
    ],
  },
  {
    id: 5,
    name: "Daiquiri Strawberry",
    ingredients: [{ itemName: "White Rum", ml: 45 }],
  },
  {
    id: 6,
    name: "Godfather",
    ingredients: [
      { itemName: "Whiskey", ml: 45 },
      { itemName: "Amaretto", ml: 15 },
    ],
  },
  {
    id: 7,
    name: "Caipirinha",
    ingredients: [{ itemName: "Cachaca", ml: 50 }],
  },
  {
    id: 8,
    name: "Espresso Martini",
    ingredients: [
      { itemName: "Absolut Vodka", ml: 45 },
      { itemName: "Coffee Liqueur", ml: 25 },
    ],
  },
  {
    id: 9,
    name: "Cosmopolitan",
    ingredients: [
      { itemName: "Absolut Vodka", ml: 40 },
      { itemName: "Triple Sec", ml: 20 },
    ],
  },
]

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
})

function remainingBottlesEquivalent(item: Item) {
  const fullClosedBottles = Math.max(item.bottles - 1, 0)
  const openBottleEquivalent = item.openBottleMl / item.bottleSizeMl
  return (fullClosedBottles + openBottleEquivalent).toFixed(2)
}

function totalAvailableMl(item: Item) {
  return Math.max(item.bottles - 1, 0) * item.bottleSizeMl + item.openBottleMl
}

function isLow(item: Item) {
  return item.bottles <= item.minBottles
}

function isUrgent(item: Item) {
  return item.bottles < item.minBottles
}

function topCategory(items: Item[]) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
}

function consumeFromItem(item: Item, amountMl: number) {
  let bottles = item.bottles
  let openBottleMl = item.openBottleMl
  let remainingToConsume = amountMl

  while (remainingToConsume > 0 && bottles > 0) {
    if (openBottleMl >= remainingToConsume) {
      openBottleMl -= remainingToConsume
      remainingToConsume = 0
    } else {
      remainingToConsume -= openBottleMl
      bottles -= 1
      openBottleMl = bottles > 0 ? item.bottleSizeMl : 0
    }
  }

  return {
    ...item,
    bottles,
    openBottleMl,
  }
}

export default function Page() {
  const [items, setItems] = useState<Item[]>(drinksDataset)
  const [prompt, setPrompt] = useState("")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] =
    useState<(typeof navItems)[number]>("Dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number>(drinksDataset[0].id)
  const [consumptionAmountMl, setConsumptionAmountMl] = useState("50")

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Welcome to Cavaapp. I can help you track bottles, open-bottle ml, cocktail sales and reorder suggestions.",
    },
  ])

  const [logs, setLogs] = useState<ConsumptionLog[]>([
    {
      id: 1,
      itemName: "Mai Tai",
      amountMl: 75,
      reason: "Cocktail sold",
      time: "10:10",
    },
    {
      id: 2,
      itemName: "Negroni",
      amountMl: 90,
      reason: "Cocktail sold",
      time: "11:35",
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

  const lowItems = items.filter((item) => isLow(item))
  const urgentItems = items.filter((item) => isUrgent(item))

  const totalValue = items.reduce(
    (sum, item) =>
      sum +
      (Math.max(item.bottles - 1, 0) + item.openBottleMl / item.bottleSizeMl) *
        item.cost,
    0
  )

  const totalBottleEquivalent = items.reduce(
    (sum, item) =>
      sum +
      Math.max(item.bottles - 1, 0) +
      item.openBottleMl / item.bottleSizeMl,
    0
  )

  const reorderItems = items
    .filter((item) => isLow(item))
    .map((item) => ({
      ...item,
      suggestedOrder: Math.max(item.minBottles * 2 - item.bottles, 1),
    }))

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0]

  function addLog(itemName: string, amountMl: number, reason: string) {
    const now = new Date()
    const time = now.toLocaleTimeString("el-GR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setLogs((prev) => [
      {
        id: Date.now(),
        itemName,
        amountMl,
        reason,
        time,
      },
      ...prev,
    ])
  }

  function addBottle(itemId: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              bottles: item.bottles + 1,
            }
          : item
      )
    )
  }
  function removeBottle(itemId: number) {
  setItems((current) =>
    current.map((item) =>
      item.id === itemId && item.bottles > 0
        ? {
            ...item,
            bottles: item.bottles - 1,
          }
        : item
    )
  )
}
  

  function addManualConsumption() {
    const amount = Number(consumptionAmountMl)
    if (!selectedItem || !amount || amount <= 0) return

    if (totalAvailableMl(selectedItem) < amount) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Cannot record consumption. Not enough stock for ${selectedItem.name}.`,
        },
      ])
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === selectedItem.id ? consumeFromItem(item, amount) : item
      )
    )

    addLog(selectedItem.name, amount, "Manual consumption update")
  }

  function sellCocktail(cocktail: Cocktail) {
    const missingIngredient = cocktail.ingredients.find((ingredient) => {
      const item = items.find((i) => i.name === ingredient.itemName)
      return !item || totalAvailableMl(item) < ingredient.ml
    })

    if (missingIngredient) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Cannot prepare ${cocktail.name}. Not enough stock for ${missingIngredient.itemName}.`,
        },
      ])
      return
    }

    setItems((current) =>
      current.map((item) => {
        const ingredient = cocktail.ingredients.find(
          (ing) => ing.itemName === item.name
        )
        if (!ingredient) return item
        return consumeFromItem(item, ingredient.ml)
      })
    )

    const totalUsed = cocktail.ingredients.reduce((sum, ing) => sum + ing.ml, 0)
    addLog(cocktail.name, totalUsed, "Cocktail sold")

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `${cocktail.name} recorded successfully. Deducted: ${cocktail.ingredients
          .map((i) => `${i.itemName} ${i.ml}ml`)
          .join(", ")}.`,
      },
    ])
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
      response = reorderItems.length
        ? "Recommended reorder list: " +
          reorderItems
            .map(
              (i) =>
                `${i.name} (${i.bottles} bottles, reorder ${i.suggestedOrder})`
            )
            .join(", ")
        : "All items are above minimum thresholds right now."
    } else if (
      text.includes("summary") ||
      text.includes("overview") ||
      text.includes("σύνοψη")
    ) {
      response = `Inventory summary: ${items.length} labels, ${totalBottleEquivalent.toFixed(
        2
      )} bottle-equivalent stock, ${lowItems.length} low-stock items, ${
        urgentItems.length
      } urgent shortages, estimated value ${money.format(totalValue)}.`
    } else if (
      text.includes("cocktail") ||
      text.includes("κοκτει")
    ) {
      response =
        "Cocktail tracking is active. When you sell a cocktail, I deduct the correct ml from each ingredient and reduce bottle count when a bottle is finished."
    } else if (
      text.includes("loss") ||
      text.includes("απώλ") ||
      text.includes("λάθος")
    ) {
      response =
        "To reduce losses: record every cocktail sale, track the open bottle, reorder based on minimum bottles, and review consumption logs daily."
    } else {
      response =
        "Try asking: 'What should I reorder today?', 'Give me an inventory summary', or 'How can I reduce losses?'"
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
                  Monitoring stock, cocktails, reorder signals and usage.
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
                  <p className="text-lg font-bold tracking-tight md:text-2xl">
                    Cavaapp
                  </p>
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
                      Track bottles, open-bottle ml, sell real cocktails, reduce
                      losses, and manage your cava from one place.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <HeroMetric title="Labels" value={String(items.length)} />
                  <HeroMetric title="Low stock" value={String(lowItems.length)} />
                  <HeroMetric
                    title="Inventory value"
                    value={money.format(totalValue)}
                  />
                </div>
              </div>
            </section>

            {activeTab === "Dashboard" && (
              <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Bottle Equivalent"
                    value={totalBottleEquivalent.toFixed(2)}
                    subtitle="Remaining stock in bottle equivalent"
                    icon={<Package className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Urgent Shortages"
                    value={String(urgentItems.length)}
                    subtitle="Below minimum bottle threshold"
                    icon={<AlertTriangle className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Top Category"
                    value={topCategory(items)}
                    subtitle="Most represented spirit type"
                    icon={<Wine className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Reorder Signals"
                    value={String(reorderItems.length)}
                    subtitle="Items needing reorder attention"
                    icon={<ShoppingCart className="h-5 w-5" />}
                  />
                </section>

                <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
                  <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                    <CardHeader>
                      <CardTitle className="text-2xl">Dashboard Overview</CardTitle>
                      <CardDescription>
                        Quick health check of your bar inventory.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <InsightRow
                        icon={<AlertTriangle className="h-4 w-4" />}
                        text={`${lowItems.length} items are low based on minimum bottles.`}
                      />
                      <InsightRow
                        icon={<ShoppingCart className="h-4 w-4" />}
                        text={`${reorderItems.length} items have reorder suggestions ready.`}
                      />
                      <InsightRow
                        icon={<TrendingUp className="h-4 w-4" />}
                        text={`Current inventory value is ${money.format(totalValue)}.`}
                      />
                    </CardContent>
                  </Card>

                  <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                    <CardHeader>
                      <CardTitle className="text-2xl">Quick Actions</CardTitle>
                      <CardDescription>
                        Move quickly to the most important tasks.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ActionBox
                        title="Open Inventory"
                        text="Review bottles, open-bottle ml, suppliers and stock."
                        onClick={() => setActiveTab("Inventory")}
                      />
                      <ActionBox
                        title="Record Consumption"
                        text="Update ml usage or sell a cocktail."
                        onClick={() => setActiveTab("Consumption")}
                      />
                      <ActionBox
                        title="Review Orders"
                        text="Check reorder suggestions."
                        onClick={() => setActiveTab("Orders")}
                      />
                      <ActionBox
                        title="Ask AI Assistant"
                        text="Get summary and loss prevention advice."
                        onClick={() => setActiveTab("AI Assistant")}
                      />
                    </CardContent>
                  </Card>
                </section>
              </div>
            )}

            {activeTab === "Inventory" && (
              <section>
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle className="text-2xl">Inventory</CardTitle>
                        <CardDescription>
                          Full cava view with bottles, open bottle ml, costs and suppliers.
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
                        const low = isLow(item)
                        const urgent = isUrgent(item)

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
                                        {item.bottleSizeMl}ml
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

                                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-5">
                                  <InfoPill label="Bottles" value={`${item.bottles}`} />
                                  <InfoPill
                                    label="Open Bottle"
                                    value={`${item.openBottleMl} ml`}
                                  />
                                  <InfoPill
                                    label="Bottle Eq."
                                    value={remainingBottlesEquivalent(item)}
                                  />
                                  <InfoPill
                                    label="Min Bottles"
                                    value={`${item.minBottles}`}
                                  />
                                  <InfoPill label="Supplier" value={item.supplier} />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start lg:self-center">
                                <Button
                                  variant="outline"
                                  className="rounded-xl"
                                  onClick={() => addBottle(item.id)}
                                >
                                  +1
                                </Button>

                                <Button
                                  variant="outline" 
                                  className="rounded-xl"
                                  onClick={() => removeBottle(item.id)}
                                >
                                  -1
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {activeTab === "Consumption" && (
              <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-2xl">Manual Consumption</CardTitle>
                    <CardDescription>
                      Manually subtract ml from the selected bottle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItemId(item.id)}
                          className={`rounded-2xl border p-4 text-left ${
                            selectedItemId === item.id
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                              {item.image}
                            </div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p
                                className={`text-sm ${
                                  selectedItemId === item.id
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                              >
                                Bottles: {item.bottles} • Open bottle: {item.openBottleMl}ml
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Selected item</p>
                      <p className="mt-1 text-xl font-semibold">
                        {selectedItem?.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Bottles: {selectedItem?.bottles} • Open bottle: {selectedItem?.openBottleMl}ml
                      </p>
                    </div>

                    <Input
                      type="number"
                      value={consumptionAmountMl}
                      onChange={(e) => setConsumptionAmountMl(e.target.value)}
                      placeholder="50"
                      className="rounded-xl"
                    />

                    <div className="flex gap-2">
                      <Button className="rounded-xl" onClick={addManualConsumption}>
                        Save Consumption
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => addBottle(selectedItemId)}
                      >
                        Add Bottle
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-2xl">Real Cocktails</CardTitle>
                    <CardDescription>
                      Sell cocktails and deduct the right ml from each ingredient.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cocktails.map((cocktail) => (
                      <div
                        key={cocktail.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-semibold">{cocktail.name}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {cocktail.ingredients
                                .map((i) => `${i.itemName} ${i.ml}ml`)
                                .join(" • ")}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => sellCocktail(cocktail)}
                          >
                            Sell Cocktail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {activeTab === "Orders" && (
              <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-2xl">Orders</CardTitle>
                    <CardDescription>
                      Suggested reorders based on bottle thresholds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reorderItems.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                        No reorder suggestions right now.
                      </div>
                    ) : (
                      reorderItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                Bottles {item.bottles} • Open bottle {item.openBottleMl}ml •
                                Min {item.minBottles} bottles • {item.supplier}
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                              Suggested order:{" "}
                              <span className="font-semibold">
                                {item.suggestedOrder} bottles
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <CardTitle className="text-2xl">Supplier Summary</CardTitle>
                    <CardDescription>
                      Current suppliers active in your inventory.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...new Set(items.map((i) => i.supplier))].map((supplier) => (
                      <div
                        key={supplier}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-medium">{supplier}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {
                            items.filter((item) => item.supplier === supplier)
                              .length
                          }{" "}
                          products
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {activeTab === "AI Assistant" && (
              <section className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="rounded-[24px] border-0 shadow-xl shadow-slate-200/70">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      <CardTitle className="text-2xl">Cavaapp AI Assistant</CardTitle>
                    </div>
                    <CardDescription>
                      Ask about stock, open bottles, cocktails and reorders.
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
                    <CardTitle className="text-2xl">Recent Consumption</CardTitle>
                    <CardDescription>
                      Latest manual or cocktail-based deductions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-slate-200 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{log.itemName}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {log.reason}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-semibold">-{log.amountMl}ml</p>
                            <p className="text-slate-400">{log.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}
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
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
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

function ActionBox({
  title,
  text,
  onClick,
}: {
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </button>
  )
}