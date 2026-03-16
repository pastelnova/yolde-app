import { FormControl } from '@angular/forms';

export interface ArticleFormInterface {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
}
