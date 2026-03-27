import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authStore } from '../../auth/store/auth.store';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  store = inject(authStore);
  authService = inject(AuthService);

  protected isDropdownOpen = signal(false);
  protected isMobileMenuOpen = signal(false);

  authorUsername = computed(() => this.store.currentUser()?.username ?? 'You');
  authorInitials = computed(() => {
    const username = this.store.currentUser()?.username ?? '';
    return username.slice(0, 2).toUpperCase() || 'ME';
  });
  authorEmail = computed(() => this.store.currentUser()?.email ?? '');

  @ViewChild('avatarWrap') private avatarWrap?: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuRef') private mobileMenuRef?: ElementRef<HTMLElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (!this.avatarWrap?.nativeElement.contains(target)) {
      this.isDropdownOpen.set(false);
    }
    if (!this.mobileMenuRef?.nativeElement.contains(target)) {
      this.isMobileMenuOpen.set(false);
    }
  }

  // Avatar dropdown toggle
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen.update((open) => !open);
  }

  toggleMobileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onSignout(): void {
    this.authService.signout();
  }
}
