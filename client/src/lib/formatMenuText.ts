const MODIFIER_NAME_FIXES: Record<string, string> = {
  'allergy shelfish': 'Shellfish allergy',
  'allergy shellfish': 'Shellfish allergy',
  'allergy nut': 'Nut allergy',
  'allergy open': 'Other allergy — add details below',
  'cut in 3': 'Cut into 3 pieces',
  'cut in 4': 'Cut into 4 pieces',
  'cut in half': 'Cut in half',
};

const MODIFIER_LIST_FIXES: Record<string, string> = {
  'preparation option': 'Preparation options',
  'preparation options': 'Preparation options',
};

export function formatModifierName(name: string): string {
  const normalized = name.trim().toLowerCase();
  return MODIFIER_NAME_FIXES[normalized] || name.trim();
}

export function formatModifierListName(name: string): string {
  const normalized = name.trim().toLowerCase();
  return MODIFIER_LIST_FIXES[normalized] || name.trim();
}
