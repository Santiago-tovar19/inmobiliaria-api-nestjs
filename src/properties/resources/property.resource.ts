import { Property } from '../entities/property.entity';

export class PropertyResource {
  static make(property: Property) {
    if (!property) return null;

    return {
      id: property.id,
      name: property.name,
      description: property.description,

      property_type_id: property.propertyType?.id ?? null,
      address: property.address,
      mls_number: property.mls_number,
      construction_year: property.construction_year,
      location_type: property.location_type,

      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      video: property.video,
      size: property.size !== null ? property.size.toString() : null,
      price: property.price !== null ? property.price.toString() : null,

      currency_id: property.currency?.id ?? null,
      youtube_link: property.youtube_link,

      status_id: property.status?.id ?? null,
      contract_type_id: property.contractType?.id ?? null,

      lat: property.lat,
      lon: property.lon,

      parking: property.parking,
      kitchen: property.kitchen,
      elevator: property.elevator,
      wifi: property.wifi,
      fireplace: property.fireplace,
      hoa: property.hoa,
      stories: property.stories,
      exclusions: property.exclusions,
      level: property.level,
      security: property.security,
      lobby: property.lobby,
      balcony: property.balcony,
      terrace: property.terrace,
      power_plant: property.power_plant,
      gym: property.gym,
      walk_in_closet: property.walk_in_closet,
      swimming_pool: property.swimming_pool,
      kids_area: property.kids_area,
      pets_allowed: property.pets_allowed,
      central_air_conditioner: property.central_air_conditioner,

      published: property.published,
      featured: property.featured,

      created_by: property.createdBy?.id ?? null,
      broker_id: property.broker?.id ?? null,

      published_at: property.published_at,
      deleted_at: property.deleted_at,
      created_at: property.created_at,
      updated_at: property.updated_at,

      // Relaciones (Laravel style)
      property_type: property.propertyType
        ? {
            id: property.propertyType.id,
            name: property.propertyType.name,
            created_at: property.propertyType.created_at,
            updated_at: property.propertyType.updated_at,
          }
        : null,

      status: property.status
        ? {
            id: property.status.id,
            name: property.status.name,
            created_at: property.status.created_at,
            updated_at: property.status.updated_at,
          }
        : null,

      currency: property.currency
        ? {
            id: property.currency.id,
            name: property.currency.name,
            created_at: property.currency.created_at,
            updated_at: property.currency.updated_at,
          }
        : null,

      contract_type: property.contractType
        ? {
            id: property.contractType.id,
            name: property.contractType.name,
            created_at: property.contractType.created_at,
            updated_at: property.contractType.updated_at,
          }
        : null,

      images:
        property.images?.map((img) => ({
          id: img.id,
          name: img.name,
          property_id: img.property?.id ?? property.id,
          type: img.type,
          created_at: img.created_at,
          updated_at: img.updated_at,
        })) ?? [],
    };
  }

  static collection(properties: Property[]) {
    return properties.map((property) => this.make(property));
  }
}
