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

      document.getElementById('resolution').addEventListener('change', () => {
        document.getElementById('custom_resolution').style.display =
          document.getElementById('resolution').value === 'other' ? 'block' : 'none';
      });
      document.getElementById('recording_type').addEventListener('change', () => {
        document.getElementById('custom_recording_type').style.display =
          document.getElementById('recording_type').value === 'other' ? 'block' : 'none';
      });

        document.getElementById('sensor').addEventListener('change', () => {
        document.getElementById('custom_sensor').style.display =
        document.getElementById('sensor').value === 'other' ? 'block' : 'none';
         });
        document.getElementById('SubmitAll').addEventListener('click', async (e) => {
        e.preventDefault();
      

const fieldsToValidate = [
  // ─── NETWORK ───
  { id: 'network_code', type: 'string', required: true, label: 'FDSN Network Code' },
  { id: 'custom_network_code', type: 'string', required: false, label: 'Custom Network Code' },
  { id: 'network_name', type: 'string', required: false, label: 'Network Name' },
  { id: 'custom_network_name', type: 'string', required: false, label: 'Custom Network Name' },

  // ─── STATION ───
  { id: 'station_code', type: 'string', required: true, label: 'Station Code' },
  { id: 'site_name', type: 'string', required: true, label: 'Site Name' },
  { id: 'longitude', type: 'number', required: true, label: 'Longitude' },
  { id: 'latitude', type: 'number', required: true, label: 'Latitude' },
  { id: 'elevation', type: 'number', required: false, label: 'Elevation' },
  { id: 'depth', type: 'number', required: false, label: 'Depth' },
  { id: 'open_date', type: 'date', required: false, label: 'Open Date' },
  { id: 'close_date', type: 'date', required: false, label: 'Close Date' },

  // ─── IMAGE ───
  { id: 'date_scanned', type: 'date', required: false, label: 'Date Scanned' },
  { id: 'resolution', type: 'number', required: true, label: 'Resolution' },
  { id: 'custom_resolution', type: 'number', required: false, label: 'Custom Resolution' },
  { id: 'length', type: 'number', required: false, label: 'Image Length' },
  { id: 'width', type: 'number', required: false, label: 'Image Width' },
  { id: 'phase_markings', type: 'boolean', required: false, label: 'Phase Markings' },
  { id: 'bulletin', type: 'string', required: false, label: 'Bulletin' },
  { id: 'occlusions', type: 'boolean', required: false, label: 'Occlusions' },
  { id: 'recording_type', type: 'string', required: true, label: 'Recording Type' },
  { id: 'custom_recording_type', type: 'string', required: false, label: 'Custom Recording Type' },
  { id: 'notes', type: 'string', required: false, label: 'Notes' },
  { id: 'owner_contact', type: 'string', required: false, label: 'Owner Contact' },
  { id: 'signal', type: 'boolean', required: false, label: 'Signal Present' },
  { id: 'timemark', type: 'date', required: false, label: 'Timemark' },

  // ─── SENSOR ───
  { id: 'sensor', type: 'string', required: true, label: 'Sensor' },
  { id: 'custom_sensor', type: 'string', required: false, label: 'Custom Sensor' },
  { id: 'sensor_nature', type: 'string', required: false, label: 'Sensor Nature' },
  { id: 'free_period', type: 'number', required: true, label: 'Galvo Free Period' },
  { id: 'damping', type: 'number', required: true, label: 'Galvo Damping' },

  // ─── EQUIPMENT ───
  { id: 'channel', type: 'string', required: true, label: 'Channel' },
  { id: 'equip_open_date', type: 'date', required: false, label: 'Equipment Open Date' },
  { id: 'h_dip1', type: 'number', required: true, label: 'Horizontal 1 Dip/Azimuth' },
  { id: 'h_dip2', type: 'number', required: true, label: 'Horizontal 2 Dip/Azimuth' },
  { id: 'v_dip', type: 'number', required: true, label: 'Vertical Dip/Azimuth' },
  { id: 'recording_system', type: 'string', required: true, label: 'Recording System' },
  { id: 'recording_serial_number', type: 'number', required: false, label: 'Recording Serial Number' },
  { id: 'equip_gain', type: 'number', required: false, label: 'Equipment Gain' },
  { id: 'period_of_gain', type: 'number', required: false, label: 'Period of Gain' },
  { id: 'equip_nature', type: 'string', required: false, label: 'Equipment Nature' },
  { id: 'sensor_serial_number', type: 'number', required: true, label: 'Sensor Serial Number' }
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
    case 'date':
      isValid = !isNaN(Date.parse(raw));
      break;
    case 'boolean':
      isValid = ['true', 'false'].includes(raw.toLowerCase());
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


// PARSE RESOLUTION EITHER FOR 361 AND CUSTOM VALUES
let resolutionRaw = document.getElementById('resolution').value;
let resolutionValue;
if (resolutionRaw === '361 (WWSSN)') {
  resolutionValue = 361;
} else if (resolutionRaw === 'other') {
  resolutionValue = parseInt(document.getElementById('custom_resolution').value);
} else {
  resolutionValue = parseInt(resolutionRaw);
}

// PARSE RECORDING TYPE (CUSTOM OR SELECTED)
let recordingRaw = document.getElementById('recording_type').value;
let recordingType = (recordingRaw === 'other')
  ? document.getElementById('custom_recording_type').value.trim()
  : recordingRaw;

// PARSE SENSOR TYPE (CUSTOM OR SELECTED)
let sensorRaw = document.getElementById('sensor').value;
let sensorValue = (sensorRaw === 'other')
  ? document.getElementById('custom_sensor').value.trim()
  : sensorRaw;

        
// Convert dropdowns to booleans or null
const phaseMarkingsRaw = document.getElementById('phase_markings').value;
let phaseMarkings = phaseMarkingsRaw === "True" ? true : phaseMarkingsRaw === "False" ? false : null;

const occlusionsRaw = document.getElementById('occlusions').value;
let occlusions = occlusionsRaw === "True" ? true : occlusionsRaw === "False" ? false : null;

const signalRaw = document.getElementById('signal').value;
let signal = signalRaw === "True" ? true : signalRaw === "False" ? false : null;

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
  site_name: document.getElementById('site_name').value.trim(),
  longitude: parseFloat(document.getElementById('longitude').value),
  latitude: parseFloat(document.getElementById('latitude').value),
  elevation: parseInt(document.getElementById('elevation').value) || null,
  depth: parseInt(document.getElementById('depth').value) || null,
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

        // Insert into image table
        const { error: imageError } = await client.from('image').insert([{
          date_scanned: document.getElementById('date_scanned').value || null,
          resolution: resolutionValue,
          length: parseFloat(document.getElementById('length').value),
          width: parseFloat(document.getElementById('width').value),
          phase_markings: phaseMarkings,
          bulletin: document.getElementById('bulletin').value,
          occlusions: occlusions,
          recording_type: recordingType,
          notes: document.getElementById('notes').value,
          owner_contact: document.getElementById('owner_contact').value,
          signal: signal,
          timemark: document.getElementById('timemark').value || null
        }]);
        if (imageError) {
          resultBox.textContent = 'Error inserting image: ' + imageError.message;
          return;
        }


        
            // Insert into sensor table

          console.log("Inserting sensor:", {
  sensor: sensorValue,
  sensor_nature: document.getElementById('sensor_nature').value,
  free_period: parseFloat(document.getElementById('free_period').value),
  damping: parseInt(document.getElementById('damping').value)
});


let sensorInsertSkipped = false;

// Try inserting the sensor row
const { error: sensorError } = await client.from('sensor').insert([{
  sensor: sensorValue,
  sensor_nature: document.getElementById('sensor_nature').value,
  free_period: parseFloat(document.getElementById('free_period').value),
  damping: parseInt(document.getElementById('damping').value)
}]);

// ⚠️ Handle sensor error only after the insert attempt
if (sensorError) {
  const msg = sensorError.message.toLowerCase();

  // If it's a duplicate/unique constraint error, skip and log
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Sensor is in database.");
    sensorInsertSkipped = true;
  } else {
    // For any other error, stop execution
    resultBox.textContent = 'Error inserting sensor: ' + sensorError.message;
    return;
  }
}




let equipmentInsertSkipped = false;

const { error: equipError } = await client.from('equipment').insert([{
  channel: document.getElementById('channel').value,
  equip_open_date: document.getElementById('equip_open_date').value || null,
  h_dip1: parseFloat(document.getElementById('h_dip1').value),
  h_dip2: parseFloat(document.getElementById('h_dip2').value),
  v_dip: parseFloat(document.getElementById('v_dip').value),
  recording_system: document.getElementById('recording_system').value,
  recording_serial_number: parseInt(document.getElementById('recording_serial_number').value),
  equip_gain: parseInt(document.getElementById('equip_gain').value),
  period_of_gain: parseFloat(document.getElementById('period_of_gain').value),
  equip_nature: document.getElementById('equip_nature').value,
  sensor_serial_number: parseInt(document.getElementById('sensor_serial_number').value),
  sensor: sensorValue
}]);

if (equipError) {
  const msg = equipError.message.toLowerCase();

  // If it's a duplicate/unique constraint error, skip and log
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Equipment is in database.");
    equipmentInsertSkipped = true;
  } else {
    // For any other error, stop execution
    resultBox.textContent = 'Error inserting equipment: ' + equipError.message;
    return;
  }
}      

alert('✅ Submission complete!');

resultBox.textContent = 'Success! Your record has been added to the database.'

// Save some of the last inputs for default next time
const formData = {
  // ---- NETWORK TABLE ----
  network_code: document.getElementById("network_code").value,
  custom_network_code: document.getElementById("custom_network_code").value,
  network_name: document.getElementById("network_name").value,
  custom_network_name: document.getElementById("custom_network_name").value,
  //---- STATION TABLE ----
  station_code: document.getElementById("station_code").value,
  custom_station_code: document.getElementById("custom_station_code").value,
  site_name: document.getElementById("site_name").value,
  longitude: document.getElementById("longitude").value,
  latitude: document.getElementById("latitude").value,
  elevation: document.getElementById("elevation").value,
  depth: document.getElementById("depth").value,
  open_date: document.getElementById("open_date").value,
  close_date: document.getElementById("close_date").value,

  date_scanned: document.getElementById("date_scanned").value,
  resolution: document.getElementById("resolution").value,
  custom_resolution: document.getElementById("custom_resolution").value,
  length: document.getElementById("length").value,
  width: document.getElementById("width").value,
  phase_markings: document.getElementById("phase_markings").value,
  bulletin: document.getElementById("bulletin").value,
  occlusions: document.getElementById("occlusions").value,
  recording_type: document.getElementById("recording_type").value,
  custom_recording_type: document.getElementById("custom_recording_type").value,
  notes: document.getElementById("notes").value,
  owner_contact: document.getElementById("owner_contact").value,
  signal: document.getElementById("signal").value,
  timemark: document.getElementById("timemark").value,
  sensor: document.getElementById("sensor").value,
  custom_sensor: document.getElementById("custom_sensor").value,
  free_period: document.getElementById("free_period").value,
  damping: document.getElementById("damping").value,
  channel: document.getElementById("channel").value,
  h_dip1: document.getElementById("h_dip1").value,
  h_dip2: document.getElementById("h_dip2").value,
  v_dip: document.getElementById("v_dip").value,
  recording_system: document.getElementById("recording_system").value
};

localStorage.setItem("lastSeismogramSubmission", JSON.stringify(formData));
sessionStorage.setItem("shouldAutofill", "true"); // Triggers one-time autofill on reload
location.reload();

      });
    });

