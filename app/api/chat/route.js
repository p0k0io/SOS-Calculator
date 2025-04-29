import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    const ngrokURL = "https://1fad-2a0c-5a86-f40b-1200-283b-29fb-19b8-ff3b.ngrok-free.app/api/chat";

    const response = await fetch(ngrokURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    const rawText = await response.text();
    console.log("🔵 Respuesta RAW del servidor remoto:", rawText);

    // Separar cada línea (cada JSON)
    const lines = rawText.trim().split('\n');
    let fullContent = "";

    for (const line of lines) {
      try {
        const jsonLine = JSON.parse(line);
        fullContent += jsonLine.message?.content || '';
      } catch (parseError) {
        console.error("🔴 Error parseando línea:", line, parseError);
      }
    }

    if (!fullContent) {
      throw new Error("No se pudo reconstruir la respuesta de IA");
    }

    return NextResponse.json({ response: fullContent });

  } catch (error) {
    console.error("🔥 Error en /api/chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
