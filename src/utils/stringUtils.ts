/**
 * オブジェクトのキーをキャメルケースに変換する
 * @param obj 変換対象のオブジェクト
 * @returns キーがキャメルケースになった新しいオブジェクト
 */
export function keysToCamelCase(
  obj: Record<string, unknown>,
): Record<string, string | number | null | undefined> {
  const newObj: Record<string, string | number | null | undefined> = {};
  Object.keys(obj).forEach((key) => {
    const camelKey = key.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
    newObj[camelKey] = obj[key] as string | number | null | undefined;
  });
  return newObj;
}
