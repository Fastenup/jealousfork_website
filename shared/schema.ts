import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  paymentId: text("payment_id"),
  status: text("status", { enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'] }).notNull().default('pending'),
  orderType: text("order_type", { enum: ['pickup', 'delivery'] }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default('0'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryCity: text("delivery_city"),
  deliveryState: text("delivery_state"),
  deliveryZipCode: text("delivery_zip_code"),
  deliveryPhone: text("delivery_phone"),
  deliveryNotes: text("delivery_notes"),
  items: jsonb("items").notNull(),
  estimatedReadyTime: timestamp("estimated_ready_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Menu sections and categorization for time-based menu system
export const menuSections = pgTable("menu_sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  operatingHours: text("operating_hours"),
  operatingDays: text("operating_days"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => menuSections.id),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const squareMenuItems = pgTable("square_menu_items", {
  id: serial("id").primaryKey(),
  squareId: text("square_id").notNull().unique(),
  categoryId: integer("category_id").references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").default(true),
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order").default(0),
  lastSync: timestamp("last_sync").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status", { enum: ['pending', 'sent', 'failed'] }).default('pending'),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  sentAt: true,
  createdAt: true,
});

export type MenuSection = typeof menuSections.$inferSelect;
export type InsertMenuSection = typeof menuSections.$inferInsert;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = typeof menuCategories.$inferInsert;
export type SquareMenuItem = typeof squareMenuItems.$inferSelect;
export type InsertSquareMenuItem = typeof squareMenuItems.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
