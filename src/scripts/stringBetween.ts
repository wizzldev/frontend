export const stringBetween = ([beg, end]: [string, string]) => {
  const matcher = new RegExp(`${beg}(.*?)${end}`, 'gms');
  return function(str: string): Array<{ content: string, is_code: boolean, lang: string | null }> {
    const result: Array<{ content: string, is_code: boolean, lang: string | null }> = [];
    let lastIndex = 0;

    str.replace(matcher, (match, p1, offset) => {
      if (offset > lastIndex) {
        result.push({ content: str.slice(lastIndex, offset), is_code: false, lang: null });
      }
      const { code, lang } = exportCodeAndLang(p1);
      result.push({ content: code, is_code: true, lang: lang });
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < str.length) {
      result.push({ content: str.slice(lastIndex), is_code: false, lang: null });
    }

    return result;
  }
}

const exportCodeAndLang = (s: string): { code: string, lang: string | null } => {
  const lines = s.split('\n');
  const lang = lines[0].trim();
  const code = lines.slice(1).join('\n').replace(/^"+|"+$/g, '')
  return { code: code, lang: lang || null };
}