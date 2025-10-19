export class SuggestionService {
  private static readonly SUGGESTION_COUNT = 5;

  async suggest(baseUsername: string): Promise<string[]> {
    const suggestions: string[] = [];
    let count = 0;
    let suffix = 1;

    // Generate simple suggestions by adding numbers
    while (count < SuggestionService.SUGGESTION_COUNT) {
      const suggestion = `${baseUsername}${suffix}`;
      suggestions.push(suggestion);
      count++;
      suffix++;
    }

    // Add some creative variations
    suggestions.push(`${baseUsername}_user`);
    suggestions.push(`the_${baseUsername}`);
    suggestions.push(`${baseUsername}_${Math.floor(Math.random() * 1000)}`);

    return suggestions;
  }
}
