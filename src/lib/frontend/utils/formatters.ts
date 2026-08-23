export const formatNumber = (value: number, decimals = 0) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
};
