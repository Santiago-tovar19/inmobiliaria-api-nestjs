import { Property } from 'src/properties/entities/property.entity';

export class MoreViewedPropertyResource {
  static make(item: { property: Property; total: number }) {
    return {
      property_id: item.property.id,
      total: item.total,
      property: item.property,
    };
  }

  static collection(items: { property: Property; total: number }[]) {
    return items.map((item) => this.make(item));
  }
}
