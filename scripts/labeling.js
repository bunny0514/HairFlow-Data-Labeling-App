// function updateValue(slider) {
//     document.getElementById("val-" + slider.id).textContent = slider.value;
// }

// // Generate a random labeler ID if not set
// function generateLabelerId() {
//     if (!localStorage.getItem('labeler_id')) {
//     const randomId = 'anon_' + Math.random().toString(36).substring(2, 9);
//     localStorage.setItem('labeler_id', randomId);
//     }
//     return localStorage.getItem('labeler_id');
// }

// // Set default labeler ID on page load
// window.addEventListener('DOMContentLoaded', () => {
//     const labelerIdInput = document.getElementById('labeler_id');
//     if (!labelerIdInput.value) {
//     labelerIdInput.value = generateLabelerId();
//     }
// });

// document.getElementById('submit-btn').addEventListener('click', async (e) => {
//     e.preventDefault();
    
//     const submitBtn = document.getElementById('submit-btn');
//     const messageDiv = document.getElementById('submit-message');
    
//     // Disable submit button
//     submitBtn.disabled = true;
//     submitBtn.textContent = 'Submitting...';
//     messageDiv.style.display = 'none';

//     // Build the record according to the schema
//     const record = {
//     image_id: document.getElementById('image_id').value,
//     labeler_id: document.getElementById('labeler_id').value,
//     created_at: new Date().toISOString(),
//     round: parseInt(document.getElementById('round').value),
//     measurements: {
//         radius_cm: parseFloat(document.getElementById('q1').value),
//         wavelength_cm: parseFloat(document.getElementById('q3').value),
//         twist_frequency_score: parseInt(document.getElementById('q2').value),
//         porosity_score: parseInt(document.getElementById('q4').value),
//         thickness_score: parseInt(document.getElementById('q5').value)
//     },
//     flags: {
//         is_skipped: false,
//         comments: document.getElementById('comments').value || '',
//         review_status: 'pending'
//     }
//     };

//     try {
//     const response = await fetch('/api/labels', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(record)
//     });

//     const result = await response.json();

//     if (response.ok) {
//         messageDiv.style.display = 'block';
//         messageDiv.style.color = 'green';
//         messageDiv.textContent = '✓ Label submitted successfully!';
        
//         // Reset form (optional - you might want to keep values)
//         // document.getElementById('quiz-form').reset();
//     } else {
//         throw new Error(result.error || 'Failed to submit label');
//     }
//     } catch (error) {
//     messageDiv.style.display = 'block';
//     messageDiv.style.color = 'red';
//     messageDiv.textContent = '✗ Error: ' + error.message;
//     console.error('Error submitting label:', error);
//     } finally {
//     submitBtn.disabled = false;
//     submitBtn.textContent = 'Submit';
//     }
// });

// document.getElementById('skip-btn').addEventListener('click', async (e) => {
//     e.preventDefault();
    
//     const skipBtn = document.getElementById('skip-btn');
//     const messageDiv = document.getElementById('submit-message');
    
//     // Disable submit button
//     skipBtn.disabled = true;
//     skipBtn.textContent = 'Skipping...';
//     messageDiv.style.display = 'none';

//     // Build the record according to the schema
//     const record = {
//     image_id: document.getElementById('image_id').value,
//     labeler_id: document.getElementById('labeler_id').value,
//     created_at: new Date().toISOString(),
//     round: parseInt(document.getElementById('round').value),
//     measurements: {
//         radius_cm: 0,
//         wavelength_cm: 0,
//         twist_frequency_score: 0,
//         porosity_score: 0,
//         thickness_score: 0
//     },
//     flags: {
//         is_skipped: true,
//         comments: 'Skipped, ' + document.getElementById('comments').value,
//         review_status: 'pending'
//     }
//     };

//     try {
//     const response = await fetch('/api/labels', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(record)
//     });

//     const result = await response.json();

//     if (response.ok) {
//         messageDiv.style.display = 'block';
//         messageDiv.style.color = 'green';
//         messageDiv.textContent = '✓ Label submitted successfully!';
        
//     } else {
//         throw new Error(result.error || 'Failed to submit label');
//     }
//     } catch (error) {
//     messageDiv.style.display = 'block';
//     messageDiv.style.color = 'red';
//     messageDiv.textContent = '✗ Error: ' + error.message;
//     console.error('Error submitting label:', error);
//     } finally {
//     skipBtn.disabled = false;
//     skipBtn.textContent = 'Skip';
//     }
// });

// todo: implement mechanism that refreshes page and goes to new image (pulling from cloud database) 
    // connect the /api/labels with the backend

// Update value labels when sliders change
function updateValue(slider) {
  document.getElementById("val-" + slider.id).textContent = slider.value;
}

// Generate a random labeler ID if not set
function generateLabelerId() {
  if (!localStorage.getItem('labeler_id')) {
    const randomId = 'anon_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('labeler_id', randomId);
  }
  return localStorage.getItem('labeler_id');
}

// Set default labeler ID on page load
window.addEventListener('DOMContentLoaded', () => {
  const labelerIdInput = document.getElementById('labeler_id');
  if (!labelerIdInput.value) {
    labelerIdInput.value = generateLabelerId();
  }
});

// Handle submit button
document.getElementById('submit-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  const messageDiv = document.getElementById('submit-message');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  messageDiv.style.display = 'none';

  // Build the record according to the schema
  const record = {
    image_id: document.getElementById('image_id').value,
    labeler_id: document.getElementById('labeler_id').value,
    created_at: new Date().toISOString(),
    round: parseInt(document.getElementById('round').value),
    measurements: {
      radius_cm: parseFloat(document.getElementById('q1').value),
      wavelength_cm: parseFloat(document.getElementById('q3').value),
      twist_frequency_score: parseInt(document.getElementById('q2').value),
      porosity_score: parseInt(document.getElementById('q4').value),
      thickness_score: parseInt(document.getElementById('q5').value)
    },
    flags: {
      is_ambiguous: false,
      comments: document.getElementById('comments').value || '',
      review_status: 'pending'
    }
  };

  try {
    const response = await fetch('/api/labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });

    const result = await response.json();

    if (response.ok) {
      messageDiv.style.display = 'block';
      messageDiv.style.color = 'green';
      messageDiv.textContent = '✓ Label submitted successfully!';
      
      // Reset form for next image
      document.getElementById('quiz-form').reset();
      // Reset sliders to default values
      document.getElementById('q1').value = 3;
      document.getElementById('q2').value = 5;
      document.getElementById('q3').value = 3;
      document.getElementById('q4').value = 5;
      document.getElementById('q5').value = 5;
      // Update value labels
      updateValue(document.getElementById('q1'));
      updateValue(document.getElementById('q2'));
      updateValue(document.getElementById('q3'));
      updateValue(document.getElementById('q4'));
      updateValue(document.getElementById('q5'));
      // Restore labeler_id
      document.getElementById('labeler_id').value = generateLabelerId();
    } else {
      throw new Error(result.error || 'Failed to submit label');
    }
  } catch (error) {
    messageDiv.style.display = 'block';
    messageDiv.style.color = 'red';
    messageDiv.textContent = '✗ Error: ' + error.message;
    console.error('Error submitting label:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});

// Handle skip button
document.getElementById('skip-btn').addEventListener('click', (e) => {
  e.preventDefault();
  
  // Reset form
  document.getElementById('quiz-form').reset();
  // Reset sliders to default values
  document.getElementById('q1').value = 3;
  document.getElementById('q2').value = 5;
  document.getElementById('q3').value = 3;
  document.getElementById('q4').value = 5;
  document.getElementById('q5').value = 5;
  // Update value labels
  updateValue(document.getElementById('q1'));
  updateValue(document.getElementById('q2'));
  updateValue(document.getElementById('q3'));
  updateValue(document.getElementById('q4'));
  updateValue(document.getElementById('q5'));
  // Restore labeler_id
  document.getElementById('labeler_id').value = generateLabelerId();
  
  const messageDiv = document.getElementById('submit-message');
  messageDiv.style.display = 'block';
  messageDiv.style.color = 'blue';
  messageDiv.textContent = '⏭ Image skipped';
  
  // Clear message after 2 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 2000);
});
