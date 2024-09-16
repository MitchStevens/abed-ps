export const toLocaleString = hours => minutes => seconds => 
    new Date(2000, 1, 1, hours-1, minutes, seconds).toLocaleTimeString()