import { users, orders, type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<string, Order>;
  currentId: number;
  currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.currentId = 1;
    this.currentOrderId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const order: Order = { 
      id,
      orderId: insertOrder.orderId,
      paymentId: insertOrder.paymentId || null,
      status: (insertOrder.status || 'pending') as any,
      orderType: insertOrder.orderType,
      subtotal: insertOrder.subtotal,
      tax: insertOrder.tax,
      deliveryFee: insertOrder.deliveryFee || '0',
      total: insertOrder.total,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      deliveryAddress: insertOrder.deliveryAddress || null,
      deliveryCity: insertOrder.deliveryCity || null,
      deliveryState: insertOrder.deliveryState || null,
      deliveryZipCode: insertOrder.deliveryZipCode || null,
      deliveryPhone: insertOrder.deliveryPhone || null,
      deliveryNotes: insertOrder.deliveryNotes || null,
      items: insertOrder.items,
      estimatedReadyTime: insertOrder.estimatedReadyTime || null,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(order.orderId, order);
    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (order) {
      const updatedOrder: Order = {
        ...order,
        status: status as any,
        updatedAt: new Date()
      };
      this.orders.set(orderId, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
