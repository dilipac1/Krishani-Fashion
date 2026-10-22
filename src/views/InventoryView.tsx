import React, { useState } from 'react';
import { useStore } from '../store';
import { Package, Search, Plus, Edit2, Trash2, X, ShoppingBag, DollarSign, Tag, Maximize2, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { formatCategoryName } from '../lib/translations';
import { WaterRippleButton } from '../components/WaterRippleButton';

export const InventoryView = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct, t, lang, setLang,
    availableSizes, addAvailableSize, deleteAvailableSize, editAvailableSize,
    availableCategories, addAvailableCategory, deleteAvailableCategory, editAvailableCategory
  } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProd, setNewProd] = useState<{name: string, price: string, sizes: string[], image: string, category: string, inStock: boolean}>({ name: '', price: '', sizes: [], image: '', category: 'ඇඳ ඇතිරිලි (Bed Sheets)', inStock: true });
  const [editForm, setEditForm] = useState<{name: string, price: string, sizes: string[], image: string, category: string, inStock: boolean}>({ name: '', price: '', sizes: [], image: '', category: '', inStock: true });
  
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [editingSizeName, setEditingSizeName] = useState<string | null>(null);
  const [editingSizeValue, setEditingSizeValue] = useState('');

  const [customCatInput, setCustomCatInput] = useState('');
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [editingCatValue, setEditingCatValue] = useState('');

  const handleAddCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customCatInput.trim();
    if (!trimmed) return;
    addAvailableCategory(trimmed);
    if (editingProduct) {
      setEditForm(prev => ({ ...prev, category: trimmed }));
    } else {
      setNewProd(prev => ({ ...prev, category: trimmed }));
    }
    setCustomCatInput('');
  };

  const handleSaveEditCategory = (oldCat: string) => {
    const trimmed = editingCatValue.trim();
    if (trimmed && trimmed !== oldCat) {
      editAvailableCategory(oldCat, trimmed);
      if (editingProduct) {
        if (editForm.category === oldCat) {
          setEditForm(prev => ({ ...prev, category: trimmed }));
        }
      } else {
        if (newProd.category === oldCat) {
          setNewProd(prev => ({ ...prev, category: trimmed }));
        }
      }
    }
    setEditingCatName(null);
    setEditingCatValue('');
  };

  const handleDeleteCategoryOption = (e: React.MouseEvent, catToDelete: string) => {
    e.stopPropagation();
    deleteAvailableCategory(catToDelete);
    const remaining = availableCategories.filter(c => c !== catToDelete);
    const fallback = remaining.length > 0 ? remaining[0] : 'Other';
    if (editingProduct) {
      if (editForm.category === catToDelete) {
        setEditForm(prev => ({ ...prev, category: fallback }));
      }
    } else {
      if (newProd.category === catToDelete) {
        setNewProd(prev => ({ ...prev, category: fallback }));
      }
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    addAvailableSize(trimmed);
    if (editingProduct) {
      if (!editForm.sizes.includes(trimmed)) {
        setEditForm(prev => ({ ...prev, sizes: [...prev.sizes, trimmed] }));
      }
    } else {
      if (!newProd.sizes.includes(trimmed)) {
        setNewProd(prev => ({ ...prev, sizes: [...prev.sizes, trimmed] }));
      }
    }
    setCustomSizeInput('');
  };

  const handleSaveEditSize = (oldSize: string) => {
    const trimmed = editingSizeValue.trim();
    if (trimmed && trimmed !== oldSize) {
      editAvailableSize(oldSize, trimmed);
      if (editingProduct) {
        setEditForm(prev => ({
          ...prev,
          sizes: prev.sizes.map(s => s === oldSize ? trimmed : s)
        }));
      } else {
        setNewProd(prev => ({
          ...prev,
          sizes: prev.sizes.map(s => s === oldSize ? trimmed : s)
        }));
      }
    }
    setEditingSizeName(null);
    setEditingSizeValue('');
  };

  const handleDeleteSizeOption = (e: React.MouseEvent, sizeToDelete: string) => {
    e.stopPropagation();
    deleteAvailableSize(sizeToDelete);
    if (editingProduct) {
      setEditForm(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== sizeToDelete)
      }));
    } else {
      setNewProd(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== sizeToDelete)
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const base64String = canvas.toDataURL('image/webp', 0.7);
          if (isEdit) {
            setEditForm(prev => ({ ...prev, image: base64String }));
          } else {
            setNewProd(prev => ({ ...prev, image: base64String }));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    
    addProduct({
      name: newProd.name,
      price: Number(newProd.price),
      sizes: newProd.sizes || [],
      image: newProd.image,
      category: newProd.category || 'ඇඳ ඇතිරිලි (Bed Sheets)',
      inStock: newProd.inStock
    });
    setNewProd({ name: '', price: '', sizes: [], image: '', category: 'ඇඳ ඇතිරිලි (Bed Sheets)', inStock: true });
    setShowAddForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      sizes: product.sizes || [],
      image: product.image,
      category: product.category || 'ඇඳ ඇතිරිලි (Bed Sheets)',
      inStock: product.inStock !== false
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editForm.name || !editForm.price) return;
    
    updateProduct(editingProduct.id, {
      name: editForm.name,
      price: Number(editForm.price),
      sizes: editForm.sizes || [],
      image: editForm.image || editingProduct.image,
      category: editForm.category || 'ඇඳ ඇතිරිලි (Bed Sheets)',
      inStock: editForm.inStock
    });
    setEditingProduct(null);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const confirmAndDelete = () => {
    if (confirmDeleteId) {
      deleteProduct(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30 hide-scrollbar pb-24">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#D81B60]">
            <Package size={20} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#292929]">{t('inventoryTitle')}</h2>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-lg shadow-rose-200 hover:scale-110 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 px-10 py-3 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#D81B60]/10 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={product.id} 
                className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-rose-100 transition-colors"
              >
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-rose-50 shrink-0 border border-rose-50 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-200">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-[#D81B60] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">
                      {formatCategoryName(product.category || 'Bed Sheets', lang)}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateProduct(product.id, { inStock: product.inStock === false ? true : false })}
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                        product.inStock === false 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                      title="Toggle Stock Status"
                    >
                      ● {product.inStock === false ? t('outOfStock') : t('inStock')}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-[#292929] line-clamp-1 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#D81B60]">Rs. {product.price.toLocaleString()}</span>
                    <span className="text-[9px] text-[#777777] font-medium">· {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => startEdit(product)} 
                    className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#D81B60] transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(product.id)} 
                    className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddForm || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-[#292929]">{editingProduct ? t('editProduct') : t('addProduct')}</h3>
                <button 
                  onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={editingProduct ? handleEditSubmit : handleAdd} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1">{t('productName')}</label>
                  <input 
                    type="text" placeholder="Luxury Cotton Bed Sheet Set" 
                    value={editingProduct ? editForm.name : newProd.name} 
                    onChange={e => editingProduct ? setEditForm({...editForm, name: e.target.value}) : setNewProd({...newProd, name: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-xs font-bold transition-all"
                  />
                  <div className="relative mt-3">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                    <input 
                      type="number" placeholder="2850" 
                      value={editingProduct ? editForm.price : newProd.price} 
                      onChange={e => editingProduct ? setEditForm({...editForm, price: e.target.value}) : setNewProd({...newProd, price: e.target.value})}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#D81B60]/10 text-xs font-bold transition-all"
                    />
                  </div>
                </div>

                {/* Interactive Category Selector & Manager */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1 block">Product Category (ප්‍රවර්ගය)</label>
                    <span className="text-[10px] font-bold text-[#D81B60]">Manage & Add Categories</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(cat => {
                      const currentSelectedCat = editingProduct ? editForm.category : newProd.category;
                      const isSelected = currentSelectedCat === cat;
                      const isBeingEdited = editingCatName === cat;

                      if (isBeingEdited) {
                        return (
                          <div key={cat} className="flex items-center gap-1 bg-rose-50 border border-rose-300 rounded-xl p-1">
                            <input
                              type="text"
                              value={editingCatValue}
                              onChange={e => setEditingCatValue(e.target.value)}
                              className="px-2 py-1 text-xs font-bold text-gray-800 bg-white rounded-lg outline-none w-36 border border-rose-200"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEditCategory(cat);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat)}
                              className="bg-[#D81B60] text-white p-1 rounded-lg hover:bg-rose-700 transition-colors"
                              title="Save category"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingCatName(null); setEditingCatValue(''); }}
                              className="text-gray-400 p-1 hover:text-gray-600 transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={cat}
                          onClick={() => {
                            if (editingProduct) setEditForm({...editForm, category: cat});
                            else setNewProd({...newProd, category: cat});
                          }}
                          className={`group relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                            isSelected 
                              ? 'bg-[#D81B60] text-white shadow-md shadow-rose-200' 
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <Tag size={12} className={isSelected ? 'text-white' : 'text-gray-400'} />
                          <span>{formatCategoryName(cat, lang)}</span>

                          <div className="flex items-center gap-1 ml-1 opacity-70 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCatName(cat);
                                setEditingCatValue(cat);
                              }}
                              className={`p-0.5 rounded hover:bg-black/10 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-700'}`}
                              title="Edit category name"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCategoryOption(e, cat)}
                              className={`p-0.5 rounded hover:bg-black/20 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 hover:text-red-500'}`}
                              title="Delete category"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Category Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add new category..."
                      value={customCatInput}
                      onChange={e => setCustomCatInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCategory(e);
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 outline-none focus:ring-2 focus:ring-[#D81B60]/20 text-xs font-bold transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomCategory()}
                      className="bg-rose-50 text-[#D81B60] border border-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#D81B60] hover:text-white transition-all shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <Plus size={14} /> Add Category
                    </button>
                  </div>
                </div>

                {/* Stock Status Switch */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('stockStatus')}</label>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <span className="text-xs font-bold text-gray-800">
                      {(editingProduct ? editForm.inStock : newProd.inStock) ? `● ${t('inStock')}` : `● ${t('outOfStock')}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) setEditForm({...editForm, inStock: !editForm.inStock});
                        else setNewProd({...newProd, inStock: !newProd.inStock});
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        (editingProduct ? editForm.inStock : newProd.inStock)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {(editingProduct ? editForm.inStock : newProd.inStock) ? t('markOutOfStock') : t('markInStock')}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1 block">Sizes Available</label>
                    <span className="text-[10px] font-bold text-[#D81B60]">Manage & Add Sizes</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => {
                      const currentSelectedSizes = editingProduct ? editForm.sizes : newProd.sizes;
                      const isSelected = currentSelectedSizes.includes(size);
                      const isBeingEdited = editingSizeName === size;

                      if (isBeingEdited) {
                        return (
                          <div key={size} className="flex items-center gap-1 bg-rose-50 border border-rose-300 rounded-xl p-1">
                            <input
                              type="text"
                              value={editingSizeValue}
                              onChange={e => setEditingSizeValue(e.target.value)}
                              className="px-2 py-1 text-xs font-bold text-gray-800 bg-white rounded-lg outline-none w-28 border border-rose-200"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEditSize(size);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditSize(size)}
                              className="bg-[#D81B60] text-white p-1 rounded-lg hover:bg-rose-700 transition-colors"
                              title="Save size"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingSizeName(null); setEditingSizeValue(''); }}
                              className="text-gray-400 p-1 hover:text-gray-600 transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={size}
                          onClick={() => {
                            const currentSizes = editingProduct ? editForm.sizes : newProd.sizes;
                            const nextSizes = currentSizes.includes(size) ? currentSizes.filter(s => s !== size) : [...currentSizes, size];
                            if (editingProduct) setEditForm({...editForm, sizes: nextSizes});
                            else setNewProd({...newProd, sizes: nextSizes});
                          }}
                          className={`group relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                            isSelected 
                              ? 'bg-[#D81B60] text-white shadow-md shadow-rose-200' 
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <span>{size}</span>
                          
                          <div className="flex items-center gap-1 ml-1 opacity-70 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSizeName(size);
                                setEditingSizeValue(size);
                              }}
                              className={`p-0.5 rounded hover:bg-black/10 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-700'}`}
                              title="Edit size option"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSizeOption(e, size)}
                              className={`p-0.5 rounded hover:bg-black/20 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 hover:text-red-500'}`}
                              title="Delete size option"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Size Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add custom size (e.g. Single 60x90)..."
                      value={customSizeInput}
                      onChange={e => setCustomSizeInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSize(e);
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 outline-none focus:ring-2 focus:ring-[#D81B60]/20 text-xs font-bold transition-all placeholder:font-normal placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomSize()}
                      className="bg-rose-50 text-[#D81B60] border border-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#D81B60] hover:text-white transition-all shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <Plus size={14} /> Add Size
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#777777] uppercase tracking-widest ml-1 block">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative group">
                      {(editingProduct ? editForm.image : newProd.image) ? (
                        <img src={editingProduct ? editForm.image : newProd.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={24} />
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                        <Maximize2 size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, !!editingProduct)} />
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#777777] font-medium leading-relaxed mb-3">Upload a clear photo of the item. Best results with a clean background.</p>
                      <button 
                        type="button"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-pink-50 text-[#D81B60] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-100 transition-colors"
                      >
                        Choose Photo
                      </button>
                      <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, !!editingProduct)} />
                    </div>
                  </div>
                </div>

                <WaterRippleButton 
                  type="submit"
                  className="w-full bg-[#D81B60] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:translate-y-[-2px] transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </WaterRippleButton>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 text-center border border-rose-100"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Trash2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">මෙම භාණ්ඩය ඉවත් කරන්නද?</h3>
              <p className="text-xs text-gray-500 mb-6">Are you sure you want to delete this product from inventory?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  onClick={confirmAndDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-red-200 transition-all"
                >
                  ඉවත් කරන්න
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
