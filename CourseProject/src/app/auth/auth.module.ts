import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  imports: [
  SharedModule,
  FormsModule,
  RouterModule.forChild([{path: '', component: AuthComponent}])
  ]
})
export class AuthModule { }
