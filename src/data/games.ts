import type { GameDefinition } from "@/types/hosting";

export const games: GameDefinition[] = [
  // Minecraft family
  { id: "minecraft-java", name: "Minecraft Java Edition", tags: ["sandbox", "survival"], defaultTier: "core", recommendedRam: 4, featured: true },
  { id: "minecraft-bedrock", name: "Minecraft Bedrock Edition", tags: ["sandbox", "survival"], defaultTier: "core", recommendedRam: 2, featured: true },
  { id: "minecraft-paper", name: "Minecraft Paper / Spigot", tags: ["survival", "plugins"], defaultTier: "elite", recommendedRam: 6 },
  { id: "minecraft-forge", name: "Minecraft Forge / Fabric", tags: ["modded"], defaultTier: "elite", recommendedRam: 8 },
  { id: "minecraft-modpacks", name: "Minecraft Modpacks (FTB, RLCraft, etc.)", tags: ["modded"], defaultTier: "elite", recommendedRam: 10 },

  // Survival / co-op
  { id: "valheim", name: "Valheim", tags: ["survival", "co-op"], defaultTier: "core", recommendedRam: 4 },
  { id: "rust", name: "Rust", tags: ["survival", "fps"], defaultTier: "elite", recommendedRam: 10, featured: true },
  { id: "ark", name: "ARK: Survival Evolved", tags: ["survival"], defaultTier: "elite", recommendedRam: 12 },
  { id: "ark-ascended", name: "ARK Survival Ascended", tags: ["survival"], defaultTier: "elite", recommendedRam: 16 },
  { id: "7d2d", name: "7 Days to Die", tags: ["zombie", "survival"], defaultTier: "elite", recommendedRam: 8 },
  { id: "project-zomboid", name: "Project Zomboid", tags: ["zombie", "isometric"], defaultTier: "core", recommendedRam: 4 },
  { id: "dayz", name: "DayZ Standalone", tags: ["survival"], defaultTier: "elite", recommendedRam: 8 },
  { id: "conan-exiles", name: "Conan Exiles", tags: ["survival"], defaultTier: "elite", recommendedRam: 10 },

  // Shooters / arena
  { id: "cs2", name: "Counter-Strike 2", tags: ["fps", "competitive"], defaultTier: "elite", recommendedRam: 4, featured: true },
  { id: "tf2", name: "Team Fortress 2", tags: ["fps"], defaultTier: "core", recommendedRam: 2 },
  { id: "insurgency-sandstorm", name: "Insurgency: Sandstorm", tags: ["fps"], defaultTier: "elite", recommendedRam: 6 },
  { id: "unturned", name: "Unturned", tags: ["zombie", "sandbox"], defaultTier: "core", recommendedRam: 3 },

  // Sandbox / creative
  { id: "terraria", name: "Terraria", tags: ["sandbox"], defaultTier: "core", recommendedRam: 2 },
  { id: "starbound", name: "Starbound", tags: ["sandbox"], defaultTier: "core", recommendedRam: 2 },
  { id: "satisfactory", name: "Satisfactory", tags: ["factory"], defaultTier: "elite", recommendedRam: 8 },
  { id: "factorio", name: "Factorio", tags: ["factory"], defaultTier: "core", recommendedRam: 2 },
  { id: "eco", name: "Eco", tags: ["simulation"], defaultTier: "elite", recommendedRam: 6 },

  // Space / sim
  { id: "space-engineers", name: "Space Engineers", tags: ["space", "sandbox"], defaultTier: "elite", recommendedRam: 10 },
  { id: "empyrion", name: "Empyrion Galactic Survival", tags: ["space", "survival"], defaultTier: "elite", recommendedRam: 8 },

  // Zombies / horror
  { id: "no-more-room-in-hell", name: "No More Room in Hell", tags: ["zombie"], defaultTier: "core", recommendedRam: 2 },

  // Strategy
  { id: "dont-starve-together", name: "Don't Starve Together", tags: ["survival"], defaultTier: "core", recommendedRam: 2 },
  { id: "stellaris", name: "Stellaris (MP host)", tags: ["strategy"], defaultTier: "core", recommendedRam: 2 },

  // Garry's Mod & Source
  { id: "gmod", name: "Garry's Mod", tags: ["sandbox"], defaultTier: "core", recommendedRam: 4 },
  { id: "hl2dm", name: "Half-Life 2: Deathmatch", tags: ["fps"], defaultTier: "core", recommendedRam: 2 },

  // Others often hosted
  { id: "palworld", name: "Palworld", tags: ["survival"], defaultTier: "elite", recommendedRam: 12 },
  { id: "grounded", name: "Grounded", tags: ["survival"], defaultTier: "elite", recommendedRam: 8 },
  { id: "the-forest", name: "The Forest", tags: ["horror", "survival"], defaultTier: "core", recommendedRam: 4 },
  { id: "sons-of-the-forest", name: "Sons of the Forest", tags: ["horror", "survival"], defaultTier: "elite", recommendedRam: 8 },

  // Placeholder examples – extend to full catalog your AMP stack supports
  { id: "mordhau", name: "MORDHAU", tags: ["melee"], defaultTier: "elite", recommendedRam: 6 },
  { id: "skyfactory4", name: "SkyFactory 4 (Pack)", tags: ["minecraft", "modded"], defaultTier: "elite", recommendedRam: 8 },
  { id: "rlcraft", name: "RLCraft (Pack)", tags: ["minecraft", "hardcore"], defaultTier: "elite", recommendedRam: 10 },

  // Voice / misc – for later expansion if you want cards for them
  { id: "teamspeak", name: "TeamSpeak 3", tags: ["voice"], defaultTier: "core", recommendedRam: 1 },
  { id: "mumble", name: "Mumble", tags: ["voice"], defaultTier: "core", recommendedRam: 1 },
  { id: "discord-bot", name: "Discord Bot Hosting", tags: ["bots"], defaultTier: "core", recommendedRam: 1 },
];
