"use client";

import React, { useState, useMemo, useEffect } from "react";

// ─── PRODUCT CATALOG ───
const CATALOG = [
  // Línea Escolar
  { id: 'esc-01', name: 'Silla Escolar Apilable', category: 'escolar', priceUsd: 8.50, unit: 'unidad', color: '#4ECDC4' },
  { id: 'esc-02', name: 'Mesa Escolar Rectangular', category: 'escolar', priceUsd: 22.00, unit: 'unidad', color: '#4ECDC4' },
  { id: 'esc-03', name: 'Pupitre Escolar Completo', category: 'escolar', priceUsd: 28.50, unit: 'unidad', color: '#4ECDC4' },
  { id: 'esc-04', name: 'Silla Escolar Reforzada', category: 'escolar', priceUsd: 11.00, unit: 'unidad', color: '#4ECDC4' },
  { id: 'esc-05', name: 'Banqueta Escolar', category: 'escolar', priceUsd: 6.50, unit: 'unidad', color: '#4ECDC4' },

  // Línea Pratice
  { id: 'pra-01', name: 'Silla Pratice con Brazo', category: 'pratice', priceUsd: 14.50, unit: 'unidad', color: '#FF6B6B' },
  { id: 'pra-02', name: 'Silla Pratice Sin Brazo', category: 'pratice', priceUsd: 11.00, unit: 'unidad', color: '#FF6B6B' },
  { id: 'pra-03', name: 'Mesa Pratice Cuadrada', category: 'pratice', priceUsd: 18.00, unit: 'unidad', color: '#FF6B6B' },
  { id: 'pra-04', name: 'Mesa Pratice Redonda', category: 'pratice', priceUsd: 20.00, unit: 'unidad', color: '#FF6B6B' },
  { id: 'pra-05', name: 'Banco Pratice Largo', category: 'pratice', priceUsd: 16.00, unit: 'unidad', color: '#FF6B6B' },

  // Línea Vidracaria
  { id: 'vid-01', name: 'Caballete Vidracaria', category: 'vidracaria', priceUsd: 35.00, unit: 'unidad', color: '#45B7D1' },
  { id: 'vid-02', name: 'Soporte de Vidrio Tipo A', category: 'vidracaria', priceUsd: 42.00, unit: 'unidad', color: '#45B7D1' },
  { id: 'vid-03', name: 'Caballete Reforzado', category: 'vidracaria', priceUsd: 48.00, unit: 'unidad', color: '#45B7D1' },
  { id: 'vid-04', name: 'Base Transporte Vidrio', category: 'vidracaria', priceUsd: 55.00, unit: 'unidad', color: '#45B7D1' },

  // Industrial
  { id: 'ind-01', name: 'Pallet Plástico 1200x1000', category: 'industrial', priceUsd: 45.00, unit: 'unidad', color: '#96CEB4' },
  { id: 'ind-02', name: 'Cajón Industrial 60L', category: 'industrial', priceUsd: 18.50, unit: 'unidad', color: '#96CEB4' },
  { id: 'ind-03', name: 'Contenedor Apilable 40L', category: 'industrial', priceUsd: 12.00, unit: 'unidad', color: '#96CEB4' },
  { id: 'ind-04', name: 'Balde Industrial 20L', category: 'industrial', priceUsd: 5.50, unit: 'unidad', color: '#96CEB4' },
  { id: 'ind-05', name: 'Cesto de Basura 120L', category: 'industrial', priceUsd: 22.00, unit: 'unidad', color: '#96CEB4' },
  { id: 'ind-06', name: 'Materia Prima PP (polipropileno)', category: 'industrial', priceUsd: 1.35, unit: 'kg', color: '#96CEB4' },
  { id: 'ind-07', name: 'Materia Prima PE (polietileno)', category: 'industrial', priceUsd: 1.20, unit: 'kg', color: '#96CEB4' },
];

export default function OriplastCalculator() {
  // ─── ESTADOS ───
  const [currency, setCurrency] = useState('USD');
  const [rateUsdPyg, setRateUsdPyg] = useState(7750);
  const [rateUsdBrl, setRateUsdBrl] = useState(5.75);
  
  const [items, setItems] = useState<any[]>([]);
  const [nextId, setNextId] = useState(1);

  // Cliente
  const [clientName, setClientName] = useState('');
  const [clientRuc, setClientRuc] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientCountry, setClientCountry] = useState('PY');

  // Condiciones
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState('Contado');
  const [quoteValidity, setQuoteValidity] = useState('30 días');

  // Agregar Producto
  const [addCategory, setAddCategory] = useState('');
  const [addProductId, setAddProductId] = useState('');
  const [addQty, setAddQty] = useState(100);

  // Producto Personalizado
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customUnit, setCustomUnit] = useState('unidad');

  // ─── EFECTOS Y LÓGICA ───
  useEffect(() => {
    if (clientCountry === 'PY') setCurrency('PYG');
    else if (clientCountry === 'BR') setCurrency('BRL');
    else setCurrency('USD');
  }, [clientCountry]);

  const filteredProducts = useMemo(() => {
    return addCategory && addCategory !== 'custom' 
      ? CATALOG.filter(p => p.category === addCategory) 
      : CATALOG;
  }, [addCategory]);

  const convertFromUsd = (usd: number, targetCurrency: string) => {
    if (targetCurrency === 'PYG') return usd * rateUsdPyg;
    if (targetCurrency === 'BRL') return usd * rateUsdBrl;
    return usd;
  };

  const formatNum = (n: number, decimals: number) => {
    return n.toLocaleString('es-PY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatPrice = (usd: number, targetCurrency = currency) => {
    const val = convertFromUsd(usd, targetCurrency);
    if (targetCurrency === 'PYG') return '₲' + formatNum(val, 0);
    if (targetCurrency === 'BRL') return 'R$' + formatNum(val, 2);
    return '$' + formatNum(val, 2);
  };

  const handleAddProduct = () => {
    if (addCategory === 'custom') {
      const price = parseFloat(customPrice);
      if (!customName.trim() || isNaN(price)) return alert('Completá nombre y precio válido');
      
      setItems([...items, {
        id: 'custom-' + nextId,
        name: customName,
        priceUsd: price,
        unit: customUnit,
        qty: addQty,
        color: '#ff9f43',
        category: 'custom'
      }]);
      setNextId(prev => prev + 1);
      setCustomName('');
      setCustomPrice('');
    } else {
      if (!addProductId) return;
      const product = CATALOG.find(p => p.id === addProductId);
      if (!product) return;

      const existingItemIndex = items.findIndex(i => i.id === product.id);
      if (existingItemIndex >= 0) {
        const newItems = [...items];
        newItems[existingItemIndex].qty += addQty;
        setItems(newItems);
      } else {
        setItems([...items, { ...product, qty: addQty }]);
      }
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const setExactQty = (id: string, val: string) => {
    const qty = Math.max(1, parseInt(val) || 1);
    setItems(items.map(item => item.id === id ? { ...item, qty } : item));
  };

  // ─── CÁLCULOS TOTALES ───
  const subtotalUsd = items.reduce((sum, i) => sum + i.priceUsd * i.qty, 0);
  const discountUsd = subtotalUsd * (globalDiscount / 100);
  const afterDiscount = subtotalUsd - discountUsd;
  const taxUsd = afterDiscount * (taxRate / 100);
  const totalUsd = afterDiscount + taxUsd;

  const altCurrency = currency === 'USD' ? 'PYG' : 'USD';

  // ─── EXPORTAR CSV ───
  const exportCSV = () => {
    if (items.length === 0) return alert('No hay productos para exportar');
    let csv = 'Producto,Categoría,Unidad,Precio Unitario,Cantidad,Subtotal\n';
    items.forEach(i => {
      const sub = i.priceUsd * i.qty;
      csv += `"${i.name}","${i.category}","${i.unit}","${formatPrice(i.priceUsd)}",${i.qty},"${formatPrice(sub)}"\n`;
    });
    
    csv += `\n"SUBTOTAL","","","","","${formatPrice(subtotalUsd)}"`;
    csv += `\n"DESCUENTO (${globalDiscount}%)","","","","","-${formatPrice(discountUsd)}"`;
    csv += `\n"IVA (${taxRate}%)","","","","","${formatPrice(taxUsd)}"`;
    csv += `\n"TOTAL","","","","","${formatPrice(totalUsd)}"`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion-oriplast-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── GENERAR PDF / IMPRIMIR ───
  const generateQuote = () => {
    if (items.length === 0) return alert('Agregá productos antes de generar la cotización');
    
    const rows = items.map((i, idx) => {
      const sub = i.priceUsd * i.qty;
      return `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${idx+1}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">${i.unit}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">${formatPrice(i.priceUsd)}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">${i.qty}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right; font-weight:600;">${formatPrice(sub)}</td>
      </tr>`;
    }).join('');
    
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cotización Oriplast</title>
    <style>body{font-family:Arial,sans-serif;color:#333;max-width:800px;margin:0 auto;padding:40px;}
    .header{display:flex;justify-content:space-between;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #00d4aa;}
    table{width:100%;border-collapse:collapse;margin:20px 0;}
    th{background:#f5f5f5;padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;}
    .totals{margin-top:20px;text-align:right;}
    .totals div{margin:4px 0;font-size:15px;}
    .grand-total{font-size:24px;font-weight:700;color:#00d4aa;margin-top:10px;}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888;}
    @media print{body{padding:20px;}}</style></head>
    <body>
    <div class="header">
      <div><h1 style="margin:0;color:#00d4aa;">ORIPLAST</h1><p style="color:#888;margin:4px 0;">Fábrica de Plásticos Inyectados</p><p style="color:#888;font-size:12px;">oriplastpy.com</p></div>
      <div style="text-align:right;"><h2 style="margin:0;">COTIZACIÓN</h2><p style="color:#888;">Fecha: ${new Date().toLocaleDateString('es-PY')}</p><p style="color:#888;">Nro: COT-${Date.now().toString(36).toUpperCase()}</p></div>
    </div>
    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:20px;">
      <strong>Cliente:</strong> ${clientName || 'Cliente'} &nbsp;|&nbsp; <strong>RUC:</strong> ${clientRuc || '-'} &nbsp;|&nbsp; <strong>Contacto:</strong> ${clientContact || '-'}
    </div>
    <table><thead><tr><th>#</th><th>Producto</th><th style="text-align:center;">Unidad</th><th style="text-align:right;">P. Unit.</th><th style="text-align:center;">Cant.</th><th style="text-align:right;">Subtotal</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="totals">
      <div>Subtotal: <strong>${formatPrice(subtotalUsd)}</strong></div>
      ${globalDiscount > 0 ? `<div>Descuento (${globalDiscount}%): <strong>-${formatPrice(discountUsd)}</strong></div>` : ''}
      <div>IVA (${taxRate}%): <strong>${formatPrice(taxUsd)}</strong></div>
      <div class="grand-total">TOTAL: ${formatPrice(totalUsd)}</div>
      <div style="font-size:13px;color:#888;margin-top:8px;">
        ≈ ${formatPrice(totalUsd, 'USD')} | ≈ ${formatPrice(totalUsd, 'PYG')} | ≈ ${formatPrice(totalUsd, 'BRL')}
      </div>
    </div>
    <div class="footer">
      <p><strong>Condición de pago:</strong> ${paymentTerms} &nbsp;|&nbsp; <strong>Validez:</strong> ${quoteValidity}</p>
      <p><strong>Tipos de cambio aplicados:</strong> 1 USD = ${formatNum(rateUsdPyg, 0)} PYG | 1 USD = ${formatNum(rateUsdBrl, 2)} BRL</p>
      <p style="margin-top:12px;">Este presupuesto no constituye una oferta vinculante. Precios sujetos a disponibilidad de stock y variación de tipo de cambio.</p>
    </div>
    <script>window.print();<\/script>
    </body></html>`;
    
    const w = window.open('', '_blank');
    if(w) {
        w.document.write(html);
        w.document.close();
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg: #0c0f14;
          --surface: #141820;
          --surface-2: #1a1f2a;
          --surface-3: #222836;
          --border: #2a3040;
          --border-hover: #3a4560;
          --text: #e8eaf0;
          --text-dim: #8892a4;
          --text-muted: #5a6478;
          --accent: #00d4aa;
          --accent-dim: #00d4aa22;
          --accent-hover: #00eabc;
          --warning: #ff9f43;
          --danger: #ff6b6b;
          --usd: #85bb65;
          --pyg: #d63384;
          --brl: #f4c542;
          --radius: 10px;
          --radius-lg: 16px;
          --shadow: 0 4px 24px rgba(0,0,0,0.3);
          --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .calculator-container * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .calculator-container {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        
        .calculator-container::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at 20% 50%, #00d4aa08 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 20%, #0066ff06 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 80%, #d6338406 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .app { position: relative; z-index: 1; }
        
        /* HEADER */
        .header { padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100; background: var(--bg)ee; }
        .logo-area { display: flex; align-items: center; gap: 14px; }
        .logo-mark { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent), #0088ff); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Space Mono', monospace; font-weight: 700; font-size: 18px; color: var(--bg); }
        .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .logo-text span { color: var(--accent); }
        .logo-sub { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; font-family: 'Space Mono', monospace; }
        .header-actions { display: flex; gap: 10px; }
        
        .btn { padding: 10px 20px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all var(--transition); display: flex; align-items: center; gap: 6px; }
        .btn:hover { border-color: var(--border-hover); background: var(--surface-2); }
        .btn-primary { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 600; }
        .btn-primary:hover { background: var(--accent-hover); }
        
        /* LAYOUT */
        .main-content { max-width: 1400px; margin: 0 auto; padding: 28px 32px; display: grid; grid-template-columns: 340px 1fr; gap: 24px; }
        @media (max-width: 1024px) { .main-content { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .main-content { padding: 16px; } .header { padding: 16px; } }
        
        /* PANELS */
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
        .panel-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .panel-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .panel-title .icon { width: 20px; height: 20px; background: var(--accent-dim); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .panel-body { padding: 20px 22px; }
        
        /* FORMS */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .field-group { margin-bottom: 16px; }
        .field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 8px; font-family: 'Space Mono', monospace; }
        .field-input { width: 100%; padding: 11px 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; transition: all var(--transition); outline: none; }
        .field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
        select.field-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238892a4' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; cursor: pointer; }
        select.field-input option { background: var(--surface-2); color: var(--text); }
        
        /* CURRENCY TABS */
        .currency-tabs { display: flex; gap: 4px; background: var(--surface-3); padding: 4px; border-radius: var(--radius); }
        .currency-tab { flex: 1; padding: 8px 4px; text-align: center; font-size: 12px; font-weight: 600; border-radius: 7px; cursor: pointer; transition: all var(--transition); border: none; background: transparent; color: var(--text-muted); font-family: 'Space Mono', monospace; letter-spacing: 0.5px; }
        .currency-tab:hover { color: var(--text-dim); }
        .currency-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .currency-tab[data-currency="USD"].active { color: var(--usd); }
        .currency-tab[data-currency="PYG"].active { color: var(--pyg); }
        .currency-tab[data-currency="BRL"].active { color: var(--brl); }
        
        .rates-display { display: flex; gap: 8px; flex-wrap: wrap; }
        .rate-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--surface-3); border-radius: 20px; font-size: 12px; font-family: 'Space Mono', monospace; }
        .rate-dot { width: 6px; height: 6px; border-radius: 50%; }
        .rate-dot.usd { background: var(--usd); }
        .rate-dot.pyg { background: var(--pyg); }
        .rate-dot.brl { background: var(--brl); }
        
        .config-row { display: flex; gap: 10px; align-items: end; }
        .config-row .field-group { flex: 1; }
        .editable-rate { width: 100%; padding: 6px 10px; background: var(--surface-3); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-family: 'Space Mono', monospace; font-size: 12px; text-align: center; outline: none; transition: all var(--transition); }
        .editable-rate:focus { border-color: var(--accent); }
        
        /* TABLE */
        .product-table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border); font-family: 'Space Mono', monospace; white-space: nowrap; position: sticky; top: 0; background: var(--surface); }
        thead th.right, td.right { text-align: right; }
        tbody tr { border-bottom: 1px solid var(--border); transition: background var(--transition); }
        tbody tr:hover { background: var(--surface-2); }
        tbody tr:last-child { border-bottom: none; }
        td { padding: 14px 16px; font-size: 14px; white-space: nowrap; }
        
        .product-name { font-weight: 600; display: flex; align-items: center; gap: 10px; }
        .product-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .product-category { font-size: 11px; color: var(--text-muted); font-weight: 400; }
        
        .qty-control { display: flex; align-items: center; gap: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .qty-btn { width: 32px; height: 32px; border: none; background: var(--surface-3); color: var(--text-dim); cursor: pointer; font-size: 16px; transition: all var(--transition); display: flex; align-items: center; justify-content: center; }
        .qty-btn:hover { background: var(--border); color: var(--text); }
        .qty-input { width: 52px; height: 32px; border: none; background: var(--surface-2); color: var(--text); text-align: center; font-family: 'Space Mono', monospace; font-size: 13px; outline: none; }
        .qty-input::-webkit-inner-spin-button { appearance: none; }
        
        .price-value { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 14px; }
        .price-secondary { font-size: 11px; color: var(--text-muted); font-family: 'Space Mono', monospace; margin-top: 2px; }
        .subtotal-value { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 15px; color: var(--accent); }
        
        .remove-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 14px; transition: all var(--transition); display: flex; align-items: center; justify-content: center; }
        .remove-btn:hover { background: #ff6b6b22; color: var(--danger); }
        
        /* TOTALS BAR */
        .totals-bar { margin-top: 16px; padding: 20px 22px; background: linear-gradient(135deg, var(--surface-2), var(--surface-3)); border-radius: var(--radius); border: 1px solid var(--border); }
        .totals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
        .total-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Space Mono', monospace; margin-bottom: 6px; }
        .total-value { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; }
        .total-value.primary { color: var(--accent); font-size: 28px; }
        .total-value-secondary { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--text-dim); margin-top: 2px; }
        
        .add-product-row { padding: 16px 22px; border-top: 1px solid var(--border); display: flex; gap: 10px; align-items: end; flex-wrap: wrap; }
        .add-product-row .field-group { margin-bottom: 0; flex: 1; min-width: 120px; }
        
        .empty-state { padding: 60px 20px; text-align: center; color: var(--text-muted); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
        .empty-state p { font-size: 14px; margin-top: 8px; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        
        @media print {
          body { background: #fff; color: #000; }
          .header-actions, .qty-btn, .remove-btn, .add-product-row, .sidebar { display: none !important; }
          .main-content { grid-template-columns: 1fr; }
          .panel { border: 1px solid #ddd; }
          .totals-bar { background: #f5f5f5; }
          .price-value, .subtotal-value, .total-value { color: #000 !important; }
        }
      `}} />

      <div className="calculator-container">
        <div className="app">
          {/* HEADER */}
          <header className="header">
            <div className="logo-area">
              <div className="logo-mark">OP</div>
              <div>
                <div className="logo-text">Ori<span>plast</span></div>
                <div className="logo-sub">Calculadora B2B</div>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn" onClick={exportCSV}>⬇ CSV</button>
              <button className="btn" onClick={() => window.print()}>🖨 Imprimir</button>
              <button className="btn btn-primary" onClick={generateQuote}>📄 Cotización</button>
            </div>
          </header>

          <div className="main-content">
            {/* SIDEBAR */}
            <aside className="sidebar">
              {/* Moneda y Tipo de Cambio */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span className="icon">$</span> Moneda y Tipo de Cambio</div>
                </div>
                <div className="panel-body">
                  <div className="currency-tabs">
                    <button className={`currency-tab ${currency === 'USD' ? 'active' : ''}`} data-currency="USD" onClick={() => setCurrency('USD')}>USD</button>
                    <button className={`currency-tab ${currency === 'PYG' ? 'active' : ''}`} data-currency="PYG" onClick={() => setCurrency('PYG')}>PYG</button>
                    <button className={`currency-tab ${currency === 'BRL' ? 'active' : ''}`} data-currency="BRL" onClick={() => setCurrency('BRL')}>BRL</button>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div className="field-label">Tipos de cambio</div>
                    <div className="config-row" style={{ marginBottom: '8px' }}>
                      <div className="field-group">
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>1 USD = PYG</div>
                        <input type="number" className="editable-rate" value={rateUsdPyg} onChange={(e) => setRateUsdPyg(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="field-group">
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>1 USD = BRL</div>
                        <input type="number" className="editable-rate" value={rateUsdBrl} step="0.01" onChange={(e) => setRateUsdBrl(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                    <div className="rates-display">
                      <div className="rate-chip"><div className="rate-dot usd"></div>1 USD</div>
                      <div className="rate-chip"><div className="rate-dot pyg"></div>{formatNum(rateUsdPyg, 0)} PYG</div>
                      <div className="rate-chip"><div className="rate-dot brl"></div>{formatNum(rateUsdBrl, 2)} BRL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span className="icon">👤</span> Datos del Cliente</div>
                </div>
                <div className="panel-body">
                  <div className="field-group">
                    <div className="field-label">Empresa</div>
                    <input className="field-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre de la empresa" />
                  </div>
                  <div className="field-group">
                    <div className="field-label">RUC / CNPJ</div>
                    <input className="field-input" value={clientRuc} onChange={e => setClientRuc(e.target.value)} placeholder="Ej: 80012345-6" />
                  </div>
                  <div className="field-group">
                    <div className="field-label">Contacto</div>
                    <input className="field-input" value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="Nombre del contacto" />
                  </div>
                  <div className="field-group">
                    <div className="field-label">País</div>
                    <select className="field-input" value={clientCountry} onChange={e => setClientCountry(e.target.value)}>
                      <option value="PY">🇵🇾 Paraguay</option>
                      <option value="BR">🇧🇷 Brasil</option>
                      <option value="AR">🇦🇷 Argentina</option>
                      <option value="UY">🇺🇾 Uruguay</option>
                      <option value="BO">🇧🇴 Bolivia</option>
                      <option value="CL">🇨🇱 Chile</option>
                      <option value="US">🇺🇸 Estados Unidos</option>
                      <option value="OTHER">🌎 Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Condiciones */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span className="icon">%</span> Condiciones</div>
                </div>
                <div className="panel-body">
                  <div className="field-group">
                    <div className="field-label">Descuento Global (%)</div>
                    <input type="number" className="field-input" value={globalDiscount} min="0" max="100" onChange={e => setGlobalDiscount(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="field-group">
                    <div className="field-label">IVA (%)</div>
                    <input type="number" className="field-input" value={taxRate} min="0" max="100" onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="field-group">
                    <div className="field-label">Condición de pago</div>
                    <select className="field-input" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
                      <option>Contado</option>
                      <option>30 días</option>
                      <option>60 días</option>
                      <option>90 días</option>
                      <option>A convenir</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <div className="field-label">Validez de cotización</div>
                    <select className="field-input" value={quoteValidity} onChange={e => setQuoteValidity(e.target.value)}>
                      <option>7 días</option>
                      <option>15 días</option>
                      <option>30 días</option>
                      <option>60 días</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Tabla de Productos */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span className="icon">📦</span> Productos</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{items.length} items</span>
                  </div>
                </div>

                <div className="product-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Unidad</th>
                        <th className="right">Precio Unit.</th>
                        <th style={{ textAlign: 'center' }}>Cantidad</th>
                        <th className="right">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="empty-state">
                              <div className="empty-icon">📦</div>
                              <strong>Sin productos</strong>
                              <p>Seleccioná un producto abajo y hacé clic en "+ Agregar"</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        items.map(item => {
                          const sub = item.priceUsd * item.qty;
                          return (
                            <tr key={item.id} className="fade-in">
                              <td>
                                <div className="product-name">
                                  <div className="product-dot" style={{ background: item.color }}></div>
                                  <div>
                                    {item.name}
                                    <div className="product-category">{item.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{item.unit}</td>
                              <td className="right">
                                <div className="price-value">{formatPrice(item.priceUsd)}</div>
                                <div className="price-secondary">{formatPrice(item.priceUsd, altCurrency)}</div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div className="qty-control">
                                  <button className="qty-btn" onClick={() => updateQty(item.id, -10)}>−</button>
                                  <input type="number" className="qty-input" value={item.qty} onChange={(e) => setExactQty(item.id, e.target.value)} />
                                  <button className="qty-btn" onClick={() => updateQty(item.id, 10)}>+</button>
                                </div>
                              </td>
                              <td className="right">
                                <div className="subtotal-value">{formatPrice(sub)}</div>
                                <div className="price-secondary">{formatPrice(sub, altCurrency)}</div>
                              </td>
                              <td><button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Agregar Producto Fila */}
                <div className="add-product-row">
                  <div className="field-group">
                    <div className="field-label">Categoría</div>
                    <select className="field-input" value={addCategory} onChange={e => { setAddCategory(e.target.value); setAddProductId(''); }}>
                      <option value="">Todas</option>
                      <option value="escolar">Línea Escolar</option>
                      <option value="pratice">Línea Pratice</option>
                      <option value="vidracaria">Línea Vidracaria</option>
                      <option value="industrial">Industrial</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  
                  {addCategory !== 'custom' ? (
                    <div className="field-group" style={{ flex: 2 }}>
                      <div className="field-label">Producto</div>
                      <select className="field-input" value={addProductId} onChange={e => setAddProductId(e.target.value)}>
                        <option value="">Seleccionar producto...</option>
                        {filteredProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.priceUsd)}/{p.unit}</option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="field-group" style={{ flex: 0.5 }}>
                    <div className="field-label">Cant.</div>
                    <input type="number" className="field-input" value={addQty} min="1" onChange={e => setAddQty(parseInt(e.target.value) || 1)} />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddProduct} style={{ height: '42px', marginBottom: '0' }}>+ Agregar</button>
                </div>

                {/* Custom Product Row */}
                {addCategory === 'custom' && (
                  <div className="add-product-row" style={{ borderTop: '1px dashed var(--border)' }}>
                    <div className="field-group" style={{ flex: 2 }}>
                      <div className="field-label">Nombre personalizado</div>
                      <input className="field-input" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Ej: Silla plástica modelo X" />
                    </div>
                    <div className="field-group">
                      <div className="field-label">Precio USD</div>
                      <input type="number" className="field-input" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="0.00" step="0.01" />
                    </div>
                    <div className="field-group" style={{ flex: 0.5 }}>
                      <div className="field-label">Unidad</div>
                      <select className="field-input" value={customUnit} onChange={e => setCustomUnit(e.target.value)}>
                        <option>unidad</option>
                        <option>kg</option>
                        <option>m²</option>
                        <option>rollo</option>
                        <option>caja</option>
                        <option>pallet</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="panel">
                <div className="panel-body">
                  <div className="totals-bar" style={{ marginTop: '0', border: 'none', background: 'transparent', padding: '0' }}>
                    <div className="totals-grid">
                      <div className="total-item">
                        <div className="total-label">Subtotal</div>
                        <div className="total-value">{formatPrice(subtotalUsd)}</div>
                        <div className="total-value-secondary">{currency !== 'USD' ? formatPrice(subtotalUsd, 'USD') : ''}</div>
                      </div>
                      <div className="total-item">
                        <div className="total-label">Descuento</div>
                        <div className="total-value" style={{ color: 'var(--warning)' }}>-{formatPrice(discountUsd)}</div>
                      </div>
                      <div className="total-item">
                        <div className="total-label">IVA ({taxRate}%)</div>
                        <div className="total-value">{formatPrice(taxUsd)}</div>
                      </div>
                      <div className="total-item">
                        <div className="total-label">Total Final</div>
                        <div className="total-value primary">{formatPrice(totalUsd)}</div>
                        <div className="total-value-secondary">{currency !== 'USD' ? `≈ ${formatPrice(totalUsd, 'USD')}` : ''}</div>
                        <div className="total-value-secondary">{currency !== 'PYG' ? `≈ ${formatPrice(totalUsd, 'PYG')}` : ''}</div>
                        <div className="total-value-secondary">{currency !== 'BRL' ? `≈ ${formatPrice(totalUsd, 'BRL')}` : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
