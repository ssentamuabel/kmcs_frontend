const DateFormatter = (date) => {
    const newDate = new Date(date);
  
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = newDate.toLocaleString('en-US', { month: 'short' }); // e.g., "Apr"
    const year = String(newDate.getFullYear()).slice(-2); // last two digits of the year
  
    return `${day}-${month}-${year}`;
};


const convertToISO = (formattedDate) => {
    const [day, shortMonth, yearSuffix] = formattedDate.split('-');
  
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
  
    const fullYear = parseInt(yearSuffix) > 50 
      ? '19' + yearSuffix 
      : '20' + yearSuffix;
  
    const month = monthMap[shortMonth];
  
    return `${fullYear}-${month}-${day}`;
  };
  

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  
export default {DateFormatter, convertToISO, formatDateForInput};
