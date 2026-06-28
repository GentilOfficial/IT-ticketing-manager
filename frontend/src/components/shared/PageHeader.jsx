const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">{title}</h2>
        {description && <p className="leading-7 text-muted-foreground">{description}</p>}
      </div>
      {actions ? <div className="flex items-center">{actions}</div> : null}
    </div>
  )
}

export default PageHeader
