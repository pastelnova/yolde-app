import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { ProfileInterface } from '../models/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  getProfile(username: Signal<string>) {
    return httpResource<{ profile: ProfileInterface }>(() => (username() ? `/profiles/${username()}` : undefined));
  }
}
