
const SUPABASE_URL = "https://gyviuwlmfbgqnndwvcjx.supabase.co";

const SUPABASE_KEY = "sb_publishable_NR6GR_eiwvVG0rCwYut_6w_SclDaOOs";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentLang = "he";
let currentUser = null;
let currentAdminStatus = "new";

const defaultProducts = [
  {
    titleHe: "זר פרחים",
    titleAr: "باقة ورد",
    price: "₪120",
    descHe: "עדין, יפה ומתאים לכל אירוע.",
    descAr: "ناعمة وجميلة لكل مناسبة.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
  },
  {
    titleHe: "קופסת מתנה",
    titleAr: "بوكس هدية",
    price: "₪180",
    descHe: "עיצוב אישי לפי הצבעים שלך.",
    descAr: "تصميم حسب ألوانك وذوقك.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80"
  },
  {
    titleHe: "מתנה מיוחדת",
    titleAr: "هدية خاصة",
    price: "₪250",
    descHe: "ליום הולדת, אירוסין או הפתעה.",
    descAr: "لميلاد، خطوبة أو مفاجأة.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80"
  }
];

function getProducts() {
  const saved = JSON.parse(localStorage.getItem("bloomProducts") || "null");
  return saved || defaultProducts;
}

function saveProducts(products) {
  localStorage.setItem("bloomProducts", JSON.stringify(products));
}

function renderProducts() {
  const products = getProducts();
  const workGrid = document.getElementById("workGrid");
  const productRow = document.getElementById("productRow");

  if (!workGrid || !productRow) return;

  workGrid.innerHTML = "";
  productRow.innerHTML = "";

  products.forEach((p) => {
    const title = currentLang === "he" ? p.titleHe : p.titleAr;
    const desc = currentLang === "he" ? p.descHe : p.descAr;

    workGrid.innerHTML += `
      <div class="card reveal show">
        <img src="${p.image}" alt="${title}">
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>
    `;

    productRow.innerHTML += `
      <div class="product reveal show">
        <span>${p.price}</span>
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>
    `;
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = "rtl";

 document.querySelectorAll("[data-he]").forEach((el) => {

if(
el.id === "loginText"
&&
currentUser
){

return;

}

el.textContent =
currentLang === "he"
?
el.dataset.he
:
el.dataset.ar;

});

  document.querySelectorAll("[data-ph-he]").forEach((el) => {
    el.placeholder = currentLang === "he" ? el.dataset.phHe : el.dataset.phAr;
  });

  document.querySelectorAll("select option[data-he]").forEach((el) => {
    el.textContent = currentLang === "he" ? el.dataset.he : el.dataset.ar;
  });

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.textContent = currentLang === "he" ? "العربية" : "עברית";
  }

  renderProducts();
}

document.getElementById("langBtn")?.addEventListener("click", () => {
  currentLang = currentLang === "he" ? "ar" : "he";
  applyLanguage();
});

const authModal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");
const closeAuth = document.getElementById("closeAuth");

loginBtn?.addEventListener("click", () => {

if(currentUser){

if(
currentUser.role
===
"admin"
){

openAdminPage();

}

else{
openCustomerPage();

}

return;

}

authModal.classList.add(
"show"
);

});

closeAuth?.addEventListener("click", () => {
  authModal.classList.remove("show");
});

authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.classList.remove("show");
  }
});

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab?.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

signupTab?.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

signupForm?.addEventListener("submit", async (e)=>{

e.preventDefault();

const name =
document
.getElementById(
"signupName"
)
.value
.trim();

const email =
document
.getElementById(
"signupEmail"
)
.value
.trim();

const password =
document
.getElementById(
"signupPass"
)
.value;

const {
data,
error
}
=
await db.auth.signUp({

email,

password,

options:{

data:{
name:name
},

emailRedirectTo:
"https://bloomart2.netlify.app"

}

});

if(error){

alert(
error.message
);

return;

}

alert(

currentLang==="he"

?

"נשלח אימייל לאימות החשבון"

:

"تم إرسال إيميل لتفعيل الحساب"

);

authModal
.classList
.remove(
"show"
);

});

loginForm?.addEventListener("submit", async (e) => {

e.preventDefault();

const email =
document
.getElementById("loginUser")
.value
.trim();

const password =
document
.getElementById("loginPass")
.value;

const {
data,
error
}
=
await db.auth.signInWithPassword({

email,

password

});

if(error){

alert(

currentLang==="he"

?

"שם משתמש או סיסמה שגויים"

:

"الإيميل أو كلمة السر غلط"

);

return;

}

/* لازم يكون مفعل الايميل */

if(
!data.user.email_confirmed_at
){

alert(

currentLang==="he"

?

"יש לאשר את האימייל קודם"

:

"لازم تفعّل الإيميل أول"

);

await db.auth.signOut();

return;

}

/* جلب الاسم */

currentUser = {

name:
data.user.user_metadata?.name
||
data.user.email,

email:
data.user.email,

role:
data.user.email
===
"bloomart89@gmail.com"
?
"admin"
:
"client"

};

localStorage.setItem(

"loggedUser",

JSON.stringify(
currentUser
)

);

updateUserUI();

authModal.classList.remove(
"show"
);

if(
currentUser.role
===
"admin"
){

openAdminPage();

}
else{

openCustomerPage();

}

});



function openOrderPage() {
  document.getElementById("homePage")?.classList.add("hidden");
  document.getElementById("adminPage")?.classList.add("hidden");
  document.getElementById("orderPage")?.classList.remove("hidden");

  window.scrollTo(0, 0);
  applyLanguage();
}

async function openAdminPage() {
  const { data } = await db.auth.getSession();

  if (!data.session) {
    alert(currentLang === "he" ? "אין הרשאה" : "ما عندك صلاحية");
    openHome();
    return;
  }

  currentUser = {
    name: "Admin",
    role: "admin"
  };

  document.getElementById("homePage")?.classList.add("hidden");
  document.getElementById("orderPage")?.classList.add("hidden");
  document.getElementById("adminPage")?.classList.remove("hidden");

  await renderOrders();

  window.scrollTo(0, 0);
  applyLanguage();
}

function openHome() {
  document.getElementById("homePage")?.classList.remove("hidden");
  document.getElementById("orderPage")?.classList.add("hidden");
  document.getElementById("adminPage")?.classList.add("hidden");

  window.location.hash = "home";
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.querySelectorAll(".open-order").forEach((btn) => {
  btn.addEventListener("click", () => openOrderPage());
});

document.querySelectorAll(".backHome").forEach((btn) => {
  btn.addEventListener("click", openHome);
});

document.querySelector(".logout")?.addEventListener("click", async () => {
  await db.auth.signOut();
  currentUser = null;
  localStorage.removeItem(
"loggedUser"
);

  updateUserUI();
  openHome();
});

document.querySelector(".logo")?.addEventListener("click", (e) => {
  e.preventDefault();
  openHome();
});

document.querySelector('a[href="#home"]')?.addEventListener("click", (e) => {
  e.preventDefault();
  openHome();
});

const orderForm = document.getElementById("orderForm");

orderForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
if(
localStorage.getItem(
"ordersEnabled"
)==="false"
){

alert(
currentLang==="he"
?
"ההזמנות סגורות"
:
"الطلبات مغلقة حالياً"
);

return;

}

  const data = new FormData(orderForm);
const orderCode = "BA-" + Date.now().toString().slice(-6);

let imageUrl = "";

const imageFile = document.getElementById("orderImage")?.files[0];

if (imageFile) {
  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${orderCode}.${fileExt}`;

  const { error: uploadError } = await db.storage
    .from("order-images")
    .upload(fileName, imageFile);

  if (uploadError) {
    console.log(uploadError);
    alert("Image upload error");
    return;
  }

  const { data: imageData } = db.storage
    .from("order-images")
    .getPublicUrl(fileName);

  imageUrl = imageData.publicUrl;
}
const order = {
  order_code: orderCode,
  name: data.get("name"),
  phone: data.get("phone"),
  email: data.get("email"),
  type: data.get("type"),
  budget: data.get("budget"),
  delivery_date: data.get("delivery_date"),
  delivery_method: data.get("delivery_method"),
  address: data.get("address"),
  city: data.get("city"),
  delivery_time: data.get("delivery_time"),
  gift_addons: getSelectedAddons().join(", "),
  delivery_fee: getDeliveryFee(),
  estimated_total: getEstimatedTotal(),
  payment_method: data.get("payment_method"),
  details: data.get("details"),
  image_url: imageUrl,
  status: "new"
};

  const { error } = await db
.from("orders")
.insert([order]);

  if (error) {
    console.log(error);
    alert(currentLang === "he" ? "שגיאה בשליחת ההזמנה" : "صار خطأ بإرسال الطلب");
    return;
  }
try{

console.log("SENDING EMAIL FUNCTION...");

const emailResponse =
await fetch(
"https://gyviuwlmfbgqnndwvcjx.supabase.co/functions/v1/send-order-email",
{
method:"POST",

headers:{
"Content-Type":"application/json",

"Authorization":
`Bearer ${SUPABASE_KEY}`
},

body:JSON.stringify({

email:data.get("email"),

name:data.get("name"),

orderCode:orderCode,

lang:currentLang

})

}
);

console.log(
"EMAIL FUNCTION STATUS:",
emailResponse.status
);

const emailText =
await emailResponse.text();

console.log(
"EMAIL FUNCTION RESPONSE:",
emailText
);

}catch(err){

console.log(
"EMAIL FUNCTION ERROR:",
err
);

}

 orderForm.reset();

document.getElementById("successOrderCode").textContent =
orderCode;

document.getElementById("successModal").classList.remove("hidden");
});

let adminSearchText = "";
async function renderOrders() {
  const list = document.getElementById("ordersList");

  if (!list) return;

  list.innerHTML = currentLang === "he" ? "טוען..." : "جاري التحميل...";

  const { data, error } = await db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    list.innerHTML = currentLang === "he" ? "שגיאה בטעינת ההזמנות" : "صار خطأ بتحميل الطلبات";
    return;
  }

  const orders = data || [];
  const paidOrders =
orders.filter(o => o.final_price);

const totalRevenue =
paidOrders.reduce(
(sum,o)=>
sum + Number(o.final_price),
0
);

const avg =
paidOrders.length
?
Math.round(
totalRevenue /
paidOrders.length
)
:
0;

const max =
paidOrders.length
?
Math.max(
...paidOrders.map(
o=>
Number(o.final_price)
)
)
:
0;

document.getElementById(
"totalRevenue"
).textContent =
`₪${totalRevenue}`;

document.getElementById(
"ordersCount"
).textContent =
orders.length;

document.getElementById(
"avgOrder"
).textContent =
`₪${avg}`;

document.getElementById(
"maxOrder"
).textContent =
`₪${max}`;

  const newCount = document.getElementById("newCount");
  const preparingCount = document.getElementById("preparingCount");
  const readyCount = document.getElementById("readyCount");
  const doneCount = document.getElementById("doneCount");

  if (newCount) {
    newCount.textContent = orders.filter((o) => (o.status || "new") === "new").length;
  }

  if (preparingCount) {
    preparingCount.textContent = orders.filter((o) => o.status === "preparing").length;
  }

  if (readyCount) {
    readyCount.textContent = orders.filter((o) => o.status === "ready").length;
  }

  if (doneCount) {
    doneCount.textContent = orders.filter((o) => o.status === "done").length;
  }

  const filtered = orders.filter((o) => {
  const sameStatus = (o.status || "new") === currentAdminStatus;

  const searchText = adminSearchText.toLowerCase();

  const matchesSearch =
    !searchText ||
    (o.name || "").toLowerCase().includes(searchText) ||
    (o.phone || "").toLowerCase().includes(searchText) ||
    (o.order_code || "").toLowerCase().includes(searchText);

  return sameStatus && matchesSearch;
});

  if (!filtered.length) {
    list.innerHTML = currentLang === "he" ? "אין הזמנות כאן" : "لا توجد طلبات هنا";
    return;
  }

  list.innerHTML = filtered.map((o) => `
    <div class="order-item">
      <div class="order-top">
        <b>${o.name || ""}</b>
        <span class="status-badge">${getStatusText(o.status || "new")}</span>
      </div>

      <p><strong>📞</strong> ${o.phone || ""}</p>
      <p><strong>🎁</strong> ${o.type || ""}</p>
      <p><strong>₪</strong> ${o.budget || ""}</p>
      <p><strong>📍</strong> ${o.city || ""}</p>
      <p><strong>🚚</strong> ₪${o.delivery_fee || 0}</p>
      <p><strong>⏰</strong> ${o.delivery_time || ""}</p>
      <p><strong>🎁</strong> ${o.gift_addons || ""}</p>
      <p><strong>🧾</strong> ₪${o.estimated_total || 0}</p>
      <p><strong>📅</strong> ${o.delivery_date || ""}</p>
      <p><strong>🚚</strong> ${
  o.delivery_method === "delivery"
    ? (currentLang === "he" ? "משלוח" : "توصيل")
    : (currentLang === "he" ? "איסוף עצמי" : "استلام ذاتي")
}</p>

<p><strong>💳</strong> ${
  o.payment_method === "cash"
    ? (currentLang === "he" ? "מזומן" : "كاش")
    : o.payment_method === "card"
    ? (currentLang === "he" ? "כרטיס אשראי" : "كرت")
    : o.payment_method === "bit"
    ? "Bit"
    : o.payment_method === "bank_transfer"
    ? (currentLang === "he" ? "העברה בנקאית" : "تحويل بنكي")
    : ""
}</p>

${o.address ? `<p><strong>📍</strong> ${o.address}</p>` : ""}
      <p><strong>📝</strong> ${o.details || ""}</p>

${o.image_url ? `
  <img class="order-img" src="${o.image_url}" alt="Order image">
` : ""}

      <small>${o.created_at ? new Date(o.created_at).toLocaleString() : ""}</small>
<div class="final-price-box">

<div class="admin-note-box">
  <label>
    ${currentLang === "he" ? "הערת מנהל" : "ملاحظة داخلية"}
  </label>

  <textarea
    id="adminNote-${o.id}"
    placeholder="${currentLang === "he" ? "הערה שלא מופיעה ללקוח" : "ملاحظة لا تظهر للعميل"}">${o.admin_note || ""}</textarea>

  <button onclick="saveAdminNote(${o.id})">
    ${currentLang === "he" ? "שמירת הערה" : "حفظ الملاحظة"}
  </button>
</div>

  <label>
    ${currentLang === "he" ? "מחיר סופי" : "السعر النهائي"}
  </label>

  <input
    type="number"
    id="finalPrice-${o.id}"
    value="${o.final_price || ""}"
    placeholder="₪">

  <button onclick="saveFinalPrice(${o.id})">
    ${currentLang === "he" ? "שמירה" : "حفظ"}
  </button>

</div>


<div class="order-actions">

<button class="prepare-btn" onclick="updateOrderStatus(${o.id}, 'preparing')">
${currentLang === "he" ? "בהכנה" : "قيد التحضير"}
</button>

<button class="ready-btn" onclick="updateOrderStatus(${o.id}, 'ready')">
${currentLang === "he" ? "ההזמנה מוכנה" : "الطلب جاهز"}
</button>

<button class="done-btn" onclick="updateOrderStatus(${o.id}, 'done')">
${currentLang === "he" ? "נמסר" : "تم التسليم"}
</button>

<a
class="whatsapp-btn"
target="_blank"
href="${getWhatsAppLink(o)}">

WhatsApp

</a>

${o.final_price ? `
<a
class="invoice-whatsapp-btn"
target="_blank"
href="${getInvoiceWhatsAppLink(o)}">

📄
${currentLang==="he"
?
"שליחת חשבונית"
:
"إرسال الفاتورة"}

</a>
` : ""}

<button class="delete-btn" onclick="deleteOrder(${o.id})">

${currentLang === "he"
?
"מחיקה"
:
"حذف"}

</button>

</div>

</div>

`).join("");

}





function getStatusText(status) {
  const he = {
    new: "חדשה",
    preparing: "בהכנה",
    ready: "מוכנה",
    done: "נמסרה"
  };

  const ar = {
    new: "جديدة",
    preparing: "قيد التحضير",
    ready: "جاهزة",
    done: "تم التسليم"
  };

  return currentLang === "he" ? (he[status] || status) : (ar[status] || status);
}

function getWhatsAppLink(order) {
  let phone = (order.phone || "").replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "972" + phone.slice(1);
  }

  const status = order.status || "new";

  const messagesAr = {
    new: `مرحبا ${order.name || ""} 🌸
استلمنا طلبك في Bloom Art.
رقم الطلب: ${order.order_code}
سنراجع التفاصيل ونتواصل معك قريباً.`,

    preparing: `مرحبا ${order.name || ""} 🌸
طلبك قيد التحضير الآن.
رقم الطلب: ${order.order_code}`,

    ready: `مرحبا ${order.name || ""} 🎉
طلبك جاهز!
رقم الطلب: ${order.order_code}
يمكنك الاستلام أو انتظار التوصيل حسب الاتفاق.`,

    done: `مرحبا ${order.name || ""} 🌸
تم تسليم طلبك.
شكراً لاختيارك Bloom Art.`
  };

  const messagesHe = {
    new: `שלום ${order.name || ""} 🌸
קיבלנו את ההזמנה שלך ב-Bloom Art.
מספר הזמנה: ${order.order_code}
נבדוק את הפרטים וניצור קשר בקרוב.`,

    preparing: `שלום ${order.name || ""} 🌸
ההזמנה שלך נמצאת בהכנה.
מספר הזמנה: ${order.order_code}`,

    ready: `שלום ${order.name || ""} 🎉
ההזמנה שלך מוכנה!
מספר הזמנה: ${order.order_code}
אפשר לאסוף או להמתין למשלוח לפי הסיכום.`,

    done: `שלום ${order.name || ""} 🌸
ההזמנה נמסרה.
תודה שבחרת Bloom Art.`
  };

  const message =
    currentLang === "he"
      ? messagesHe[status]
      : messagesAr[status];

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
async function updateOrderStatus(id, status){

const order =
document
.querySelectorAll(".order-item");

const { data: orderData } =
await db
.from("orders")
.select("*")
.eq("id",id)
.single();

const { error } =
await db
.from("orders")
.update({
status:status
})
.eq(
"id",
id
);

if(error){

console.log(error);

alert("Error");

return;

}

try{

await fetch(
"https://gyviuwlmfbgqnndwvcjx.supabase.co/functions/v1/send-status-email",
{

method:"POST",

headers:{

"Content-Type":
"application/json",

"Authorization":
`Bearer ${SUPABASE_KEY}`

},

body:
JSON.stringify({

email:
orderData.email,

name:
orderData.name,

orderCode:
orderData.order_code,

status:
status,

lang:
currentLang,

finalPrice:
orderData.final_price,

paymentMethod:
orderData.payment_method

})

}

);

}
catch(err){

console.log(err);

}

renderOrders();

}

async function deleteOrder(id) {
  if (!confirm(currentLang === "he" ? "למחוק הזמנה?" : "حذف الطلب؟")) return;

  const { error } = await db
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Error");
    return;
  }

  renderOrders();
}

document.querySelectorAll(".admin-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentAdminStatus = btn.dataset.status || "new";
    renderOrders();
  });
});

const productForm = document.getElementById("productForm");

productForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(productForm);
  const title = data.get("title");

  const product = {
    titleHe: title,
    titleAr: title,
    price: data.get("price"),
    descHe: data.get("desc"),
    descAr: data.get("desc"),
    image: data.get("image")
  };

  const products = getProducts();

  products.unshift(product);
  saveProducts(products);

  productForm.reset();
  renderProducts();

  alert(currentLang === "he" ? "המוצר נוסף" : "تمت إضافة المنتج");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

renderProducts();
applyLanguage();

const rememberedUser =
JSON.parse(localStorage.getItem("loggedUser") || "null");

if (rememberedUser) {

currentUser =
rememberedUser;

updateUserUI();

if(
rememberedUser.role
===
"client"
){

openHome();

}

else if(
rememberedUser.role
===
"admin"
){

openAdminPage();

}

}

(async () => {
  const { data } = await db.auth.getSession();

  if (data.session) {
    currentUser = {
      name: "Admin",
      role: "admin"
    };

    openAdminPage();
  }
})();

function openTrackPage() {
  document.getElementById("homePage")?.classList.add("hidden");
  document.getElementById("orderPage")?.classList.add("hidden");
  document.getElementById("adminPage")?.classList.add("hidden");
  document.getElementById("trackPage")?.classList.remove("hidden");
  window.scrollTo(0, 0);
}

document.getElementById("trackBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  openTrackPage();
});

document.getElementById("trackForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = document.getElementById("trackCode").value.trim().toUpperCase();
  const result = document.getElementById("trackResult");

  result.innerHTML = currentLang === "he" ? "בודק..." : "جاري الفحص...";

  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("order_code", code)
    .single();

  if (error || !data) {
    result.innerHTML = currentLang === "he"
      ? "לא נמצאה הזמנה"
      : "لم يتم العثور على الطلب";
    return;
  }
const invoiceBtn =
document.getElementById(
"downloadInvoice"
);

if(data.final_price){

invoiceBtn.classList.remove(
"hidden"
);

invoiceBtn.onclick =
() =>
generateInvoice(data);

}

else{

invoiceBtn.classList.add(
"hidden"
);

}

result.innerHTML = `
  <div class="track-card">
    <h3>${data.order_code}</h3>
    <p>${data.name || ""}</p>
    <p>${data.type || ""}</p>

    ${data.final_price ? `
      <p class="track-price">
        ${currentLang === "he" ? "מחיר סופי:" : "السعر النهائي:"}
        <strong>₪${data.final_price}</strong>
      </p>

      <button
           class="invoice-btn"
            onclick='generateInvoice(${JSON.stringify(data).replace(/'/g,"&#39;")})'>
            ${currentLang === "he" ? "הורדת חשבונית" : "تحميل الفاتورة"}
        </button>

      <div class="payment-instructions">
        <h3>${currentLang === "he" ? "הוראות תשלום" : "تعليمات الدفع"}</h3>
        <p>
          ${currentLang === "he" ? "שיטת תשלום:" : "طريقة الدفع:"}
          <strong>${getPaymentText(data.payment_method)}</strong>
        </p>
        <p>
          ${currentLang === "he"
            ? "לאחר אישור ההזמנה ניצור קשר להשלמת התשלום"
            : "بعد تأكيد الطلب سنتواصل معك لإتمام الدفع"}
        </p>
      </div>
    ` : `
      <p class="track-price pending">
        ${currentLang === "he"
          ? "המחיר הסופי יישלח לאחר בדיקת הפרטים."
          : "السعر النهائي سيتم إرساله بعد مراجعة التفاصيل."}
      </p>
    `}

    <div class="track-steps">
      <div class="${["new","preparing","ready","done"].includes(data.status) ? "active" : ""}">
        ${currentLang === "he" ? "התקבל" : "تم الاستلام"}
      </div>
      <div class="${["preparing","ready","done"].includes(data.status) ? "active" : ""}">
        ${currentLang === "he" ? "בהכנה" : "قيد التحضير"}
      </div>
      <div class="${["ready","done"].includes(data.status) ? "active" : ""}">
        ${currentLang === "he" ? "מוכן" : "جاهز"}
      </div>
      <div class="${data.status === "done" ? "active" : ""}">
        ${currentLang === "he" ? "נמסר" : "تم التسليم"}
      </div>
    </div>
  </div>
`;
});

document.getElementById("closeSuccess")?.addEventListener("click", () => {
  document.getElementById("successModal").classList.add("hidden");
  openHome();
});

function showAdminNotification(order) {
  const note = document.createElement("div");

  note.className = "admin-notification";

  note.innerHTML = `
    🔔 ${currentLang === "he" ? "הזמנה חדשה" : "طلب جديد"}
    <br>
    <strong>${order.name || ""}</strong>
  `;

  document.body.appendChild(note);

  setTimeout(() => {
    note.remove();
  }, 5000);
}

db
  .channel("orders-realtime")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "orders"
    },
    (payload) => {
      showAdminNotification(payload.new);

      if (!document.getElementById("adminPage").classList.contains("hidden")) {
        renderOrders();
      }
    }
  )
  .subscribe();
  const deliveryMethod = document.getElementById("deliveryMethod");
const addressBox = document.getElementById("addressBox");
const addressInput = document.getElementById("addressInput");

deliveryMethod?.addEventListener("change", () => {
  if (deliveryMethod.value === "delivery") {
    addressBox.classList.remove("hidden");
    addressInput.required = true;
  } else {
    addressBox.classList.add("hidden");
    addressInput.required = false;
    addressInput.value = "";
  }
});
function getDeliveryFee() {
  const citySelect = document.getElementById("citySelect");
  const selected = citySelect?.options[citySelect.selectedIndex];
  return Number(selected?.dataset.fee || 0);
}

function getAddonsTotal() {
  let total = 0;

  document.querySelectorAll(".addon-check:checked").forEach((item) => {
    total += Number(item.dataset.price || 0);
  });

  return total;
}

function getSelectedAddons() {
  const addons = [];

  document.querySelectorAll(".addon-check:checked").forEach((item) => {
    addons.push(item.value);
  });

  return addons;
}

function getEstimatedTotal() {
  return getDeliveryFee() + getAddonsTotal();
}

function updateEstimate() {
  const deliveryFee = getDeliveryFee();
  const addonsTotal = getAddonsTotal();
  const estimatedTotal = deliveryFee + addonsTotal;

  document.getElementById("deliveryFeeText").textContent = `₪${deliveryFee}`;
  document.getElementById("addonsTotalText").textContent = `₪${addonsTotal}`;
  document.getElementById("estimatedTotalText").textContent = `₪${estimatedTotal}`;
}

document.getElementById("citySelect")?.addEventListener("change", updateEstimate);

document.querySelectorAll(".addon-check").forEach((box) => {
  box.addEventListener("change", updateEstimate);
});

updateEstimate();

async function saveFinalPrice(id) {
  const input = document.getElementById(`finalPrice-${id}`);
  const price = Number(input.value);

  if (!price || price <= 0) {
    alert(currentLang === "he" ? "הכניסו מחיר תקין" : "اكتب سعر صحيح");
    return;
  }

  const { error } = await db
    .from("orders")
    .update({
      final_price: price,
      price_sent: "yes"
    })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Error");
    return;
  }

  alert(currentLang === "he" ? "המחיר נשמר" : "تم حفظ السعر");
  renderOrders();
}
async function saveAdminNote(id) {
  const note = document.getElementById(`adminNote-${id}`).value;

  const { error } = await db
    .from("orders")
    .update({ admin_note: note })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Error");
    return;
  }

  alert(currentLang === "he" ? "ההערה נשמרה" : "تم حفظ الملاحظة");
}
function getPaymentText(method) {
  if (method === "cash") {
    return currentLang === "he"
      ? "מזומן - תשלום בקבלה"
      : "كاش - الدفع عند الاستلام";
  }

  if (method === "bit") {
    return currentLang === "he"
      ? "Bit - שלחו תשלום למספר 0515732005 וכתבו את מספר ההזמנה בהערה"
      : "Bit - أرسل الدفع إلى الرقم 0515732005 واكتب رقم الطلب بالملاحظة";
  }

  if (method === "bank_transfer") {
    return currentLang === "he"
      ? "העברה בנקאית - פרטי חשבון יישלחו אליכם לאחר אישור ההזמנה"
      : "تحويل بنكي - سيتم إرسال تفاصيل الحساب بعد تأكيد الطلب";
  }

  if (method === "card") {
    return currentLang === "he"
      ? "כרטיס אשראי - נשלח לכם קישור תשלום מאובטח בוואטסאפ"
      : "كرت - سنرسل لك رابط دفع آمن عبر واتساب";
  }

  return "";
}
function generateInvoice(order) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const pageW = pdf.internal.pageSize.getWidth();

  // Background
  pdf.setFillColor(250, 247, 244);
  pdf.rect(0, 0, pageW, 297, "F");

  // Header card
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(15, 15, 180, 45, 8, 8, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(30, 30, 30);
  pdf.text("Bloom Art", 25, 35);

  pdf.setFontSize(11);
  pdf.setTextColor(120, 100, 95);
  pdf.text("Handmade gifts & flowers", 25, 45);

  // Invoice badge
  pdf.setFillColor(34, 34, 34);
  pdf.roundedRect(142, 25, 40, 18, 9, 9, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text("INVOICE", 153, 37);

  // Info card
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(15, 75, 180, 105, 8, 8, "F");

  pdf.setTextColor(35, 35, 35);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Order Details", 25, 92);

  pdf.setDrawColor(235, 220, 215);
  pdf.line(25, 98, 185, 98);

  const typeText = String(order.type || "").replace(/[^\x00-\x7F]/g, "");
  const paymentText = String(getPaymentText(order.payment_method) || "").replace(/[^\x00-\x7F]/g, "");

  const rows = [
    ["Order Number", order.order_code || ""],
    ["Customer Name", order.name || ""],
    ["Gift Type", typeText || "Custom order"],
    ["Payment Method", paymentText || "Selected by customer"],
    ["Date", order.created_at ? new Date(order.created_at).toLocaleDateString() : new Date().toLocaleDateString()]
  ];

  let y = 115;

  rows.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(120, 100, 95);
    pdf.text(label, 25, y);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(35, 35, 35);
    pdf.text(String(value), 85, y);

    y += 14;
  });

  // Total card
  pdf.setFillColor(34, 34, 34);
  pdf.roundedRect(15, 195, 180, 38, 8, 8, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Total Amount", 25, 218);

  pdf.setFontSize(24);
  pdf.text(`${order.final_price || 0} ILS`, 135, 219);

  // Footer
  pdf.setTextColor(120, 100, 95);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("Thank you for choosing Bloom Art", 25, 260);
  pdf.text("For questions, contact us on WhatsApp", 25, 270);

  pdf.save(`invoice-${order.order_code}.pdf`);
}

function getInvoiceWhatsAppLink(order) {
  let phone = (order.phone || "").replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "972" + phone.slice(1);
  }

  const message = currentLang === "he"
    ? `שלום ${order.name || ""},
החשבונית להזמנה שלך מוכנה.

מספר הזמנה: ${order.order_code}
סוג הזמנה: ${order.type || ""}
מחיר סופי: ₪${order.final_price}
שיטת תשלום: ${getPaymentText(order.payment_method)}

תודה שבחרת Bloom Art 🌸`
    : `مرحبا ${order.name || ""},
فاتورة طلبك جاهزة.

رقم الطلب: ${order.order_code}
نوع الطلب: ${order.type || ""}
السعر النهائي: ₪${order.final_price}
طريقة الدفع: ${getPaymentText(order.payment_method)}

شكراً لاختيارك Bloom Art 🌸`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
document.getElementById("adminSearch")?.addEventListener("input", (e) => {
  adminSearchText = e.target.value.trim();
  renderOrders();
});
function updateOrdersToggle(){

const btn =
document.getElementById(
"toggleOrders"
);

if(!btn)return;

const enabled =
localStorage.getItem(
"ordersEnabled"
)!=="false";

btn.innerHTML=
enabled
?
"🟢 نستقبل طلبات"
:
"🔴 الطلبات مغلقة";

btn.classList.toggle(
"closed",
!enabled
);

}

document.getElementById(
"toggleOrders"
)?.addEventListener(
"click",
()=>{

const current=
localStorage.getItem(
"ordersEnabled"
)!=="false";

localStorage.setItem(
"ordersEnabled",
!current
);

updateOrdersToggle();

}
);

updateOrdersToggle();

function updateUserUI(){

const text =
document.getElementById(
"loginText"
);

if(!text)return;

if(currentUser){

text.textContent =
currentLang==="he"
?
`שלום ${currentUser.name}`
:
`مرحبا ${currentUser.name}`;

}

else{

text.textContent =
currentLang==="he"
?
"כניסה"
:
"دخول";

}
}
updateUserUI();
async function openCustomerPage(){

if(!currentUser){
authModal.classList.add("show");
return;
}

document.getElementById("homePage")?.classList.add("hidden");
document.getElementById("orderPage")?.classList.add("hidden");
document.getElementById("adminPage")?.classList.add("hidden");
document.getElementById("trackPage")?.classList.add("hidden");
document.getElementById("customerPage")?.classList.remove("hidden");

document.getElementById("customerWelcome").textContent =
currentLang==="he"
?
`שלום ${currentUser.name}`
:
`مرحبا ${currentUser.name}`;

const box = document.getElementById("customerOrders");
box.innerHTML = currentLang==="he" ? "טוען..." : "جاري التحميل...";

const { data, error } = await db
.from("orders")
.select("*")
.eq("email", currentUser.email)
.order("created_at", { ascending:false });

if(error){
box.innerHTML = "Error";
return;
}

if(!data.length){
box.innerHTML = currentLang==="he" ? "אין הזמנות" : "لا توجد طلبات";
return;
}

box.innerHTML = data.map(o=>`
<div class="order-item">
  <div class="order-top">
    <b>${o.order_code}</b>
    <span class="status-badge">${getStatusText(o.status || "new")}</span>
  </div>

  <p>🎁 ${o.type || ""}</p>
  <p>📅 ${o.delivery_date || ""}</p>
  <p>💳 ${getPaymentText(o.payment_method)}</p>

  ${o.final_price ? `
    <p><strong>₪${o.final_price}</strong></p>
    <button class="invoice-btn" onclick='generateInvoice(${JSON.stringify(o).replace(/'/g,"&#39;")})'>
      ${currentLang==="he" ? "הורדת חשבונית" : "تحميل الفاتورة"}
    </button>
  ` : ""}

</div>
`).join("");

}