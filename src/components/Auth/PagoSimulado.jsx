import { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";

function PagoSimulado() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { noches, precio_total, titulo } = location.state || {};

  const [form, setForm] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    vencimiento: "",
    cvv: ""
  });
  const [procesando, setProcesando] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePagar = (e) => {
    e.preventDefault();

    if (form.numeroTarjeta.replace(/\s/g, "").length < 16) {
      setError("Número de tarjeta inválido.");
      return;
    }
    if (form.cvv.length < 3) {
      setError("CVV inválido.");
      return;
    }

    setError(null);
    setProcesando(true);

    // Simulación: no se procesa ningún pago real, solo se muestra
    // un pequeño retraso para que se sienta como una transacción real.
    setTimeout(() => {
      setProcesando(false);
      setPagado(true);
    }, 1200);
  };

  if (pagado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            ¡Pago confirmado!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Tu reserva #{id} quedó confirmada. Te esperamos en {titulo || "tu alojamiento"}.
          </p>

          {precio_total && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-6 text-left">
              <p className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Noches</span>
                <strong className="text-gray-800">{noches}</strong>
              </p>
              <p className="flex justify-between text-sm text-gray-500">
                <span>Total pagado</span>
                <strong className="text-gray-800">${precio_total}</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to="/mis-reservas"
              className="flex-1 bg-[#FF385C] text-white font-semibold text-sm rounded-lg px-4 py-3 hover:bg-[#e03150] transition"
            >
              Ver mis reservas
            </Link>
            <Link
              to="/"
              className="flex-1 bg-white text-gray-800 border border-gray-300 font-semibold text-sm rounded-lg px-4 py-3 hover:bg-gray-50 transition"
            >
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1.5">
          Confirmar pago
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          Reserva #{id}{titulo ? ` — ${titulo}` : ""}
        </p>
        {precio_total && (
          <p className="text-2xl font-bold text-[#FF385C] mb-6">
            ${precio_total}
          </p>
        )}

        {error && (
          <p className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handlePagar} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Número de tarjeta
            </label>
            <input
              name="numeroTarjeta"
              value={form.numeroTarjeta}
              onChange={handleChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre del titular
            </label>
            <input
              name="nombreTitular"
              value={form.nombreTitular}
              onChange={handleChange}
              placeholder="Como aparece en la tarjeta"
              required
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Vencimiento
              </label>
              <input
                name="vencimiento"
                value={form.vencimiento}
                onChange={handleChange}
                placeholder="MM/AA"
                maxLength={5}
                required
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                CVV
              </label>
              <input
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                required
                className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={procesando}
            className="w-full bg-[#FF385C] text-white font-semibold text-sm rounded-lg px-4 py-3.5 hover:bg-[#e03150] transition disabled:bg-[#f3a5b4] disabled:cursor-not-allowed mt-2"
          >
            {procesando ? "Procesando pago..." : "Pagar y confirmar"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-1">
            Esto es una simulación — no se procesa ningún pago real.
          </p>
        </form>
      </section>
    </main>
  );
}

export default PagoSimulado;