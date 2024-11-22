import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Order } from 'src/entities/order.entity';
import { ProductsOrder } from 'src/entities/product-order.entity';
import { Product } from 'src/entities/products/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Subproduct } from 'src/entities/products/subproduct.entity';

@Injectable()
export class OrdersMetricsRepository {
  constructor(
    @InjectRepository(ProductsOrder) private readonly productsOrderRepository: Repository<ProductsOrder>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Account) private readonly accountRepository: Repository<Account>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Subproduct) private readonly subproductRepository: Repository<Subproduct>
  ) {}

  async getMostSoldProductIds(limit: number): Promise<{ productId: string, quantity: number }[]> {
    const mostSoldProducts = await this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .innerJoin('productsOrder.subproduct', 'subproduct')
      .innerJoin('subproduct.product', 'product')
      .select('product.id', 'productId')
      .addSelect('SUM(productsOrder.quantity)', 'quantity')
      .groupBy('product.id')
      .orderBy('quantity', 'DESC')
      .limit(limit)
      .getRawMany();

    return mostSoldProducts.map(result => ({
      productId: result.productId,
      quantity: parseFloat(result.quantity),
    }));
  }
  
  async getMostSoldProductsRepository(limit: number): Promise<any[]> {
    const mostSoldProductData = await this.getMostSoldProductIds(limit);
  
    if (mostSoldProductData.length === 0) {
      return [];
    }
  
    const mostSoldProductIds = mostSoldProductData.map(item => item.productId);
  
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subproducts', 'subproduct')
      .leftJoinAndSelect('product.category', 'category') 
      .addSelect('product.averageRating')  
      .where('product.id IN (:...ids)', { ids: mostSoldProductIds })
      .getMany();
  
    const formattedProducts = products.map(product => {
      const salesData = mostSoldProductData.find(item => item.productId === product.id);
      return {
        product: {
          id: product.id,
          description: product.description,
          presentacion: product.presentacion,
          tipoGrano: product.tipoGrano,
          imgUrl: product.imgUrl,
          averageRating: product.averageRating,  
          category: product.category ? {
            id: product.category.id,
            name: product.category.name,  
          } : null,
        },
        subproducts: product.subproducts.map(subproduct => ({
          id: subproduct.id,
          price: subproduct.price,
          stock: subproduct.stock,
          amount: subproduct.amount,
          unit: subproduct.unit,
          discount: subproduct.discount,
          isAvailable: subproduct.isAvailable,
        })),
        totalQuantity: salesData ? salesData.quantity : 0, 
      };
    });
  
    return formattedProducts;
  }
  
  async getLessSoldProductIds(limit: number): Promise<{ productId: string, quantity: number }[]> {
    const lessSoldProducts = await this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .innerJoin('productsOrder.subproduct', 'subproduct')
      .innerJoin('subproduct.product', 'product')
      .select('product.id', 'productId')
      .addSelect('SUM(productsOrder.quantity)', 'quantity')
      .groupBy('product.id')
      .orderBy('quantity', 'ASC')  
      .limit(limit)
      .getRawMany();
  
    return lessSoldProducts.map(result => ({
      productId: result.productId,
      quantity: parseFloat(result.quantity),
    }));
  }
  
  async getLessSoldProductsRepository(limit: number): Promise<any[]> {
    const lessSoldProductData = await this.getLessSoldProductIds(limit);
  
    if (lessSoldProductData.length === 0) {
      return [];
    }
  
    const lessSoldProductIds = lessSoldProductData.map(item => item.productId);
  
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subproducts', 'subproduct')
      .leftJoinAndSelect('product.category', 'category') 
      .addSelect('product.averageRating')  
      .where('product.id IN (:...ids)', { ids: lessSoldProductIds })
      .getMany();
  
    const formattedProducts = products.map(product => {
      const salesData = lessSoldProductData.find(item => item.productId === product.id);
      return {
        product: {
          id: product.id,
          description: product.description,
          presentacion: product.presentacion,
          tipoGrano: product.tipoGrano,
          imgUrl: product.imgUrl,
          averageRating: product.averageRating,
          category: product.category ? {
            id: product.category.id,
            name: product.category.name, 
          } : null,
        },
        subproducts: product.subproducts.map(subproduct => ({
          id: subproduct.id,
          price: subproduct.price,
          stock: subproduct.stock,
          amount: subproduct.amount,
          unit: subproduct.unit,
          discount: subproduct.discount,
          isAvailable: subproduct.isAvailable,
        })),
        totalQuantity: salesData ? salesData.quantity : 0, 
      };
    });
  
    return formattedProducts;
  }
  
    
  async getBestProductsRepository(limit:number) {
    const products = await this.productRepository
      .createQueryBuilder('productRating')
      .select('id', 'id')
      .addSelect('description', 'description')
      .addSelect('"averageRating"', 'averageRating')
      .orderBy('"averageRating"', 'DESC')
      .limit(limit)
      .getRawMany();
    return products;
  }
  async getWorstProductsRepository(limit:number) {
    const products = await this.productRepository
      .createQueryBuilder('productRating')
      .select('id', 'id')
      .addSelect('description', 'description')
      .addSelect('"averageRating"', 'averageRating')
      .orderBy('"averageRating"', 'ASC')
      .limit(limit)
      .getRawMany();
    return products;
  }
  async getLargestDebtorsRepository(limit: number) {
    const debtors = await this.accountRepository
      .createQueryBuilder('account')
      .select('user.id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('SUM(account.balance)', 'balance')
      .innerJoin('account.user', 'user')
      // .where('user.role = :role', { role: 'Cliente' })
      .groupBy('user.id, user.name')
      .having('SUM(account.balance) > 0')  // Excluir usuarios con saldo 0 o positivo
      .orderBy('balance', 'DESC')
      .limit(limit)
      .getRawMany();
  
    return debtors;
  }
  
  async getOrdersByUserIdAndDateRepository(id: string, date: Date): Promise<{ data: Order[], total: number }> {
    const user = await this.userRepository.findOne({
        where: { id },
    });

    if (!user) throw new NotFoundException(`Usuario no encontrado. ID: ${id}`);

    const year = date.getFullYear();
    const month = date.getMonth()+2; 
    

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
        .leftJoinAndSelect('order.productsOrder', 'productsOrder')
        .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
        .leftJoinAndSelect('subproduct.product', 'product')
        .leftJoinAndSelect('order.orderDetail', 'orderDetail')
        .leftJoinAndSelect('orderDetail.transactions', 'transactions')
        .leftJoinAndSelect('order.receipt', 'receipt')
        .leftJoinAndSelect('order.bill', 'bill')
        .where('order.userId = :userId', { userId: user.id })
        .andWhere('EXTRACT(YEAR FROM order.date) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM order.date) = :month', { month });

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async getProductsByMonthRepository(dateSelected: Date, productId:string, limit: number) {
    if(!limit) limit = 20
    if (!dateSelected) {
      throw new BadRequestException('Fecha inválida');
  }  
    const year = dateSelected.getFullYear();
    const month = dateSelected.getMonth() + 2;
    
    const queryBuilder = this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
      .leftJoinAndSelect('subproduct.product', 'product')
      .leftJoinAndSelect('productsOrder.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .where('product.id = :productId', { productId })
      .andWhere('EXTRACT(YEAR FROM order.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM order.date) = :month', { month })
      .orderBy('productsOrder.quantity', 'DESC')
      .limit(limit);
  
    try {
      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      console.error('Error executing query: ', error);
      throw new Error('Error al obtener productos por mes.');
    }
  }
  

  async geAllTimeProductsRepository( productId, limit) {  

    const queryBuilder = this.productsOrderRepository
      .createQueryBuilder('productsOrder')
      .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
      .leftJoinAndSelect('subproduct.product', 'product')
      .leftJoinAndSelect('productsOrder.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .where('product.id = :productId', { productId })
      .orderBy('productsOrder.quantity', 'DESC')
      .limit(limit);
  
    try {
      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      console.error('Error executing query: ', error);
      throw new Error('Error al obtener productos por mes.');
    }
  }

  async getProductsByMonthByUserRepository(dateSelected: Date, userId: string, limit: number) {
    const products = await this.productsOrderRepository
        .createQueryBuilder('productsOrder')
        .leftJoinAndSelect('productsOrder.subproduct', 'subproduct')
        .leftJoinAndSelect('subproduct.product', 'product')
        .leftJoinAndSelect('productsOrder.order', 'order')
        .leftJoinAndSelect('order.user', 'user')
        .where('user.id = :userId', { userId })
        .andWhere('order.date BETWEEN :startDate AND :endDate', {
            startDate: new Date(dateSelected.getFullYear(), 0, 1), 
            endDate: new Date(dateSelected.getFullYear(), 11, 31), 
        })
        .orderBy('order.date', 'DESC') 
        .limit(limit)
        .getRawMany();

    const formatMonthYear = (date: Date) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const month = months[date.getMonth()];
        const year = String(date.getFullYear()).slice(2);
        return `${month} '${year}`;
    };

    const groupedByMonth = products.reduce((acc, product) => {
        const monthYear = formatMonthYear(new Date(product.order_date)); 
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(product);
        return acc;
    }, {});

    const result = Object.entries(groupedByMonth).map(([month, items]) => {
        return {
            month,
            items,
        };
    });

    return result;
}
async getProductsByMonthByUserBonifiedRepositoryasync 
(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit: number
): Promise<Record<string, {
  kilosFacturados: number;
  unidadesFacturadas: number;
  kilosBonificados: number;
  unidadesBonificadas: number;
  importeGenerado: number;
  totalSold: number;
  totalBonified: number;
  revenueFromChargedProducts: number;
  revenueFromBonifiedProducts: number;
  productsDetail: Array<{
    productId: string;
    productDescription: string;
    subproductId: string;
    subproductDescription: string;
    subproductUnit: string;
    subproductQuantity: number;
    subproductBonified: number;
    subproductRevenue: number;
  }>;
}>> {
  const products = await this.productsOrderRepository
    .createQueryBuilder("productsOrder")
    .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
    .leftJoinAndSelect("subproduct.product", "product")
    .leftJoinAndSelect("productsOrder.order", "order")
    .where("order.date BETWEEN :startDate AND :endDate", { startDate, endDate })
    .andWhere("order.userId = :userId", { userId }) // Filtrar por ID de usuario
    .orderBy("order.date", "DESC")
    .limit(limit)
    .getRawMany();

  console.log("Productos obtenidos para el usuario:", products);

  const formatMonthYear = (date: Date) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(2);
    return `${month} '${year}`;
  };

  const convertToKilos = (amount: number, unit: string): number => {
    switch (unit.toUpperCase()) {
      case "KILO":
        return amount;
      case "GRAMOS":
        return amount / 1000;
      case "TONELADAS":
        return amount * 1000;
      default:
        return 0;
    }
  };

  interface MonthlyMetrics {
    kilosFacturados: number;
    unidadesFacturadas: number;
    kilosBonificados: number;
    unidadesBonificadas: number;
    importeGenerado: number;
    totalSold: number;
    totalBonified: number;
    productsDetail: Array<{
      productId: string;
      productDescription: string;
      subproductId: string;
      subproductDescription: string;
      subproductUnit: string;
      subproductQuantity: number;
      subproductBonified: number;
      subproductRevenue: number;
    }>;
  }

  const groupedByMonth: Record<string, MonthlyMetrics> = products.reduce((acc, product) => {
    const monthYear = formatMonthYear(new Date(product.order_date));

    if (!acc[monthYear]) {
      acc[monthYear] = {
        kilosFacturados: 0,
        unidadesFacturadas: 0,
        kilosBonificados: 0,
        unidadesBonificadas: 0,
        importeGenerado: 0,
        totalSold: 0,
        totalBonified: 0,
        productsDetail: [],
      };
    }

    const group = acc[monthYear];
    const productDetail = {
      productId: product.product_id,
      productDescription: product.product_description,
      subproductId: product.subproduct_id,
      subproductDescription: product.subproduct_description,
      subproductUnit: product.subproduct_unit,
      subproductQuantity: product.productsOrder_quantity,
      subproductBonified: 0,
      subproductRevenue: 0,
    };

    if (product.subproduct_discount < 100) {
      // Productos con cargo
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
        group.kilosFacturados += kilos;
        group.importeGenerado += (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
        group.totalSold += product.productsOrder_quantity;
        productDetail.subproductRevenue = (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        group.unidadesFacturadas += unidades;
        group.importeGenerado += product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
        group.totalSold += unidades;
        productDetail.subproductRevenue = product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
      }
    } else if (product.subproduct_discount === 100) {
      // Productos bonificados
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
        group.kilosBonificados += kilos;
        group.totalBonified += product.productsOrder_quantity;
        productDetail.subproductBonified = product.productsOrder_quantity;
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        group.unidadesBonificadas += unidades;
        group.totalBonified += unidades;
        productDetail.subproductBonified = unidades;
      }
    }

    group.productsDetail.push(productDetail);

    return acc;
  }, {} as Record<string, MonthlyMetrics>);

  const result: Record<string, MonthlyMetrics & {
    revenueFromChargedProducts: number;
    revenueFromBonifiedProducts: number;
  }> = {};

  // Cálculo de ingresos por productos cargados y bonificados
  for (const [monthYear, metrics] of Object.entries(groupedByMonth)) {
    result[monthYear] = {
      ...metrics,
      revenueFromChargedProducts: 0,
      revenueFromBonifiedProducts: 0,
    };

    const totalSold = metrics.totalSold;
    const totalBonified = metrics.totalBonified;
    const totalRevenue = metrics.importeGenerado;
    const totalProductsSold = totalSold + totalBonified;

    if (totalProductsSold > 0) {
      const revenuePerProduct = totalRevenue / totalProductsSold;

      result[monthYear].revenueFromChargedProducts = revenuePerProduct * totalSold;
      result[monthYear].revenueFromBonifiedProducts = revenuePerProduct * totalBonified;
    }
  }

  console.log("Métricas por usuario y rango de fechas:", result);
  return result;
}



async getProductsAndImportByMonthByUserBonifiedRepository(
  dateSelected: Date,
  userId: string,
  limit: number
) {
  const startDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), 1);
  const endDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0);

  const products = await this.productsOrderRepository
    .createQueryBuilder("productsOrder")
    .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
    .leftJoinAndSelect("subproduct.product", "product")
    .leftJoinAndSelect("productsOrder.order", "order")
    .leftJoinAndSelect("order.user", "user")
    .where("user.id = :userId", { userId })
    .andWhere("order.date BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .orderBy("order.date", "DESC")
    .limit(limit)
    .getRawMany();

  console.log("Productos obtenidos:", products);

  const formatMonthYear = (date: Date) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(2);
    return `${month} '${year}`;
  };

  const convertToKilos = (amount: number, unit: string): number => {
    switch (unit.toUpperCase()) {
      case "KILO":
        return amount;
      case "GRAMOS":
        return amount / 1000;
      case "TONELADAS":
        return amount * 1000;
      default:
        return 0;
    }
  };

  const groupedByMonth = products.reduce((acc, product) => {
    const monthYear = formatMonthYear(new Date(product.order_date));
    const userId = product.user_id;

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }

    if (!acc[monthYear][userId]) {
      acc[monthYear][userId] = {
        kilosFacturados: 0,
        unidadesFacturadas: 0,
        kilosBonificados: 0,
        unidadesBonificadas: 0,
        importeGenerado: 0, 
      };
    }

    const userGroup = acc[monthYear][userId];

    if (product.subproduct_discount < 100) {
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(
          product.subproduct_amount * product.productsOrder_quantity,
          product.subproduct_unit
        );
        userGroup.kilosFacturados += kilos;
        userGroup.importeGenerado += (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100); 
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        userGroup.unidadesFacturadas += unidades;
        userGroup.importeGenerado += product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
      }
    } else if (product.subproduct_discount === 100) {
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(
          product.subproduct_amount * product.productsOrder_quantity,
          product.subproduct_unit
        );
        userGroup.kilosBonificados += kilos;
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        userGroup.unidadesBonificadas += unidades;
      }
    }

    return acc;
  }, {});

  const result = Object.entries(groupedByMonth).map(([month, users]) => {
    return {
      month,
      users: Object.entries(users).map(([userId, data]) => ({
        userId,
        ...data,
      })),
    };
  });

  return result;
}

async getProductsByDeliveryByMonthRepository(
  dateSelected: Date,
  limit: number,
  deliveryFilter: { deliveryNumber?: number; province?: string; localidad?: string }
): Promise<Record<string, {
  kilosFacturados: number;
  unidadesFacturadas: number;
  kilosBonificados: number;
  unidadesBonificadas: number;
  importeGenerado: number;
  totalSold: number;
  totalBonified: number;
  revenueFromChargedProducts: number;
  revenueFromBonifiedProducts: number;
  appliedFilters: { // Aquí se incluyen los filtros aplicados
    deliveryNumber?: number;
    province?: string;
    localidad?: string;
  };
  productsDetail: Array<{
    productId: string;
    productDescription: string;
    subproductId: string;
    subproductDescription: string;
    subproductUnit: string;
    subproductQuantity: number;
    subproductBonified: number;
    subproductRevenue: number;
  }>;
}>> {
  const startDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), 1);
  const endDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0);

  // Construimos la consulta base
  let query = this.productsOrderRepository
    .createQueryBuilder("productsOrder")
    .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
    .leftJoinAndSelect("subproduct.product", "product")
    .leftJoinAndSelect("productsOrder.order", "order")
    .leftJoinAndSelect("order.user", "user")
    .leftJoinAndSelect("user.address", "address")
    .where("order.date BETWEEN :startDate AND :endDate", { startDate, endDate })
    .orderBy("order.date", "DESC")
    .limit(limit);

  // Aplicamos el filtro de reparto si existe
  if (deliveryFilter) {
    if (deliveryFilter.province) {
      query = query.andWhere("address.province = :province", { province: deliveryFilter.province });
    }
    if (deliveryFilter.localidad) {
      query = query.andWhere("address.localidad = :localidad", { localidad: deliveryFilter.localidad });
    }
    if (deliveryFilter.deliveryNumber) {
      query = query.andWhere("address.deliveryNumber = :deliveryNumber", { deliveryNumber: deliveryFilter.deliveryNumber });
    }
  }

  const products = await query.getRawMany();
  console.log("Productos obtenidos:", products);

  // Función para formatear el mes y año
  const formatMonthYear = (date: Date) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(2);
    return `${month} '${year}`;
  };

  const convertToKilos = (amount: number, unit: string): number => {
    switch (unit.toUpperCase()) {
      case "KILO":
        return amount;
      case "GRAMOS":
        return amount / 1000;
      case "TONELADAS":
        return amount * 1000;
      default:
        return 0;
    }
  };

  interface MonthlyMetrics {
    kilosFacturados: number;
    unidadesFacturadas: number;
    kilosBonificados: number;
    unidadesBonificadas: number;
    importeGenerado: number;
    totalSold: number;
    totalBonified: number;
    productsDetail: Array<{
      productId: string;
      productDescription: string;
      subproductId: string;
      subproductDescription: string;
      subproductUnit: string;
      subproductQuantity: number;
      subproductBonified: number;
      subproductRevenue: number;
    }>;
  }

  const groupedByMonth: Record<string, MonthlyMetrics> = products.reduce((acc, product) => {
    const monthYear = formatMonthYear(new Date(product.order_date));

    if (!acc[monthYear]) {
      acc[monthYear] = {
        kilosFacturados: 0,
        unidadesFacturadas: 0,
        kilosBonificados: 0,
        unidadesBonificadas: 0,
        importeGenerado: 0,
        totalSold: 0,
        totalBonified: 0,
        productsDetail: [],
      };
    }

    const group = acc[monthYear];
    const productDetail = {
      productId: product.product_id,
      productDescription: product.product_description,
      subproductId: product.subproduct_id,
      subproductDescription: product.subproduct_description,
      subproductUnit: product.subproduct_unit,
      subproductQuantity: product.productsOrder_quantity,
      subproductBonified: 0,
      subproductRevenue: 0,
    };

    if (product.subproduct_discount < 100) {
      // Productos con cargo
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
        group.kilosFacturados += kilos;
        group.importeGenerado += (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
        group.totalSold += product.productsOrder_quantity;
        productDetail.subproductRevenue = (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        group.unidadesFacturadas += unidades;
        group.importeGenerado += product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
        group.totalSold += unidades;
        productDetail.subproductRevenue = product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
      }
    } else if (product.subproduct_discount === 100) {
      // Productos bonificados
      if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
        const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
        group.kilosBonificados += kilos;
        group.totalBonified += product.productsOrder_quantity;
        productDetail.subproductBonified = product.productsOrder_quantity;
      } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
        const unidades = product.productsOrder_quantity;
        group.unidadesBonificadas += unidades;
        group.totalBonified += unidades;
        productDetail.subproductBonified = unidades;
      }
    }

    group.productsDetail.push(productDetail);

    return acc;
  }, {} as Record<string, MonthlyMetrics>);

  const result: Record<string, MonthlyMetrics & {
    revenueFromChargedProducts: number;
    revenueFromBonifiedProducts: number;
    appliedFilters: {
      deliveryNumber?: number;
      province?: string;
      localidad?: string;
    };
  }> = {};

  // Cálculo de ingresos por productos cargados y bonificados
  for (const [monthYear, metrics] of Object.entries(groupedByMonth)) {
    result[monthYear] = {
      ...metrics,
      revenueFromChargedProducts: 0,
      revenueFromBonifiedProducts: 0,
      appliedFilters: { ...deliveryFilter },  // Añadimos los filtros aplicados
    };

    const totalSold = metrics.totalSold;
    const totalBonified = metrics.totalBonified;
    const totalRevenue = metrics.importeGenerado;
    const totalProductsSold = totalSold + totalBonified;

    if (totalProductsSold > 0) {
      const revenuePerProduct = totalRevenue / totalProductsSold;

      result[monthYear].revenueFromChargedProducts = revenuePerProduct * totalSold;
      result[monthYear].revenueFromBonifiedProducts = revenuePerProduct * totalBonified;
    }
  }

  // console.log("Métricas por mes (con desglose y filtros aplicados):", result);
  return result;
}


    async getProductsAndImportByMonthBonifiedRepository(
      dateSelected: Date,
      limit: number
  ): Promise<Record<string, {
      kilosFacturados: number;
      unidadesFacturadas: number;
      kilosBonificados: number;
      unidadesBonificadas: number;
      importeGenerado: number;
      totalSold: number;
      totalBonified: number;
      revenueFromChargedProducts: number;
      revenueFromBonifiedProducts: number;
  }>> {
      const startDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), 1);
      const endDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0);

      const products = await this.productsOrderRepository
          .createQueryBuilder("productsOrder")
          .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
          .leftJoinAndSelect("subproduct.product", "product")
          .leftJoinAndSelect("productsOrder.order", "order")
          .where("order.date BETWEEN :startDate AND :endDate", {
              startDate,
              endDate,
          })
          .orderBy("order.date", "DESC")
          .limit(limit)
          .getRawMany();

      console.log("Productos obtenidos:", products);

      const formatMonthYear = (date: Date) => {
          const months = [
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
          ];
          const month = months[date.getMonth()];
          const year = String(date.getFullYear()).slice(2);
          return `${month} '${year}`;
      };

      const convertToKilos = (amount: number, unit: string): number => {
          switch (unit.toUpperCase()) {
              case "KILO":
                  return amount;
              case "GRAMOS":
                  return amount / 1000;
              case "TONELADAS":
                  return amount * 1000;
              default:
                  return 0;
          }
      };

      interface MonthlyMetrics {
          kilosFacturados: number;
          unidadesFacturadas: number;
          kilosBonificados: number;
          unidadesBonificadas: number;
          importeGenerado: number;
          totalSold: number;
          totalBonified: number;
      }

      const groupedByMonth: Record<string, MonthlyMetrics> = products.reduce((acc, product) => {
          const monthYear = formatMonthYear(new Date(product.order_date));

          if (!acc[monthYear]) {
              acc[monthYear] = {
                  kilosFacturados: 0,
                  unidadesFacturadas: 0,
                  kilosBonificados: 0,
                  unidadesBonificadas: 0,
                  importeGenerado: 0,
                  totalSold: 0,
                  totalBonified: 0,
              };
          }

          const group = acc[monthYear];

          if (product.subproduct_discount < 100) {
              if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
                  const kilos = convertToKilos(
                      product.subproduct_amount * product.productsOrder_quantity,
                      product.subproduct_unit
                  );
                  group.kilosFacturados += kilos;
                  group.importeGenerado += (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
                  group.totalSold += product.productsOrder_quantity;
              } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
                  const unidades = product.productsOrder_quantity;
                  group.unidadesFacturadas += unidades;
                  group.importeGenerado += product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
                  group.totalSold += unidades;
              }
          } else if (product.subproduct_discount === 100) {
              if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
                  const kilos = convertToKilos(
                      product.subproduct_amount * product.productsOrder_quantity,
                      product.subproduct_unit
                  );
                  group.kilosBonificados += kilos;
                  group.totalBonified += product.productsOrder_quantity;
              } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
                  const unidades = product.productsOrder_quantity;
                  group.unidadesBonificadas += unidades;
                  group.totalBonified += unidades;
              }
          }

          return acc;
      }, {} as Record<string, MonthlyMetrics>);

      const result: Record<string, MonthlyMetrics & {
          revenueFromChargedProducts: number;
          revenueFromBonifiedProducts: number;
      }> = {};

      // Cálculo de ingresos por productos
      for (const [monthYear, metrics] of Object.entries(groupedByMonth)) {
          result[monthYear] = {
              ...metrics,
              revenueFromChargedProducts: 0,
              revenueFromBonifiedProducts: 0,
          };

          const totalSold = metrics.totalSold;
          const totalBonified = metrics.totalBonified;
          const totalRevenue = metrics.importeGenerado;
          const totalProductsSold = totalSold + totalBonified;

          if (totalProductsSold > 0) {
              const revenuePerProduct = totalRevenue / totalProductsSold;

              result[monthYear].revenueFromChargedProducts = revenuePerProduct * totalSold;
              result[monthYear].revenueFromBonifiedProducts = revenuePerProduct * totalBonified;
          }
      }

      console.log("Métricas por mes:", result);
      return result;
  }

  async getProductsAndImportByMonthBonifiedRepositoryDetailed(
    dateSelected: Date,
    limit: number
  ): Promise<Record<string, {
    kilosFacturados: number;
    unidadesFacturadas: number;
    kilosBonificados: number;
    unidadesBonificadas: number;
    importeGenerado: number;
    totalSold: number;
    totalBonified: number;
    revenueFromChargedProducts: number;
    revenueFromBonifiedProducts: number;
    productsDetail: Array<{
      productId: string;
      productDescription: string;
      subproductId: string;
      subproductDescription: string;
      subproductUnit: string;
      subproductQuantity: number;
      subproductBonified: number;
      subproductRevenue: number;
    }>;
  }>> {
    const startDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), 1);
    const endDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0);

    const products = await this.productsOrderRepository
      .createQueryBuilder("productsOrder")
      .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
      .leftJoinAndSelect("subproduct.product", "product")
      .leftJoinAndSelect("productsOrder.order", "order")
      .where("order.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("order.date", "DESC")
      .limit(limit)
      .getRawMany();

    console.log("Productos obtenidos:", products);

    const formatMonthYear = (date: Date) => {
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ];
      const month = months[date.getMonth()];
      const year = String(date.getFullYear()).slice(2);
      return `${month} '${year}`;
    };

    const convertToKilos = (amount: number, unit: string): number => {
      switch (unit.toUpperCase()) {
        case "KILO":
          return amount;
        case "GRAMOS":
          return amount / 1000;
        case "TONELADAS":
          return amount * 1000;
        default:
          return 0;
      }
    };

    interface MonthlyMetrics {
      kilosFacturados: number;
      unidadesFacturadas: number;
      kilosBonificados: number;
      unidadesBonificadas: number;
      importeGenerado: number;
      totalSold: number;
      totalBonified: number;
      productsDetail: Array<{
        productId: string;
        productDescription: string;
        subproductId: string;
        subproductDescription: string;
        subproductUnit: string;
        subproductQuantity: number;
        subproductBonified: number;
        subproductRevenue: number;
      }>;
    }

    const groupedByMonth: Record<string, MonthlyMetrics> = products.reduce((acc, product) => {
      const monthYear = formatMonthYear(new Date(product.order_date));

      if (!acc[monthYear]) {
        acc[monthYear] = {
          kilosFacturados: 0,
          unidadesFacturadas: 0,
          kilosBonificados: 0,
          unidadesBonificadas: 0,
          importeGenerado: 0,
          totalSold: 0,
          totalBonified: 0,
          productsDetail: [],
        };
      }

      const group = acc[monthYear];
      const productDetail = {
        productId: product.product_id,
        productDescription: product.product_description,
        subproductId: product.subproduct_id,
        subproductDescription: product.subproduct_description,
        subproductUnit: product.subproduct_unit,
        subproductQuantity: product.productsOrder_quantity,
        subproductBonified: 0,
        subproductRevenue: 0,
      };

      if (product.subproduct_discount < 100) {
        // Productos con cargo
        if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
          const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
          group.kilosFacturados += kilos;
          group.importeGenerado += (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
          group.totalSold += product.productsOrder_quantity;
          productDetail.subproductRevenue = (product.subproduct_price * product.productsOrder_quantity) * (1 - product.subproduct_discount / 100);
        } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
          const unidades = product.productsOrder_quantity;
          group.unidadesFacturadas += unidades;
          group.importeGenerado += product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
          group.totalSold += unidades;
          productDetail.subproductRevenue = product.subproduct_price * unidades * (1 - product.subproduct_discount / 100);
        }
      } else if (product.subproduct_discount === 100) {
        // Productos bonificados
        if (["KILO", "GRAMOS", "TONELADAS"].includes(product.subproduct_unit.toUpperCase())) {
          const kilos = convertToKilos(product.subproduct_amount * product.productsOrder_quantity, product.subproduct_unit);
          group.kilosBonificados += kilos;
          group.totalBonified += product.productsOrder_quantity;
          productDetail.subproductBonified = product.productsOrder_quantity;
        } else if (["UNIDADES", "SOBRES", "CAJAS"].includes(product.subproduct_unit.toUpperCase())) {
          const unidades = product.productsOrder_quantity;
          group.unidadesBonificadas += unidades;
          group.totalBonified += unidades;
          productDetail.subproductBonified = unidades;
        }
      }

      group.productsDetail.push(productDetail);

      return acc;
    }, {} as Record<string, MonthlyMetrics>);

    const result: Record<string, MonthlyMetrics & {
      revenueFromChargedProducts: number;
      revenueFromBonifiedProducts: number;
    }> = {};

    // Cálculo de ingresos por productos cargados y bonificados
    for (const [monthYear, metrics] of Object.entries(groupedByMonth)) {
      result[monthYear] = {
        ...metrics,
        revenueFromChargedProducts: 0,
        revenueFromBonifiedProducts: 0,
      };

      const totalSold = metrics.totalSold;
      const totalBonified = metrics.totalBonified;
      const totalRevenue = metrics.importeGenerado;
      const totalProductsSold = totalSold + totalBonified;

      if (totalProductsSold > 0) {
        const revenuePerProduct = totalRevenue / totalProductsSold;

        result[monthYear].revenueFromChargedProducts = revenuePerProduct * totalSold;
        result[monthYear].revenueFromBonifiedProducts = revenuePerProduct * totalBonified;
      }
    }

    console.log("Métricas por mes (con desglose):", result);
    return result;
  }
  async getProductsByMonthGroupedByUserRepository(
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<Record<string, Record<string, {
    orders: Array<{
      orderId: string;
      orderDate: Date;
      productsDetail: Array<{
        productId: string;
        productDescription: string;
        subproductId: string;
        subproductDescription: string;
        subproductUnit: string;
        subproductQuantity: number;
        subproductBonified: number;
        subproductRevenue: number;
      }>;
    }>;
    kilosFacturados: number;
    unidadesFacturadas: number;
    kilosBonificados: number;
    unidadesBonificadas: number;
    importeGenerado: number;
    totalSold: number;
    totalBonified: number;
  }>>> {
    const products = await this.productsOrderRepository
      .createQueryBuilder("productsOrder")
      .leftJoinAndSelect("productsOrder.subproduct", "subproduct")
      .leftJoinAndSelect("subproduct.product", "product")
      .leftJoinAndSelect("productsOrder.order", "order")
      .leftJoinAndSelect("order.user", "user") // Asegúrate de tener la relación con "user"
      .where("order.date BETWEEN :startDate AND :endDate", { startDate, endDate })
      .orderBy("order.date", "DESC")
      .limit(limit)
      .getRawMany();
  
    console.log("Productos obtenidos:", products);
  
    const formatMonthYear = (date: Date) => {
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ];
      const month = months[date.getMonth()];
      const year = String(date.getFullYear()).slice(2);
      return `${month} '${year}`;
    };
  
    const groupedData: Record<string, Record<string, {
      orders: Array<{
        orderId: string;
        orderDate: Date;
        productsDetail: Array<{
          productId: string;
          productDescription: string;
          subproductId: string;
          subproductDescription: string;
          subproductUnit: string;
          subproductQuantity: number;
          subproductBonified: number;
          subproductRevenue: number;
        }>;
      }>;
      kilosFacturados: number;
      unidadesFacturadas: number;
      kilosBonificados: number;
      unidadesBonificadas: number;
      importeGenerado: number;
      totalSold: number;
      totalBonified: number;
    }>> = {};
  
    products.forEach(product => {
      const monthYear = formatMonthYear(new Date(product.order_date));
      const userId = product.order_userId; // Ajusta según el alias en tu consulta
      const userName = product.user_name || "Usuario Desconocido"; // Alias para nombre de usuario si aplica
      if (!groupedData[monthYear]) {
        groupedData[monthYear] = {};
      }
  
      if (!groupedData[monthYear][userId]) {
        groupedData[monthYear][userId] = {
          orders: [],
          kilosFacturados: 0,
          unidadesFacturadas: 0,
          kilosBonificados: 0,
          unidadesBonificadas: 0,
          importeGenerado: 0,
          totalSold: 0,
          totalBonified: 0,
        };
      }
  
      const userMetrics = groupedData[monthYear][userId];
      const existingOrder = userMetrics.orders.find(order => order.orderId === product.order_id);
  
      const productDetail = {
        productId: product.product_id,
        productDescription: product.product_description,
        subproductId: product.subproduct_id,
        subproductDescription: product.subproduct_description,
        subproductUnit: product.subproduct_unit,
        subproductQuantity: product.productsOrder_quantity,
        subproductBonified: product.subproduct_discount === 100 ? product.productsOrder_quantity : 0,
        subproductRevenue: product.subproduct_discount < 100 ? 
          product.productsOrder_quantity * product.subproduct_price * (1 - product.subproduct_discount / 100) : 0,
      };
  
      if (existingOrder) {
        existingOrder.productsDetail.push(productDetail);
      } else {
        userMetrics.orders.push({
          orderId: product.order_id,
          orderDate: product.order_date,
          productsDetail: [productDetail],
        });
      }
  
      if (product.subproduct_discount < 100) {
        userMetrics.kilosFacturados += productDetail.subproductUnit === "Kilo" ? productDetail.subproductQuantity : 0;
        userMetrics.unidadesFacturadas += productDetail.subproductUnit !== "Kilo" ? productDetail.subproductQuantity : 0;
        userMetrics.importeGenerado += productDetail.subproductRevenue;
        userMetrics.totalSold += productDetail.subproductQuantity;
      } else {
        userMetrics.kilosBonificados += productDetail.subproductUnit === "Kilo" ? productDetail.subproductQuantity : 0;
        userMetrics.unidadesBonificadas += productDetail.subproductUnit !== "Kilo" ? productDetail.subproductQuantity : 0;
        userMetrics.totalBonified += productDetail.subproductQuantity;
      }
    });
  
    console.log("Datos agrupados por mes y usuario:", groupedData);
    return groupedData;
  }
  
}



