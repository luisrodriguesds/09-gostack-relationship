import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
// import AppError from '@shared/errors/AppError';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    // TODO
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    const createOrder = await this.ormRepository.save(order);
    return createOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    // TODO
    const [order] = await this.ormRepository.find({
      where: { id },
    });

    if (!order) {
      return undefined;
    }

    return order;
  }
}

export default OrdersRepository;
