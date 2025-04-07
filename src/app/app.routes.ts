import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ShopComponent } from './pages/shop/shop.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


export const routes: Routes = [
    {path : 'home', component: HomeComponent},
    {path : 'shop', component: ShopComponent},
    {path : 'cart', component: CartComponent},
    {path : 'login', component: LoginComponent},
    {path : 'register', component: RegisterComponent},
    {path : 'product/:id', component: ProductDetailsComponent},
    {path : '', redirectTo: 'home', pathMatch: 'full'},
    {path : '**', component: PageNotFoundComponent}

];
