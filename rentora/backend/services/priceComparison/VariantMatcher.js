/**
 * VariantMatcher - Product Matching Intelligence Engine
 * 
 * Enforces strict hardware matching rules:
 * - RAM & Storage isolation (8GB+128GB !== 8GB+256GB)
 * - Model Generation separation (Galaxy A35 !== A36, M2 !== M3)
 * - Condition isolation (Brand New !== Refurbished)
 * - Color variant tracking
 */

class VariantMatcher {
  /**
   * Normalize storage string to standardized number of GB
   * e.g. "128GB" -> 128, "1TB" -> 1024, "256 GB" -> 256
   */
  static parseStorage(str) {
    if (!str) return null;
    const clean = String(str).toUpperCase().trim();
    if (clean.includes('TB')) {
      const num = parseFloat(clean.replace('TB', '').trim());
      return isNaN(num) ? null : num * 1024;
    }
    const num = parseFloat(clean.replace('GB', '').trim());
    return isNaN(num) ? null : num;
  }

  /**
   * Normalize RAM string to GB number
   * e.g. "8GB" -> 8, "16 GB" -> 16
   */
  static parseRam(str) {
    if (!str) return null;
    const clean = String(str).toUpperCase().trim();
    const num = parseFloat(clean.replace('GB', '').trim());
    return isNaN(num) ? null : num;
  }

  /**
   * Extract variant specs from title or description if not explicitly passed
   */
  static extractVariantFromText(text) {
    if (!text) return {};
    const str = String(text);

    // RAM match (e.g., 8GB RAM, 16GB Unified RAM, 36GB RAM)
    const ramMatch = str.match(/(\d+)\s*(?:GB|gb)\s*(?:RAM|Unified|unified|ram)/i) ||
                     str.match(/(\d+)\s*(?:GB)\s*\+/i);
    const ram = ramMatch ? `${ramMatch[1]}GB` : null;

    // Storage match (e.g. 128GB, 256GB, 512GB, 1TB SSD, 2TB NVMe)
    const storageMatch = str.match(/(128|256|512)\s*(?:GB|gb)(?:\s*(?:SSD|Storage|ROM|rom))?/i) ||
                         str.match(/([124])\s*(?:TB|tb)(?:\s*(?:SSD|Storage|ROM|rom))?/i);
    const storage = storageMatch ? `${storageMatch[1]}${storageMatch[0].toUpperCase().includes('TB') ? 'TB' : 'GB'}` : null;

    // Condition match
    let condition = 'Brand New';
    if (/refurbished|renewed|pre-owned/i.test(str)) {
      condition = 'Refurbished';
    } else if (/like new|gently used|open box/i.test(str)) {
      condition = 'Like New';
    }

    return {
      ram,
      storage,
      condition,
    };
  }

  /**
   * Compare two variants strictly
   * @param {Object} target - { ram, storage, color, condition, generation, brand, modelNumber }
   * @param {Object} candidate - { ram, storage, color, condition, generation, brand, modelNumber }
   * @returns {Object} - { isExactMatch: Boolean, isSimilar: Boolean, mismatchReasons: Array<String>, score: Number }
   */
  static evaluateMatch(target = {}, candidate = {}) {
    const mismatchReasons = [];

    // 1. Condition check (Brand New vs Refurbished MUST NEVER MIX)
    const targetCond = (target.condition || 'Brand New').toLowerCase();
    const candCond = (candidate.condition || 'Brand New').toLowerCase();
    const isTargetRefurb = targetCond.includes('refurbished') || targetCond.includes('renewed');
    const isCandRefurb = candCond.includes('refurbished') || candCond.includes('renewed');

    if (isTargetRefurb !== isCandRefurb) {
      mismatchReasons.push(`Condition mismatch: Cannot compare ${isTargetRefurb ? 'Refurbished' : 'New'} with ${isCandRefurb ? 'Refurbished' : 'New'}`);
    }

    // 2. Storage check (128GB must not match 256GB)
    const targetStorage = this.parseStorage(target.storage);
    const candStorage = this.parseStorage(candidate.storage);
    if (targetStorage && candStorage && targetStorage !== candStorage) {
      mismatchReasons.push(`Storage mismatch: Target is ${target.storage}, candidate is ${candidate.storage}`);
    }

    // 3. RAM check (8GB must not match 16GB)
    const targetRam = this.parseRam(target.ram);
    const candRam = this.parseRam(candidate.ram);
    if (targetRam && candRam && targetRam !== candRam) {
      mismatchReasons.push(`RAM mismatch: Target is ${target.ram}, candidate is ${candidate.ram}`);
    }

    // 4. Model / Generation check
    if (target.generation && candidate.generation) {
      const gen1 = String(target.generation).toLowerCase().trim();
      const gen2 = String(candidate.generation).toLowerCase().trim();
      if (gen1 !== gen2) {
        mismatchReasons.push(`Generation mismatch: ${target.generation} vs ${candidate.generation}`);
      }
    }

    // 5. Brand check
    if (target.brand && candidate.brand) {
      if (target.brand.toLowerCase().trim() !== candidate.brand.toLowerCase().trim()) {
        mismatchReasons.push(`Brand mismatch: ${target.brand} vs ${candidate.brand}`);
      }
    }

    const isExactMatch = mismatchReasons.length === 0;

    // Check if it qualifies as a "Similar Product" (same brand & series, but different RAM/Storage or refurbished)
    const isSimilar = !isExactMatch &&
      (target.brand && candidate.brand && target.brand.toLowerCase() === candidate.brand.toLowerCase()) &&
      (!targetStorage || !candStorage || Math.abs(targetStorage - candStorage) <= 512);

    return {
      isExactMatch,
      isSimilar,
      mismatchReasons,
      matchGrade: isExactMatch ? 'EXACT_SPEC_MATCH' : (isSimilar ? 'SIMILAR_VARIANT' : 'INCOMPATIBLE'),
      specSummary: `${candidate.ram || target.ram || ''} ${candidate.storage || target.storage || ''} ${candidate.color || target.color || ''}`.trim()
    };
  }
}

module.exports = VariantMatcher;
