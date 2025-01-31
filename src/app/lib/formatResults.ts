export function formatTetradAnalysis(content: string) {
    // Extract each section
    const getSection = (tag: string) => {
      const match = content.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`));
      return match ? match[1].trim() : '';
    };
  
    return {
      enhancement: getSection('enhancement'),
      obsolescence: getSection('obsolescence'),
      retrieval: getSection('retrieval'),
      reversal: getSection('reversal')
    };
  }