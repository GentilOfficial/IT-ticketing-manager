import ThemeSwitcher from '@/components/theme/ThemeSwitcher'
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowRight,
  Code2,
  Headset,
  KeyRound,
  LayoutDashboard,
  ListFilter,
  MessagesSquare,
  Scroll,
  ShieldCheck,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'

const STEPS = [
  {
    step: '01',
    title: 'Open a ticket',
    description: 'A team member describes the issue: a title and a few lines of detail. Takes under a minute.',
  },
  {
    step: '02',
    title: 'IT assigns it',
    description: 'Only support staff can be assigned to a ticket, so it always has one clear owner.',
  },
  {
    step: '03',
    title: 'Status moves forward',
    description: "Open, then in progress, then resolved. If it's waiting on something else, it can be put on hold.",
  },
  {
    step: '04',
    title: 'Nothing gets lost',
    description: 'Every comment and status change stays on the ticket, not buried in an inbox.',
  },
]

const FEATURES = [
  {
    icon: ListFilter,
    title: 'Search, filter, sort & group',
    description: 'Find any ticket instantly by title, status, requester, or assignee.',
  },
  {
    icon: MessagesSquare,
    title: 'Ticket comments',
    description: 'Keep the back-and-forth where the work happens, not scattered across email.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-based access',
    description: 'Employees see their own tickets. IT admins see and manage everything, enforced by the API.',
  },
  {
    icon: KeyRound,
    title: 'Email or Google sign-in',
    description: 'Register with a password, or sign in with Google. No other options, no other data collected.',
  },
  {
    icon: LayoutDashboard,
    title: 'Live stats dashboard',
    description: "A running view of what's open, in progress, on hold or resolved.",
  },
  {
    icon: Scroll,
    title: 'Open API docs',
    description: 'A full OpenAPI reference, browsable and testable, for anything built on top.',
  },
]

const HomePage = () => {
  useEffect(() => {
    document.title = 'Helpdesk - IT Ticketing Manager'
  }, [])

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Headset className="size-5 text-primary" />
            <span className="font-semibold text-sm">HelpDesk</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/signup">Sign up</Link>
            </Button>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <Badge variant="outline" className="mb-5 text-muted-foreground">
                Internal IT Support
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                Every IT ticket, in one place, with a status you can trust.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                A team member opens a ticket. IT takes it, assigns it, works it, resolves it. Every step is tracked, and
                nothing gets lost in email.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link to="/auth/signup">
                    Create your account
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/auth/login">Sign in</Link>
                </Button>
              </div>
            </div>
            <Card className="border-border/80">
              <CardContent className="flex flex-col gap-4">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  A ticket's life on HelpDesk
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <TicketStatusBadge status="open" />
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <TicketStatusBadge status="in_progress" />
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <TicketStatusBadge status="resolved" />
                </div>
                <p className="text-xs text-muted-foreground">when it's waiting on something else:</p>
                <TicketStatusBadge status="on_hold" />
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Every move is enforced by the API, not just the interface. A ticket can't skip a step, and only IT can
                  assign or resolve one.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <Separator />
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Four steps, the same ones every ticket in the system actually follows.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, title, description }) => (
              <div key={step}>
                <span className="text-sm font-semibold text-primary">{step}</span>
                <h3 className="mt-2 font-medium">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>
        <Separator />
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Built for how support actually works</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Everything below is already in the product, not on a roadmap.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/80">
                <CardContent className="flex flex-col gap-2">
                  <Icon className="size-5 text-primary" />
                  <h3 className="text-base font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="border-t border-border/80 bg-muted/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ready to open your first ticket?</h2>
            <p className="max-w-md text-muted-foreground">
              Create an account and see the whole flow: from a two-line request to a resolved ticket.
            </p>
            <Button asChild>
              <Link to="/auth/signup">
                Create your account
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-12 sm:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Headset className="size-4" />
            <span className="text-sm">HelpDesk an IT Ticketing Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full text-muted-foreground">
              <a href="https://github.com/GentilOfficial/IT-ticketing-manager" target="_blank">
                <Code2 />
                <span>View source</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full text-muted-foreground">
              <a href={`${import.meta.env.VITE_API_SERVER}/docs`} target="_blank">
                <Scroll />
                <span>API Documentation</span>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
