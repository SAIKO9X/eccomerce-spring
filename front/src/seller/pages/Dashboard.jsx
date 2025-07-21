import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../state/store";
import {
  fetchDashboardMetrics,
  fetchAnnualEarningsChart,
  fetchMonthlyEarningsChart,
  fetchDailyEarningsChart,
} from "../../state/seller/transactionSlice";

const mesesCompletos = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const mesesAbreviados = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { metrics, chartData, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const [period, setPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(null);

  // Obter o ano e mês atuais
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Janeiro é 1

  // Gerar lista de anos (de 2000 até o ano atual)
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

  // Filtrar os meses disponíveis com base no ano selecionado
  const availableMonths =
    selectedYear === currentYear
      ? mesesCompletos.slice(0, currentMonth)
      : mesesCompletos;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    let params = {};

    if (period === "annual") {
      params = { year: selectedYear };
      dispatch(fetchAnnualEarningsChart({ jwt, ...params }));
      const start = `${selectedYear}-01-01T00:00:00`;
      const end = `${selectedYear}-12-31T23:59:59`;
      dispatch(fetchDashboardMetrics({ jwt, start, end }));
    } else if (period === "monthly") {
      params = { year: selectedYear, month: selectedMonth };
      dispatch(fetchMonthlyEarningsChart({ jwt, ...params }));
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);
      const start = startDate.toISOString().replace("Z", "");
      const end = endDate.toISOString().replace("Z", "");
      dispatch(fetchDashboardMetrics({ jwt, start, end }));
    } else if (period === "daily" && selectedDate) {
      params = { date: selectedDate };
      dispatch(fetchDailyEarningsChart({ jwt, ...params }));
      // Garantir que a data seja tratada corretamente
      const [year, month, day] = selectedDate.split("-");
      const startDate = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0)
      );
      const start = startDate.toISOString().replace("Z", "");
      const endDate = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999)
      );
      const end = endDate.toISOString().replace("Z", "");
      console.log("Daily interval:", { start, end }); // Para depuração
      dispatch(fetchDashboardMetrics({ jwt, start, end }));
    }
  }, [period, selectedYear, selectedMonth, selectedDate, dispatch]);

  if (loading) return <div className="p-4 text-center">Carregando...</div>;
  if (error) {
    const errorMessage =
      error.message || "Erro ao carregar os dados do dashboard";
    return (
      <div className="p-4 text-center text-red-600">Erro: {errorMessage}</div>
    );
  }

  const chartDataFormatted = Object.entries(chartData).map(([key, value]) => {
    let name = key;
    if (period === "annual") {
      const mesIndex = mesesAbreviados.findIndex(
        (mes) => mes.toUpperCase() === key
      );
      name = mesIndex !== -1 ? mesesAbreviados[mesIndex] : key;
    }
    return {
      name,
      earnings: parseFloat(value),
    };
  });

  const renderChart = () => {
    const tooltipFormatter = (value) => `R$ ${parseFloat(value).toFixed(2)}`;
    if (period === "annual" || period === "monthly") {
      return (
        <BarChart
          data={chartDataFormatted}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Bar dataKey="earnings" fill="#4F46E5" name="Ganhos" />
        </BarChart>
      );
    } else if (period === "daily") {
      return (
        <LineChart
          data={chartDataFormatted}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#4F46E5"
            name="Ganhos"
          />
        </LineChart>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="font-playfair text-2xl font-semibold text-center">
        Dashboard do Vendedor
      </h1>

      {/* Filtro de Período */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="p-2 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="annual">Anual</option>
          <option value="monthly">Mensal</option>
          <option value="daily">Diário</option>
        </select>
        {period === "annual" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
        {period === "monthly" && (
          <>
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = Number(e.target.value);
                setSelectedYear(newYear);
                if (newYear === currentYear && selectedMonth > currentMonth) {
                  setSelectedMonth(currentMonth);
                }
              }}
              className="p-2 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={mesesCompletos[selectedMonth - 1]}
              onChange={(e) => {
                const mesIndex = mesesCompletos.indexOf(e.target.value) + 1;
                setSelectedMonth(mesIndex);
              }}
              className="p-2 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              {availableMonths.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </>
        )}
        {period === "daily" && (
          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        )}
      </div>

      {/* Métricas */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-black/10 rounded hover:shadow-md transition">
            <p className="text-sm text-gray-600">Vendas Totais</p>
            <p className="text-2xl font-medium">{metrics.totalSales}</p>
          </div>
          <div className="p-4 border border-black/10 rounded hover:shadow-md transition">
            <p className="text-sm text-gray-600">Ganhos Totais</p>
            <p className="text-2xl font-medium">
              R$ {metrics.totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="p-4 border border-black/10 rounded hover:shadow-md transition">
            <p className="text-sm text-gray-600">Pedidos Cancelados</p>
            <p className="text-2xl font-medium">{metrics.canceledOrders}</p>
          </div>
          <div className="p-4 border border-black/10 rounded hover:shadow-md transition">
            <p className="text-sm text-gray-600">Reembolso Total</p>
            <p className="text-2xl font-medium">
              R$ {metrics.totalRefunds.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className="mt-6">
        <h2 className="font-playfair text-xl font-semibold text-center mb-4">
          Ganhos por{" "}
          {period === "annual"
            ? "Mês"
            : period === "monthly"
            ? "Semana"
            : "Hora"}
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
