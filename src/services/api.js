const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const defaultHeaders = { 'Content-Type': 'application/json' };

function authHeaders() {
  const token = localStorage.getItem('dematiq_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...authHeaders(), ...(options.headers || {}) },
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error de conexión con el servidor');
  }

  return data;
}

function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: Number(p.price),
    category: p.categories?.name || 'General',
    category_id: p.category_id,
    image: p.image_url || `/img/products/${p.slug || p.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    image_url: p.image_url,
    description: p.description || '',
    stock: p.stock ?? 0,
    specs: p.specs || {},
    features: Array.isArray(p.specs) ? p.specs : [],
    status: p.status || 'active',
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

function mapOrder(o) {
  return {
    id: o.id,
    order_id: `#${String(o.id).padStart(3, '0')}`,
    user_id: o.user_id,
    customer: o.profiles?.name || 'Desconocido',
    customer_email: o.profiles?.email || '',
    items: o.order_items || [],
    total: Number(o.total),
    status: o.status,
    notes: o.notes,
    shipping_address_id: o.shipping_address_id,
    created_at: o.created_at,
    updated_at: o.updated_at,
    itemCount: (o.order_items || []).reduce((sum, i) => sum + i.quantity, 0),
  };
}

function mapUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: u.role === 'admin' ? 'Admin' : 'Usuario',
    role_raw: u.role,
    company_name: u.company_name || '',
    rfc: u.rfc || '',
    created_at: u.created_at,
  };
}

export const categoriesApi = {
  getAll: async () => {
    const res = await request('/categories');
    return res.data || [];
  },
};

export const productsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category_id) query.set('category_id', params.category_id);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    const res = await request(`/products${qs ? `?${qs}` : ''}`);
    return (res.data || []).map(mapProduct);
  },

  getById: async (id) => {
    const res = await request(`/products/${id}`);
    return mapProduct(res.data);
  },

  create: async (data) => {
    const res = await request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapProduct(res.data);
  },

  update: async (id, data) => {
    const res = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mapProduct(res.data);
  },

  delete: async (id) => {
    await request(`/products/${id}`, { method: 'DELETE' });
  },
};

export const ordersApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.user_id) query.set('user_id', params.user_id);
    const qs = query.toString();
    const res = await request(`/orders${qs ? `?${qs}` : ''}`);
    return (res.data || []).map(mapOrder);
  },

  getById: async (id) => {
    const res = await request(`/orders/${id}`);
    return mapOrder(res.data);
  },

  create: async (data) => {
    const res = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapOrder(res.data);
  },

  updateStatus: async (id, status) => {
    const res = await request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return mapOrder(res.data);
  },
};

export const usersApi = {
  getAll: async () => {
    const res = await request('/users');
    return (res.data || []).map(mapUser);
  },

  getById: async (id) => {
    const res = await request(`/users/${id}`);
    return mapUser(res.data);
  },

  update: async (id, data) => {
    const res = await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mapUser(res.data);
  },

  delete: async (id) => {
    await request(`/users/${id}`, { method: 'DELETE' });
  },
};
