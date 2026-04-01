"use client"
 
import { useState, useMemo } from "react"
 
/*
══════════════════════════════════════════════════════════════════
  LÓGICA DE LA CALCULADORA ORIPLAST
══════════════════════════════════════════════════════════════════
 
  1. PRODUCTOS: Cada conjunto (CJA) tiene un precio fijo en USD 
     que incluye todas las piezas (asiento, encosto, sapatas, 
     ponteiras, tampo con travessa, porta livros).
 
  2. COLORES: Cada modelo tiene un color asignado por edad/nivel:
     - CJA01 Maternal → Naranja (Laranja)
     - CJA03 Infantil → Amarillo (Amarelo)
     - CJA04 Juvenil  → Rojo (Vermelho)
     - CJA05 Adulto   → Verde (Bandeira)
     - CJA06 Adulto   → Azul
     - CP01 Profesor   → Gris (Cinza)
 
  3. PIEZAS SUELTAS: También se cotizan individualmente
     para reposición o pedidos especiales.
 
  4. CÁLCULO:
     - Precio base en USD (tabla de fábrica)
     - Conversión a PYG (principal), USD y BRL
     - Descuento por volumen automático:
       +200 = 3%  |  +500 = 5%  |  +1000 = 7%
       +2000 = 10%  |  +5000 = 15%
     - IVA configurable (default 10%)
     - Tolerancia: ±5% en cantidad de producción
 
  5. CONDICIONES:
     - Pago: 100% antes de entrega
     - Precio: FCA (fábrica)
     - Plazo: 60 días después del anticipo
══════════════════════════════════════════════════════════════════
*/
 
const DEFAULT_RATES = { USD_PYG: 6475, USD_BRL: 5.25 }
 
const COLORS = [
  { id: "laranja",  name: "Naranja",  hex: "#E67E22", modelo: "CJA01" },
  { id: "amarelo",  name: "Amarillo", hex: "#F1C40F", modelo: "CJA03" },
  { id: "vermelho", name: "Rojo",     hex: "#E74C3C", modelo: "CJA04" },
  { id: "verde",    name: "Verde",    hex: "#27AE60", modelo: "CJA05" },
  { id: "azul",     name: "Azul",     hex: "#2E86C1", modelo: "CJA06" },
  { id: "cinza",    name: "Gris",     hex: "#95A5A6", modelo: "CP01"  },
]
 
type Product = {
  id: string; name: string; category: "conjunto" | "pieza"
  priceUsd: number; unit: string; minQty: number
  colorId: string | null; desc: string
}
 
const CATALOG: Product[] = [
  { id: "cja01", name: "CJA01 Educ. Inicial (Maternal)", category: "conjunto", priceUsd: 14.75, unit: "conj", minQty: 40, colorId: "laranja", desc: "Conjunto maternal completo: asiento + encosto + tampo con travessa + porta livros + sapatas + ponteiras" },
  { id: "cja03", name: "CJA03 EEB 2\u00b0 Ciclo (Infantil)", category: "conjunto", priceUsd: 17.44, unit: "conj", minQty: 30, colorId: "amarelo", desc: "Conjunto infantil 2\u00b0 ciclo completo con todos los componentes" },
  { id: "cja04", name: "CJA04 EEB 3\u00b0 Ciclo (Juvenil)", category: "conjunto", priceUsd: 17.57, unit: "conj", minQty: 30, colorId: "vermelho", desc: "Conjunto juvenil 3\u00b0 ciclo completo con todos los componentes" },
  { id: "cja06", name: "CJA06 EEB 3\u00b0 Ciclo (Adulto)", category: "conjunto", priceUsd: 17.60, unit: "conj", minQty: 30, colorId: "azul", desc: "Conjunto adulto 3\u00b0 ciclo completo con todos los componentes" },
  { id: "asiento-06", name: "Asiento 06 Cinza", category: "pieza", priceUsd: 2.21, unit: "pza", minQty: 100, colorId: "cinza", desc: "Asiento pl\u00e1stico inyectado gris" },
  { id: "asiento-04", name: "Asiento 04 Vermelho", category: "pieza", priceUsd: 2.18, unit: "pza", minQty: 100, colorId: "vermelho", desc: "Asiento pl\u00e1stico inyectado rojo" },
  { id: "asiento-03", name: "Asiento 03 Amarelo", category: "pieza", priceUsd: 2.05, unit: "pza", minQty: 100, colorId: "amarelo", desc: "Asiento pl\u00e1stico inyectado amarillo" },
  { id: "asiento-01", name: "Asiento 01 Laranja", category: "pieza", priceUsd: 1.23, unit: "pza", minQty: 100, colorId: "laranja", desc: "Asiento pl\u00e1stico inyectado naranja" },
  { id: "porta-livros", name: "Porta Livros Cinza", category: "pieza", priceUsd: 1.31, unit: "pza", minQty: 100, colorId: "cinza", desc: "Porta libros pl\u00e1stico gris para pupitre" },
  { id: "encosto", name: "Encosto 06/04/03", category: "pieza", priceUsd: 1.79, unit: "pza", minQty: 100, colorId: null, desc: "Respaldo pl\u00e1stico, compatible con modelos 06, 04 y 03" },
  { id: "encosto-01", name: "Encosto 01 (20,70)", category: "pieza", priceUsd: 1.23, unit: "pza", minQty: 100, colorId: "laranja", desc: "Respaldo pl\u00e1stico maternal naranja" },
  { id: "ponteira-sup", name: "Ponteira Superior", category: "pieza", priceUsd: 0.07, unit: "pza", minQty: 500, colorId: null, desc: "Regat\u00f3n superior del pupitre" },
  { id: "ponteira-pino", name: "Ponteira con Pino", category: "pieza", priceUsd: 0.05, unit: "pza", minQty: 500, colorId: null, desc: "Regat\u00f3n con pino de la silla" },
  { id: "sapata-frontal", name: "Sapata Frontal", category: "pieza", priceUsd: 0.33, unit: "pza", minQty: 200, colorId: null, desc: "Zapata anterior del pupitre" },
  { id: "sapata-post", name: "Sapata Posterior", category: "pieza", priceUsd: 0.18, unit: "pza", minQty: 200, colorId: null, desc: "Zapata posterior del pupitre" },
  { id: "tampo", name: "Tampo con Travessa", category: "pieza", priceUsd: 10.93, unit: "pza", minQty: 40, colorId: null, desc: "Tapa de mesa con travesa\u00f1o PP texturizado" },
]
 
type CartItem = { uid: string; product: Product; qty: number; color: string }
type Currency = "PYG" | "USD" | "BRL"
 
function convert(usd: number, c: Currency, r: typeof DEFAULT_RATES): number {
  if (c === "PYG") return usd * r.USD_PYG; if (c === "BRL") return usd * r.USD_BRL; return usd
}
function fmt(usd: number, c: Currency, r: typeof DEFAULT_RATES): string {
  const v = convert(usd, c, r)
  if (c === "PYG") return "\u20b2 " + Math.round(v).toLocaleString("es-PY")
  if (c === "BRL") return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return "$ " + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function disc(qty: number): number {
  if (qty >= 5000) return 15; if (qty >= 2000) return 10; if (qty >= 1000) return 7; if (qty >= 500) return 5; if (qty >= 200) return 3; return 0
}
 
export default function CalculadoraPage() {
  const [cur, setCur] = useState<Currency>("PYG")
  const [rates, setRates] = useState(DEFAULT_RATES)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selCat, setSelCat] = useState<"" | "conjunto" | "pieza">("")
  const [selProd, setSelProd] = useState("")
  const [selColor, setSelColor] = useState("")
  const [selQty, setSelQty] = useState(100)
  const [iva, setIva] = useState(10)
  const [uid, setUid] = useState(1)
 
  const filtered = selCat ? CATALOG.filter(p => p.category === selCat) : CATALOG
  const cp = CATALOG.find(p => p.id === selProd)
  const fc = cp?.colorId
  const activeColor = fc || selColor
  const canAdd = cp && (fc || selColor || cp.colorId !== null)
 
  const addItem = () => {
    if (!cp) return
    const color = activeColor || "cinza"
    setCart(prev => [...prev, { uid: `i${uid}`, product: cp, qty: Math.max(cp.minQty, selQty), color }])
    setUid(n => n + 1); setSelProd(""); setSelColor(""); setSelQty(100)
  }
 
  const totals = useMemo(() => {
    let sub = 0
    const lines = cart.map(item => {
      const gross = item.product.priceUsd * item.qty
      const d = disc(item.qty); const net = gross * (1 - d / 100)
      sub += net; return { ...item, gross, d, net }
    })
    const iv = sub * (iva / 100); return { lines, sub, iv, total: sub + iv }
  }, [cart, iva])
 
  const colObj = (id: string) => COLORS.find(c => c.id === id)
 
  const S = { bg: "#060a13", sf: "#0c1221", sf2: "#111827", bd: "#1c2740", ac: "#10b981", t1: "#e2e8f0", t2: "#8892a8", t3: "#4a5568" }
 
  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.t1, fontFamily: "-apple-system, 'Segoe UI', sans-serif" }}>
      <header style={{ padding: "14px 16px", borderBottom: `1px solid ${S.bd}`, background: S.sf, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${S.ac}, #0ea5e9)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: S.bg }}>OP</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Ori<span style={{ color: S.ac }}>plast</span></div>
              <div style={{ fontSize: 10, color: S.t3, letterSpacing: 1.5, fontFamily: "monospace" }}>CALCULADORA B2B</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, background: S.sf2, padding: 3, borderRadius: 8 }}>
            {(["PYG", "USD", "BRL"] as Currency[]).map(c => (
              <button key={c} onClick={() => setCur(c)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: cur === c ? S.sf : "transparent", color: cur === c ? (c === "PYG" ? "#f472b6" : c === "USD" ? "#4ade80" : "#fbbf24") : S.t3, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "monospace", boxShadow: cur === c ? "0 2px 8px rgba(0,0,0,0.3)" : "none" }}>{c}</button>
            ))}
          </div>
        </div>
      </header>
 
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "16px" }}>
        {/* Rates */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "10px 14px", background: S.sf, borderRadius: 10, border: `1px solid ${S.bd}`, marginBottom: 16, fontSize: 12 }}>
          <span style={{ color: S.t3 }}>TC:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: S.t2 }}>1$=</span>
            <input type="number" value={rates.USD_PYG} onChange={e => setRates(r => ({ ...r, USD_PYG: +e.target.value || 0 }))} style={{ ...mi, width: 65 }} />
            <span style={{ color: "#f472b6", fontWeight: 600 }}>\u20b2</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: S.t2 }}>1$=</span>
            <input type="number" step="0.01" value={rates.USD_BRL} onChange={e => setRates(r => ({ ...r, USD_BRL: +e.target.value || 0 }))} style={{ ...mi, width: 55 }} />
            <span style={{ color: "#fbbf24", fontWeight: 600 }}>R$</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <span style={{ color: S.t2 }}>IVA:</span>
            <input type="number" value={iva} onChange={e => setIva(+e.target.value || 0)} style={{ ...mi, width: 40 }} />
            <span style={{ color: S.t2 }}>%</span>
          </div>
        </div>
 
        {/* Add Product */}
        <div style={{ padding: 16, background: S.sf, borderRadius: 12, border: `1px solid ${S.bd}`, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: S.ac }}>+ Agregar producto</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {([{ v: "" as const, l: "Todos" }, { v: "conjunto" as const, l: "\ud83d\udce6 Conjuntos" }, { v: "pieza" as const, l: "\ud83d\udd27 Piezas" }]).map(t => (
              <button key={t.v} onClick={() => { setSelCat(t.v); setSelProd("") }} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${selCat === t.v ? S.ac + "66" : S.bd}`, background: selCat === t.v ? S.ac + "15" : "transparent", color: selCat === t.v ? S.ac : S.t2, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{t.l}</button>
            ))}
          </div>
          <select value={selProd} onChange={e => { setSelProd(e.target.value); setSelColor("") }} style={{ ...ii, background: S.sf2, marginBottom: 12 }}>
            <option value="">Seleccionar producto...</option>
            {filtered.map(p => (<option key={p.id} value={p.id}>{p.category === "conjunto" ? "\ud83d\udce6" : "\ud83d\udd27"} {p.name} \u2014 {fmt(p.priceUsd, cur, rates)}/{p.unit}</option>))}
          </select>
 
          {cp && (
            <>
              <div style={{ fontSize: 12, color: S.t2, marginBottom: 12, padding: "8px 10px", background: S.sf2, borderRadius: 8 }}>
                {cp.desc}
                <span style={{ display: "block", marginTop: 4, color: S.t3, fontSize: 11 }}>M\u00ednimo: {cp.minQty} {cp.unit}</span>
              </div>
 
              {/* Color */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: S.t3, marginBottom: 6, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>Color</div>
                {fc ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: colObj(fc)?.hex, border: `2px solid ${S.ac}`, boxShadow: `0 0 0 2px ${S.ac}44` }} />
                    <span style={{ fontSize: 13 }}>{colObj(fc)?.name}</span>
                    <span style={{ fontSize: 11, color: S.t3 }}>(fijo)</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {COLORS.map(c => (
                      <button key={c.id} onClick={() => setSelColor(c.id)} style={{ width: 36, height: 36, borderRadius: 8, background: c.hex, border: `2px solid ${selColor === c.id ? S.ac : "transparent"}`, boxShadow: selColor === c.id ? `0 0 0 2px ${S.ac}66` : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>{selColor === c.id ? "\u2713" : ""}</button>
                    ))}
                    {selColor && <span style={{ fontSize: 12, color: S.ac, alignSelf: "center" }}>{colObj(selColor)?.name}</span>}
                  </div>
                )}
              </div>
 
              {/* Qty + Preview + Add */}
              <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 100px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: S.t3, marginBottom: 6, fontFamily: "monospace" }}>CANTIDAD</div>
                  <input type="number" value={selQty} min={1} onChange={e => setSelQty(+e.target.value || 1)} style={{ ...ii, background: S.sf2 }} />
                </div>
                <div style={{ flex: "1 1 100px", textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: S.t3, marginBottom: 4 }}>Estimado</div>
                  <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: S.ac }}>{fmt(cp.priceUsd * Math.max(cp.minQty, selQty), cur, rates)}</div>
                  {disc(selQty) > 0 && <div style={{ fontSize: 11, color: "#4ade80" }}>-{disc(selQty)}% volumen</div>}
                </div>
                <button onClick={addItem} disabled={!canAdd} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: canAdd ? S.ac : S.bd, color: canAdd ? S.bg : S.t3, fontWeight: 700, fontSize: 14, cursor: canAdd ? "pointer" : "default", height: 42 }}>+ Agregar</button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {[{ q: 200, d: 3 }, { q: 500, d: 5 }, { q: 1000, d: 7 }, { q: 2000, d: 10 }, { q: 5000, d: 15 }].map(t => (
                  <span key={t.q} style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontFamily: "monospace", background: selQty >= t.q ? S.ac + "18" : S.sf2, color: selQty >= t.q ? S.ac : S.t3, border: `1px solid ${selQty >= t.q ? S.ac + "44" : S.bd}` }}>+{t.q}: -{t.d}%</span>
                ))}
              </div>
            </>
          )}
        </div>
 
        {/* Cart */}
        <div style={{ background: S.sf, borderRadius: 12, border: `1px solid ${S.bd}`, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${S.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>\ud83d\udccb Pedido ({cart.length})</span>
            {cart.length > 0 && <button onClick={() => setCart([])} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ef444444", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer" }}>Limpiar</button>}
          </div>
 
          {cart.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center", color: S.t3 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>\ud83d\udce6</div>
              <div style={{ fontSize: 13 }}>Agreg\u00e1 productos para cotizar</div>
            </div>
          ) : (
            <div>
              {totals.lines.map(item => {
                const col = colObj(item.color)
                return (
                  <div key={item.uid} style={{ padding: "12px 16px", borderBottom: `1px solid ${S.bd}`, display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: col?.hex || S.t3 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: S.t2 }}>{fmt(item.product.priceUsd, cur, rates)} \u00d7 {item.qty}{item.d > 0 && <span style={{ color: "#4ade80", marginLeft: 4 }}>(-{item.d}%)</span>}</div>
                    </div>
                    <div style={{ display: "flex", border: `1px solid ${S.bd}`, borderRadius: 6, overflow: "hidden" }}>
                      <button onClick={() => setCart(c => c.map(i => i.uid === item.uid ? { ...i, qty: Math.max(1, i.qty - 10) } : i))} style={qb}>\u2212</button>
                      <input type="number" value={item.qty} onChange={e => setCart(c => c.map(i => i.uid === item.uid ? { ...i, qty: Math.max(1, +e.target.value || 1) } : i))} style={{ width: 48, height: 30, border: "none", background: S.sf2, color: S.t1, textAlign: "center", fontFamily: "monospace", fontSize: 12 }} />
                      <button onClick={() => setCart(c => c.map(i => i.uid === item.uid ? { ...i, qty: i.qty + 10 } : i))} style={qb}>+</button>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 85 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: S.ac }}>{fmt(item.net, cur, rates)}</div>
                      {cur !== "USD" && <div style={{ fontFamily: "monospace", fontSize: 10, color: S.t3 }}>{fmt(item.net, "USD", rates)}</div>}
                    </div>
                    <button onClick={() => setCart(c => c.filter(i => i.uid !== item.uid))} style={{ width: 24, height: 24, borderRadius: 4, border: "none", background: "transparent", color: S.t3, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>\u2715</button>
                  </div>
                )
              })}
 
              {/* Totals */}
              <div style={{ padding: 16, background: S.sf2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: S.t2 }}>Subtotal</span>
                  <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600 }}>{fmt(totals.sub, cur, rates)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: S.t2 }}>IVA ({iva}%)</span>
                  <span style={{ fontFamily: "monospace", fontSize: 14 }}>{fmt(totals.iv, cur, rates)}</span>
                </div>
                <div style={{ borderTop: `1px solid ${S.bd}`, paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>TOTAL</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 800, color: S.ac }}>{fmt(totals.total, cur, rates)}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: S.t2, marginTop: 2 }}>
                        {cur !== "PYG" && <span style={{ marginRight: 8 }}>{fmt(totals.total, "PYG", rates)}</span>}
                        {cur !== "USD" && <span style={{ marginRight: 8 }}>{fmt(totals.total, "USD", rates)}</span>}
                        {cur !== "BRL" && <span>{fmt(totals.total, "BRL", rates)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
 
        {/* Conditions */}
        <div style={{ marginTop: 16, padding: 14, background: S.sf, borderRadius: 10, border: `1px solid ${S.bd}`, fontSize: 11, color: S.t3, lineHeight: 1.8 }}>
          <div style={{ fontWeight: 600, color: S.t2, marginBottom: 4 }}>Condiciones:</div>
          <div>1. Pago: 100% antes de entrega</div>
          <div>2. Precio: FCA (puesto en f\u00e1brica)</div>
          <div>3. Plazo: 60 d\u00edas despu\u00e9s del anticipo</div>
          <div>4. Tolerancia: \u00b15% en cantidad</div>
          <div style={{ marginTop: 8 }}>TC: 1 USD = \u20b2 {rates.USD_PYG.toLocaleString()} | 1 USD = R$ {rates.USD_BRL}</div>
        </div>
      </main>
    </div>
  )
}
 
const mi: React.CSSProperties = { padding: "3px 6px", background: "#0b0f19", border: "1px solid #1c2740", borderRadius: 5, color: "#e2e8f0", fontFamily: "monospace", fontSize: 12, textAlign: "center" }
const ii: React.CSSProperties = { width: "100%", padding: "10px 12px", background: "#111827", border: "1px solid #1c2740", borderRadius: 8, color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }
const qb: React.CSSProperties = { width: 30, height: 30, border: "none", background: "#1c2740", color: "#8892a8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }
