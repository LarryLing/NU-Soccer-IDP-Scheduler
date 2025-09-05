const calculateCoefficientOfVariation = (counts: number[]) => {
  if (counts.length === 0) return 0;

  const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
  if (mean === 0) return 0;

  const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;
  const standardDeviation = Math.sqrt(variance);

  return standardDeviation / mean;
};

const calculateMeanAbsoluteDeviation = (counts: number[], targetPlayerCount: number) => {
  if (counts.length === 0) return 0;

  return counts.reduce((sum, count) => sum + Math.abs(count - targetPlayerCount), 0) / counts.length;
};

export const calculateCombinedScore = (
  trainingBlockAssignedPlayerCounts: Record<string, number>,
  maximumPlayerCount: number,
  uniformityWeight: number = 0.2,
  targetAdherenceWeight: number = 1,
  debug = false
) => {
  const counts = Object.values(trainingBlockAssignedPlayerCounts).filter((count) => count > 0);
  const targetPlayerCount = maximumPlayerCount / 2;

  const cv = calculateCoefficientOfVariation(counts);
  const mad = calculateMeanAbsoluteDeviation(counts, targetPlayerCount);

  const uniformityScore = 1 / (1 + cv);
  const targetAdherenceScore = 1 / (1 + mad / targetPlayerCount);

  const uniformityContribution = uniformityWeight * uniformityScore;
  const targetAdherenceContribution = targetAdherenceWeight * targetAdherenceScore;

  const totalScore = uniformityContribution + targetAdherenceContribution;

  if (debug) {
    console.log(`
      === Score Breakdown ===
      Assigned Player Counts: ${Object.entries(trainingBlockAssignedPlayerCounts)}
      Counts: [${counts.join(", ")}]
      Target: ${targetPlayerCount}

      Raw Metrics:
      CV: ${cv.toFixed(4)}
      MAD: ${mad.toFixed(4)}

      Component Scores:
      Uniformity: ${uniformityScore.toFixed(4)} (range: 0-1)
      Target Adherence: ${targetAdherenceScore.toFixed(4)} (range: 0-1)

      Weighted Contributions:
      Uniformity: ${uniformityWeight} * ${uniformityScore.toFixed(4)} = ${uniformityContribution.toFixed(4)}
      Target: ${targetAdherenceWeight} * ${targetAdherenceScore.toFixed(4)} = ${targetAdherenceContribution.toFixed(4)}

      # Total Score: ${totalScore.toFixed(4)}
    `);
  }

  return totalScore;
};
