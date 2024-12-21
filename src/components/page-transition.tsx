import { cn } from '@/lib/utils'
import { HTMLMotionProps, m } from 'motion/react'

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={cn('w-full h-full', className)}
      {...props}
    >
      {children}
    </m.div>
  )
}
