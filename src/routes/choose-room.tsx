import { ChooseRoomScreen } from '@/screens/choose-room-screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/choose-room')({
  component: ChooseRoomScreen,
})
