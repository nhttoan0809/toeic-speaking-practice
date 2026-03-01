import { supabase } from './supabase';

/**
 * Uploads a file to a Supabase bucket and returns the public URL.
 */
export async function uploadImage(bucket: string, folder: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt ?? ''}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Uploads multiple files and/or handles existing URLs.
 * Returns a list of all public URLs.
 */
export async function uploadMultipleImages(
  bucket: string,
  folder: string,
  items: (string | File)[],
): Promise<string[]> {
  const uploadPromises = items.map(async (item) => {
    if (item instanceof File) {
      return uploadImage(bucket, folder, item);
    }
    return item;
  });

  return Promise.all(uploadPromises);
}
