import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'

export function KontenPratinjau() {
  const { contentId } = useParams()
  return (
    <PagePlaceholder
      title={`Pratinjau & tinjauan: ${contentId ?? ''}`}
      note="Checklist 4 poin dan tayangkan — dikerjakan di potongan 6."
    />
  )
}
