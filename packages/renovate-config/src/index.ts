export function createBaseRenovateConfig() {
  return {
    $schema: "https://docs.renovatebot.com/renovate-schema.json",
    extends: ["config:best-practices"],
    labels: ["dependencies"],
    rangeStrategy: "replace",
    packageRules: [
      {
        matchManagers: ["npm"],
        groupName: "node.js tooling",
      },
      {
        matchUpdateTypes: ["major"],
        dependencyDashboardApproval: true,
      },
    ],
  };
}

const baseRenovateConfig = createBaseRenovateConfig();

export { baseRenovateConfig };
export default baseRenovateConfig;
