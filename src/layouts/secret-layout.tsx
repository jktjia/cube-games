import { Outlet } from '@tanstack/react-router'

export default function SecretLayout() {
  return (
    <div className="mx-auto p-4 sm:p-8 text-center max-w-full w-2xl h-full justify-center items-center flex">
      <Outlet />
    </div>
  )
}
