import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditMaterial() {
  const { id } = useParams(); // URL-ből kivesszük az ID-t
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Aktuális adatok lekérése
  useEffect(() => {
    document.title = "Tananyag Szerkesztése";
    
    const fetchMaterial = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setTitle(data.title);
          setSubject(data.subject);
          setDescription(data.description);
          setMaterialLink(data.link || '');
        } else {
          setError(data.message || 'Hiba a tananyag betöltésekor.');
        }
      } catch (err) {
        setError('Hálózati hiba történt.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'PUT', // PUT metódus a frissítéshez!
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          subject,
          description,
          link: materialLink
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Tananyag sikeresen frissítve!');
        setTimeout(() => {
          navigate('/manage-materials'); // Vissza a listába
        }, 2000);
      } else {
        setError(data.message || 'Hiba történt a mentés során.');
      }
    } catch (err) {
      setError('Hálózati hiba: Nem sikerült csatlakozni a szerverhez.');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-indigo-600">Adatok betöltése... ⏳</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Tananyag Szerkesztése ✏️</h2>
          <Link to="/manage-materials" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition shadow-sm">
            ← Mégse
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 font-bold border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 font-bold border border-green-200">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-5 animate-fade-in-up">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Cím</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tantárgy</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Leírás</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-y" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Link <span className="text-gray-400 font-normal">(Opcionális)</span></label>
            <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={materialLink} onChange={(e) => setMaterialLink(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition mt-2 shadow-sm">
            Mentés 💾
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMaterial;