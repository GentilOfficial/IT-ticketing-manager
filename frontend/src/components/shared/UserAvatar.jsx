import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const UserAvatar = ({ user }) => {
  return (
    <Avatar>
      <AvatarFallback className="font-semibold text-xs shrink-0">
        {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
