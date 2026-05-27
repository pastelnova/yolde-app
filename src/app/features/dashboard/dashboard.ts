import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { LucidePlus, LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  imports: [LucidePlus, LucideSearch],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  @HostBinding('class') readonly hostClass = 'dark block min-h-screen bg-background text-foreground';
}
