export const USD_TO_INR_RATE = 85;

export const convertToINR = (price) => {
  return price * USD_TO_INR_RATE;
};

// Formats an original USD product price after conversion
export const formatINR = (price) => {
  return formatRupees(convertToINR(price));
};

// Formats an amount that is already in INR
export const formatRupees = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
