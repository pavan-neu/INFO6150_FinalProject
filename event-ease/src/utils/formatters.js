// src/utils/formatters.js
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timeString) => {
  if (!timeString) return "";

  // Convert 24h format to 12h format
  const [hours, minutes] = timeString.split(":");
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  return `${hour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount) => {
  if (amount === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};
