export function formatDate(isoString) {
  const date = new Date(isoString);

  const options = {
    full: {
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      onlyDate: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      onlyTime: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
    short: {
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  };

  return {
    // Formato completo: 21/02/2025 23:21:52
    full: options.full.date,
    // Apenas data: 21/02/2025
    date: options.full.onlyDate,
    // Apenas hora: 23:21:52
    time: options.full.onlyTime,
    // Formato curto: 21 fev 2025
    shortDate: options.short.date,
    // Hora curta: 23:21
    shortTime: options.short.time,
    // Data por extenso
    longDate: date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }), // 21 de fevereiro de 2025
  };
}
