import { useId } from 'react'
import * as RechartsPrimitive from 'recharts'

import { cn } from '@/lib/utils'

const ChartContainer = ({ id, className, children, config = {}, ...props }) => {
  const uniqueId = useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      className={cn(
        '[&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-border [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-legend-item-text]:text-foreground [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border',
        className,
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
    </div>
  )
}

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config || {}).filter(([, item]) => item?.color)

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {${colorConfig.map(([key, item]) => `--color-${key}: ${item.color};`).join('')}}`,
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = ({ active, payload, label, formatter, indicator = 'dot', hideLabel = false }) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="grid min-w-[8rem] gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 py-2 text-xs shadow-md">
      {!hideLabel && label ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1">
        {payload.map((item) => {
          const key = item.dataKey || item.name || 'value'
          const value = formatter ? formatter(item.value, item.name, item) : item.value

          return (
            <div key={`${key}-${item.value}`} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {indicator === 'dot' ? (
                  <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                ) : null}
                <span>{item.name}</span>
              </div>
              <span className="font-mono font-medium text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
