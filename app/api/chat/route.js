import { NextResponse } from 'next/server';
import https from 'https';

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();
    console.log("📥 imageUrl recibido:", imageUrl);

    if (!imageUrl) {
      console.warn("⚠️ No se proporcionó imageUrl");
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }


    const downloadImage = (url) => {
      return new Promise((resolve, reject) => {
        https.get(url, (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
           
            resolve(buffer);
          });
          res.on('error', (err) => {

            reject(err);
          });
        });
      });
    };

    const imageBuffer = await downloadImage(imageUrl);

    if (!imageBuffer || !imageBuffer.length) {
      throw new Error("⚠️ imageBuffer vacío o no válido");
    }

    const base64Image = imageBuffer.toString('base64');
    console.log("📸 Imagen convertida a base64. Longitud:", base64Image.length);

    const ngrokURL = "https://638b-79-117-245-156.ngrok-free.app/api/chat";

    const bodyPayload = JSON.stringify({
      model: 'llama3.2-vision',
      messages: [
        {
          role: 'user',
          content: `
            Analiza la imagen adjunta (contenido y estadísticas) y calcula tu huella anual de CO₂ en kg.  
            La respuesta debe tener este formato EXACTO, en no más de 3 líneas y sin explicaciones ni texto adicional:
            1) "X KG de CO₂ al año"  
            2) Una comparación breve  
            3) Un único consejo de mejora
          `.trim(),
          images: [base64Image],
        }
      ],
    });

    console.log("📤 Enviando solicitud al servidor remoto:", ngrokURL);

    const response = await fetch(ngrokURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyPayload,
    });

  } catch (error) {
    console.error("🔥 Error en /api/chat:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
