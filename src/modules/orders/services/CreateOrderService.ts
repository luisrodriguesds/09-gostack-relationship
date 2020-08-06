import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Cliente não encontrado');
    }

    const productsIds = products.map(productsId => {
      return {
        id: productsId.id,
      };
    });

    const findProducts = await this.productsRepository.findAllById(productsIds);

    if (findProducts.length !== products.length) {
      throw new AppError('Um existe um produto inexistente na lista');
    }

    const makeIProducts = findProducts.map(prod => {
      const findQuantity = products.find(prodQuant => prodQuant.id === prod.id);
      const quantity = findQuantity?.quantity || 0;
      if (prod.quantity - quantity < 0) {
        throw new AppError(
          `Existe um produto ${prod.name} não tem quantidade suficiente para esta ordem`,
        );
      }
      return {
        product_id: prod.id,
        price: prod.price,
        quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: makeIProducts,
    });
    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
