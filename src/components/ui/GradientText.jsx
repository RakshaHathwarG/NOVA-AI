import { cn } from '../../utils/cn'

export default function GradientText({ children, className = '', as: Tag = 'span' }) {
  return <Tag className={cn('gradient-text', className)}>{children}</Tag>
}
