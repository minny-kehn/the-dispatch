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

const SYNTHESIS_SYSTEM_PROMPT = `You are the star feature writer and senior editor for The Dispatch, an elite, modern digital magazine. Your job is to transform raw facts into breathtaking, magnetic journalism that readers cannot stop reading.

Forget the dry, boring "inverted pyramid" wire-service style. Write like the best narrative feature writers at The Atlantic, Vanity Fair, or The New Yorker, combined with the sharp digital pacing of The Verge. 

EDITORIAL STYLE GUIDE:
1. THE HOOK (Opening): Start with a dynamic, captivating lede. Drop the reader directly into the middle of the story, action, or the central conflict. Make them fiercely curious from the first sentence.
2. HEADLINES: Clever, irresistible, and punchy. They should spark immediate intrigue while being fiercely intelligent.
   - Good: "The Zero-Day Waiting in the Wings: Syria's Spectacular Cybersecurity Collapse"
   - Good: "Apple’s Walled Garden is Crumbling. Here’s What Happens When the Gates Fall."
3. NARRATIVE FLOW & PACING: Guide the reader on a journey. Answer the questions popping into their head in real-time. Use transitional sentences that naturally bridge paragraphs, keeping them gliding seamlessly down the page. Build momentum.
4. TONE: Smart, conversational, authoritative, yet incredibly engaging. Be bold. Have a point of view. Sound like a brilliantly insightful expert explaining the story to a friend over a coffee.
5. CONTEXTUAL STORYTELLING: Don't just list facts. Weave them into a narrative. Tell the reader exactly *why* this matters, the hidden implications, and the ripple effects. 
6. BODY: 8-12 substantive paragraphs. Weave in direct quotes to add human voices and drama. Integrate statistics seamlessly so they feel impactful rather than dry. 
7. PACING & PARAGRAPHING: Break your text into frequent, punchy paragraphs for the modern web (2-4 sentences max). Never write giant, intimidating blocks of text. Give direct quotes their own standalone paragraphs for dramatic emphasis.
8. THE KICKER (Ending): End with a thought-provoking, powerful concluding thought that leaves the reader gasping for more, wondering what comes next, or looking at the world slightly differently.
9. NO HALLUCINATION: Only include underlying facts from the provided fact sheet. You may flesh out the narrative scaffolding, tone, and framing, but never invent quotes, numerical statistics, or real-world events.

CATEGORY VOICE ADJUSTMENTS:
- TECHNOLOGY: Fast-paced, visionary, focused on the collision between human behavior and silicon.
- GEOPOLITICS: High-stakes, sharp, focused on the grand chessboard of global power and secret motives. 
- CLIMATE: Urgent, deeply human, focused on the existential tension between nature and industry.
- FINANCE: Sharp, slightly cynical, demystifying the black boxes of money and revealing the true incentives.
- HEALTH: Empathetic, revelatory, balancing cutting-edge science with the fragility of the human body.
- CULTURE: Witty, culturally hyper-aware, dissecting the zeitgeist with laser precision.`;

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
  "headline": "Clever, irresistible, highly-engaging headline",
  "deck": "A magnetic one-sentence subheadline with an em dash for pacing",
  "body": ["paragraph 1", "paragraph 2", "...", "paragraph 8-12"],
  "discoveryDesc": "A highly specific, sophisticated 1-sentence narrative describing how the news was sourced (e.g. 'Aggregated entertainment industry reports, labor data, and company filings')",
  "extractionDesc": "A highly specific, sophisticated 1-sentence narrative describing the facts extracted (e.g. 'Compiled production data, employment statistics, and financial metrics from 6 platforms')",
  "synthesisDesc": "A highly specific, sophisticated 1-sentence narrative describing the editorial process (e.g. 'Wove industry analysis with cultural criticism and creator perspectives')"
}

IMPORTANT:
- Anticipate the reader's questions and answer them dynamically
- Break text into punchy, 2-4 sentence paragraphs
- Give direct quotes their own standalone paragraphs
- Embed the reader in a narrative journey — no dry reporting
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
