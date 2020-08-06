import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const [product] = await this.ormRepository.find({
      where: { name },
    });

    if (!product) {
      return undefined;
    }

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO

    const findProducts = await this.ormRepository.find({
      where: In(products.map(product => product.id)),
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    let findProducts = await this.ormRepository.find({
      where: { id: In(products.map(prod => prod.id)) },
    });

    findProducts = findProducts.map(findProduct => {
      const findQuantity = products.find(
        product => product.id === findProduct.id,
      );
      const quantity = findQuantity?.quantity || findProduct.quantity;
      return {
        ...findProduct,
        quantity,
      };
    });

    await this.ormRepository.save(findProducts);

    return findProducts;
  }
}

export default ProductsRepository;
