const SUPABASE_URL = 'https://ndysyydnaxtkwjikicoc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keXN5eWRuYXh0a3dqaWtpY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNTQsImV4cCI6MjA2NzE1NjI1NH0.9LN1walCptD8bJkULcFjL2arqc4Ih-Rf3CRTJJ7_eyg';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tables = ['network','station','location','channel','data','image','cdwp_image','cdwp_location'];
const pageSize = 50;


async function fetchTable(tableName, page = 0) {
  const start = page * pageSize;
  const end = start + pageSize - 1;
  return await client.from(tableName).select('*').range(start, end);
}


async function renderTable(tableName, page = 0) {
  const container = document.getElementById(`table-${tableName}`);
  container.innerHTML = '';
  const { data, error } = await fetchTable(tableName, page);

  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    container.innerHTML = `<p style="color:red;">Error loading ${tableName}: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<p>No data found for this table.</p>`;
    return;
  }


  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  Object.keys(data[0]).forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);


  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach(val => {
      const td = document.createElement('td');
      td.textContent = val ?? 'NULL';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);


  const nav = document.createElement('div');
  nav.style.marginTop = '10px';
  const prev = document.createElement('button');
  prev.textContent = 'Previous';
  prev.disabled = page === 0;
  prev.onclick = () => renderTable(tableName, page - 1);
  const next = document.createElement('button');
  next.textContent = 'Next';
  next.disabled = data.length < pageSize;
  next.onclick = () => renderTable(tableName, page + 1);
  nav.appendChild(prev);
  nav.appendChild(next);
  container.appendChild(nav);
}

// Render all tables in separate containers
async function fetchAllTables() {
  const container = document.getElementById('tablesContainer');
  container.innerHTML = '';
  for (const tableName of tables) {
    const section = document.createElement('div');
    section.classList.add('table-container'); // ✅ matches form card style

    const title = document.createElement('h2');
    title.textContent = `Table: ${tableName}`;
    section.appendChild(title);

    const inner = document.createElement('div');
    inner.id = `table-${tableName}`;
    inner.textContent = 'Loading...';
    section.appendChild(inner);

    container.appendChild(section);
    renderTable(tableName, 0);
  }
}

document.addEventListener('DOMContentLoaded', fetchAllTables);
