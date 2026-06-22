import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { setCoachRuntimeListeners } from "../lib/twilio-coach-runtime"
import { LIVE_CALLS_POLL_MS } from "../constants/live-calls.constants"
import {
  fetchActiveLiveCallsThunk,
  leaveCoachCallThunk,
  setCoachPhase,
} from "../redux/live-calls.slice"

export default function LiveCallsEffectsCP() {
  const dispatch = useAppDispatch()
  const usersCount = useAppSelector((s) => s.users.usersOriginal.length)

  useEffect(() => {
    if (usersCount === 0) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, usersCount])

  useEffect(() => {
    setCoachRuntimeListeners({
      onPhase: (phase) => dispatch(setCoachPhase(phase)),
      onError: (message) => {
        dispatch(setCoachPhase("error"))
        console.error("[live-calls] coach error:", message)
      },
    })
    return () => {
      setCoachRuntimeListeners({})
    }
  }, [dispatch])

  useEffect(() => {
    void dispatch(fetchActiveLiveCallsThunk())
    const timer = window.setInterval(() => {
      void dispatch(fetchActiveLiveCallsThunk())
    }, LIVE_CALLS_POLL_MS)
    return () => window.clearInterval(timer)
  }, [dispatch])

  useEffect(() => {
    return () => {
      void dispatch(leaveCoachCallThunk())
    }
  }, [dispatch])

  return null
}
