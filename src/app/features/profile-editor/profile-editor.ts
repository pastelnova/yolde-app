import { Component, computed, effect, inject } from '@angular/core';
import { ProfileService } from '../../shared/services/profile.service';
import { ProfileInterface } from '../../shared/models/profile.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { authStore } from '../../core/auth/store/auth.store';
import { AuthService } from '../../core/auth/services/auth.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-profile-editor',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.scss',
})
export class ProfileEditor {
  private profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  store = inject(authStore);

  private username = toSignal(this.route.params.pipe(map((params) => params['username'])), { initialValue: '' });

  profileResource = this.profileService.getProfile(this.username);
  isLoading = computed(() => this.profileResource.isLoading());
  profile = computed(() => this.profileResource.value()?.profile ?? ({} as ProfileInterface));

  profileForm = new FormGroup({
    image: new FormControl(''),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    bio: new FormControl(''),
    password: new FormControl(''),
  });

  private formValue = toSignal(this.profileForm.valueChanges, {
    initialValue: this.profileForm.value,
  });

  previewInitials = computed(() => {
    const name = this.formValue().username || this.profile().username || '';
    return name.slice(0, 2).toUpperCase();
  });
  previewName = computed(() => this.formValue().username || this.profile().username || '');
  previewHandle = computed(() => `@${this.formValue().username || this.profile().username || ''}`);
  previewBio = computed(() => this.formValue().bio || this.profile().bio || '');

  constructor() {
    effect(() => {
      const user = this.store.currentUser();
      if (user && !this.profileForm.dirty) {
        this.profileForm.patchValue({
          image: user.image ?? '',
          username: user.username,
          email: user.email,
          bio: user.bio ?? '',
        });
      }
    });
  }

  onSubmit() {
    if (!this.profileForm.valid) return;
    const { password, image, username, email, bio } = this.profileForm.value;
    const payload = {
      ...(image != null && { image }),
      ...(username != null && { username }),
      ...(email != null && { email }),
      ...(bio != null && { bio }),
      ...(password && { password }),
    };
    this.authService.updateUser(payload).subscribe({
      next: () => {
        this.router.navigate(['/profile', this.profileForm.get('username')?.value]);
      },
    });
  }
}
