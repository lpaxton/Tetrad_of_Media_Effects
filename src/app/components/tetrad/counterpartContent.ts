// src/app/components/tetrad/counterpartContent.ts

export const generateCounterpartContent = (technology: string) => ({
    enhancement: {
      limitations: [
        `While enhancing communication capabilities, may reduce depth of personal interactions`,
        `Enhanced efficiency might lead to unrealistic expectations and increased stress`,
        `Amplified features could overshadow simpler, traditional solutions`
      ],
      implications: `The enhancement of ${technology} capabilities raises important questions about balance 
      between augmented functionality and maintaining essential human elements.`
    },
    obsolescence: {
      limitations: [
        `Risk of losing valuable traditional methods and practices`,
        `Potential loss of skills and knowledge associated with obsolete technologies`,
        `Cultural and historical disconnection from previous methods`
      ],
      implications: `As ${technology} makes certain practices obsolete, we must consider the 
      intrinsic value of what's being replaced and how to preserve essential aspects.`
    },
    retrieval: {
      limitations: [
        `Retrieved practices may not translate well to modern contexts`,
        `Risk of romanticizing past methods without critical evaluation`,
        `Potential conflict between retrieved and current practices`
      ],
      implications: `While ${technology} retrieves certain past practices, we should carefully 
      evaluate how these retrieved elements fit into contemporary contexts.`
    },
    reversal: {
      limitations: [
        `Difficulty in predicting long-term reversal effects`,
        `Challenge of maintaining balance when pushed to extremes`,
        `Potential for unexpected negative consequences`
      ],
      implications: `The reversal effects of ${technology} remind us to consider the 
      full spectrum of consequences when technologies are pushed to their limits.`
    }
  });