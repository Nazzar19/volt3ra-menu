import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { supabase } from './supabaseClient.js'

// Halaman ini untuk kasir input pesanan yang baru masuk.
// Sementara BELUM dikunci login — jangan sebar link /admin-input.html dulu.

let menuItems = []
let cart = {} // { menu_item_id: qty }

const menuListEl = document.getElementById('menu-list')
const totalValueEl = document.getElementById('total-value')
const submitBtn = document.getElementById('submit-btn')
const messageEl = document.getElementById('message')

async function loadMenu() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('name')

  if (!error) {
    menuItems = data || []
    renderMenu()
  } else {
    menuListEl.innerHTML = `<div class="text-danger small">Gagal memuat menu: ${error.message}</div>`
  }
}

function renderMenu() {
  menuListEl.innerHTML = ''
  menuItems.forEach((item) => {
    const qty = cart[item.id] || 0
    const row = document.createElement('div')
    row.className = 'd-flex justify-content-between align-items-center border-bottom py-2'
    row.innerHTML = `
      <div>
        <div class="fw-semibold">${item.name}</div>
        <div class="text-secondary small">Rp${item.price.toLocaleString('id-ID')}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-outline-secondary btn-sm qty-minus" data-id="${item.id}">-</button>
        <span style="min-width:22px;text-align:center;">${qty}</span>
        <button type="button" class="btn btn-outline-secondary btn-sm qty-plus" data-id="${item.id}">+</button>
      </div>
    `
    menuListEl.appendChild(row)
  })

  menuListEl.querySelectorAll('.qty-plus').forEach((btn) =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 1))
  )
  menuListEl.querySelectorAll('.qty-minus').forEach((btn) =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1))
  )

  updateTotal()
}

function changeQty(id, delta) {
  const current = cart[id] || 0
  const updated = Math.max(0, current + delta)
  if (updated === 0) delete cart[id]
  else cart[id] = updated
  renderMenu()
}

function updateTotal() {
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id)
    return sum + item.price * qty
  }, 0)
  totalValueEl.textContent = `Rp${total.toLocaleString('id-ID')}`
  submitBtn.disabled = Object.keys(cart).length === 0
}

submitBtn.addEventListener('click', async () => {
  const cartLines = Object.entries(cart).map(([id, qty]) => {
    const item = menuItems.find((m) => m.id === id)
    return { ...item, qty }
  })
  if (cartLines.length === 0) return

  submitBtn.disabled = true
  submitBtn.textContent = 'Menyimpan...'
  messageEl.textContent = ''

  const total = cartLines.reduce((sum, l) => sum + l.price * l.qty, 0)

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ total })
    .select()
    .single()

  if (orderErr) {
    messageEl.textContent = 'Gagal simpan pesanan: ' + orderErr.message
    submitBtn.disabled = false
    submitBtn.textContent = 'Simpan Pesanan'
    return
  }

  const itemsPayload = cartLines.map((l) => ({
    order_id: order.id,
    menu_item_id: l.id,
    menu_name: l.name,
    price: l.price,
    qty: l.qty,
  }))

  const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload)

  if (itemsErr) {
    messageEl.textContent = 'Pesanan tersimpan tapi ada masalah simpan detail item: ' + itemsErr.message
  } else {
    messageEl.textContent = 'Pesanan berhasil disimpan ✔'
    cart = {}
    renderMenu()
  }

  submitBtn.textContent = 'Simpan Pesanan'
  updateTotal()
})

loadMenu()
