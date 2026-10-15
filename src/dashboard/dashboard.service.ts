// src/dashboard/dashboard.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyView } from 'src/property-views/entities/property-view.entity/property-view.entity';
import { In } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(PropertyView)
    private readonly propertyViewRepo: Repository<PropertyView>,
  ) {}

  async getAdminMasterData(authUser: User) {
    if (authUser.role_id !== 1) {
      throw new ForbiddenException('No autorizado');
    }

    const masterAdminCount = await this.userRepo.count({
      where: { role: { id: 1 } },
    });
    const agentCount = await this.userRepo.count({
      where: { role: { id: 3 } },
    });
    const costumerCount = await this.userRepo.count({
      where: { role: { id: 4 } },
    });

    const propertyCount = await this.propertyRepo.count({
      where: { createdBy: { id: authUser.id } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayPropertiesViewsCount = await this.propertyViewRepo
      .createQueryBuilder('pv')
      .innerJoin('pv.property', 'property')
      .where('property.created_by = :userId', { userId: authUser.id })
      .andWhere('pv.created_at BETWEEN :today AND :tomorrow', {
        today,
        tomorrow,
      })
      .getCount();

    // 🔥 FIX GROUP BY
    const topViewedRaw = await this.propertyViewRepo
      .createQueryBuilder('pv')
      .select('pv.property_id', 'property_id')
      .addSelect('COUNT(*)', 'total')
      .groupBy('pv.property_id')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany();

    const propertyIds = topViewedRaw.map((p) => p.property_id);

    const properties = await this.propertyRepo.find({
      where: { id: In(propertyIds) },
      relations: ['images'],
    });

    const moreViewedProperties = propertyIds
      .map((id) => {
        const property = properties.find((p) => p.id === id);
        if (!property) return null;

        const total = Number(
          topViewedRaw.find((p) => p.property_id === id)?.total,
        );

        return {
          property,
          total,
        };
      })
      .filter(
        (item): item is { property: Property; total: number } => item !== null,
      );

    return {
      masterAdminCount,
      agentCount,
      costumerCount,
      propertyCount,
      todayPropertiesViewsCount,
      moreViewedProperties,
    };
  }
}
