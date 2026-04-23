import { Injectable } from '@nestjs/common';
import { Settings } from '@/common/types/api-contracts';
import { mapSettingsRowToContract } from '@/modules/settings/settings.mapper';
import { SettingsRepository } from '@/modules/settings/settings.repository';
import { UpdateSettingsDto } from '@/modules/settings/settings.types';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async get(userId: string, email: string): Promise<Settings> {
    const row = await this.settingsRepository.upsert(userId, {}, email);
    return mapSettingsRowToContract(row);
  }

  async update(
    userId: string,
    email: string,
    input: UpdateSettingsDto,
  ): Promise<Settings> {
    const row = await this.settingsRepository.upsert(userId, input, email);
    return mapSettingsRowToContract(row);
  }
}
