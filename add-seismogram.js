// Wait until the DOM is fully loaded before executing any code

    document.addEventListener('DOMContentLoaded', () => {
      const SUPABASE_URL = 'https://ndysyydnaxtkwjikicoc.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keXN5eWRuYXh0a3dqaWtpY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNTQsImV4cCI6MjA2NzE1NjI1NH0.9LN1walCptD8bJkULcFjL2arqc4Ih-Rf3CRTJJ7_eyg';
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const resultBox = document.getElementById('Result');  // element to display error message

      async function loadNetworkCodes() {
    const { data, error } = await client.from('network').select('network_code');
    if (error) {
      console.error('Error loading networks:', error.message);
      return;
    }
    const dropdown = document.getElementById('network_code');
    data.forEach(row => {
      const opt = document.createElement('option');
      opt.value = row.network_code;
      opt.textContent = row.network_code;
      dropdown.insertBefore(opt, dropdown.lastElementChild);
    });
  }

  async function loadNetworkNames() {
    const { data, error } = await client.from('network').select('network_name');
    if (error) {
      console.error('Error loading network names:', error.message);
      return;
    }
    const dropdown = document.getElementById('network_name');
    data.forEach(row => {
      const opt = document.createElement('option');
      opt.value = row.network_name;
      opt.textContent = row.network_name;
      dropdown.insertBefore(opt, dropdown.lastElementChild);
    });
  }

  async function loadStationCodes() {
    const { data, error } = await client.from('station').select('station_code');
    if (error) {
      console.error('Error loading stations:', error.message);
      return;
    }
    const dropdown = document.getElementById('station_code');
    data.forEach(row => {
      const opt = document.createElement('option');
      opt.value = row.station_code;
      opt.textContent = row.station_code;
      dropdown.insertBefore(opt, dropdown.lastElementChild);
    });
  }

  // ✅ 2. CALL LOADERS IMMEDIATELY
  loadNetworkCodes();
  loadNetworkNames();
  loadStationCodes();
  
        // Autofill form ONLY IF just submitted

      const savedData = JSON.parse(localStorage.getItem("lastSeismogramSubmission"));
      const shouldAutofill = sessionStorage.getItem("shouldAutofill") === "true";

      if (savedData && shouldAutofill) {
      for (const key in savedData) {
      const el = document.getElementById(key);
      if (el) {
        el.value = savedData[key];

        // Show the custom fields if "other" was selected
        if (key === 'resolution' && savedData[key] === 'other') {
          document.getElementById("custom_resolution").style.display = "block";
        }
        if (key === 'recording_type' && savedData[key] === 'other') {
          document.getElementById("custom_recording_type").style.display = "block";
        }
        if (key === 'sensor' && savedData[key] === 'other') {
          document.getElementById("custom_sensor").style.display = "block";
        }
      }
    }

  ['resolution', 'recording_type', 'sensor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event('change'));
  });

  ['network_code', 'network_name', 'station_code'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.dispatchEvent(new Event('change'));
});


    // Don't autofill again on refresh
  sessionStorage.removeItem("shouldAutofill");
}
  

// SHOW CUSTOM FIELDS WHEN "OTHER" OPTION IS TOGGLED ------------------------------
// NETWORK:
document.getElementById('network_code').addEventListener('change', () => {
  document.getElementById('custom_network_code').style.display =
    document.getElementById('network_code').value === 'other' ? 'block' : 'none';
});

document.getElementById('network_name').addEventListener('change', () => {
  document.getElementById('custom_network_name').style.display =
    document.getElementById('network_name').value === 'other' ? 'block' : 'none';
});
// STATION:
document.getElementById('station_code').addEventListener('change', () => {
  document.getElementById('custom_station_code').style.display =
    document.getElementById('station_code').value === 'other' ? 'block' : 'none';
});
// LOCATION:
document.getElementById('sensor').addEventListener('change', () => {
  document.getElementById('custom_sensor').style.display =
    document.getElementById('sensor').value === 'other' ? 'block' : 'none';
});
// CHANNEL:
document.getElementById('recording_nature').addEventListener('change', () => {
  document.getElementById('custom_recording_nature').style.display =
    document.getElementById('recording_nature').value === 'other' ? 'block' : 'none';
});
// DATA:
document.getElementById('physical_location').addEventListener('change', () => {
  document.getElementById('custom_physical_location').style.display =
    document.getElementById('physical_location').value === 'other' ? 'block' : 'none';
});
// IMAGE: 
document.getElementById('resolution').addEventListener('change', () => {
  document.getElementById('custom_resolution').style.display =
     document.getElementById('resolution').value === 'other' ? 'block' : 'none';
});
document.getElementById('recording_type').addEventListener('change', () => {
 document.getElementById('custom_recording_type').style.display =
    document.getElementById('recording_type').value === 'other' ? 'block' : 'none';
      });
document.getElementById('format').addEventListener('change', () => {
 document.getElementById('custom_format').style.display =
    document.getElementById('format').value === 'other' ? 'block' : 'none';
      });

document.getElementById('SubmitAll').addEventListener('click', async (e) => {e.preventDefault();
      

const fieldsToValidate = [
  // ─── NETWORK ───

  // note: we need to add custom codes for drop-down vals
  // match label with GUI
  { id: 'network_code', type: 'string', required: true, label: 'FDSN Network Code' },
  { id: 'custom_network_code', type: 'string', required: false, label: 'Custom Network Code' },
  { id: 'network_name', type: 'string', required: false, label: 'Network Name' },
  { id: 'custom_network_name', type: 'string', required: false, label: 'Custom Network Name' },

  // ─── STATION ───
  { id: 'station_code', type: 'string', required: true, label: 'Station Code' },
  { id: 'custom_station_code', type: 'string', required: false, label: 'Custom Station Code' },
  { id: 'site_name', type: 'string', required: true, label: 'Site Name' },
  { id: 'longitude', type: 'number', required: true, label: 'Longitude' },
  { id: 'latitude', type: 'number', required: true, label: 'Latitude' },
  { id: 'elevation', type: 'number', required: false, label: 'Elevation' },
  { id: 'open_date', type: 'date', required: false, label: 'Open Date' },
  { id: 'close_date', type: 'date', required: false, label: 'Close Date' },

  // ─── LOCATION ───
  { id: 'location_code', type: 'string', required: true, label: 'Location Code' },
  { id: 'sensor', type: 'string', required: true, label: 'Sensor' },
  { id: 'custom_sensor', type: 'string', required: false, label: 'Custom Sensor' },
  { id: 'sensor_nature', type: 'string', required: false, label: 'Sensor Nature' },
  { id: 'depth', type: 'number', required: false, label: 'Depth' },
  { id: 'install_date', type: 'date', required: false, label: 'Install Date' },

  // ─── CHANNEL ───
  { id: 'channel_name', type: 'string', required: true, label: 'Channel Name' },
  { id: 'free_period', type: 'number', required: true, label: 'Free Period' },
  { id: 'damping', type: 'number', required: true, label: 'Damping' },
  { id: 'sensor_serial_number', type: 'number', required: true, label: 'Sensor Serial Number' },
  { id: 'dip', type: 'number', required: true, label: 'Dip' },
  { id: 'azimuth', type: 'number', required: true, label: 'Azimuth' },
  { id: 'recording_serial_number', type: 'number', required: false, label: 'Recording Serial Number' },
  { id: 'period_of_gain', type: 'number', required: false, label: 'Period of Gain' },
  { id: 'recording_nature', type: 'string', required: false, label: 'Recording Nature' },
  { id: 'custom_recording_nature', type: 'string', required: false, label: 'Custom Recording Nature' },
  { id: 'R', type: 'number', required: false, label: 'R' },
  { id: 'r', type: 'number', required: false, label: 'r' },
  { id: 'a', type: 'number', required: false, label: 'a' },
  { id: 'b', type: 'number', required: false, label: 'b' },
  { id: 'd', type: 'number', required: false, label: 'd' },
  { id: 'FDSN_time_series', type: 'number', required: false, label: 'FDSN_time_series' },


  // ─── DATA ───
  { id: 'physical_location', type: 'string', required: true, label: 'Physical Location' },
  { id: 'custom_physical_location', type: 'string', required: false, label: 'Custom Physical Location' },
  { id: 'polarity', type: 'text', required: false, label: 'Polarity' },
  { id: 'start_time', type: 'date', required: true, label: 'Start Date' },
  { id: 'end_time', type: 'date', required: true, label: 'End Date' },
  { id: 'time_correction', type: 'number', required: false, label: 'Time Correction' },
  { id: 'data_notes', type: 'text', required: false, label: 'Notes' },
  { id: 'source_of_info', type: 'text', required: false, label: 'Source of Information' },
  { id: 'data_creation', type: 'date', required: false, label: 'Date Creation' },

  // ─── IMAGE ───
  { id: 'date_scanned', type: 'date', required: false, label: 'Date Scanned' },
  { id: 'DOI', type: 'text', required: false, label: 'DOI' },
  { id: 'resolution', type: 'number', required: true, label: 'Resolution' },
  { id: 'custom_resolution', type: 'number', required: false, label: 'Custom Resolution' },
  { id: 'format', type: 'string', required: false, label: 'Format' },
  { id: 'custom_format', type: 'string', required: false, label: 'Custom Format' },
  { id: 'length', type: 'number', required: false, label: 'Image Length' },
  { id: 'width', type: 'number', required: false, label: 'Image Width' },
  { id: 'phase_markings', type: 'boolean', required: false, label: 'Phase Markings' },
  { id: 'bulletin', type: 'string', required: false, label: 'Bulletin' },
  { id: 'occlusions', type: 'boolean', required: false, label: 'Occlusions' },
  { id: 'recording_type', type: 'string', required: true, label: 'Recording Type' },
  { id: 'custom_recording_type', type: 'string', required: false, label: 'Custom Recording Type' },
  { id: 'signal', type: 'boolean', required: false, label: 'Signal Present' },
  { id: 'timemark', type: 'text', required: false, label: 'Timemark' },
  { id: 'notes', type: 'string', required: false, label: 'Notes' },
  { id: 'owner_contact', type: 'string', required: false, label: 'Owner Contact' },
  { id: 'location_record', type: 'text', required: false, label: 'Location Record' },
  { id: 'vectorized', type: 'boolean', required: true, label: 'Vectorized' },
  { id: 'recording_gain', type: 'number', required: false, label: 'Recording Gain' },

  // ─── CDWP_LOCATION ───
  { id: 'box_id', type: 'number', required: true, label: 'Box ID' },
  { id: 'start_date', type: 'date', required: false, label: 'Start Date' },
  { id: 'end_date', type: 'date', required: false, label: 'End Date' },
  { id: 'container', type: 'text', required: false, label: 'Container' },
  { id: 'stack', type: 'number', required: false, label: 'Stack' },
  { id: 'previous_no', type: 'number', required: false, label: 'Previous Number' },
  { id: 'exceptions', type: 'text', required: false, label: 'Exceptions' },
  { id: 'CDWP_location_notes', type: 'text', required: false, label: 'Notes' },

   // ─── CDWP_IMAGE ───
  { id: 'station_code_local', type: 'text', required: false, label: 'Local Station Code' },
  { id: 'start_time_correction', type: 'date', required: false, label: 'Start Time Correction' },
  { id: 'end_time_correction', type: 'date', required: false, label: 'End Time Correction' },
  { id: 'side', type: 'text', required: false, label: 'Side' },
  { id: 'instrument_name', type: 'text', required: false, label: 'Instrument Name' },
  { id: 'CDWP_location_gain', type: 'number', required: false, label: 'Gain' },
  { id: 't0', type: 'number', required: false, label: 'T0' },
  { id: 'tg', type: 'number', required: false, label: 'Tg' },
  { id: 'filename', type: 'text', required: false, label: 'Filename' },
  { id: 'CDWP_image_creator', type: 'text', required: false, label: 'Creator' },

];

for (let field of fieldsToValidate) {
  const el = document.getElementById(field.id);
  if (!el) continue;

  let raw = el.value?.trim();
  // Handle custom network code
if (field.id === 'network_code' && raw === 'other') {
  raw = document.getElementById('custom_network_code')?.value.trim() || '';
  if (!raw) {
    alert('Please enter a custom FDSN Network Code.');
    return;
  }
}
// Handle custom network name
if (field.id === 'network_name' && raw === 'other') {
  raw = document.getElementById('custom_network_name')?.value.trim() || '';
  if (!raw) {
    alert('Please enter a custom Network Name.');
    return;
  }
}

if (field.id === 'station_code' && raw === 'other') {
  raw = document.getElementById('custom_station_code')?.value.trim() || '';;
  if (!raw) {
    alert('Please enter a custom Station Code.');
    return;
  }
}

  // Handle custom dropdowns
  if (field.id === 'resolution' && raw === 'other') {
    raw = document.getElementById('custom_resolution').value.trim();
    if (!raw) {
      alert('Please enter a custom resolution.');
      return;
    }
  }
  if (field.id === 'recording_type' && raw === 'other') {
    raw = document.getElementById('custom_recording_type').value.trim();
    if (!raw) {
      alert('Please enter a custom recording type.');
      return;
    }
  }
  if (field.id === 'sensor' && raw === 'other') {
    raw = document.getElementById('custom_sensor').value.trim();
    if (!raw) {
      alert('Please enter a custom sensor.');
      return;
    }
  }

  // Required field check
  if (field.required && (!raw || raw === '')) {
    alert(`❌ ${field.label} is required.`);
    return;
  }

  // Allow empty optional fields
  if (!field.required && (!raw || raw === '')) continue;

  // Type validation
  let isValid = true;
  switch (field.type) {
    case 'number':
      isValid = !isNaN(parseFloat(raw));
      break;
    case 'string':
      isValid = typeof raw === 'string';
      break;
    case 'text':  // ✅ treat text same as string
    isValid = typeof raw === 'string';
    break;
    case 'date':
      isValid = !isNaN(Date.parse(raw));
      break;
    case 'boolean':
      isValid = raw === '' || raw === null || ['true', 'false'].includes(raw.toLowerCase());
      break;
    default:
      isValid = false;
  }

  if (!isValid) {
    alert(`❌ Invalid value for ${field.label}. Expected type: ${field.type}.`);
    return;
  }
}


// DROP DOWNS CODE ------------------------------------------------------------------- 
// IF SELECT OTHER; PARSE THE CUSTOM VALUE
// CHANNEL_NAME does not need an other value

// ---- NETWORK TABLE ----
let networkCodeRaw = document.getElementById('network_code').value;
let networkCode = (networkCodeRaw === 'other')
  ? document.getElementById('custom_network_code')?.value.trim() || ''
  : networkCodeRaw;

let networkNameRaw = document.getElementById('network_name').value;
let networkName = (networkNameRaw === 'other')
  ? document.getElementById('custom_network_name')?.value.trim() || ''
  : networkNameRaw;

// ---- STATION TABLE ----
let stationCodeRaw = document.getElementById('station_code').value;
let stationCode = (stationCodeRaw === 'other')
  ? document.getElementById('custom_station_code')?.value.trim() || ''
  : stationCodeRaw;

const siteName = `${document.getElementById("city").value}, ${document.getElementById("state").value}, ${document.getElementById("country").value}`;
const location_record = `${document.getElementById("image_room").value},${document.getElementById("image_institution").value},${document.getElementById("image_city").value}, ${document.getElementById("image_state").value}, ${document.getElementById("image_country").value}`;
// ---- LOCATION TABLE ----
let sensorRaw = document.getElementById('sensor').value;
let sensorCode = (sensorRaw === 'other')
  ? document.getElementById('custom_sensor')?.value.trim() || ''
  : sensorRaw;

// ---- CHANNEL TABLE ----
let recordingnatureRaw = document.getElementById('recording_nature').value;
let recordingnatureCode = (recordingnatureRaw === 'other')
  ? document.getElementById('custom_recording_nature')?.value.trim() || ''
  : recordingnatureRaw;

// ---- DATA TABLE ----
let physicallocationRaw = document.getElementById('physical_location').value;
let physicallocationCode = (physicallocationRaw === 'other')
  ? document.getElementById('custom_physical_location')?.value.trim() || ''
  : physicallocationRaw;

// ---- IMAGE TABLE ----
//  Resolution: For 400 or custom values
let resolutionRaw = document.getElementById('resolution').value;
let resolutionValue;
if (resolutionRaw === '400 (WWSSN)') {
  resolutionValue = 400;
} else if (resolutionRaw === 'other') {
  resolutionValue = parseInt(document.getElementById('custom_resolution').value);
} else {
  resolutionValue = parseInt(resolutionRaw);
}

let recordingRaw = document.getElementById('recording_type').value;
let recordingType = (recordingRaw === 'other')
  ? document.getElementById('custom_recording_type').value.trim()
  : recordingRaw;

let formatRaw = document.getElementById('format').value;
let formatCode = (formatRaw === 'other')
  ? document.getElementById('custom_format')?.value.trim() || ''
  : formatRaw;

// FOR UNREQUIRED FIELDS
// Convert dropdowns to null/unknown for fields that are not required

// ---- IMAGE TABLE ----
const phaseMarkingsRaw = document.getElementById('phase_markings').value;
let phaseMarkings = phaseMarkingsRaw === "True" ? true : phaseMarkingsRaw === "False" ? false : null;

const occlusionsRaw = document.getElementById('occlusions').value;
let occlusions = occlusionsRaw === "True" ? true : occlusionsRaw === "False" ? false : null;

const signalRaw = document.getElementById('signal').value;
let signal = signalRaw === "True" ? true : signalRaw === "False" ? false : null;

const timemarkRaw = document.getElementById('timemark').value;
let timemark;

if (timemarkRaw === "Positive") {
  timemark = "positive";
} else if (timemarkRaw === "Negative") {
  timemark = "negative";
} else if (timemarkRaw === "Null") {
  timemark = "null";
} else {
  timemark = "unknown";
}


const vectorizedRaw = document.getElementById('vectorized').value;
let vectorized = null; // default to null

if (vectorizedRaw === "True") vectorized = true;
else if (vectorizedRaw === "False") vectorized = false;
else vectorized = null;

// ---- DATA TABLE ----

const polarityRaw = document.getElementById('polarity').value;
let polarity;

if (polarityRaw === "Up") {
  polarity = "up";
} else if (polarityRaw === "Down") {
  polarity = "down";
} else {
  polarity = "unknown";
}
if (!polarityRaw) {
  polarity = "unknown";
}

// ---- CDWP_image TABLE ----

const sideRaw = document.getElementById('side').value;
let side;

if (sideRaw === "0") {
  side = "0";
} else if (sideRaw === "1") {
  side = "1";
} else {
  side = "unknown";
}

// ───────── INSERTION ──────────
// note: need to follow database schema
// ─── INSERT NETWORK TABLE ───
let networkInsertSkipped = false;
const { error: networkError } = await client.from('network').insert([{
  network_code: networkCode,
  network_name: networkName
}]);

if (networkError) {
  const msg = networkError.message.toLowerCase();
  if (msg.includes('duplicate') || msg.includes('already exists')) {
    console.warn("Network already exists, skipping insert.");
    networkInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting network: ' + networkError.message;
    return;
  }
}

// ─── INSERT STATION STATION ───
let stationInsertSkipped = false;
const { error: stationError } = await client.from('station').insert([{
  network_code: networkCode,
  station_code: stationCode,
  site_name: siteName,
  longitude: parseFloat(document.getElementById('longitude').value),
  latitude: parseFloat(document.getElementById('latitude').value),
  elevation: parseInt(document.getElementById('elevation').value) || null,
  open_date: document.getElementById('open_date').value || null,
  close_date: document.getElementById('close_date').value || null
}]);

if (stationError) {
  const msg = stationError.message.toLowerCase();
  if (msg.includes('duplicate') || msg.includes('already exists')) {
    console.warn("Station already exists, skipping insert.");
    stationInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting station: ' + stationError.message;
    return;
  }
}

// ─── INSERT LOCATION TABLE ───
let locationInsertSkipped = false;

const { error: locationError } = await client.from('location').insert([{
  network_code: networkCode,
  station_code: stationCode,
  location_code: document.getElementById('location_code')?.value.trim(),
  sensor: sensorCode,
  sensor_nature: document.getElementById('sensor_nature')?.value.trim() || null,
  depth: parseInt(document.getElementById('depth').value) || null,
  install_date: document.getElementById('install_date')?.value || null
}]);

if (locationError) {
  const msg = locationError.message.toLowerCase();
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Location already exists, skipping insert.");
    locationInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting location: ' + locationError.message;
    return;
  }
}

// ─── INSERT CHANNEL TABLE ───
let channelInsertSkipped = false;

const { error: channelError } = await client.from('channel').insert([{
  network_code: networkCode,
  station_code: stationCode,
  location_code: document.getElementById('location_code')?.value.trim(),
  channel_name: document.getElementById('channel_name')?.value.trim(),
  free_period: parseFloat(document.getElementById('free_period')?.value),
  damping: parseInt(document.getElementById('damping')?.value),
  sensor_serial_number: parseInt(document.getElementById('sensor_serial_number')?.value),
  dip: parseFloat(document.getElementById('dip')?.value),
  azimuth: parseFloat(document.getElementById('azimuth')?.value),
  recording_serial_number: parseFloat(document.getElementById('recording_serial_number')?.value) || null,
  period_of_gain: parseFloat(document.getElementById('period_of_gain')?.value) || null,
  recording_nature: document.getElementById('recording_nature')?.value.trim() || null,
  paper_speed: parseFloat(document.getElementById('paper_speed')?.value) || null,
  R: parseFloat(document.getElementById('R')?.value) || null,
  r: parseFloat(document.getElementById('r')?.value) || null,
  a: parseFloat(document.getElementById('a')?.value) || null,
  b: parseFloat(document.getElementById('b')?.value) || null,
  d: parseFloat(document.getElementById('d')?.value) || null,
  FDSN_time_series: document.getElementById("FDSN_time_series").value
}]);

if (channelError) {
  const msg = channelError.message.toLowerCase();
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Channel already exists, skipping insert.");
    channelInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting channel: ' + channelError.message;
    return;
  }
}

// ─── INSERT DATA TABLE ───
let dataPid = null;
let dataInsertSkipped = false;

const { data: insertedData, error: dataError } = await client.from('data')
  .insert([{
    network_code: networkCode,
    station_code: stationCode,
    location_code: document.getElementById('location_code')?.value.trim(),
    channel_name: document.getElementById('channel_name')?.value.trim(),
    physical_location: physicallocationCode,
    polarity: polarity,
    start_time: document.getElementById('start_time')?.value.trim(),
    end_time: document.getElementById('end_time')?.value.trim(),
    time_correction: parseFloat(document.getElementById('time_correction')?.value) || null,
    data_notes: document.getElementById('data_notes')?.value.trim() || null,
    source_of_info: document.getElementById('source_of_info')?.value.trim() || null,
    date_creation: document.getElementById('date_creation')?.value.trim() || null,
  }])
  .select('pid')
  .single();

if (dataError) {
  const msg = dataError.message.toLowerCase();
  if (msg.includes('duplicate') || msg.includes('already exists') || msg.includes('violates unique constraint')) {
    console.warn("Data already exists, skipping insert.");
    dataInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting data: ' + dataError.message;
    return;
  }
} else {
  dataPid = insertedData?.pid || null;
}

// fetch PID from data table if we skipped the insert due to duplicate
if (dataInsertSkipped) {
  const { data: existingData } = await client.from('data')
    .select('pid')
    .eq('network_code', networkCode)
    .eq('station_code', stationCode)
    .eq('channel_name', document.getElementById('channel_name').value.trim())
    .single();

  dataPid = existingData?.pid || null;
}


// ─── INSERT IMAGE TABLE ───
let imageInsertSkipped = false;

const { error: imageError } = await client.from('image').insert([{
  pid: dataPid,
  date_scanned: document.getElementById('date_scanned')?.value || null,
  DOI: document.getElementById('DOI')?.value || null,
  resolution: resolutionValue,
  format: formatCode,
  length: parseFloat(document.getElementById('length')?.value) || null,
  width: parseFloat(document.getElementById('width')?.value) || null,
  phase_markings: phaseMarkings,
  bulletin: document.getElementById('bulletin')?.value.trim() || null,
  occlusions: occlusions,
  recording_type: recordingType,
  signal: signal,
  timemark: document.getElementById('timemark')?.value.trim() || null,
  notes: document.getElementById('notes')?.value.trim() || null,
  owner_contact: document.getElementById('owner_contact')?.value.trim() || null,
  recording_gain: parseInt(document.getElementById('recording_gain')?.value) || null,
  location_record: document.getElementById('location_record')?.value.trim(),
  vectorized: vectorized
}]);

if (imageError) {
  const msg = imageError.message.toLowerCase();
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Image already exists, skipping insert.");
    imageInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting image: ' + imageError.message;
    return;
  }
}

// ─── INSERT CDWP_LOCATION TABLE ───
let CDWP_locationInsertSkipped = false;
const { error: CDWP_locationError } = await client.from('CDWP_location').insert([{
box_id: document.getElementById("box_id").value,
start_date: document.getElementById("start_date")?.value || null,
end_date: document.getElementById("end_date")?.value || null,
container: document.getElementById("container")?.value || null,
stack: document.getElementById("stack")?.value || null,
previous_no: document.getElementById("previous_no")?.value || null,
exceptions: document.getElementById("exceptions")?.value || null,
CDWP_location_notes: document.getElementById("CDWP_location_notes")?.value || null,
}]);

if (CDWP_locationError) {
  const msg = CDWP_locationError.message.toLowerCase();
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("CDWP_Location already exists, skipping insert.");
    CDWP_locationInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting CDWP_Location: ' + CDWP_locationError.message;
    return;
  }
}

// ─── INSERT CDWP_IMAGE TABLE ───
let CDWP_imageInsertSkipped = false;
const { error: CDWP_imageError } = await client.from('CDWP_image').insert([{
station_code_local: document.getElementById("station_code_local").value,
start_time_correction: document.getElementById("start_time_correction").value,
end_time_correction: document.getElementById("end_time_correction").value,
side: document.getElementById("side").value,
instrument_name: document.getElementById("instrument_name").value,
CDWP_location_gain: document.getElementById("CDWP_location_gain").value,
t0: document.getElementById("t0").value,
tg: document.getElementById("tg").value,
filename: document.getElementById("filename").value,
CDWP_image_creator: document.getElementById("CDWP_image_creator").value,
}]);

if (CDWP_imageError) {
  const msg = CDWP_imageError.message.toLowerCase();
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("CDWP_Image already exists, skipping insert.");
    CDWP_imageInsertSkipped = true;
  } else {
    resultBox.textContent = 'Error inserting CDWP_Image: ' + CDWP_imageError.message;
    return;
  }
}

if (!networkError && !stationError && !locationError && !channelError && !dataError && !imageError && !CDWP_locationError && !CDWP_imageError) {
    alert('✅ Submission complete!!!');
    resultBox.textContent = 'Success! Your record has been added to the database.';



// Save some of the last inputs for default next time
const formData = {
  // ---- NETWORK TABLE ----

  //note: must add for custom drop-down values
  network_code: document.getElementById("network_code").value,
  custom_network_code: document.getElementById("custom_network_code").value,
  network_name: document.getElementById("network_name").value,
  custom_network_name: document.getElementById("custom_network_name").value,
  //---- STATION TABLE ----
  station_code: document.getElementById("station_code").value,
  custom_station_code: document.getElementById("custom_station_code").value,
  site_name: siteName,
  longitude: document.getElementById("longitude").value,
  latitude: document.getElementById("latitude").value,
  elevation: document.getElementById("elevation").value,
  open_date: document.getElementById("open_date").value,
  close_date: document.getElementById("close_date").value,
  // ---- LOCATION TABLE ----
  location_code: document.getElementById("location_code").value,
  sensor: document.getElementById("sensor").value,
  custom_sensor: document.getElementById("custom_sensor").value,
  sensor_nature: document.getElementById("sensor_nature").value,
  depth: document.getElementById("depth").value,
  install_date: document.getElementById("install_date").value,
  // ---- CHANNEL TABLE ----
  channel_name: document.getElementById("channel_name").value,
  free_period: document.getElementById("free_period").value,
  damping: document.getElementById("damping").value,
  sensor_serial_number: document.getElementById("sensor_serial_number").value,
  dip: document.getElementById("dip").value,
  azimuth: document.getElementById("azimuth").value,
  recording_serial_number: document.getElementById("recording_serial_number").value,
  period_of_gain: document.getElementById("period_of_gain").value,
  recording_nature: document.getElementById("recording_nature").value,
  custom_recording_nature: document.getElementById("custom_recording_nature").value,
  paper_speed: document.getElementById("paper_speed").value,
  R: document.getElementById("R").value,
  r: document.getElementById("r").value,
  a: document.getElementById("a").value,
  b: document.getElementById("b").value,
  d: document.getElementById("d").value,
  FDSN_time_series: document.getElementById("FDSN_time_series").value,
  // ---- DATA TABLE ----
  physical_location: document.getElementById("physical_location").value,
  polarity: document.getElementById("polarity").value,
  start_time: document.getElementById("start_time").value,
  end_time: document.getElementById("end_time").value,
  time_correction: document.getElementById("time_correction").value,
  data_notes: document.getElementById("data_notes").value,
  source_of_info: document.getElementById("source_of_info").value,
  data_creation: document.getElementById("data_creation").value,
  // ---- IMAGE TABLE ----
  date_scanned: document.getElementById("date_scanned").value,
  DOI: document.getElementById("DOI").value,
  resolution: document.getElementById("resolution").value,
  custom_resolution: document.getElementById("custom_resolution").value,
  location_record: document.getElementById("location_record").value,
  format: document.getElementById("format").value,
  custom_format: document.getElementById("custom_format").value,
  length: document.getElementById("length").value,
  width: document.getElementById("width").value,
  phase_markings: document.getElementById("phase_markings").value,
  vectorized: document.getElementById("vectorized").value,
  bulletin: document.getElementById("bulletin").value,
  occlusions: document.getElementById("occlusions").value,
  recording_type: document.getElementById("recording_type").value,
  recording_gain: document.getElementById("recording_gain").value,
  custom_recording_type: document.getElementById("custom_recording_type").value,
  signal: document.getElementById("signal").value,
  timemark: document.getElementById("timemark").value,
  notes: document.getElementById("notes").value,
  owner_contact: document.getElementById("owner_contact").value,
  // ---- CDWP_LOCATION TABLE ----
  box_id: document.getElementById("box_id").value,
  start_date: document.getElementById("start_date").value,
  end_date: document.getElementById("end_date").value,
  container: document.getElementById("container").value,
  stack: document.getElementById("stack").value,
  previous_no: document.getElementById("previous_no").value,
  exceptions: document.getElementById("exceptions").value,
  CDWP_location_notes: document.getElementById("CDWP_location_notes").value,
  // ---- CDWP_IMAGE TABLE ----
  station_code_local: document.getElementById("station_code_local").value,
  start_time_correction: document.getElementById("start_time_correction").value,
  end_time_correctio: document.getElementById("end_time_correction").value,
  side: document.getElementById("side").value,
  instrument_name: document.getElementById("instrument_name").value,
  CDWP_location_gain: document.getElementById("CDWP_location_gain").value,
  t0: document.getElementById("t0").value,
  tg: document.getElementById("tg").value,
  filename: document.getElementById("filename").value,
  CDWP_image_creator: document.getElementById("CDWP_image_creator").value,
};


localStorage.setItem("lastSeismogramSubmission", JSON.stringify(formData));
sessionStorage.setItem("shouldAutofill", "true"); // Triggers one-time autofill on reload
location.reload();

     } });
    });

