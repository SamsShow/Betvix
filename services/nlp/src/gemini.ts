import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Generate a news capsule from a headline
   */
  async generateCapsule(headline: string, context?: string): Promise<{
    title: string;
    lines: string[];
    betStatement: string;
    category: string;
    tags: string[];
  }> {
    const prompt = `
      Given this news headline: "${headline}"
      ${context ? `Context: ${context}` : ''}
      
      Please create:
      1. A concise title (max 60 characters)
      2. Two clear, factual lines explaining the situation (max 120 characters each)
      3. A binary prediction question that can be answered with Yes/No
      4. A relevant category (crypto, politics, finance, tech, sports, etc.)
      5. Relevant tags (max 5)
      
      Format as JSON:
      {
        "title": "string",
        "lines": ["string", "string"],
        "betStatement": "string",
        "category": "string",
        "tags": ["string"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        title: parsed.title || headline,
        lines: parsed.lines || [headline],
        betStatement: parsed.betStatement || `Will ${headline}?`,
        category: parsed.category || 'general',
        tags: parsed.tags || [],
      };
    } catch (error) {
      console.error('Error generating capsule with Gemini:', error);
      
      // Fallback response
      return {
        title: headline.substring(0, 60),
        lines: [headline.substring(0, 120)],
        betStatement: `Will ${headline}?`,
        category: 'general',
        tags: ['news'],
      };
    }
  }

  /**
   * Generate a bet statement from news content
   */
  async generateBetStatement(content: string): Promise<string> {
    const prompt = `
      Given this news content: "${content}"
      
      Create a clear, binary (Yes/No) prediction question that:
      - Can be objectively verified
      - Has a specific timeframe
      - Is relevant to the news content
      - Can be answered definitively
      
      Return only the question, no additional text.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating bet statement with Gemini:', error);
      return `Will this news event occur?`;
    }
  }

  /**
   * Classify news content into categories
   */
  async classifyContent(content: string): Promise<{
    category: string;
    confidence: number;
    tags: string[];
  }> {
    const prompt = `
      Classify this news content: "${content}"
      
      Return JSON with:
      - category: one of [crypto, politics, finance, tech, sports, entertainment, health, science]
      - confidence: number between 0 and 1
      - tags: array of relevant tags (max 5)
      
      Format: {"category": "string", "confidence": number, "tags": ["string"]}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        category: parsed.category || 'general',
        confidence: parsed.confidence || 0.5,
        tags: parsed.tags || [],
      };
    } catch (error) {
      console.error('Error classifying content with Gemini:', error);
      
      return {
        category: 'general',
        confidence: 0.5,
        tags: ['news'],
      };
    }
  }
}
