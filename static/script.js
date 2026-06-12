let cart = [];

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function addToCart(id, name, price, emoji) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, emoji, qty: 1 });
  }
  updateCart();
  const sidebar = document.getElementById('cartSidebar');
  if (!sidebar.classList.contains('open')) toggleCart();
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartCount = document.getElementById('cartCount');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFooter.style.display = 'none';
    cartItems.innerHTML = '<div id="cartEmpty" style="text-align:center;padding:2rem;"><p>🍽️ Cart is empty!</p></div>';
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'block';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById('cartSubtotal').textContent = '₹' + subtotal;
  document.getElementById('cartTotal').textContent = '₹' + (subtotal + 30);
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}

function filterMenu(category, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.food-card').forEach(card => {
    if (category === 'All' || card.dataset.category === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function openCheckout() {
  toggleCart();
  document.getElementById('modalOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function placeOrder() {
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;

  if (!name || !phone || !address) {
    alert('Please fill all fields!');
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  fetch('/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, address, items: cart, total: subtotal + 30 })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      closeCheckout();
      document.getElementById('orderId').textContent = data.order_id;
      document.getElementById('successOverlay').classList.add('open');
      cart = [];
      updateCart();
    }
  });
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('open');
}
