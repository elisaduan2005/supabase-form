// Wait until the DOM is fully loaded before executing any code

    document.addEventListener('DOMContentLoaded', () => {
      const SUPABASE_URL = 'https://ndysyydnaxtkwjikicoc.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keXN5eWRuYXh0a3dqaWtpY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODAyNTQsImV4cCI6MjA2NzE1NjI1NH0.9LN1walCptD8bJkULcFjL2arqc4Ih-Rf3CRTJJ7_eyg';
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const resultBox = document.getElementById('Result');  // element to display error message

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

  alert('Autofilled with last submission');

  ['resolution', 'recording_type', 'sensor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event('change'));
  });

    // 🔁 Don't autofill again on refresh
  sessionStorage.removeItem("shouldAutofill");
}
  


     // ADD OR HIDE CUSTOM FIELD
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
      

        // Validate all required fields before inserting anything
        const requiredFields = [
          { id: 'resolution', label: 'Resolution' },
          { id: 'recording_type', label: 'Recording Type' },
          { id: 'sensor', label: 'Sensor' },
          { id: 'free_period', label: 'Galvo Free Period' },
          { id: 'damping', label: 'Galvo Damping' },
          { id: 'channel', label: 'Channel' },
          { id: 'h_dip1', label: 'Horizontal 1 Dip/Azimuth' },
          { id: 'h_dip2', label: 'Horizontal 2 Dip/Azimuth' },
          { id: 'v_dip', label: 'Vertical Dip/Azimuth' },
          { id: 'recording_system', label: 'Recording System' }
        ];

        //Validate all required fields
        for (let field of requiredFields) {
          const el = document.getElementById(field.id);
if (!el) {
  alert(`Missing field in DOM: ${field.label} (id="${field.id}")`);
  return;
}
let value = el.value;

          

            //DROP DOWNS
          // If custom value is required for "other", get the input value
          if (field.id === 'resolution' && value === 'other') {
            value = document.getElementById('custom_resolution').value;
          }
          if (field.id === 'recording_type' && value === 'other') {
            value = document.getElementById('custom_recording_type').value;
          }
          if (field.id === 'sensor' && value === 'other') {
            value = document.getElementById('custom_sensor').value;
          }
        
          // If any required field is empty, show an alert and stop submission
          if (!value || value.trim() === '') {
            alert(`Please enter a value for ${field.label}.`);
            return;
          }
        }

//DROP DOWNS
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
          timemark: document.getElementById('timemark').value || null,
          sensor_serial_number: parseInt(document.getElementById('sensor_serial_number').value)
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
  sensor_serial_number: parseInt(document.getElementById('sensor_serial_number').value),
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
  sensor: sensorValue
}]);

// Handle Equip error only after the insert attempt
if (equipError) {
  const msg = equipError.message.toLowerCase();

  // If it's a duplicate/unique constraint error, skip and log
  if (
    msg.includes('duplicate') ||
    msg.includes('already exists') ||
    msg.includes('violates unique constraint')
  ) {
    console.warn("Equipment is in database.");
    sensorInsertSkipped = true;
  } else {
    // For any other error, stop execution
    resultBox.textContent = 'Error inserting equipent: ' + sensorError.message;
    return;
  }
}       alert('✅ Submission complete!');

        resultBox.textContent = 'Success! Your record has been added to the database.'

// ✅ Save some of the last inputs for default next time
const formData = {
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
  equip_serial_number: document.getElementById("equip_serial_number").value,
  h_dip1: document.getElementById("h_dip1").value,
  h_dip2: document.getElementById("h_dip2").value,
  v_dip: document.getElementById("v_dip").value,
  recording_system: document.getElementById("recording_system").value
};

localStorage.setItem("lastSeismogramSubmission", JSON.stringify(formData));
sessionStorage.setItem("shouldAutofill", "true"); // ✅ Triggers one-time autofill on reload
location.reload();

      });
    });

