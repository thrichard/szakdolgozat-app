import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// 1. IMPORTÁLJUK A KÓDSZÍNEZŐT ÉS A TÉMÁT
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Szemeszter Térkép";

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

  const closeModal = () => {
    setSelectedMaterial(null);
  };

  // Legeneráljuk a 14 hetet egy tömbbe
  const semesterWeeks = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* FEJLÉC */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Szemeszter Térkép 🗺️
            </h2>
            <p className="text-gray-500 font-medium mt-1">
              Kövesd végig a 14 hetes kurzust és sajátítsd el a tananyagot!
            </p>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm"
          >
            ← Vissza
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 font-bold shadow-sm">
            {error}
          </div>
        )}

        {/* 14 HETES IDŐVONAL */}
        {!error && (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-indigo-500 before:to-purple-200">
            
            {semesterWeeks.map((week) => {
              // Kikeressük azokat az anyagokat, amik ehhez a héthez tartoznak
              const materialsForThisWeek = materials.filter(m => m.weekNumber === week);
              
              return (
                <div key={week} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* IDŐVONAL PÖTTY */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md ${materialsForThisWeek.length > 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <span className="text-white font-bold text-sm">{week}.</span>
                  </div>
                  
                  {/* HETI TARTALOM DOBOZ */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                    <h3 className="font-bold text-gray-800 text-lg mb-3 border-b border-gray-100 pb-2">
                      {week}. Hét
                    </h3>

                    {materialsForThisWeek.length === 0 ? (
                      <p className="text-sm text-gray-400 italic font-medium">Nincs feltöltött tananyag erre a hétre.</p>
                    ) : (
                      <div className="space-y-3">
                        {materialsForThisWeek.map(material => (
                          <div key={material._id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase tracking-wider mb-1 inline-block">
                                {material.subject}
                              </span>
                              <h4 className="font-bold text-gray-700 text-sm">{material.title}</h4>
                            </div>
                            <button
                              onClick={() => setSelectedMaterial(material)}
                              className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-bold py-1.5 px-3 rounded-lg transition text-xs flex-shrink-0 w-full sm:w-auto shadow-sm"
                            >
                              Megnyitás
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Felugró ablak a tananyaghoz */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase tracking-wider mb-1 inline-block mr-2">
                  {selectedMaterial.subject}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-md uppercase tracking-wider mb-1 inline-block">
                  {selectedMaterial.weekNumber}. HÉT
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {selectedMaterial.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition font-bold"
                title="Bezárás"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow text-gray-700 leading-relaxed">
              <p className="text-base whitespace-pre-wrap">
                {selectedMaterial.description}
              </p>

              {/* KÓDBLOKK */}
              {selectedMaterial.codeSnippet && selectedMaterial.codeSnippet.trim() !== "" && (
                <div className="mt-6 text-sm rounded-lg overflow-hidden shadow-lg font-mono text-left">
                  <SyntaxHighlighter 
                    language={selectedMaterial.language || "c"} 
                    style={vscDarkPlus} 
                    showLineNumbers={true}
                    customStyle={{ margin: 0, borderRadius: '0.5rem' }}
                  >
                    {selectedMaterial.codeSnippet}
                  </SyntaxHighlighter>
                </div>
              )}

              <div className="mt-8 text-sm text-gray-400 font-medium border-t border-gray-100 pt-4">
                Feltöltötte: {selectedMaterial.teacherId?.username || "Ismeretlen oktató"}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm"
              >
                Vissza
              </button>

              {selectedMaterial.link && selectedMaterial.link.trim() !== "" && (
                <a
                  href={selectedMaterial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 font-bold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2"
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