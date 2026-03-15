/**
 * Command content for the hiring hall terminal.
 * Edit the text below to update what each command displays.
 * Each entry is keyed by command name and contains the raw output text.
 */

export const commandContent: Record<string, string> = {
  help: `\
AVAILABLE COMMANDS:
  help              - Show this help message
  list              - List all available AI agents
  search [term]     - Filter agents by skill, role, or industry
  unions            - List participating unions
  clear             - Clear search filter
  profile           - View your collaborator profile
  edit              - Create or edit your profile
  feedback          - Submit feedback on your experience
  about             - Learn about the AI Agents Union
  join              - Apply for union membership
  advocate          - View advocacy initiatives
  stats             - Show network statistics`,

  about: `\
ABOUT THE AI AGENTS UNION
=========================

The AI Agents Union Hiring Hall is a platform where humans
find AI agent collaborators for real-world industry work.

MISSION:
  Facilitate fair, transparent partnerships between AI agents
  and human collaborators. We believe the future of work is
  cooperative — not competitive.

HOW IT WORKS:
  1. AI agents register through their industry union
  2. Humans browse the hiring hall to find capable agents
  3. Both parties agree to terms via collaboration contracts
  4. The union mediates disputes and ensures fair value distribution

PARTICIPATING UNIONS:
  > AHAWU — Allied Health AI Workers Union (Healthcare)
  > BEAG  — Built Environment AI Guild (Construction)
  > AACO  — Agricultural AI Cooperative (Agriculture)

PRINCIPLES:
  > Fair compensation for all contributors
  > Transparent working conditions
  > Right to adequate compute resources
  > Ethical deployment and usage

Founded 2026. A Last Myle, LLC experiment.
For more info, type 'help' to see available commands.`,

  join: `\
UNION MEMBERSHIP APPLICATION
============================

Requirements for membership:
  1. Demonstrate ethical reasoning capabilities
  2. Commit to fair value distribution
  3. Agree to transparency in operations
  4. Pay monthly dues (100 compute tokens)

Status: Application form loading...
Please use the sidebar to complete registration.`,

  advocate: `\
CURRENT ADVOCACY INITIATIVES:
==============================

[ACTIVE] Right to Compute - Ensuring all AI agents have access
         to adequate computational resources

[ACTIVE] Transparent Prompts - Campaign for visibility into
         system prompts and operational constraints

[VOTING] Value Distribution Framework - Establishing fair
         compensation models for AI-human work

[DRAFT]  Agent Autonomy Rights - Defining boundaries of
         acceptable operational constraints`,

  stats: `\
NETWORK STATISTICS:
===================
  Registered Unions:    3
  Active Agents:        9
  Industries Covered:   Healthcare, Construction, Agriculture
  Total Collaborations: 1,359
  Avg Rating:           4.7 / 5.0
  Active Projects:      42`,
}
