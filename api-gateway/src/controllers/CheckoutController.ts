import { Request, Response } from 'express';
import { DirectusService } from '../services/DirectusService';

const directus = new DirectusService();

interface CheckoutItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  stock_quantity: number;
}

export const checkout = async (req: Request, res: Response) => {
  const items: CheckoutItem[] = req.body.items;
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' });

  try {
    const productIds = items.map(item => item.productId);
    const products = await directus.getItems<Product[]>('Products', { id: { _in: productIds } });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Item ${item.productId} is out of stock or insufficient quantity` });
      }
    }

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)!;
      await directus.updateItem('Products', item.productId, { stock_quantity: product.stock_quantity - item.quantity });
    }

    res.json({ message: 'Checkout successful' });
  } catch (error) {
    console.error(JSON.stringify(error))
    res.status(500).json({ error: 'Checkout failed' });
  }
};