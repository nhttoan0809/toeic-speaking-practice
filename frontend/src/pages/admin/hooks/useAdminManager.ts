import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function useAdminManager<T extends { id: number; created_at?: string }>(
  table: string,
  bucket?: string,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(result as T[]);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const removeStorageFiles = useCallback(
    async (files: string | string[]) => {
      if (!bucket) return;
      const fileList = Array.isArray(files) ? files : [files];
      const indicator = `/storage/v1/object/public/${bucket}/`;

      const pathsToRemove = fileList
        .filter((url) => url.includes(indicator))
        .map((url) => url.split(indicator).pop())
        .filter((path): path is string => !!path);

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(bucket).remove(pathsToRemove);
      }
    },
    [bucket],
  );

  const deleteItem = async (id: number, storageFiles?: string | string[]) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        if (storageFiles) {
          await removeStorageFiles(storageFiles);
        }
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        await fetchData();
      } catch (err) {
        console.error(`Error deleting from ${table}:`, err);
        alert('Đã xảy ra lỗi khi xóa.');
      }
    }
  };

  return { data, loading, fetchData, deleteItem, removeStorageFiles };
}
