import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, inStock, type } = req.query;
    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Math.max(0, Number(minPrice));
      if (maxPrice) query.price.$lte = Math.max(0, Number(maxPrice));
    }

    if (inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    let sortObj = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else sortObj.createdAt = -1; // Default newest

    const products = await Product.find(query).sort(sortObj);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('basketItems.product');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
