import { serviceCategories, services } from '@/data/seed/services'
import type { Service, ServiceCategory } from '@/types'

export function getServiceCategories(): ServiceCategory[] {
  return serviceCategories
}

export function getServices(): Service[] {
  return services
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServicesByCategory(categoryId: string): Service[] {
  return services.filter((s) => s.categoryId === categoryId)
}
