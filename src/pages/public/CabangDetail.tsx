import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'

export function CabangDetail() {
  const { slug } = useParams()
  return <PagePlaceholder title={`Cabang: ${slug}`} note="Peta, foto fasilitas, jam praktik — dikerjakan di potongan 2." />
}
