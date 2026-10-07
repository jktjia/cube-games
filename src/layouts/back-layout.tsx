import { Outlet, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackLayout() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <>
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() =>
          canGoBack ? router.history.back() : router.navigate({ to: '/' })
        }
        className="m-2 md:fixed z-10 left-0 top-0"
      >
        <ArrowLeft />
      </Button>
      <Outlet />
    </>
  )
}
