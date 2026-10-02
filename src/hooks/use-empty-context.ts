import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UseNavigateResult } from '@tanstack/react-router'
import { EmptyContext } from '@/components/providers/empty-provider'
import { boredMessages } from '@/utils/messages'
import { DONT_LEAVE_PATH } from '@/utils/paths'

export const timeoutModifier = 1

export function useEmptyProvider({
  navigate,
}: {
  navigate: UseNavigateResult<string>
}) {
  const [title, setTitle] = useState<string>('Cube Games')
  const [lastActivity, setLastActivity] = useState<Date>(() => {
    const localTime = localStorage.getItem('last-activity')
    return localTime ? new Date(JSON.parse(localTime)) : new Date()
  })

  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [pokes, setPokes] = useState<number>(0)

  const [interfereAllowed, setInterfereAllowed] = useState<boolean>(true)
  const [ignoreCount, setIgnoreCount] = useState<number>(0)

  const [startTime, _] = useState<Date>(new Date())

  const updateLocal = (activity: Date) => {
    localStorage.setItem('last-activity', JSON.stringify(activity))
  }

  const updateActivity = useCallback(() => {
    const now = new Date()
    setLastActivity(now)
    updateLocal(now)
  }, [setLastActivity])

  useEffect(() => {
    const now = new Date()
    const startDiff = now.valueOf() - startTime.valueOf()
    if (startDiff > 10 * 60 * 1000 * timeoutModifier) {
      setShowMessage(true)
      setTitle('Empty Games')

      setTimeout(
        () => {
          setShowMessage(false)
          setTitle('Cube Games')
        },
        2.5 * 1000 * timeoutModifier,
      )
    }
    const timeout = setTimeout(
      () => setPokes((p) => p + 1),
      2 * 60 * 1000 * timeoutModifier,
    )
    return () => clearTimeout(timeout)
  }, [startTime, setShowMessage, setTitle, pokes])

  useEffect(() => {
    const startDiff = startTime.valueOf() - lastActivity.valueOf()
    if (startDiff > 20 * 60 * 1000 * timeoutModifier) {
      navigate({ to: '/' + DONT_LEAVE_PATH })
    }
  }, [])

  const riceMessage = useMemo(
    () =>
      showMessage
        ? boredMessages[Math.floor(Math.random() * boredMessages.length)]
        : undefined,
    [showMessage],
  )

  const toggleInterference = useCallback(
    (b: boolean) => {
      if (b) {
        setInterfereAllowed(true)
      } else {
        setInterfereAllowed(false)
        setIgnoreCount((i) => i + 1)
        setTimeout(
          () => {
            setInterfereAllowed(true)
            toast.info('I lived, bitch', {
              description: "Thought you'd seen the last of me, didn't you?",
            })
          },
          60 *
            1000 *
            timeoutModifier *
            (10 - Math.min(ignoreCount, 10) + Math.ceil(Math.random() * 5)),
        )
      }
    },
    [setInterfereAllowed],
  )

  return {
    title,
    setTitle,
    lastActivity,
    updateActivity,
    riceMessage,
    interfereAllowed,
    setInterfereAllowed: toggleInterference,
    // setInterfereAllowed: setInterfereAllowed,
  }
}

export default function useEmptyContext() {
  return useContext(EmptyContext)
}
