import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MathGridBg } from '@/components/background'
import { ModalLeaderboard } from '@/components/modal-leaderboard'
import { ModalSettings } from '@/components/modal-settings'

export const Route = createRootRoute({
  component: () => (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Outlet />
      <MathGridBg cell={30} major={30} />
      <ModalLeaderboard />
      <ModalSettings />
    </div>
  ),
})
