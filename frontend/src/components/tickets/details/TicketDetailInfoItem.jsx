const TicketDetailInfoItem = ({ label, value, children }) => {
  return (
    <div className="flex items-center justify-between gap-2 text-muted-foreground">
      <div>{label}</div>
      {children ?? <div>{value}</div>}
    </div>
  )
}

export default TicketDetailInfoItem
