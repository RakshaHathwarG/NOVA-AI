import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold border border-white/15 text-ink hover:border-nova-cyan/60 hover:text-nova-cyan transition-colors duration-300',
  text: 'inline-flex items-center gap-1.5 font-medium text-ink-muted hover:text-white transition-colors duration-300',
}

const SIZES = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
}

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', className = '', as = 'button', ...props },
  ref
) {
  const Component = motion[as] || motion.button
  return (
    <Component
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(VARIANTS[variant], SIZES[size] !== '' ? SIZES[size] : undefined, className)}
      {...props}
    >
      {children}
    </Component>
  )
})

export default Button
