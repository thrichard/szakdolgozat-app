import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState("");

  // Állapot a kiválasztott (épp nagyban megnyitott) tananyaghoz
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tananyagok";

    const fetchMaterials = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/materials", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMaterials(data);
        } else {
          setError(data.message || "Hiba a tananyagok betöltésekor.");
        }
      } catch (err) {
        setError("Hálózati hiba: A szerver nem elérhető.");
      }
    };

    fetchMaterials();
  }, [navigate]);

  // Modal bezárása
  const closeModal = () => {
    setSelectedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Tananyagok 📚
          </h2>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm"
          >
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-medium">
            {error}
          </div>
        )}

        {!error && materials.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 font-medium">
              Jelenleg nincsenek elérhető tananyagok.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col h-full"
              >
                <div className="mb-3 flex-shrink-0">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    {material.subject}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-gray-800 mb-2 line-clamp-2"
                  title={material.title}
                >
                  {material.title}
                </h3>

                {/* A line-clamp-3 CSS osztály biztosítja, hogy maximum 3 sor jelenjen meg, utána ... lesz */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {material.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-medium truncate pr-2">
                    Oktató: {material.teacherId?.username || "Ismeretlen"}
                  </span>

                  {/* Itt már nem külső linkre visz, hanem megnyitja a modalt */}
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm flex-shrink-0 shadow-sm"
                  >
                    Megnyitás
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL (Felugró ablak) - Csak akkor renderelődik, ha van kiválasztott anyag */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          {/* Animált, fehér doboz */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            {/* Modal Fejléc */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase tracking-wider mb-1 inline-block">
                  {selectedMaterial.subject}
                </span>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedMaterial.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition"
                title="Bezárás"
              >
                ✕
              </button>
            </div>

            {/* Modal Tartalom (Görgethető, ha túl hosszú a szöveg) */}
            <div className="p-6 overflow-y-auto flex-grow text-gray-700 whitespace-pre-wrap leading-relaxed">
              <p>{selectedMaterial.description}</p>
              <div className="mt-6 text-sm text-gray-500 font-medium">
                Feltöltötte:{" "}
                {selectedMaterial.teacherId?.username || "Ismeretlen oktató"}
              </div>
            </div>

            {/* Modal Lábjegyzet / Gombok */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm"
              >
                Vissza
              </button>

              {/* Csak akkor jelenik meg a gomb, ha tényleg van link */}
              {selectedMaterial.link && selectedMaterial.link.trim() !== "" && (
                <a
                  href={selectedMaterial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 font-bold text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                  Külső link megnyitása 🔗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materials;
