import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// DB Table
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  price: numeric("price", { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Zod Scheme for Runtime Validation
export const insertTradeSchema = createInsertSchema(trades);
