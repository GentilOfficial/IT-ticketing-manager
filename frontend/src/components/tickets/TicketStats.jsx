import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'
import useTicketStats from '@/hooks/useTicketStats'
import { AlertTriangle, CircleCheck, CircleDot, Clock, ClockAlert } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

const STATUS_ORDER = ['open', 'in_progress', 'on_hold', 'resolved']

const STATUS_CONFIG = {
  open: { label: 'Open', icon: CircleDot, color: '#2b7fff', progressClass: 'bg-blue-500' },
  in_progress: { label: 'In Progress', icon: Clock, color: '#f0b100', progressClass: 'bg-yellow-500' },
  on_hold: { label: 'On Hold', icon: ClockAlert, color: '#ad46ff', progressClass: 'bg-purple-500' },
  resolved: { label: 'Resolved', icon: CircleCheck, color: '#00bc7d', progressClass: 'bg-emerald-500' },
}

const TicketStats = () => {
  const { isAdmin } = useAuth()
  const { stats, isLoading, error } = useTicketStats()

  const total = Number.isFinite(stats.total) ? stats.total : 0
  const items = STATUS_ORDER.map((status) => ({
    key: status,
    label: STATUS_CONFIG[status].label,
    icon: STATUS_CONFIG[status].icon,
    color: STATUS_CONFIG[status].color,
    progressClass: STATUS_CONFIG[status].progressClass,
    value: Number(stats.byStatus[status] || 0),
  }))
  const radarData = items.map((item) => ({
    status: item.label,
    tickets: item.value,
    fill: item.color,
  }))

  const chartConfig = {
    tickets: { label: 'Tickets', color: 'var(--color-chart-1)' },
  }

  if (error)
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="size-4" />
        <AlertTitle>Unable to load ticket statistics</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Ticket Statistics</CardTitle>
        <CardDescription>
          {isAdmin
            ? 'Global distribution for all tickets in the platform.'
            : 'Distribution for tickets created by your account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-5 lg:items-stretch">
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/50 bg-card/70 p-2 lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner className="size-8" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-32 w-full lg:h-48">
                <RadarChart data={radarData} outerRadius="70%" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <PolarGrid />
                  <PolarAngleAxis dataKey="status" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                  <Radar
                    dataKey="tickets"
                    name="Tickets"
                    stroke="var(--color-tickets)"
                    fill="var(--color-tickets)"
                    fillOpacity={0.25}
                    dot={{ r: 3, fill: 'var(--color-tickets)' }}
                  />
                </RadarChart>
              </ChartContainer>
            )}
            <div className="text-center">
              <div className="text-2xl leading-none font-semibold">{total}</div>
              <small className="text-xs text-muted-foreground">Total Tickets</small>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:col-span-3 lg:items-stretch">
            {items.map((item) => {
              const percentage = !total ? 0 : Math.round((item.value / total) * 100)
              const Icon = item.icon

              return (
                <div
                  key={item.key}
                  className="flex h-full flex-col justify-between rounded-lg border border-border/60 bg-card/80 p-2.5"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Icon className="size-3.5" />
                      {item.label}
                    </span>
                    <span className="text-muted-foreground">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    indicatorClassName={item.progressClass}
                    aria-label={`${item.label}: ${item.value} tickets`}
                    className="h-1.5"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TicketStats
