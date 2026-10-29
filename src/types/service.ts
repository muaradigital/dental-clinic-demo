export interface ServiceCategory {
  id: string
  name: string
}

/**
 * Deliberately has NO price field. "Harga layanan default tersembunyi" is
 * enforced structurally — there is nothing here a UI could render, not a
 * flag that could be flipped on.
 */
export interface Service {
  id: string
  slug: string
  categoryId: string
  name: string
  shortDescription: string
  icon: string
}
