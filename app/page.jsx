'use client';
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [iaResponse, setIaResponse] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setUploadStatus("No se ha seleccionado ningún archivo");
      return;
    }
  
    try {
      setUploadStatus("Subiendo archivo a Supabase...");
  
      const formData = new FormData();
      formData.append("file", file);
  
      // SUBIR A SUPABASE
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const { url } = await res.json(); // 👈 obtiene la URL pública
  
      if (!url) {
        throw new Error("No se pudo obtener la URL de Supabase");
      }
  
      setUploadStatus("Archivo subido correctamente");
  
      // Enviar la URL pública al endpoint de IA
      await questionIA(url);
  
    } catch (error) {
      setUploadStatus("Error en la subida: " + error.message);
      console.error("Error en la subida:", error.message);
    }
  };

  // Petición al servidor para enviar la imagen a Ollama
  const questionIA = async (imageUrl) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }), // 👈 enviar la URL pública
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error en respuesta de la API de IA:", errorText);
        throw new Error(errorText);
      }
  
      const data = await res.json();
      console.log("Respuesta de la IA:", data);
      setIaResponse(data.response);
    } catch (error) {
      console.error("Error al consultar la IA:", error.message);
      setIaResponse("Error al procesar la imagen");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl w-full gap-12">
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/ios-17-iphone-14-pro-settings-screen-time.png"
            alt="Pantalla de ajustes de iOS en iPhone"
            className="w-3/4 rounded-2xl object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center w-full max-w-md">
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600 text-center mb-4">
              Calcula cuánto contaminas <br /> con solo una foto
            </h1>
            <div className="w-16 border-b-4 border-emerald-600 mb-6" />
            <p className="text-lg text-gray-700 text-center mb-4">
              Sube una foto de tu consumo o del tiempo de uso
            </p>

            <form onSubmit={onSubmit} className="w-full flex flex-col items-center gap-4">
              <label className="w-full">
                <div className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-center py-3 px-6 rounded-lg shadow-lg cursor-pointer transition-colors">
                  {file ? "Archivo seleccionado ✅" : "Seleccionar archivo 📸"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              <div className="flex w-auto">
                <hr />
                <p> o </p>
                <hr />
              </div>

              <button type="button" onClick={() => setShowModal(true)}>
                Ingresar datos manualmente
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center"
              >
                Estima tu huella de carbono
              </button>
            </form>

            {/* Mostrar respuesta de la IA */}
            {iaResponse && (
              <div className="mt-6 p-4 bg-slate-100 rounded-lg text-center text-gray-800">
                <p className="font-bold">Respuesta IA:</p>
                <p>{iaResponse}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-gray-500 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-emerald-600">Formulario Manual</h2>
            <form className="flex flex-col gap-4">
              <label>Numero de horas de uso del teléfono</label>
              <input
                type="text"
                placeholder="Introduce las horas de uso diarias"
                className="border rounded p-2 w-full"
              />
              <label>Numero de horas de uso de dispositivos</label>
              <input
                type="number"
                placeholder="Tiempo de uso (horas)"
                className="border rounded p-2 w-full"
              />
              <input type="number" placeholder="Consumo (kWh)" className="border rounded p-2 w-full" />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded">
                Calcular
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}