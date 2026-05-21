import { supabase } from './supabase';

export interface Poem {
  id: number;
  name: string;
  section: string;
  sectionIndex: number;
  lines: string[];
}

export const NAV_SECTIONS = [
  'الرئيسة', 'الدينية', 'الوطنية', 'الوجدانية', 'العاطفية',
  'الثورية', 'الرثائية', 'الهجائية', 'الجناسات', 'اللوحات',
];

export const sections = NAV_SECTIONS;

function rowToPoem(row: { id: number; name: string; section: string; section_index: number; lines: string[] }): Poem {
  return {
    id: row.id,
    name: row.name,
    section: row.section,
    sectionIndex: row.section_index,
    lines: row.lines,
  };
}

export async function fetchAllPoems(): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('id, name, section, section_index, lines')
    .order('id');
  if (error || !data) return [];
  return data.map(rowToPoem);
}

export async function fetchSectionPoems(section: string): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('id, name, section, section_index, lines')
    .eq('section', section)
    .order('id');
  if (error || !data) return [];
  return data.map(rowToPoem);
}

export async function savePoem(poem: Poem): Promise<boolean> {
  const { error } = await supabase
    .from('poems')
    .update({
      name: poem.name,
      lines: poem.lines,
      updated_at: new Date().toISOString(),
    })
    .eq('id', poem.id);
  return !error;
}

export interface SearchResult {
  poem: Poem;
  matchLine: string;
  matchIndex: number;
  target: 'read' | 'watch';
}

export function searchPoems(query: string, poems: Poem[]): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  poems.forEach((poem) => {
    let matchLine = '';
    let matchIndex = -1;

    if (poem.name.toLowerCase().includes(q)) {
      matchLine = poem.name;
      matchIndex = -1;
    } else {
      for (let i = 0; i < poem.lines.length; i++) {
        if (poem.lines[i].toLowerCase().includes(q)) {
          matchLine = poem.lines[i];
          matchIndex = i;
          break;
        }
      }
    }

    if (matchLine) {
      results.push({ poem, matchLine, matchIndex, target: 'read' });
      results.push({ poem, matchLine, matchIndex, target: 'watch' });
    }
  });

  return results.slice(0, 60);
}

export function getSectionPoems(section: string, poems: Poem[]): Poem[] {
  return poems.filter((p) => p.section === section);
}
