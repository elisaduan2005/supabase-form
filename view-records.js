
const SUPABASE_URL = 'https://ndysyydnaxtkwjikicoc.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keXN5eWRuYXh0a3dqaWtpY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNTQsImV4cCI6MjA2NzE1NjI1NH0.9LN1walCptD8bJkULcFjL2arqc4Ih-Rf3CRTJJ7_eyg';
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const tables = [
  'network',
  'station',
  'location',
  'channel',
  'data',
  'image',
  'cdwp_image',
  'cdwp_location'   
];

// fetch and render all tables
async function fetchAllTables() {
  const container = document.getElementById('tablesContainer');
  container.innerHTML = '';

  for (const tableName of tables) {

    const { data, error } = await client.from(tableName).select('*');
    if (error) {
      console.error(`Error loading ${tableName}:`, error.message);
      continue;
    }


    const section = document.createElement('div');
    section.style.marginBottom = '40px';


    const title = document.createElement('h2');
    title.textContent = `Table: ${tableName}`;
    section.appendChild(title);


    const table = document.createElement('table');
    table.border = '1';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';


    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    if (data.length > 0) {
      Object.keys(data[0]).forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        th.style.background = '#333';
        th.style.color = '#fff';
        th.style.padding = '5px';
        headerRow.appendChild(th);
      });
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);


    const tbody = document.createElement('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      Object.values(row).forEach(val => {
        const td = document.createElement('td');
        td.textContent = val ?? 'NULL';
        td.style.padding = '5px';
        td.style.border = '1px solid #ddd';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    section.appendChild(table);
    container.appendChild(section);
  }
}


fetchAllTables();
