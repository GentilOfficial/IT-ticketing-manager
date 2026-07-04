import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContext'
import { Shield, User } from 'lucide-react'
import moment from 'moment'

const CommentItem = ({ comment }) => {
  const { user } = useAuth()
  const { author, message } = comment
  const isOwn = author._id === user._id
  const createdAt = moment(comment.createdAt).fromNow()

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar>
        <AvatarFallback className="font-semibold text-xs shrink-0">
          {author.name.slice(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col gap-1 min-w-0 max-w-4/5 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {author.role === 'admin' ? <Shield className="size-3.5" /> : <User className="size-3.5" />}
          <span className="font-semibold">{isOwn ? 'You' : author.name}</span>
        </div>
        <div
          className={`rounded-lg px-3 py-2 text-sm wrap-break-word w-fit max-w-full ${
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          }`}
        >
          {message}
        </div>
        <small className="text-muted-foreground">{createdAt}</small>
      </div>
    </div>
  )
}

export default CommentItem
