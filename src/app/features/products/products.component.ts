import { Component, EnvironmentInjector, OnInit, inject, runInInjectionContext } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../apis/products.service';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from './card/card.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{
  productSvc = inject(ProductsService);
  products$ = this.productSvc.getAllProducts();

  productSvc2: any
  private readonly injector = inject(EnvironmentInjector);

  ngOnInit(): void {
     runInInjectionContext(this.injector, () => {
      this.productSvc2 = inject(ProductsService);
      const result = toSignal(this.products$)

     })
  }
}
