import { get, cloneDeep } from 'lodash';
import { AtLeastOne, Entries, RecursiveKeyOf } from '@/shared-kernel';

type TSchemeObject<T, R> = {
  [key in keyof R]: AtLeastOne<{
    key: RecursiveKeyOf<T>
    callback(source: T): R[key]
    nested: TSchemeObject<T, R[key]>
  }>
};

export default function convertObject<T, R>(source: T, scheme: TSchemeObject<T, R>) {
  const output: Partial<R> = {};
  const entries = Object.entries(cloneDeep(scheme)) as unknown as Entries<typeof scheme>;

  entries.forEach(([key, value]) => {
    if (value.key) {
      output[key] = get(source, value.key);
    } else if (value.callback) {
      output[key] = value.callback(source);
    } else if (value.nested) {
      output[key] = convertObject<T, R[typeof key]>(source, value.nested);
    }
  });

  return output as R;
}
