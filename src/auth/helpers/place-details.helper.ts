import { Injectable, Logger } from '@nestjs/common';
import {
  Client,
  PlacesNearbyResponse,
} from '@googlemaps/google-maps-services-js';
import axios from 'axios';

export interface PlacePhotoResult {
  url: string;
  width: number;
  height: number;
}

export interface PlaceResult {
  place_id: string;
  photos: PlacePhotoResult[];
}

@Injectable()
export class PlaceDetailsHelper {
  private readonly logger = new Logger(PlaceDetailsHelper.name);
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
  }

  /**
   * Builds an outdoor Street View photo URL facing the building/property.
   */
  private buildStreetViewUrl(
    lat: number,
    lng: number,
    heading?: number,
    pitch = 10,
    fov = 90,
    width = 800,
    height = 600,
  ): string {
    let url = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&fov=${fov}&pitch=${pitch}&key=${this.apiKey}`;
    if (heading !== undefined) {
      url += `&heading=${heading}`;
    }
    return url;
  }

  private buildPlacePhotoUrl(photoReference: string, maxWidth = 1080): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Gets outside property photos via Street View (3 perspectives), falling back to Places API if unavailable.
   */
  async getPlacePhotos(
    latlng: { lat: number; lng: number },
    maxWidth = 800,
  ): Promise<PlaceResult[]> {
    if (!this.apiKey) {
      this.logger.warn('GOOGLE_MAPS_API_KEY is not defined');
      return [];
    }

    const height = Math.round((maxWidth * 3) / 4);

    // 1. Try Street View first (generates 3 exterior views: Front, Wide angle, Architecture close-up)
    try {
      const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${latlng.lat},${latlng.lng}&key=${this.apiKey}`;
      const metaRes = await axios.get(metadataUrl, { timeout: 3000 });

      if (metaRes.data?.status === 'OK') {
        const panoId = metaRes.data.pano_id || 'streetview';

        const frontPhoto = this.buildStreetViewUrl(
          latlng.lat,
          latlng.lng,
          undefined,
          10,
          90,
          maxWidth,
          height,
        );

        const widePhoto = this.buildStreetViewUrl(
          latlng.lat,
          latlng.lng,
          undefined,
          12,
          110,
          maxWidth,
          height,
        );

        const focusedPhoto = this.buildStreetViewUrl(
          latlng.lat,
          latlng.lng,
          undefined,
          5,
          70,
          maxWidth,
          height,
        );

        return [
          {
            place_id: panoId,
            photos: [
              { url: frontPhoto, width: maxWidth, height },
              { url: widePhoto, width: maxWidth, height },
              { url: focusedPhoto, width: maxWidth, height },
            ],
          },
        ];
      } else {
        this.logger.debug(
          `Street View status: ${metaRes.data?.status}. Falling back to Places API.`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Street View check failed: ${err instanceof Error ? err.message : err}. Falling back to Places API.`,
      );
    }

    // 2. Fallback: Google Places API if Street View is not available
    try {
      const raw: unknown = await this.client.placesNearby({
        params: {
          location: { lat: latlng.lat, lng: latlng.lng },
          radius: 150,
          key: this.apiKey,
        },
      });

      const response = raw as PlacesNearbyResponse;
      const places = response.data?.results ?? [];

      const withPhotos = places.filter(
        (p) => p.photos && p.photos.length > 0,
      );

      if (withPhotos.length > 0) {
        // Collect photos across nearby places up to 3-4 photos
        const allExtractedPhotos: PlacePhotoResult[] = [];
        for (const place of withPhotos) {
          for (const photo of place.photos || []) {
            if (allExtractedPhotos.length < 3) {
              allExtractedPhotos.push({
                url: this.buildPlacePhotoUrl(photo.photo_reference, maxWidth),
                width: photo.width,
                height: photo.height,
              });
            }
          }
        }

        return [
          {
            place_id: withPhotos[0]?.place_id || 'places',
            photos: allExtractedPhotos,
          },
        ];
      }
    } catch (error) {
      this.logger.error('Places API fallback failed', error);
    }

    // 3. Fallback: Direct Street View Static URLs (3 perspectives)
    return [
      {
        place_id: 'streetview-direct',
        photos: [
          {
            url: this.buildStreetViewUrl(latlng.lat, latlng.lng, undefined, 10, 90, maxWidth, height),
            width: maxWidth,
            height,
          },
          {
            url: this.buildStreetViewUrl(latlng.lat, latlng.lng, undefined, 12, 110, maxWidth, height),
            width: maxWidth,
            height,
          },
          {
            url: this.buildStreetViewUrl(latlng.lat, latlng.lng, undefined, 5, 70, maxWidth, height),
            width: maxWidth,
            height,
          },
        ],
      },
    ];
  }
}
