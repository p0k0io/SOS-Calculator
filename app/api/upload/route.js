'use server'

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export async function POST(req) {
  console.log("POST /api/upload iniciado")

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      console.warn("No se recibió ningún archivo")
      return new Response('No file uploaded', { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadDir)) {
      console.log("Creando directorio de uploads...")
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Limpiar el nombre del archivo para evitar vulnerabilidades
    const safeFileName = path.basename(file.name)
    const filePath = path.join(uploadDir, safeFileName)

    console.log("Guardando archivo en:", filePath)
    await writeFile(filePath, buffer)

    console.log("Archivo guardado correctamente")
    return new Response('File uploaded successfully', { status: 200 })
  } catch (e) {
    console.error("Error en la subida del archivo:", e)
    return new Response('File upload failed', { status: 500 })
  }
}
