// Car validation and API utilities

export const validateCar = async (make, model, year) => {
  // Basic validation
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year, 10);
  
  if (!make || !model || !year) {
    return { valid: false, message: 'All fields are required' };
  }

  if (isNaN(yearNum)) {
    return { valid: false, message: 'Year must be a number' };
  }

  if (yearNum > currentYear + 1) {
    return { valid: false, message: `Year cannot be greater than ${currentYear + 1}` };
  }

  if (yearNum < 1885) { // First automobile was created in 1885
    return { valid: false, message: 'Year must be 1885 or later' };
  }

  try {
    // You can replace this with an actual API call to validate make/model/year
    const response = await fetch(`https://api.carapi.app/cars/${make}/${model}/${year}`);
    const data = await response.json();
    
    if (!data.success) {
      return { 
        valid: false, 
        message: 'This combination of make, model, and year was not found in our database',
        continueAnyway: true 
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating car:', error);
    return { 
      valid: false, 
      message: 'Could not verify car details. You may continue anyway.',
      continueAnyway: true 
    };
  }
};

export const getCarImage = async (make, model, year) => {
  try {
    // You can replace this with an actual car image API
    const response = await fetch(`https://api.carapi.app/images/${make}/${model}/${year}`);
    const data = await response.json();
    
    if (data.success && data.images && data.images.length > 0) {
      return data.images[0].url;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching car image:', error);
    return null;
  }
};

export const getMaintenanceSchedule = async (make, model, year) => {
  try {
    // You can replace this with an actual maintenance schedule API
    const response = await fetch(`https://api.carapi.app/maintenance/${make}/${model}/${year}`);
    const data = await response.json();
    
    if (!data.success) {
      return [];
    }
    
    return data.schedule || [];
  } catch (error) {
    console.error('Error fetching maintenance schedule:', error);
    return [];
  }
};
