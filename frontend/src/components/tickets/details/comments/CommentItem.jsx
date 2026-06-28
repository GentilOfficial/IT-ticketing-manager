import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/providers/AuthProvider'
import { Shield, User } from 'lucide-react'

const CommentItem = ({ comment }) => {
  const { user } = useAuth()
  const isOwn = comment.author._id === user._id

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar>
        <AvatarFallback className="font-semibold text-xs shrink-0">
          {user.name.slice(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col gap-1 min-w-0 max-w-4/5 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {comment.author.role === 'admin' ? <Shield className="size-3.5" /> : <User className="size-3.5" />}
          <span className="font-semibold">{isOwn ? 'You' : comment.author.name}</span>
        </div>
        <div
          className={`rounded-lg px-3 py-2 text-sm wrap-break-word w-fit max-w-full ${
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          }`}
        >
          {comment.message}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
