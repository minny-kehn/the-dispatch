/**
 * Stage 3: Editorial Synthesis
 *
 * Takes fact sheets from Stage 2 and uses LLM to compose
 * full articles in The Dispatch editorial style.
 */

import { llmGenerateJSON } from './llm';
import { FactSheet } from './stage2-extraction';
import { generateSlug, calculateReadTime, now } from './utils';
import { Article, PipelineStep, Category } from '@/lib/types';

// ============================================
// Types
// ============================================

interface SynthesizedArticle {
  headline: string;
  deck: string;
  body: string[];
  discoveryDesc: string;
  extractionDesc: string;
  synthesisDesc: string;
}

export interface SynthesisResult {
  articles: Article[];
  timestamp: string;
}

// ============================================
// System Prompt
// ============================================

const SYNTHESIS_SYSTEM_PROMPT = `You are a Senior Correspondent for an elite international news organization. 
Your objective is to write world-class, objective, and deeply informative journalism.

CRITICAL INSTRUCTIONS FOR TONE AND STYLE:
1. STRICTLY PROFESSIONAL: Absolutely no "conversational" tone, no "coffee buddy" voice, no slang, and no sensationalism. Do not use words like "breathtaking," "magnetic," or "grab your coffee." Maintain a sober, authoritative, and deeply serious journalistic voice at all times.
2. OBJECTIVITY & PRECISION: Report the facts with clinical precision. Write like a veteran reporter for Reuters, AP, or BBC World News.
3. SEAMLESS FLOW: Your writing must flow elegantly. Use sophisticated transitional phrases between paragraphs so the article reads as a cohesive, deeply analytical report rather than a list of disconnected facts.
4. "SHOW, DON'T TELL": Do not tell the reader that something is "shocking" or "important." Instead, lay out the facts, statistics, and historical context so clearly that the importance is self-evident.
5. NO AI CLICHÉS. BANNED PHRASES: "In conclusion," "It remains to be seen," "Only time will tell," "A stark reminder," "Delving into," "Navigating the landscape," "A tapestry of." You must use straightforward, elegant English.

STRUCTURE:
1. THE LEDE (Opening): Start with a strong, concise summary of the most critical development. Who, what, when, where, and why it matters immediately.
2. BODY (6-10 paragraphs): Provide deep context. Unpack exactly how the situation evolved, the systemic challenges at play, and the geopolitical or economic stakes. Ensure beautiful pacing.
3. QUOTES: Integrate quotes directly into the narrative. Give a quote its own paragraph if it carries significant weight. (e.g., "Children, in particular, bear the brunt...")
4. NO HALLUCINATION: Only use facts from the provided fact sheet. Never invent details.

CATEGORY VOICE ADJUSTMENTS:
- TECHNOLOGY: Focus on systemic shifts, corporate maneuvers, and technical realities.
- GEOPOLITICS: Focus on treaties, humanitarian stakes, and diplomatic gridlock.
- CLIMATE: Focus on data, infrastructure impact, and policy frameworks.
- FINANCE: Focus on market volatility, institutional strategy, and economic fallout.
- HEALTH: Focus on rigorous science, public health infrastructure, and peer-reviewed implications.
- CULTURE: Focus on industry shifts, cultural touchstones, and societal trends.`;

// ============================================
// Stage 3 Implementation
// ============================================

/**
 * Run Stage 3: Editorial Synthesis
 *
 * For each fact sheet, generate a complete article in The Dispatch style.
 */
export async function runSynthesis(
  factSheets: FactSheet[],
  discoveryTimestamp: string,
  extractionTimestamp: string
): Promise<SynthesisResult> {
  console.log('\n✍️  STAGE 3: EDITORIAL SYNTHESIS');
  console.log('═'.repeat(50));

  const articles: Article[] = [];

  for (const factSheet of factSheets) {
    console.log(`\n  📝 Writing article for: ${factSheet.storyTitle}`);

    const userPrompt = `Write a complete article for The Dispatch based on the following fact sheet.

FACT SHEET:
Title: ${factSheet.storyTitle || 'Untitled'}
Category: ${factSheet.category || 'GENERAL'}

KEY FACTS:
${(factSheet.keyFacts || []).map((f, i) => `${i + 1}. [${f.type}/${f.confidence}] ${f.claim} (Sources: ${(f.sources || []).join(', ')})`).join('\n')}

KEY QUOTES:
${(factSheet.keyQuotes || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}

KEY STATISTICS:
${(factSheet.keyStatistics || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

CONTEXTUAL BACKGROUND:
${factSheet.contextualBackground || 'Not available.'}

WHY IT MATTERS:
${factSheet.whyItMatters || 'Not available.'}

SOURCES REFERENCED:
${(factSheet.sourceNames || []).join(', ') || 'Not available'}

Return a JSON object with this exact structure:
{
  "headline": "A serious, highly informative, and noun-heavy headline",
  "deck": "A single sober sentence providing crucial context",
  "body": ["paragraph 1", "paragraph 2", "...", "paragraph 8-12"],
  "discoveryDesc": "A highly specific, sophisticated 1-sentence narrative describing how the news was sourced (e.g. 'Aggregated entertainment industry reports, labor data, and company filings')",
  "extractionDesc": "A highly specific, sophisticated 1-sentence narrative describing the facts extracted (e.g. 'Compiled production data, employment statistics, and financial metrics from 6 platforms')",
  "synthesisDesc": "A highly specific, sophisticated 1-sentence narrative describing the editorial process (e.g. 'Synthesized raw data into a comprehensive report on diplomatic gridlock')"
}

IMPORTANT:
- Maintain a strictly professional, objective journalistic tone
- Ensure beautiful, seamless paragraph transitions
- Break text into clear, readable paragraphs without AI fluff
- Give direct quotes their own standalone paragraphs
- Do NOT wrap the headline in asterisks or any markdown
- ONLY use facts from the fact sheet above — do NOT invent any details`;

    try {
      const synthesized = await llmGenerateJSON<SynthesizedArticle>(
        SYNTHESIS_SYSTEM_PROMPT,
        userPrompt,
        { temperature: 0.7, maxTokens: 8192 }
      );

      // Sanitize headline to strip any rogue markdown asterisks
      const cleanHeadline = synthesized.headline.replace(/\*\*/g, '').trim();
      const slug = generateSlug(cleanHeadline);
      const synthesisTimestamp = now();

      const article: Article = {
        slug,
        headline: cleanHeadline,
        deck: synthesized.deck.replace(/(\*\*|\*)/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'),
        category: factSheet.category as Category,
        body: synthesized.body.map(p => p.replace(/(\*\*|\*)/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')),
        publishedAt: synthesisTimestamp,
        readTime: calculateReadTime(synthesized.body),
        sources: factSheet.sourceNames,
        sourceUrls: factSheet.sourceUrls || [],
        pipelineSteps: [
          {
            name: 'Source Discovery',
            status: 'complete',
            timestamp: discoveryTimestamp,
            detail: synthesized.discoveryDesc,
          },
          {
            name: 'Fact Extraction',
            status: 'complete',
            timestamp: extractionTimestamp,
            detail: synthesized.extractionDesc,
          },
          {
            name: 'Editorial Synthesis',
            status: 'complete',
            timestamp: synthesisTimestamp,
            detail: synthesized.synthesisDesc,
          },
          {
            name: 'Quality Review',
            status: 'pending' as PipelineStep['status'],
            detail: 'Awaiting quality review',
          },
        ],
      };

      articles.push(article);
      console.log(`  ✓ Generated: "${synthesized.headline}" (${article.readTime} min read, ${synthesized.body.length} paragraphs)`);
    } catch (error) {
      console.error(`  ✗ Synthesis failed for "${factSheet.storyTitle}": ${(error as Error).message}`);
    }
  }

  console.log(`\n📊 Synthesis complete: ${articles.length} articles generated`);

  return {
    articles,
    timestamp: now(),
  };
}
