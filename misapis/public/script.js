// configuración
const API = '/api/pcgamers';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1616596870972-66cd87c9d1b5?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd';

// elementos (verificamos existencia)
const pcsContainer = document.getElementById('pcs');
const emptyState = document.getElementById('emptyState');
const form = document.getElementById('pcForm');
const alertBox = document.getElementById('formAlert');
const btnRefresh = document.getElementById('btnRefresh');
const btnClear = document.getElementById('btnClear');
const confirmBody = document.getElementById('confirmBody');
const confirmBtn = document.getElementById('confirmBtn');
const confirmModalEl = document.getElementById('confirmModal');
const modal = (confirmModalEl && typeof bootstrap !== 'undefined') ? new bootstrap.Modal(confirmModalEl) : null;

// utilidades
const safe = v => (v === undefined || v === null) ? '' : v;
const showAlert = (msg, type = 'success') => {
  if (!alertBox) return;
  alertBox.innerHTML = `<div class="alert alert-${type} alert-sm">${msg}</div>`;
  setTimeout(() => { if (alertBox) alertBox.innerHTML = '' }, 4000);
};
const safeReplaceClass = (el, removeClass, addClass) => {
  if (!el || !el.classList) return;
  if (removeClass) el.classList.remove(removeClass);
  if (addClass) el.classList.add(addClass);
};

const formToObject = () => {
  const extrasRaw = (document.getElementById('extras') && document.getElementById('extras').value) || '';
  return {
    marca: safe(document.getElementById('marca')?.value).trim(),
    modelo: safe(document.getElementById('modelo')?.value).trim(),
    cpu: safe(document.getElementById('cpu')?.value).trim(),
    gpu: safe(document.getElementById('gpu')?.value).trim(),
    ramGB: Number(document.getElementById('ramGB')?.value) || 0,
    almacenamiento: safe(document.getElementById('almacenamiento')?.value).trim(),
    precioUSD: Number(document.getElementById('precioUSD')?.value) || 0,
    disponible: true,
    extras: extrasRaw.split(',').map(s => s.trim()).filter(Boolean),
    imagen: (document.getElementById('imagen')?.value || '').trim() || DEFAULT_IMG
  };
};

const clearForm = () => {
  if (!form) return;
  form.reset();
  const pcId = document.getElementById('pcId');
  if (pcId) pcId.value = '';
  const btnSubmit = document.getElementById('btnSubmit');
  if (btnSubmit) btnSubmit.textContent = 'Guardar';
};

if (btnClear) btnClear.addEventListener('click', clearForm);

const createCardHTML = (pc) => {
  const id = pc._id || pc.id || '';
  const marca = safe(pc.marca);
  const modelo = safe(pc.modelo);
  const imagen = safe(pc.imagen) || DEFAULT_IMG;
  const precio = safe(pc.precioUSD);
  const ram = safe(pc.ramGB);
  const cpu = safe(pc.cpu);
  const gpu = safe(pc.gpu);
  // usamos data-attributes en lugar de inyección de funciones con comillas para mayor seguridad
  return `
    <div class="card text-dark pc-card shadow-sm">
      <img src="${imagen}" class="card-img-top pc-image" alt="${marca} ${modelo}" onerror="this.src='${DEFAULT_IMG}'">
      <div class="card-body">
        <h5 class="card-title mb-1">${marca} ${modelo}</h5>
        <p class="card-text small-muted mb-2">${cpu} · ${gpu}</p>
        <p class="mb-2"><strong>$${precio}</strong> · ${ram}GB RAM</p>
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-outline-primary btn-view" data-id="${id}">Ver</button>
          <div>
            <button class="btn btn-sm btn-secondary me-1 btn-edit" data-id="${id}">Editar</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${id}" data-title="${marca} ${modelo}">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
};

const renderPCs = (pcs) => {
  if (!pcsContainer) return;
  pcsContainer.innerHTML = '';
  if (!pcs || pcs.length === 0) {
    emptyState?.classList.remove('d-none');
    return;
  }
  emptyState?.classList.add('d-none');
  pcs.forEach(pc => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = createCardHTML(pc);
    pcsContainer.appendChild(col);
  });

  // Delegación de eventos para botones dentro de las tarjetas
  pcsContainer.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      if (id) viewPc(id);
    });
  });
  pcsContainer.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      if (id) editPc(id);
    });
  });
  pcsContainer.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const title = e.currentTarget.dataset.title || '';
      if (id) confirmDelete(id, title);
    });
  });
};

async function fetchAll() {
  try {
    const res = await fetch(API);
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? '- '+text : ''}`);
    }
    const data = await res.json().catch(() => null);
    let list = [];
    if (!data) list = [];
    else if (Array.isArray(data)) list = data;
    else list = data.pcs || data.ejemplos || data.items || data.list || [];
    renderPCs(list);
  } catch (err) {
    console.error(err);
    showAlert('Error al cargar catálogo', 'danger');
  }
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pcId')?.value || '';
    const obj = formToObject();
    try {
      let res;
      if (id) {
        res = await fetch(`${API}/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj)
        });
      } else {
        res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj)
        });
      }
      const data = await res.json().catch(()=>null);
      if (!res.ok) {
        const msg = data?.msg ? (Array.isArray(data.msg) ? data.msg.join(', ') : data.msg) : `Error ${res.status}`;
        showAlert(msg, 'danger');
        return;
      }
      clearForm();
      fetchAll();
      showAlert(id ? 'Pc actualizada' : 'Pc creada');
    } catch (err) {
      console.error(err);
      showAlert('Error al guardar', 'danger');
    }
  });
}

window.viewPc = async function (id) {
  try {
    const res = await fetch(`${API}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('No encontrado');
    const data = await res.json().catch(()=>null);
    // soporta {pc}, {ejemplo}, array, o el mismo objeto
    const pc = data?.pc || data?.ejemplo || (Array.isArray(data) ? data[0] : data) || {};
    confirmBody.innerHTML = `
      <div class="text-center">
        <img src="${safe(pc.imagen) || DEFAULT_IMG}" alt="pc" style="max-width:100%; max-height:220px; object-fit:cover; border-radius:8px" onerror="this.src='${DEFAULT_IMG}'">
        <h5 class="mt-3">${safe(pc.marca)} ${safe(pc.modelo)}</h5>
        <p class="small-muted">${safe(pc.cpu)} · ${safe(pc.gpu)}</p>
        <p><strong>$${safe(pc.precioUSD)}</strong> · ${safe(pc.ramGB)} GB</p>
        <p class="muted">Extras: ${(pc.extras || []).join(', ') || '—'}</p>
      </div>`;
    if (confirmBtn) {
      confirmBtn.textContent = 'Cerrar';
      safeReplaceClass(confirmBtn, 'btn-danger', 'btn-primary');
      confirmBtn.onclick = () => modal?.hide();
    }
    modal?.show();
  } catch (err) {
    console.error(err);
    showAlert('No se pudo obtener el Pc', 'danger');
  }
};

window.editPc = async function (id) {
  try {
    const res = await fetch(`${API}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('No encontrado');
    const data = await res.json().catch(()=>null);
    const pc = data?.pc || data?.ejemplo || (Array.isArray(data) ? data[0] : data) || {};
    document.getElementById('pcId').value = pc._id || pc.id || '';
    document.getElementById('marca').value = pc.marca || '';
    document.getElementById('modelo').value = pc.modelo || '';
    document.getElementById('cpu').value = pc.cpu || '';
    document.getElementById('gpu').value = pc.gpu || '';
    document.getElementById('ramGB').value = pc.ramGB || '';
    document.getElementById('almacenamiento').value = pc.almacenamiento || '';
    document.getElementById('precioUSD').value = pc.precioUSD || '';
    document.getElementById('imagen').value = pc.imagen || '';
    document.getElementById('extras').value = (pc.extras || []).join(',');
    document.getElementById('btnSubmit').textContent = 'Actualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    showAlert('No se pudo cargar el Pc para editar', 'danger');
  }
};

window.confirmDelete = function (id, title = '') {
  if (!confirmBody || !confirmBtn) {
    showAlert('Elemento de confirmación no disponible', 'danger');
    return;
  }
  confirmBody.innerHTML = `<p>¿Deseas eliminar <strong>${title}</strong>?</p>`;
  confirmBtn.textContent = 'Eliminar';
  safeReplaceClass(confirmBtn, 'btn-primary', 'btn-danger');
  confirmBtn.onclick = async () => {
    try {
      const res = await fetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json().catch(()=>null);
      if (!res.ok) {
        throw new Error(data?.msg || `Error ${res.status}`);
      }
      modal?.hide();
      fetchAll();
      showAlert('Pc eliminada');
    } catch (err) {
      console.error(err);
      modal?.hide();
      showAlert('No se pudo eliminar', 'danger');
    }
  };
  modal?.show();
};

if (btnRefresh) btnRefresh.addEventListener('click', fetchAll);
fetchAll();
