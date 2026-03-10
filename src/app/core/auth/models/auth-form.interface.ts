import { FormControl } from '@angular/forms';

export interface AuthFormInterface {
  email: FormControl<string>;
  password: FormControl<string>;
  username?: FormControl<string>;
}
