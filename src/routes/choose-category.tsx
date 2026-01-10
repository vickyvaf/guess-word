import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/uikits/button'

export const Route = createFileRoute('/choose-category')({
  component: ChooseCategoryPage,
})

function ChooseCategoryPage() {
  const navigate = useNavigate()

  const categories = [
    { title: 'Animals', description: 'Guess the names of animals' },
    { title: 'Fruits', description: 'Guess the names of fruits' },
    { title: 'Vehicles', description: 'Guess the names of vehicles' },
    { title: 'Colors', description: 'Guess different colors' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        userSelect: 'none',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '3rem',
          lineHeight: 1.2,
          marginBottom: '1rem',
        }}
      >
        Choose Category
      </h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {categories.map((category) => (
          <Button
            key={category.title}
            style={{
              fontSize: '1.5rem',
              cursor: 'pointer',
              border: '2px solid black',
              borderRadius: '10px',
              padding: '1rem 2rem',
              background: 'white',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
              fontWeight: 700,
              userSelect: 'none',
              fontFamily: 'inherit',
            }}
            onClick={() => {
              navigate({
                to: '/playing/$category',
                params: { category: category.title.toLowerCase() },
              })
            }}
          >
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
