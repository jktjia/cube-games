import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import useEmptyContext from '@/hooks/use-empty-context'

export default function About() {
  const { findPage } = useEmptyContext()

  useEffect(() => {
    findPage('about')
  }, [])

  return (
    <div className="w-2xl flex flex-col items-start gap-5 h-full p-2 text-start">
      <h1 className="text-2xl font-bold">About</h1>
      <Separator />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <p className="text-background">
        She thought we ought to have an about page.
      </p>
    </div>
  )
}
