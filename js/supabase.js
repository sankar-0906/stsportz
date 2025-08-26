// Supabase Configuration
const SUPABASE_URL = 'https://nhdlyzmuyuulfyxnkhgk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZGx5em11eXV1bGZ5eG5raGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDM0MjIsImV4cCI6MjA2NjMxOTQyMn0.ejN9JHIbEmqQfXwzzzwbe0Zjjc0CRWlX76S76ytIsVg';

// Initialize Supabase client
let supabase = null;

// Check if Supabase is available and initialize
if (typeof window !== 'undefined' && window.supabase) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
    }
}

// Function to submit enquiry form
async function submitEnquiry(formData) {
    try {
        // Check if Supabase is properly initialized
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase
            .from('enquiries')
            .insert([
                {
                    name: formData.name,
                    phone: formData.phone,
                    preferred_sport: formData.preferred_sport,
                    message: formData.message || null,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Error submitting enquiry:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        return { success: false, error: error.message };
    }
}

// Function to validate phone number
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Function to validate form data
function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
        errors.push('Please enter a valid 10-digit phone number');
    }

    if (!formData.preferred_sport) {
        errors.push('Please select a preferred sport');
    }

    return errors;
}

// Export functions for use in main.js
window.SupabaseService = {
    submitEnquiry,
    validatePhone,
    validateForm
}; 