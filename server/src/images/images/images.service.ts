import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface PexelsPhoto {
  src: {
    large: string;
    [key: string]: string;
  };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  async searchImage(query: string): Promise<string | null> {
    const apiKey: string | undefined =
      this.config.get<string>('PEXELS_API_KEY');

    if (!apiKey) {
      this.logger.warn('PEXELS_API_KEY is not set; skipping image search');
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<PexelsSearchResponse>(
          'https://api.pexels.com/v1/search',
          {
            params: {
              query,
              per_page: 1,
            },
            headers: {
              Authorization: apiKey,
            },
            timeout: 5000,
          },
        ),
      );

      const image = response.data?.photos?.[0];
      return image?.src?.large ?? null;
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      this.logger.error(
        `Pexels image search failed for query "${query}"${status ? ` (status ${status})` : ''}`,
      );
      return null;
    }
  }
}
