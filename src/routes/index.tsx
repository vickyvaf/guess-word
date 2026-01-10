import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/uikits/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        width: '100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '1.5rem',
          maxWidth: '900px',
          lineHeight: 1.4,
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
          }}
        >
          Welcome to the ultimate word guessing challenge!
        </span>
        <br />
        <br />
        <span>
          Try to uncover the hidden word by guessing letters before you run out
          of attempts.
        </span>
        <br />
        <span> Sharpen your vocabulary and have fun along the way!</span>
      </p>
      <Button
        onClick={() => {
          navigate({ to: '/choose-room' })
        }}
      >
        Play
      </Button>
    </div>
  )
}
