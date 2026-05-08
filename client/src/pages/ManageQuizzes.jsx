import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Állapot a törlést megerősítő felugró ablakhoz
  const [materialToDelete, setMaterialToDelete] = useState(null);

  useEffect(() => {
    document.title = "Tananyagok Kezelése";
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/materials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Mivel a backend már weekNumber szerint rendezi, csak beállítjuk
        setMaterials(data);
      } else {
        setError('Hiba történt a tananyagok betöltésekor.');
      }
    } catch (err) {
      setError('Hálózati hiba a csatlakozáskor.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/materials/${materialToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Sikeres törlés után eltüntetjük a listából és bezárjuk a modalt
        setMaterials(materials.filter(m => m._id !== materialToDelete._id));
        setMaterialToDelete(null);
      } else {
        alert('Hiba történt a törlés során.');
      }
    } catch (err) {
      alert('Hálózati hiba a törléskor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* FEJLÉC */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Tananyagok Kezelése ⚙️</h2>
          <Link to="/teacher" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Vissza
          </Link>
        </div>

        {/* ÁLLAPOTOK */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-bold border border-red-100">{error}</div>}

        {!loading && materials.length === 0 && !error && (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-200">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nincsenek még tananyagok</h3>
            <p className="text-gray-500 mb-6">Tölts fel egy anyagot, hogy a diákok haladhassanak a szemeszterben!</p>
            <Link to="/add-material" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg transition font-bold transform hover:-translate-y-1">
              + Új tananyag feltöltése
            </Link>
          </div>
        )}

        {/* TANANYAGOK LISTÁJA */}
        <div className="grid gap-5">
          {materials.map(material => (
            <div key={material._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md font-extrabold tracking-wider border border-purple-200">
                    {material.weekNumber}. HÉT
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {material.title}
                  </h3>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{material.description}</p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                    {material.subject}
                  </span>
                  
                  {material.codeSnippet && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                      Kód: {material.language}
                    </span>
                  )}

                  {material.link && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                      Van külső link
                    </span>
                  )}
                </div>
              </div>
              
              {/* GOMBOK */}
              <div className="flex gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <Link 
                  to={`/edit-material/${material._id}`}
                  className="flex-1 md:flex-none bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300 transition font-bold flex justify-center items-center gap-2 shadow-sm"
                >
                  ✏️ Módosítás
                </Link>
                <button 
                  onClick={() => setMaterialToDelete(material)} 
                  className="flex-1 md:flex-none bg-white text-red-600 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition font-bold flex justify-center items-center gap-2 shadow-sm"
                >
                  🗑️ Törlés
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TÖRLÉS MEGERŐSÍTŐ MODAL */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
              🗑️
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Biztosan törlöd?</h3>
            <p className="text-center text-gray-500 mb-6 text-sm">
              A(z) <span className="font-bold text-gray-700">"{materialToDelete.title}"</span> nevű tananyag véglegesen törlődik. Ezt nem lehet visszavonni.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMaterialToDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                Mégse
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-md"
              >
                Igen, törlöm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageMaterials;