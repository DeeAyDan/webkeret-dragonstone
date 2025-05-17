import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth/auth.guard';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ShopComponent } from './pages/shop/shop.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


export const routes: Routes = [
    {path : 'home', component: HomeComponent},
    {path : 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path : 'shop', component: ShopComponent},
    {path : 'cart', component: CartComponent, canActivate: [authGuard]},
    {path : 'login', component: LoginComponent, canActivate: [publicGuard]},
    {path : 'register', component: RegisterComponent, canActivate: [publicGuard]},
    {path : 'product/:id', component: ProductDetailsComponent},
    {path : '', redirectTo: 'home', pathMatch: 'full'},
    {path : '**', component: PageNotFoundComponent}

];
