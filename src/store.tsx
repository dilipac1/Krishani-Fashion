import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Product, Customer, Notification, OrderStatus, CartItem } from './types';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';

import { Language, translations } from './lib/translations';

interface StoreState {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  notifications: Notification[];
  cart: CartItem[];
  availableSizes: string[];
  availableCategories: string[];
  lang: Language;
}

interface StoreContextType extends StoreState {
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['si']) => string;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => string;
  markNotificationAsRead: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  addAvailableSize: (newSize: string) => void;
  deleteAvailableSize: (sizeToDelete: string) => void;
  editAvailableSize: (oldSize: string, newSize: string) => void;
  addAvailableCategory: (newCategory: string) => void;
  deleteAvailableCategory: (categoryToDelete: string) => void;
  editAvailableCategory: (oldCategory: string, newCategory: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('krishani_store_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('krishani_store_lang', newLang);
  };

  const t = (key: keyof typeof translations['si']) => {
    return translations[lang][key] || translations['si'][key] || key;
  };

  const DEFAULT_AVAILABLE_SIZES = [
    'Single (60×90")',
    'Double (72×90")',
    'Queen (84×90")',
    'King (90×100")',
    'Super King (108×108")',
    'Standard (18×28")',
    'Jumbo (20×30")'
  ];

  const DEFAULT_AVAILABLE_CATEGORIES = [
    'ඇඳ ඇතිරිලි (Bed Sheets)',
    'කොට්ට උර (Pillow Cases)',
    'දුපොට් / කුෂන් (Duvets)',
    'මැට්ට්‍රස් ප්‍රෝටෙක්ටර්',
    'Other'
  ];

  const [state, setState] = useState<Omit<StoreState, 'lang'>>({
    orders: [],
    products: [],
    customers: [],
    notifications: [],
    cart: [],
    availableSizes: (() => {
      const saved = localStorage.getItem('krishani_available_sizes');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return DEFAULT_AVAILABLE_SIZES;
    })(),
    availableCategories: (() => {
      const saved = localStorage.getItem('krishani_available_categories');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return DEFAULT_AVAILABLE_CATEGORIES;
    })()
  });

  // Load local cart
  useEffect(() => {
    const saved = localStorage.getItem('boutique_store_cart');
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          cart: Array.isArray(parsedCart) ? parsedCart : [],
        }));
      } catch (e) {
        console.error('Failed to load cart data');
        localStorage.removeItem('boutique_store_cart');
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('boutique_store_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Firestore Listeners
  useEffect(() => {
    const DEFAULT_PRODUCTS: Omit<Product, 'id'>[] = [
      {
        name: 'Luxury Rose Floral Cotton Bed Sheet Set (ඇඳ ඇතිරිලි)',
        price: 2850,
        category: 'ඇඳ ඇතිරිලි (Bed Sheets)',
        sizes: ['Single (60x90")', 'Double (72x90")', 'Queen (84x90")', 'King (90x100")'],
        image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Elastic Fitted Cotton Bed Sheet Set (ෆිටඩ් ඇඳ ඇතිරිලි)',
        price: 3200,
        category: 'ඇඳ ඇතිරිලි (Bed Sheets)',
        sizes: ['Double (72x90")', 'Queen (84x90")', 'King (90x100")', 'Super King (108x108")'],
        image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Tropical Botanical Leaf Bed Sheet Set',
        price: 2950,
        category: 'ඇඳ ඇතිරිලි (Bed Sheets)',
        sizes: ['Double (72x90")', 'Queen (84x90")', 'King (90x100")'],
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Classic Geometric Stripe Cotton Bed Spread Set',
        price: 2750,
        category: 'ඇඳ ඇතිරිලි (Bed Sheets)',
        sizes: ['Single (60x90")', 'Double (72x90")', 'Queen (84x90")'],
        image: 'https://images.unsplash.com/photo-1540518614846-7ede433c5163?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Pastel Floral Soft Finish Bed Sheet Set',
        price: 3100,
        category: 'ඇඳ ඇතිරිලි (Bed Sheets)',
        sizes: ['Queen (84x90")', 'King (90x100")'],
        image: 'https://images.unsplash.com/photo-1582582621959-48d273528920?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Royal Satin Border Pillow Covers - Pair (කොට්ට උර 2ක්)',
        price: 850,
        category: 'කොට්ට උර (Pillow Cases)',
        sizes: ['Standard (18x28")', 'Jumbo (20x30")'],
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Frill Ruffled Cotton Pillow Covers - Pair (කොට්ට උර 2ක්)',
        price: 950,
        category: 'කොට්ට උර (Pillow Cases)',
        sizes: ['Standard (18x28")', 'Jumbo (20x30")'],
        image: 'https://images.unsplash.com/photo-1629949009765-40fea3470d48?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Printed Floral Cotton Pillow Case Set (කොට්ට උර 4ක්)',
        price: 1600,
        category: 'කොට්ට උර (Pillow Cases)',
        sizes: ['Standard (18x28")'],
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Boho Quilted Duvet & Pillow Cover Set (දුපොට්)',
        price: 4500,
        category: 'දුපොට් / කුෂන් (Duvets)',
        sizes: ['Queen Size', 'King Size'],
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Luxury Velvet Cushion Cover Pair (කුෂන් කවර් 2ක්)',
        price: 1450,
        category: 'දුපොට් / කුෂන් (Duvets)',
        sizes: ['16" x 16"', '18" x 18"'],
        image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Waterproof Cotton Mattress Protector (මැට්ට්‍රස් ප්‍රෝටෙක්ටර්)',
        price: 3800,
        category: 'මැට්ට්‍රස් ප්‍රෝටෙක්ටර්',
        sizes: ['Single', 'Double', 'Queen', 'King'],
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop'
      }
    ];

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!localStorage.getItem('krishani_products_seeded_final')) {
          localStorage.setItem('krishani_products_seeded_final', 'true');
          if (snapshot.empty) {
            DEFAULT_PRODUCTS.forEach(prod => {
              addDoc(collection(db, 'products'), prod).catch(err => console.error(err));
            });
            return;
          }
        }

        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        setState(prev => {
          // Clean up cart by removing items that no longer exist in the database
          // This ensures the cart badge count doesn't include deleted products
          const validCart = prev.cart.filter(cartItem => 
            productsData.some(p => p.id === cartItem.productId)
          );
          
          return { ...prev, products: productsData, cart: validCart };
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
      }
    );

    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setState(prev => ({ ...prev, orders: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)) }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    );

    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      (snapshot) => {
        setState(prev => ({ ...prev, customers: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)) }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'customers');
      }
    );

    const unsubNotifications = onSnapshot(
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setState(prev => ({ ...prev, notifications: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)) }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'notifications');
      }
    );

    const unsubSizes = onSnapshot(
      doc(db, 'config', 'available_sizes'),
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().sizes) {
          const sizesList: string[] = docSnap.data().sizes;
          setState(prev => ({ ...prev, availableSizes: sizesList }));
          localStorage.setItem('krishani_available_sizes', JSON.stringify(sizesList));
        } else {
          setDoc(doc(db, 'config', 'available_sizes'), { sizes: DEFAULT_AVAILABLE_SIZES }).catch(() => {});
        }
      },
      (error) => {
        console.error('Available sizes listener error:', error);
      }
    );

    const unsubCategories = onSnapshot(
      doc(db, 'config', 'available_categories'),
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().categories) {
          const categoriesList: string[] = docSnap.data().categories;
          setState(prev => ({ ...prev, availableCategories: categoriesList }));
          localStorage.setItem('krishani_available_categories', JSON.stringify(categoriesList));
        } else {
          setDoc(doc(db, 'config', 'available_categories'), { categories: DEFAULT_AVAILABLE_CATEGORIES }).catch(() => {});
        }
      },
      (error) => {
        console.error('Available categories listener error:', error);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubNotifications();
      unsubSizes();
      unsubCategories();
    };
  }, []);

  const addNotification = async (title: string, message: string) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'notifications');
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newOrder = {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, 'orders'), newOrder);
      await addNotification('New Order Received! 🎉', `Order placed for Rs. ${newOrder.total}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date().toISOString()
      });
      await addNotification('Order Updated', `Order ${orderId} is now ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), productData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', productId), productData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productId}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  // This one returns a string immediately if we need it synchronously, 
  // but to align with async DB, we will implement it slightly differently or return id.
  // The original signature returns string, so we'll generate an ID first if new.
  const addCustomer = (customerData: Omit<Customer, 'id'>): string => {
    try {
      const existing = state.customers.find(c => c.phone === customerData.phone);
      if (existing) {
        updateDoc(doc(db, 'customers', existing.id), customerData).catch(error => {
          handleFirestoreError(error, OperationType.WRITE, `customers/${existing.id}`);
        });
        return existing.id;
      }
      
      // Generate a quick ID, then setDoc
      const docRef = doc(collection(db, 'customers'));
      setDoc(docRef, customerData).catch(error => {
        handleFirestoreError(error, OperationType.WRITE, `customers/${docRef.id}`);
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'customers');
      return '';
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `notifications/${id}`);
    }
  };

  const addToCart = (item: CartItem) => {
    setState(prev => {
      const itemSize = item.size || '';
      const existing = prev.cart.find(i => i.productId === item.productId && (i.size || '') === itemSize);
      if (existing) {
        return { 
          ...prev, 
          cart: prev.cart.map(i => i.productId === item.productId && (i.size || '') === itemSize ? { ...i, quantity: i.quantity + item.quantity } : i) 
        };
      }
      return { ...prev, cart: [...prev.cart, { ...item, size: itemSize }] };
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    const targetSize = size || '';
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(i => !(i.productId === productId && (i.size || '') === targetSize))
    }));
  };

  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [] }));
  };

  const addAvailableSize = async (newSize: string) => {
    const trimmed = newSize.trim();
    if (!trimmed) return;
    const current = state.availableSizes;
    if (current.includes(trimmed)) return;
    const updated = [...current, trimmed];
    setState(prev => ({ ...prev, availableSizes: updated }));
    localStorage.setItem('krishani_available_sizes', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_sizes'), { sizes: updated });
    } catch (err) {
      console.error('Failed to write sizes to Firestore:', err);
    }
  };

  const deleteAvailableSize = async (sizeToDelete: string) => {
    const updated = state.availableSizes.filter(s => s !== sizeToDelete);
    setState(prev => ({ ...prev, availableSizes: updated }));
    localStorage.setItem('krishani_available_sizes', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_sizes'), { sizes: updated });
    } catch (err) {
      console.error('Failed to delete size in Firestore:', err);
    }
  };

  const editAvailableSize = async (oldSize: string, newSize: string) => {
    const trimmed = newSize.trim();
    if (!trimmed || oldSize === trimmed) return;
    const updated = state.availableSizes.map(s => s === oldSize ? trimmed : s);
    setState(prev => ({ ...prev, availableSizes: updated }));
    localStorage.setItem('krishani_available_sizes', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_sizes'), { sizes: updated });
    } catch (err) {
      console.error('Failed to edit size in Firestore:', err);
    }
  };

  const addAvailableCategory = async (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    const current = state.availableCategories;
    if (current.includes(trimmed)) return;
    const updated = [...current, trimmed];
    setState(prev => ({ ...prev, availableCategories: updated }));
    localStorage.setItem('krishani_available_categories', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_categories'), { categories: updated });
    } catch (err) {
      console.error('Failed to write categories to Firestore:', err);
    }
  };

  const deleteAvailableCategory = async (catToDelete: string) => {
    const updated = state.availableCategories.filter(c => c !== catToDelete);
    setState(prev => ({ ...prev, availableCategories: updated }));
    localStorage.setItem('krishani_available_categories', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_categories'), { categories: updated });
    } catch (err) {
      console.error('Failed to delete category in Firestore:', err);
    }
  };

  const editAvailableCategory = async (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    const updated = state.availableCategories.map(c => c === oldCat ? trimmed : c);
    
    // Also update existing products in state and Firestore that use this old category
    state.products.forEach(p => {
      if (p.category === oldCat) {
        updateProduct(p.id, { category: trimmed });
      }
    });

    setState(prev => ({ ...prev, availableCategories: updated }));
    localStorage.setItem('krishani_available_categories', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'available_categories'), { categories: updated });
    } catch (err) {
      console.error('Failed to edit category in Firestore:', err);
    }
  };

  return (
    <StoreContext.Provider value={{
      ...state,
      lang,
      setLang,
      t,
      addOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      markNotificationAsRead,
      addToCart,
      removeFromCart,
      clearCart,
      addAvailableSize,
      deleteAvailableSize,
      editAvailableSize,
      addAvailableCategory,
      deleteAvailableCategory,
      editAvailableCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

