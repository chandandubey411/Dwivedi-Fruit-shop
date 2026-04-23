import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, UploadCloud, Loader2 } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products'); 
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/admin/products', {});
      toast.success('Draft product created. Please edit it.');
      fetchProducts();
    } catch (error) {
      toast.error('Creation failed');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (editingProduct.type === 'basket') {
       if (!editingProduct.basketItems || editingProduct.basketItems.length === 0) {
          return toast.error('A basket must contain at least one product.');
       }
       const hasInvalidItems = editingProduct.basketItems.some(i => !i.product || i.product === '');
       if (hasInvalidItems) {
          return toast.error('Please select a valid fruit for all basket items, or remove empty ones.');
       }
    }

    try {
      await api.put(`/admin/products/${editingProduct._id}`, editingProduct);
      toast.success('Product updated fully');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
       toast.error('Update failed');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (files.length > 4) return toast.error('Maximum 4 images allowed');
    
    // Check total limit combined with existing ones
    const currentImagesCount = editingProduct.images?.length || 0;
    if (currentImagesCount + files.length > 4) {
       return toast.error(`You can only add ${4 - currentImagesCount} more images`);
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    setUploadingImages(true);
    try {
       const { data } = await api.post('/upload/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
       });
       
       if (data.success) {
          const updatedImages = [...(editingProduct.images || []), ...data.imageUrls];
          setEditingProduct({ ...editingProduct, images: updatedImages });
          toast.success('Images uploaded to server');
       }
    } catch (error) {
       toast.error(error.response?.data?.message || 'Error uploading images');
    } finally {
       setUploadingImages(false);
    }
  };

  const removeEmbeddedImage = (index) => {
    const updatedImages = [...editingProduct.images];
    updatedImages.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: updatedImages });
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Inventory...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-dark transition shadow"
        >
          <Plus className="w-5 h-5"/> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => {
          const displayImage = p.images?.length > 0 ? p.images[0] : '/placeholder.png';
          return (
          <div key={p._id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            <img src={displayImage} alt="product" className="h-40 w-full object-cover bg-gray-100" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{p.name || 'Unnamed Product'}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description || 'No description provided.'}</p>
              
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-gray-800">₹{p.price}</span>
                 <div className="flex flex-col items-end gap-1">
                   {p.type === 'basket' && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Bundle</span>}
                   <span className={`text-xs font-bold px-2 py-1 rounded ${p.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {p.countInStock > 0 ? `${p.countInStock} LEFT` : 'OUT OF STOCK'}
                   </span>
                 </div>
              </div>
              
              <div className="pt-3 border-t mt-auto flex justify-between items-center">
                 <button onClick={() => setEditingProduct({...p, images: p.images || [], type: p.type || 'single', basketItems: p.basketItems || [], tags: p.tags || [] })} className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition font-medium text-sm">
                   <Edit className="w-4 h-4"/> Edit Full
                 </button>
                 <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                   <Trash2 className="w-5 h-5"/>
                 </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Editing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={saveProduct} className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
               <h2 className="text-xl font-bold text-gray-800">Editing Product: {editingProduct.name || 'New'}</h2>
               <button type="button" onClick={() => setEditingProduct(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition">
                  <X className="w-6 h-6"/>
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid md:grid-cols-2 gap-8">
               {/* Left Col - Data */}
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                    <input required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand bg-white" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                       <option value="" disabled>Select Category</option>
                       <option value="Fruits">Fruits</option>
                       <option value="Exotic">Exotic</option>
                       <option value="Seasonal">Seasonal</option>
                       <option value="Fruit Baskets">Fruit Baskets</option>
                       <option value="Uncategorized">Uncategorized</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand resize-none h-24" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Type</label>
                      <select className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand" value={editingProduct.type || 'single'} onChange={e => setEditingProduct({...editingProduct, type: e.target.value})}>
                         <option value="single">Single Item</option>
                         <option value="basket">Fruit Basket (Bundle)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Promotional Tag</label>
                      <select className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand" value={(editingProduct.tags && editingProduct.tags[0]) || ''} onChange={e => setEditingProduct({...editingProduct, tags: e.target.value ? [e.target.value] : []})}>
                         <option value="">None</option>
                         <option value="Best Seller">Best Seller</option>
                         <option value="Festival Special">Festival Special</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                      <input type="number" required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand" value={editingProduct.price || 0} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Count</label>
                      <input type="number" required className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand" value={editingProduct.countInStock || 0} onChange={e => setEditingProduct({...editingProduct, countInStock: Number(e.target.value)})}/>
                    </div>
                  </div>

                  {/* Basket Configuration Panel */}
                  {editingProduct.type === 'basket' && (
                    <div className="mt-6 border border-brand/20 bg-brand/5 p-4 rounded-xl">
                      <h3 className="font-bold text-sm text-brand-dark mb-3 flex items-center justify-between">
                         🎁 Bundle Contents
                         <button type="button" onClick={() => setEditingProduct({...editingProduct, basketItems: [...(editingProduct.basketItems || []), { product: '', quantity: 1 }]})} className="text-xs bg-brand text-white px-2 py-1 rounded">Add Item</button>
                      </h3>
                      
                      <div className="space-y-3">
                         {(!editingProduct.basketItems || editingProduct.basketItems.length === 0) && <p className="text-xs text-gray-500 italic">No fruits added to this basket yet.</p>}
                         
                         {editingProduct.basketItems?.map((item, idx) => (
                           <div key={idx} className="flex gap-2 items-center">
                              <select 
                                value={item.product?._id || item.product || ''} 
                                onChange={e => {
                                  const updated = [...editingProduct.basketItems];
                                  updated[idx] = { ...updated[idx], product: e.target.value };
                                  setEditingProduct({...editingProduct, basketItems: updated});
                                }}
                                className="flex-1 border border-gray-300 rounded text-sm px-2 py-1.5 focus:border-brand outline-none"
                              >
                                 <option value="" disabled>Select fruit...</option>
                                 {products.filter(p => p.type !== 'basket' && p._id !== editingProduct._id).map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                 ))}
                              </select>
                              
                              <input 
                                type="number" min="1" 
                                value={item.quantity} 
                                onChange={e => {
                                  const updated = [...editingProduct.basketItems];
                                  updated[idx] = { ...updated[idx], quantity: Number(e.target.value) };
                                  setEditingProduct({...editingProduct, basketItems: updated});
                                }}
                                className="w-16 border border-gray-300 rounded text-sm px-2 py-1.5 focus:border-brand outline-none text-center"
                              />
                              
                              <button type="button" onClick={() => {
                                 const updated = [...editingProduct.basketItems];
                                 updated.splice(idx, 1);
                                 setEditingProduct({...editingProduct, basketItems: updated});
                              }} className="text-red-500 hover:bg-red-100 p-1.5 rounded">
                                 <X className="w-4 h-4"/>
                              </button>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
               </div>

               {/* Right Col - Images */}
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Gallery (Max 4)</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     {editingProduct.images?.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border aspect-square bg-gray-50">
                           <img src={img} alt="Preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => removeEmbeddedImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                              <X className="w-4 h-4"/>
                           </button>
                        </div>
                     ))}
                     
                     {(!editingProduct.images || editingProduct.images.length < 4) && (
                        <div 
                          onClick={() => !uploadingImages && fileInputRef.current?.click()}
                          className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer transition ${uploadingImages ? 'bg-gray-100 border-gray-300' : 'hover:border-brand hover:bg-brand/5 hover:text-brand'}`}
                        >
                           {uploadingImages ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8"/>}
                           <span className="text-sm font-medium">{uploadingImages ? 'Uploading...' : 'Add Image'}</span>
                        </div>
                     )}
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                  <p className="text-xs text-gray-500 italic">Square ratios strongly recommended. JPG or PNG under 2MB.</p>
               </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
               <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">Cancel</button>
               <button type="submit" disabled={uploadingImages} className="px-6 py-2 rounded-lg font-bold bg-brand text-white hover:bg-brand-dark transition shadow disabled:opacity-50">Save Everything</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
