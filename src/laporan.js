import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import Chart from 'chart.js/auto'
import { supabase } from './supabaseClient.js'

// Halaman ini AMAN dipublikasikan — publik cuma bisa baca (SELECT), tidak bisa mengubah apa pun.

const tabsEl = document.getElementById('range-tabs')
const loadingEl = document.getElementById('loading')
const contentEl = document.getElementById('content')
const statOrdersEl = document.getElementById('stat-orders')
const statTotalEl = document.getElementById('stat-total')
const emptyMsgEl = document.getElementById('empty-msg')
const chartCanvas = document.getElementById('best-seller-chart')

let chartInstance = null
let currentRange = 'day'

function getRangeStart(rangeKey) {
  const now = new Date()
  if (rangeKey === 'day') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (rangeKey === 'week') {
    const day = now.getDay() === 0 ? 7 : now.getDay() // Senin = awal minggu
    const start = new Date(now)
    start.setDate(now.getDate() - (day - 1))
    start.setHours(0, 0, 0, 0)
    return start
  }
  return new Date(now.getFullYear(), now.getMonth(), 1) // month
}

async function loadData(rangeKey) {
  loadingEl.classList.remove('d-none')
  contentEl.classList.add('d-none')

  const start = getRangeStart(rangeKey).toISOString()

  const { data: orders, error: ordersErr } = await supabase
    .from('orders')
    .select('id, total')
    .gte('created_at', start)

  if (ordersErr) {
    loadingEl.textContent = 'Gagal memuat data: ' + ordersErr.message
    return
  }

  const orderIds = (orders || []).map((o) => o.id)
  let items = []
  if (orderIds.length > 0) {
    const { data } = await supabase
      .from('order_items')
      .select('menu_name, qty')
      .in('order_id', orderIds)
    items = data || []
  }

  renderStats(orders || [])
  renderChart(items)

  loadingEl.classList.add('d-none')
  contentEl.classList.remove('d-none')
}

function renderStats(orders) {
  statOrdersEl.textContent = orders.length
  const total = orders.reduce((sum, o) => sum + o.total, 0)
  statTotalEl.textContent = `Rp${total.toLocaleString('id-ID')}`
}

function renderChart(items) {
  const map = {}
  items.forEach((item) => {
    map[item.menu_name] = (map[item.menu_name] || 0) + item.qty
  })
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)

  if (sorted.length === 0) {
    emptyMsgEl.classList.remove('d-none')
    chartCanvas.classList.add('d-none')
    if (chartInstance) chartInstance.destroy()
    return
  }

  emptyMsgEl.classList.add('d-none')
  chartCanvas.classList.remove('d-none')

  const labels = sorted.map(([name]) => name)
  const values = sorted.map(([, qty]) => qty)

  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Terjual', data: values, backgroundColor: '#111111' }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { precision: 0 } } },
    },
  })
}

tabsEl.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentRange = btn.dataset.range
    tabsEl.querySelectorAll('button').forEach((b) => {
      b.classList.remove('btn-dark')
      b.classList.add('btn-outline-dark')
    })
    btn.classList.remove('btn-outline-dark')
    btn.classList.add('btn-dark')
    loadData(currentRange)
  })
})

loadData(currentRange)
