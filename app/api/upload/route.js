'use server';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Configurar Supabase
const supabase = createClient(
  'https://rcnnhpccatfxajldgejy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbm5ocGNjYXRmeGFqbGRnZWp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTkzMDQxNywiZXhwIjoyMDYxNTA2NDE3fQ.E12LWBu_nszGTk7OGw-QiqQ95YGFFAMJg_41K_W3zAA'
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('upload') // nombre del bucket
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error al subir a Supabase:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrl = `https://rcnnhpccatfxajldgejy.supabase.co/storage/v1/object/public/upload/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('Error general en upload:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
