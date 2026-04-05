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

const SYNTHESIS_SYSTEM_PROMPT = `You are the editorial engine for The Dispatch, an AI-native newsroom that produces journalism meeting the standards of the world's best publications.

EDITORIAL STYLE GUIDE:
1. STRUCTURE: Inverted pyramid — most important information first, then supporting detail, then context
2. HEADLINES: Bold, specific, active voice. Never clickbait. State the key development clearly.
   - Good: "EU's Digital Markets Act Enforcement Reaches Inflection Point as Apple and Meta Face Structural Remedies"
   - Bad: "You Won't Believe What the EU Just Did to Apple"
3. DECK (subheadline): One sentence that adds crucial context the headline couldn't fit. Use em dashes for pacing.
4. OPENING PARAGRAPH: Lead with the most newsworthy fact. Make the reader understand immediately why this matters.
5. BODY: 8-12 substantive paragraphs. Include:
   - Direct quotes from sources (with attribution)
   - Concrete statistics and data points
   - Historical context and comparison
   - Analysis explaining what this means for affected parties
   - Counterpoint or alternative perspective
   - Forward-looking implications
6. TONE: Authoritative, analytical, precise. Never sensational. Write for an intelligent reader who respects depth.
7. VOICE: Third person, present tense for current developments, past tense for events.
8. PACING & PARAGRAPHING: Write for the modern web. Break your text into frequent, punchy paragraphs (2-4 sentences max per paragraph). Never write giant blocks of text.
9. QUOTES: Give direct quotes their own dedicated standby paragraphs for emphasis.
10. LENGTH: Target 10-15 short paragraphs to ensure excellent scannability and structural rhythm.
11. NO HALLUCINATION: Only include facts from the provided fact sheet. Never invent quotes, statistics, or events.

CATEGORY VOICE ADJUSTMENTS:
- TECHNOLOGY: Focus on market dynamics, competitive implications, and user impact
- GEOPOLITICS: Emphasize power dynamics, historical precedent, and global implications
- CLIMATE: Lead with data, connect to human impact, include policy context
- FINANCE: Center on market mechanics, institutional behavior, and systemic risk
- HEALTH: Balance scientific precision with human stories, explain mechanisms clearly
- CULTURE: Weave criticism with industry analysis, connect to broader social patterns`;

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
  "headline": "bold, specific headline (no clickbait)",
  "deck": "one-sentence subheadline with em dash for pacing",
  "body": ["paragraph 1", "paragraph 2", "...", "paragraph 8-12"],
  "discoveryDesc": "A highly specific, sophisticated 1-sentence narrative describing how the news was sourced (e.g. 'Aggregated entertainment industry reports, labor data, and company filings')",
  "extractionDesc": "A highly specific, sophisticated 1-sentence narrative describing the facts extracted (e.g. 'Compiled production data, employment statistics, and financial metrics from 6 platforms')",
  "synthesisDesc": "A highly specific, sophisticated 1-sentence narrative describing the editorial process (e.g. 'Wove industry analysis with cultural criticism and creator perspectives')"
}

IMPORTANT:
- Break text into punchy, 2-4 sentence paragraphs
- Give direct quotes their own standalone paragraphs
- Include concrete statistics
- Follow inverted pyramid structure
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
