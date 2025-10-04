import { Request, Response } from 'express';
import { DirectusService } from '../services/DirectusService';
import { SetDirectusToken } from '../helpers/DirectusTokenHelper';

const directus = new DirectusService();

export const getProducts = async (req: Request, res: Response) => {
  try {
    SetDirectusToken(directus, req);
    const { page = 1, limit = 10, filter, aggregate } = req.query;
    const parsedFilter = filter ? JSON.parse(filter as string) : void 0;
    const parsedAggregate = aggregate ? JSON.parse(aggregate as string) : void 0;
    const params: any = {
      page: Number(page),
      limit: Number(limit),
      filter: parsedFilter,
      aggregate: parsedAggregate,
    };
    const products = await directus.getItems('Products', params);
    const totalCount = await directus.getTotalCount('Products', parsedFilter);

    res.json({
      data: products,
      meta: {
        total_count: totalCount,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    console.error('Get Products Error:', error.message, error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    SetDirectusToken(directus, req);
    const { slug } = req.params;

    if (!slug) {
      console.error('Get Product Error: slug is required', { params: req.params });
      return res.status(400).json({ error: 'Product slug is required' });
    }

    const products = await directus.getItems<any[]>('Products', {
      filter: { slug: { _eq: slug } },
    });

    if (!products || products.length === 0) {
      console.error('Get Product Error: Product not found', { slug });
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error: any) {
    console.error('Get Product Error:', error.message, error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const updateProductBySlug = async (req: Request, res: Response) => {
  try {
    SetDirectusToken(directus, req);
    const { slug } = req.params;
    const { name, price, description, stock_quantity } = req.body;

    if (!slug) {
      console.error('Update Product Error: slug is required', { params: req.params });
      return res.status(400).json({ error: 'Product slug is required' });
    }

    if (!name || price == null || !description || stock_quantity == null) {
      console.error('Update Product Error: Invalid payload', { body: req.body });
      return res.status(400).json({
        error: 'All fields (name, price, description, stock_quantity) are required',
      });
    }

    const products = await directus.getItems<any[]>('Products', {
      filter: { slug: { _eq: slug } },
    });

    if (!products || products.length === 0) {
      console.error('Update Product Error: Product not found', { slug });
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    const updatedProduct = await directus.updateItem('Products', product.id, {
      name,
      price,
      description,
      stock_quantity,
    });

    res.json(updatedProduct);
  } catch (error: any) {
    console.error('Update Product Error:', error.message, error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};