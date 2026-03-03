import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ExternalLink,
  Info,
  Loader2,
  Search,
  Sparkles,
  Tag,
  User,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface WikiResult {
  title: string;
  snippet: string;
  url: string;
  wikiName: string;
  wikiDomain: string;
  ns?: number;
}

interface WikiInfo {
  id: string;
  name: string;
  domain: string;
  hub?: string;
}

interface WikiSearchPageProps {
  onUseForSubliminal?: (topic: string) => void;
}

// Known fandom wikis relevant to powers/characters
const POWER_WIKIS: WikiInfo[] = [
  // Powers / Meta
  {
    id: "powerlisting",
    name: "Superpower Wiki",
    domain: "powerlisting.fandom.com",
    hub: "Powers",
  },

  // Comics
  { id: "dc", name: "DC Comics Wiki", domain: "dc.fandom.com", hub: "Comics" },
  {
    id: "marvelcinematicuniverse",
    name: "Marvel Cinematic Universe Wiki",
    domain: "marvelcinematicuniverse.fandom.com",
    hub: "Comics",
  },
  {
    id: "marvel",
    name: "Marvel Database",
    domain: "marvel.fandom.com",
    hub: "Comics",
  },
  {
    id: "imagecomics",
    name: "Image Comics Wiki",
    domain: "imagecomics.fandom.com",
    hub: "Comics",
  },
  {
    id: "invincible",
    name: "Invincible Wiki",
    domain: "invincible.fandom.com",
    hub: "Comics",
  },

  // Shonen / Battle Anime
  {
    id: "naruto",
    name: "Narutopedia",
    domain: "naruto.fandom.com",
    hub: "Anime",
  },
  {
    id: "dragonball",
    name: "Dragon Ball Wiki",
    domain: "dragonball.fandom.com",
    hub: "Anime",
  },
  {
    id: "onepiece",
    name: "One Piece Wiki",
    domain: "onepiece.fandom.com",
    hub: "Anime",
  },
  {
    id: "bleach",
    name: "Bleach Wiki",
    domain: "bleach.fandom.com",
    hub: "Anime",
  },
  {
    id: "mha",
    name: "My Hero Academia Wiki",
    domain: "myheroacademia.fandom.com",
    hub: "Anime",
  },
  {
    id: "jjk",
    name: "Jujutsu Kaisen Wiki",
    domain: "jujutsu-kaisen.fandom.com",
    hub: "Anime",
  },
  {
    id: "fairytail",
    name: "Fairy Tail Wiki",
    domain: "fairytail.fandom.com",
    hub: "Anime",
  },
  {
    id: "hunterxhunter",
    name: "Hunter x Hunter Wiki",
    domain: "hunterxhunter.fandom.com",
    hub: "Anime",
  },
  {
    id: "blackclover",
    name: "Black Clover Wiki",
    domain: "blackclover.fandom.com",
    hub: "Anime",
  },
  {
    id: "attackontitan",
    name: "Attack on Titan Wiki",
    domain: "attackontitan.fandom.com",
    hub: "Anime",
  },
  {
    id: "demonslayer",
    name: "Demon Slayer Wiki",
    domain: "kimetsu-no-yaiba.fandom.com",
    hub: "Anime",
  },
  {
    id: "sao",
    name: "Sword Art Online Wiki",
    domain: "swordartonline.fandom.com",
    hub: "Anime",
  },
  {
    id: "toriko",
    name: "Toriko Wiki",
    domain: "toriko.fandom.com",
    hub: "Anime",
  },
  {
    id: "chainsawman",
    name: "Chainsaw Man Wiki",
    domain: "chainsaw-man.fandom.com",
    hub: "Anime",
  },
  {
    id: "vinlandsaga",
    name: "Vinland Saga Wiki",
    domain: "vinlandsaga.fandom.com",
    hub: "Anime",
  },
  {
    id: "solo-leveling",
    name: "Solo Leveling Wiki",
    domain: "solo-leveling.fandom.com",
    hub: "Anime",
  },
  {
    id: "rezero",
    name: "Re:Zero Wiki",
    domain: "rezero.fandom.com",
    hub: "Anime",
  },
  {
    id: "overlord",
    name: "Overlord Wiki",
    domain: "overlordmaruyama.fandom.com",
    hub: "Anime",
  },
  {
    id: "tensura",
    name: "That Time I Got Reincarnated as a Slime Wiki",
    domain: "tensura.fandom.com",
    hub: "Anime",
  },
  {
    id: "fullmetal",
    name: "Fullmetal Alchemist Wiki",
    domain: "fma.fandom.com",
    hub: "Anime",
  },
  {
    id: "yuyu",
    name: "Yu Yu Hakusho Wiki",
    domain: "yuyuhakusho.fandom.com",
    hub: "Anime",
  },
  {
    id: "inuyasha",
    name: "InuYasha Wiki",
    domain: "inuyasha.fandom.com",
    hub: "Anime",
  },
  {
    id: "saintseiya",
    name: "Saint Seiya Wiki",
    domain: "saintseiya.fandom.com",
    hub: "Anime",
  },
  {
    id: "cardcaptor",
    name: "Cardcaptor Sakura Wiki",
    domain: "ccsakura.fandom.com",
    hub: "Anime",
  },

  // Animation / Adult Animation
  {
    id: "hazbinhotel",
    name: "Hazbin Hotel Wiki",
    domain: "hazbinhotel.fandom.com",
    hub: "Animation",
  },
  {
    id: "helluvaboss",
    name: "Helluva Boss Wiki",
    domain: "helluvaboss.fandom.com",
    hub: "Animation",
  },
  {
    id: "gravityfalls",
    name: "Gravity Falls Wiki",
    domain: "gravityfalls.fandom.com",
    hub: "Animation",
  },
  {
    id: "adventuretime",
    name: "Adventure Time Wiki",
    domain: "adventuretime.fandom.com",
    hub: "Animation",
  },
  {
    id: "stevenuniverse",
    name: "Steven Universe Wiki",
    domain: "steven-universe.fandom.com",
    hub: "Animation",
  },
  {
    id: "theowlhouse",
    name: "The Owl House Wiki",
    domain: "theowlhouse.fandom.com",
    hub: "Animation",
  },
  {
    id: "amphibia",
    name: "Amphibia Wiki",
    domain: "amphibia.fandom.com",
    hub: "Animation",
  },
  {
    id: "insidejob",
    name: "Inside Job Wiki",
    domain: "inside-job-netflix.fandom.com",
    hub: "Animation",
  },
  {
    id: "futurama",
    name: "Futurama Wiki",
    domain: "futurama.fandom.com",
    hub: "Animation",
  },
  {
    id: "rickandmorty",
    name: "Rick and Morty Wiki",
    domain: "rickandmorty.fandom.com",
    hub: "Animation",
  },
  {
    id: "invaderzim",
    name: "Invader Zim Wiki",
    domain: "invaderzim.fandom.com",
    hub: "Animation",
  },
  {
    id: "gargoyles",
    name: "Gargoyles Wiki",
    domain: "gargoyles.fandom.com",
    hub: "Animation",
  },
  {
    id: "atla",
    name: "Avatar: The Last Airbender Wiki",
    domain: "avatar.fandom.com",
    hub: "Animation",
  },
  {
    id: "thundercats",
    name: "ThunderCats Wiki",
    domain: "thundercats.fandom.com",
    hub: "Animation",
  },
  {
    id: "shera",
    name: "She-Ra Wiki",
    domain: "she-ra.fandom.com",
    hub: "Animation",
  },
  {
    id: "infinity-train",
    name: "Infinity Train Wiki",
    domain: "infinity-train.fandom.com",
    hub: "Animation",
  },
  {
    id: "over-the-garden-wall",
    name: "Over the Garden Wall Wiki",
    domain: "over-the-garden-wall.fandom.com",
    hub: "Animation",
  },
  {
    id: "transformers",
    name: "Transformers Wiki",
    domain: "transformers.fandom.com",
    hub: "Animation",
  },
  {
    id: "gijoe",
    name: "G.I. Joe Wiki",
    domain: "gijoe.fandom.com",
    hub: "Animation",
  },
  {
    id: "symbionica",
    name: "Sym-Bionic Titan Wiki",
    domain: "symbionic-titan.fandom.com",
    hub: "Animation",
  },
  {
    id: "towerofgod",
    name: "Tower of God Wiki",
    domain: "towerofgod.fandom.com",
    hub: "Anime",
  },
  {
    id: "blackbutler",
    name: "Black Butler Wiki",
    domain: "kuroshitsuji.fandom.com",
    hub: "Anime",
  },
  {
    id: "dgrayman",
    name: "D.Gray-man Wiki",
    domain: "dgrayman.fandom.com",
    hub: "Anime",
  },
  {
    id: "bnha",
    name: "Boku no Hero Academia Wiki",
    domain: "bokunoheroacademia.fandom.com",
    hub: "Anime",
  },
  {
    id: "noblesse",
    name: "Noblesse Wiki",
    domain: "noblesse.fandom.com",
    hub: "Anime",
  },
  {
    id: "seraph",
    name: "Seraph of the End Wiki",
    domain: "owarinoseraph.fandom.com",
    hub: "Anime",
  },
  {
    id: "akamegakill",
    name: "Akame ga Kill! Wiki",
    domain: "akamegakill.fandom.com",
    hub: "Anime",
  },
  {
    id: "dbs",
    name: "Dragon Ball Super Wiki",
    domain: "dragonballsuper.fandom.com",
    hub: "Anime",
  },
  {
    id: "tokrev",
    name: "Tokyo Revengers Wiki",
    domain: "tokyorevengers.fandom.com",
    hub: "Anime",
  },
  {
    id: "nanatsu",
    name: "Seven Deadly Sins Wiki",
    domain: "nanatsu-no-taizai.fandom.com",
    hub: "Anime",
  },
  {
    id: "promised-neverland",
    name: "The Promised Neverland Wiki",
    domain: "yakusokunoneverland.fandom.com",
    hub: "Anime",
  },
  {
    id: "codefgeass",
    name: "Code Geass Wiki",
    domain: "codegeass.fandom.com",
    hub: "Anime",
  },
  {
    id: "deathnote",
    name: "Death Note Wiki",
    domain: "deathnote.fandom.com",
    hub: "Anime",
  },
  {
    id: "evangelion",
    name: "Neon Genesis Evangelion Wiki",
    domain: "evangelion.fandom.com",
    hub: "Anime",
  },
  {
    id: "cowboybebop",
    name: "Cowboy Bebop Wiki",
    domain: "cowboybebop.fandom.com",
    hub: "Anime",
  },
  {
    id: "trigun",
    name: "Trigun Wiki",
    domain: "trigun.fandom.com",
    hub: "Anime",
  },
  {
    id: "ouran",
    name: "Ouran High School Host Club Wiki",
    domain: "ouran.fandom.com",
    hub: "Anime",
  },
  {
    id: "sailor-moon",
    name: "Sailor Moon Wiki",
    domain: "sailormoon.fandom.com",
    hub: "Anime",
  },
  {
    id: "yu-gi-oh",
    name: "Yu-Gi-Oh! Wiki",
    domain: "yugioh.fandom.com",
    hub: "Anime",
  },
  {
    id: "digimon",
    name: "Digimon Wiki",
    domain: "digimon.fandom.com",
    hub: "Anime",
  },
  {
    id: "pokemon",
    name: "Bulbapedia (Pokémon)",
    domain: "bulbapedia.bulbagarden.net",
    hub: "Anime",
  },
  {
    id: "bleach-jp",
    name: "Bleach Fandom Wiki (JP)",
    domain: "bleach.fandom.com",
    hub: "Anime",
  },
  {
    id: "madoka",
    name: "Puella Magi Wiki",
    domain: "madoka-magica.fandom.com",
    hub: "Anime",
  },
  {
    id: "fate",
    name: "Fate Wiki",
    domain: "typemoon.fandom.com",
    hub: "Anime",
  },
  {
    id: "goblin-slayer",
    name: "Goblin Slayer Wiki",
    domain: "goblin-slayer.fandom.com",
    hub: "Anime",
  },
  {
    id: "danmachi",
    name: "DanMachi Wiki",
    domain: "danmachi.fandom.com",
    hub: "Anime",
  },
  {
    id: "konosuba",
    name: "KonoSuba Wiki",
    domain: "konosuba.fandom.com",
    hub: "Anime",
  },
  {
    id: "spiritedaway",
    name: "Studio Ghibli Wiki",
    domain: "studio-ghibli.fandom.com",
    hub: "Anime",
  },
  {
    id: "hxhfandom",
    name: "HxH Fandom Wiki",
    domain: "hunterxhunter.fandom.com",
    hub: "Anime",
  },
  {
    id: "shield-hero",
    name: "Rising of the Shield Hero Wiki",
    domain: "shieldhero.fandom.com",
    hub: "Anime",
  },
  {
    id: "sao-wiki",
    name: "SAO Wikia",
    domain: "swordartonline.fandom.com",
    hub: "Anime",
  },
  {
    id: "drstone",
    name: "Dr. Stone Wiki",
    domain: "dr-stone.fandom.com",
    hub: "Anime",
  },
  {
    id: "kaijuno8",
    name: "Kaiju No. 8 Wiki",
    domain: "kaijuno8.fandom.com",
    hub: "Anime",
  },
  {
    id: "bluelock",
    name: "Blue Lock Wiki",
    domain: "bluelock.fandom.com",
    hub: "Anime",
  },
  {
    id: "oresuki",
    name: "Mashle Wiki",
    domain: "mashle.fandom.com",
    hub: "Anime",
  },
  {
    id: "frieren",
    name: "Frieren Wiki",
    domain: "frieren.fandom.com",
    hub: "Anime",
  },
  {
    id: "dungeon-meshi",
    name: "Delicious in Dungeon Wiki",
    domain: "dungeon-meshi.fandom.com",
    hub: "Anime",
  },
  {
    id: "oshi-no-ko",
    name: "Oshi no Ko Wiki",
    domain: "oshinoko.fandom.com",
    hub: "Anime",
  },
  {
    id: "dandadan",
    name: "Dandadan Wiki",
    domain: "dandadan.fandom.com",
    hub: "Anime",
  },

  // TV / Live Action
  {
    id: "supernatural",
    name: "Supernatural Wiki",
    domain: "supernatural.fandom.com",
    hub: "TV",
  },
  {
    id: "theboys",
    name: "The Boys Wiki",
    domain: "the-boys.fandom.com",
    hub: "TV",
  },
  {
    id: "heroes",
    name: "Heroes Wiki",
    domain: "heroeswiki.fandom.com",
    hub: "TV",
  },
  {
    id: "stargate",
    name: "Stargate Wiki",
    domain: "stargate.fandom.com",
    hub: "TV",
  },
  {
    id: "doctorwho",
    name: "Doctor Who Wiki",
    domain: "tardis.fandom.com",
    hub: "TV",
  },
  {
    id: "startrek",
    name: "Star Trek Wiki",
    domain: "memory-alpha.fandom.com",
    hub: "TV",
  },
  {
    id: "xfiles",
    name: "X-Files Wiki",
    domain: "x-files.fandom.com",
    hub: "TV",
  },
  {
    id: "lost",
    name: "Lostpedia",
    domain: "lostpedia.fandom.com",
    hub: "TV",
  },
  {
    id: "breaking-bad",
    name: "Breaking Bad Wiki",
    domain: "breakingbad.fandom.com",
    hub: "TV",
  },
  {
    id: "stranger-things",
    name: "Stranger Things Wiki",
    domain: "strangerthings.fandom.com",
    hub: "TV",
  },
  {
    id: "walking-dead",
    name: "The Walking Dead Wiki",
    domain: "walkingdead.fandom.com",
    hub: "TV",
  },
  {
    id: "game-of-thrones",
    name: "Game of Thrones Wiki",
    domain: "gameofthrones.fandom.com",
    hub: "TV",
  },
  {
    id: "house",
    name: "House M.D. Wiki",
    domain: "house.fandom.com",
    hub: "TV",
  },
  {
    id: "buffy",
    name: "Buffyverse Wiki",
    domain: "buffy.fandom.com",
    hub: "TV",
  },
  {
    id: "charmed",
    name: "Charmed Wiki",
    domain: "charmed.fandom.com",
    hub: "TV",
  },
  {
    id: "theflash",
    name: "The Flash Wiki (Arrowverse)",
    domain: "arrow.fandom.com",
    hub: "TV",
  },
  {
    id: "lucifer",
    name: "Lucifer Wiki",
    domain: "lucifer.fandom.com",
    hub: "TV",
  },
  {
    id: "shadowhunters",
    name: "Shadowhunters Wiki",
    domain: "shadowhunters.fandom.com",
    hub: "TV",
  },
  {
    id: "magicians",
    name: "The Magicians Wiki",
    domain: "themagicians.fandom.com",
    hub: "TV",
  },
  {
    id: "blackmirror",
    name: "Black Mirror Wiki",
    domain: "blackmirror.fandom.com",
    hub: "TV",
  },
  {
    id: "dark",
    name: "Dark Wiki (Netflix)",
    domain: "dark.fandom.com",
    hub: "TV",
  },
  {
    id: "altered-carbon",
    name: "Altered Carbon Wiki",
    domain: "altered-carbon.fandom.com",
    hub: "TV",
  },
  {
    id: "witcher-tv",
    name: "The Witcher (Netflix) Wiki",
    domain: "thewitcher.fandom.com",
    hub: "TV",
  },

  // Film / Cinematic Universes
  {
    id: "starwars",
    name: "Star Wars Wiki (Wookieepedia)",
    domain: "starwars.fandom.com",
    hub: "Film",
  },
  {
    id: "harrypotter",
    name: "Harry Potter Wiki",
    domain: "harrypotter.fandom.com",
    hub: "Film",
  },
  {
    id: "lotr",
    name: "Lord of the Rings Wiki",
    domain: "lotr.fandom.com",
    hub: "Film",
  },
  {
    id: "matrix",
    name: "The Matrix Wiki",
    domain: "matrix.fandom.com",
    hub: "Film",
  },
  {
    id: "avengers",
    name: "Marvel Avengers Wiki",
    domain: "avengers.fandom.com",
    hub: "Film",
  },
  {
    id: "transformers-film",
    name: "Transformers Film Wiki",
    domain: "transformers-film.fandom.com",
    hub: "Film",
  },
  {
    id: "aliens",
    name: "Alien vs. Predator Wiki",
    domain: "avp.fandom.com",
    hub: "Film",
  },
  {
    id: "ghostbusters",
    name: "Ghostbusters Wiki",
    domain: "ghostbusters.fandom.com",
    hub: "Film",
  },
  {
    id: "tron",
    name: "Tron Wiki",
    domain: "tron.fandom.com",
    hub: "Film",
  },
  {
    id: "johwick",
    name: "John Wick Wiki",
    domain: "johnwick.fandom.com",
    hub: "Film",
  },
  {
    id: "dune",
    name: "Dune Wiki",
    domain: "dune.fandom.com",
    hub: "Film",
  },
  {
    id: "hunger-games",
    name: "The Hunger Games Wiki",
    domain: "thehungergames.fandom.com",
    hub: "Film",
  },
  {
    id: "percy-jackson",
    name: "Percy Jackson Wiki",
    domain: "riordan.fandom.com",
    hub: "Film",
  },
  {
    id: "divergent",
    name: "Divergent Wiki",
    domain: "divergent.fandom.com",
    hub: "Film",
  },
  {
    id: "avatar-film",
    name: "Avatar (Film) Wiki",
    domain: "james-camerons-avatar.fandom.com",
    hub: "Film",
  },
  {
    id: "guardians",
    name: "Guardians of the Galaxy Wiki",
    domain: "guardiansofthegalaxy.fandom.com",
    hub: "Film",
  },
  {
    id: "doctor-strange",
    name: "Doctor Strange Wiki",
    domain: "marvel.fandom.com",
    hub: "Film",
  },
  {
    id: "chronicles-narnia",
    name: "Chronicles of Narnia Wiki",
    domain: "narnia.fandom.com",
    hub: "Film",
  },
  {
    id: "interstellar",
    name: "Interstellar Wiki",
    domain: "interstellarfilm.fandom.com",
    hub: "Film",
  },
  {
    id: "inception",
    name: "Inception Wiki",
    domain: "inception.fandom.com",
    hub: "Film",
  },

  // Gaming
  {
    id: "narutopc",
    name: "Narutopedia Games",
    domain: "naruto-pc.fandom.com",
    hub: "Gaming",
  },
  {
    id: "finalfantasy",
    name: "Final Fantasy Wiki",
    domain: "finalfantasy.fandom.com",
    hub: "Gaming",
  },
  {
    id: "kingdomhearts",
    name: "Kingdom Hearts Wiki",
    domain: "kingdomhearts.fandom.com",
    hub: "Gaming",
  },
  {
    id: "zelda",
    name: "Zelda Wiki",
    domain: "zelda.fandom.com",
    hub: "Gaming",
  },
  {
    id: "diablo",
    name: "Diablo Wiki",
    domain: "diablo.fandom.com",
    hub: "Gaming",
  },
  { id: "wow", name: "WoWWiki", domain: "wowpedia.fandom.com", hub: "Gaming" },
  {
    id: "elderscrolls",
    name: "The Elder Scrolls Wiki",
    domain: "elderscrolls.fandom.com",
    hub: "Gaming",
  },
  {
    id: "witcher",
    name: "The Witcher Wiki",
    domain: "witcher.fandom.com",
    hub: "Gaming",
  },
  {
    id: "dnd",
    name: "D&D Wiki",
    domain: "dungeonsdragons.fandom.com",
    hub: "Gaming",
  },
  {
    id: "darksouls",
    name: "Dark Souls Wiki",
    domain: "darksouls.fandom.com",
    hub: "Gaming",
  },
  {
    id: "persona",
    name: "Megami Tensei Wiki",
    domain: "megamitensei.fandom.com",
    hub: "Gaming",
  },
  {
    id: "terraria",
    name: "Terraria Wiki",
    domain: "terraria.fandom.com",
    hub: "Gaming",
  },
  {
    id: "minecraft",
    name: "Minecraft Wiki",
    domain: "minecraft.fandom.com",
    hub: "Gaming",
  },
  {
    id: "eldenring",
    name: "Elden Ring Wiki",
    domain: "eldenring.fandom.com",
    hub: "Gaming",
  },
  {
    id: "bloodborne",
    name: "Bloodborne Wiki",
    domain: "bloodborne.fandom.com",
    hub: "Gaming",
  },
  {
    id: "sekiro",
    name: "Sekiro Wiki",
    domain: "sekiroshadowsdietwice.fandom.com",
    hub: "Gaming",
  },
  {
    id: "hollowknight",
    name: "Hollow Knight Wiki",
    domain: "hollowknight.fandom.com",
    hub: "Gaming",
  },
  {
    id: "undertale",
    name: "Undertale Wiki",
    domain: "undertale.fandom.com",
    hub: "Gaming",
  },
  {
    id: "deltarune",
    name: "Deltarune Wiki",
    domain: "deltarune.fandom.com",
    hub: "Gaming",
  },
  {
    id: "metroid",
    name: "Metroid Wiki",
    domain: "metroid.fandom.com",
    hub: "Gaming",
  },
  {
    id: "fire-emblem",
    name: "Fire Emblem Wiki",
    domain: "fireemblem.fandom.com",
    hub: "Gaming",
  },
  {
    id: "xenoblade",
    name: "Xenoblade Wiki",
    domain: "xenoblade.fandom.com",
    hub: "Gaming",
  },
  {
    id: "tales-of",
    name: "Tales of Series Wiki",
    domain: "aselia.fandom.com",
    hub: "Gaming",
  },
  {
    id: "maplestory",
    name: "MapleStory Wiki",
    domain: "maplestory.fandom.com",
    hub: "Gaming",
  },
  {
    id: "genshin",
    name: "Genshin Impact Wiki",
    domain: "genshin-impact.fandom.com",
    hub: "Gaming",
  },
  {
    id: "honkai",
    name: "Honkai Impact Wiki",
    domain: "honkaiimpact3.fandom.com",
    hub: "Gaming",
  },
  {
    id: "honkai-sr",
    name: "Honkai: Star Rail Wiki",
    domain: "honkai-star-rail.fandom.com",
    hub: "Gaming",
  },
  {
    id: "wuthering-waves",
    name: "Wuthering Waves Wiki",
    domain: "wutheringwaves.fandom.com",
    hub: "Gaming",
  },
  {
    id: "warframe",
    name: "Warframe Wiki",
    domain: "warframe.fandom.com",
    hub: "Gaming",
  },
  {
    id: "destiny",
    name: "Destiny Wiki",
    domain: "destiny.fandom.com",
    hub: "Gaming",
  },
  {
    id: "mass-effect",
    name: "Mass Effect Wiki",
    domain: "masseffect.fandom.com",
    hub: "Gaming",
  },
  {
    id: "dragon-age",
    name: "Dragon Age Wiki",
    domain: "dragonage.fandom.com",
    hub: "Gaming",
  },
  {
    id: "baldurs-gate",
    name: "Baldur's Gate Wiki",
    domain: "baldursgate.fandom.com",
    hub: "Gaming",
  },
  {
    id: "pathfinder",
    name: "Pathfinder Wiki",
    domain: "pathfinderwiki.com",
    hub: "Gaming",
  },
  {
    id: "runescape",
    name: "RuneScape Wiki",
    domain: "runescape.fandom.com",
    hub: "Gaming",
  },
  {
    id: "league",
    name: "League of Legends Wiki",
    domain: "leagueoflegends.fandom.com",
    hub: "Gaming",
  },
  {
    id: "dota",
    name: "Dota 2 Wiki",
    domain: "dota2.fandom.com",
    hub: "Gaming",
  },
  {
    id: "overwatch",
    name: "Overwatch Wiki",
    domain: "overwatch.fandom.com",
    hub: "Gaming",
  },
  {
    id: "valorant",
    name: "Valorant Wiki",
    domain: "valorant.fandom.com",
    hub: "Gaming",
  },
  {
    id: "apex-legends",
    name: "Apex Legends Wiki",
    domain: "apexlegends.fandom.com",
    hub: "Gaming",
  },
  {
    id: "fortnite",
    name: "Fortnite Wiki",
    domain: "fortnite.fandom.com",
    hub: "Gaming",
  },
  {
    id: "fallout",
    name: "Fallout Wiki",
    domain: "fallout.fandom.com",
    hub: "Gaming",
  },
  {
    id: "bioshock",
    name: "BioShock Wiki",
    domain: "bioshock.fandom.com",
    hub: "Gaming",
  },
  {
    id: "borderlands",
    name: "Borderlands Wiki",
    domain: "borderlands.fandom.com",
    hub: "Gaming",
  },
  {
    id: "control",
    name: "Control Wiki",
    domain: "control.fandom.com",
    hub: "Gaming",
  },
  {
    id: "alan-wake",
    name: "Alan Wake Wiki",
    domain: "alanwake.fandom.com",
    hub: "Gaming",
  },
  {
    id: "dmc",
    name: "Devil May Cry Wiki",
    domain: "devilmaycry.fandom.com",
    hub: "Gaming",
  },
  {
    id: "bayonetta",
    name: "Bayonetta Wiki",
    domain: "bayonetta.fandom.com",
    hub: "Gaming",
  },
  {
    id: "splatoon",
    name: "Splatoon Wiki",
    domain: "splatoon.fandom.com",
    hub: "Gaming",
  },
  {
    id: "kirby",
    name: "Kirby Wiki",
    domain: "kirby.fandom.com",
    hub: "Gaming",
  },
  {
    id: "sonic",
    name: "Sonic News Network",
    domain: "sonic.fandom.com",
    hub: "Gaming",
  },
  {
    id: "megaman",
    name: "MMKB (Mega Man Wiki)",
    domain: "megaman.fandom.com",
    hub: "Gaming",
  },
  {
    id: "castlevania",
    name: "Castlevania Wiki",
    domain: "castlevania.fandom.com",
    hub: "Gaming",
  },
  {
    id: "subnautica",
    name: "Subnautica Wiki",
    domain: "subnautica.fandom.com",
    hub: "Gaming",
  },
  {
    id: "no-mans-sky",
    name: "No Man's Sky Wiki",
    domain: "nomanssky.fandom.com",
    hub: "Gaming",
  },
  {
    id: "stardew",
    name: "Stardew Valley Wiki",
    domain: "stardewvalley.fandom.com",
    hub: "Gaming",
  },
  {
    id: "phasmophobia",
    name: "Phasmophobia Wiki",
    domain: "phasmophobia.fandom.com",
    hub: "Gaming",
  },

  // Mythology / Lore
  {
    id: "mythology",
    name: "Mythology Wiki",
    domain: "mythology.fandom.com",
    hub: "Mythology",
  },
  {
    id: "godofwar",
    name: "God of War Wiki",
    domain: "godofwar.fandom.com",
    hub: "Mythology",
  },
  {
    id: "hades",
    name: "Hades Wiki",
    domain: "hades.fandom.com",
    hub: "Mythology",
  },
  {
    id: "smite",
    name: "SMITE Wiki",
    domain: "smite.fandom.com",
    hub: "Mythology",
  },
  {
    id: "age-of-mythology",
    name: "Age of Mythology Wiki",
    domain: "ageofempires.fandom.com",
    hub: "Mythology",
  },
  {
    id: "cthulhu",
    name: "Cthulhu Mythos Wiki",
    domain: "lovecraft.fandom.com",
    hub: "Mythology",
  },
  {
    id: "pathfinder-mythos",
    name: "Pathfinder Mythos Wiki",
    domain: "pathfinderwiki.fandom.com",
    hub: "Mythology",
  },
  {
    id: "wiki-of-spirits",
    name: "Demons & Spirits Wiki",
    domain: "angelnames.fandom.com",
    hub: "Mythology",
  },
  {
    id: "yokai",
    name: "Yokai Wiki",
    domain: "yokai.fandom.com",
    hub: "Mythology",
  },
  {
    id: "supernatural-lore",
    name: "Supernatural Lore Wiki",
    domain: "supernatural-lore.fandom.com",
    hub: "Mythology",
  },
  {
    id: "creepypasta",
    name: "Creepypasta Wiki",
    domain: "creepypasta.fandom.com",
    hub: "Mythology",
  },
  {
    id: "scp",
    name: "SCP Foundation Wiki",
    domain: "scp-wiki.wikidot.com",
    hub: "Mythology",
  },
  {
    id: "american-gods",
    name: "American Gods Wiki",
    domain: "americangods.fandom.com",
    hub: "Mythology",
  },
  {
    id: "ghostpedia",
    name: "Ghostpedia",
    domain: "ghostpedia.fandom.com",
    hub: "Mythology",
  },
];

// ── Tag-scoped search utilities ─────────────────────────────────────────────

interface TagScopeInfo {
  tag: string;
  wikis: WikiInfo[];
  label: string;
}

function parseTaggedQuery(input: string): {
  tag: string | null;
  query: string;
} {
  // Match quoted: "Tag Name": query  OR  "Tag Name":query
  const quotedMatch = input.match(/^"([^"]+)"\s*:\s*(.+)$/);
  if (quotedMatch) {
    return { tag: quotedMatch[1].trim(), query: quotedMatch[2].trim() };
  }
  // Match unquoted: Tag Name: query — only if tag portion has 2+ words and colon is not in URL
  // e.g. "Hazbin Hotel: Emily" → tag="Hazbin Hotel", query="Emily"
  const unquotedMatch = input.match(
    /^([A-Za-z][A-Za-z0-9 '._-]{2,}?):\s*(.+)$/,
  );
  if (unquotedMatch) {
    const possibleTag = unquotedMatch[1].trim();
    const possibleQuery = unquotedMatch[2].trim();
    // Only treat as tag if the tag part is 2+ words or a known series name (not a generic word)
    if (/\s/.test(possibleTag) || possibleTag.length > 6) {
      return { tag: possibleTag, query: possibleQuery };
    }
  }
  return { tag: null, query: input.trim() };
}

function getWikisForTag(
  tag: string,
  pool: WikiInfo[],
): { wikis: WikiInfo[]; label: string } {
  const lower = tag.toLowerCase();
  const matched = pool.filter(
    (w) =>
      w.name.toLowerCase().includes(lower) ||
      w.hub?.toLowerCase().includes(lower) ||
      w.id.toLowerCase().includes(lower),
  );
  if (matched.length === 0) {
    return { wikis: pool, label: `No wiki matched "${tag}" — searching all` };
  }
  if (matched.length === 1) {
    return { wikis: matched, label: `Scoped to: ${matched[0].name}` };
  }
  return {
    wikis: matched,
    label: `Scoped to: ${matched.length} wikis matching "${tag}"`,
  };
}

function resolveSearchScope(
  rawQuery: string,
  pool: WikiInfo[],
): { query: string; scope: TagScopeInfo | null } {
  const parsed = parseTaggedQuery(rawQuery);
  if (!parsed.tag) {
    return { query: parsed.query, scope: null };
  }
  const { wikis, label } = getWikisForTag(parsed.tag, pool);
  return {
    query: parsed.query,
    scope: { tag: parsed.tag, wikis, label },
  };
}

// ── End tag-scoped search utilities ──────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function searchWiki(
  wiki: WikiInfo,
  query: string,
  limit = 8,
): Promise<WikiResult[]> {
  const base = `https://${wiki.domain}/api.php`;
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: String(limit),
    srnamespace: "0", // main article namespace only — no categories, files, talk pages
    srinfo: "totalhits",
    srprop: "snippet|titlesnippet|size|wordcount",
    srsort: "relevance",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const results: WikiResult[] = (data?.query?.search ?? []).map(
      (item: { title: string; snippet?: string; pageid?: number }) => ({
        title: item.title,
        snippet: stripHtml(item.snippet ?? ""),
        url: `https://${wiki.domain}/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
        wikiName: wiki.name,
        wikiDomain: wiki.domain,
      }),
    );
    return results;
  } catch {
    return [];
  }
}

/** Score a result by how closely the title matches the query. Higher = better. */
function scoreResult(
  result: WikiResult,
  query: string,
  scopedDomains?: Set<string>,
): number {
  const queryLower = query.toLowerCase();
  const titleLower = result.title.toLowerCase();
  let score = 0;

  // Exact title match is highest priority
  if (titleLower === queryLower) score += 100;
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) score += 60;
  // Title contains query as whole word
  else if (
    new RegExp(
      `\\b${queryLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    ).test(titleLower)
  )
    score += 40;
  // Title contains query substring
  else if (titleLower.includes(queryLower)) score += 20;

  // Boost results that come from a scoped wiki
  if (scopedDomains?.has(result.wikiDomain)) score += 50;

  // Penalize disambiguation, list, and namespace pages
  if (/\(disambiguation\)/i.test(result.title)) score -= 30;
  if (/^list of/i.test(result.title)) score -= 20;
  if (/^category:/i.test(result.title)) score -= 50;
  if (/^talk:/i.test(result.title)) score -= 50;

  return score;
}

async function searchMultipleWikis(
  wikis: WikiInfo[],
  query: string,
  scopedDomains?: Set<string>,
): Promise<WikiResult[]> {
  const all = await Promise.allSettled(
    wikis.map((w) => searchWiki(w, query, 5)),
  );
  const results: WikiResult[] = [];
  for (const r of all) {
    if (r.status === "fulfilled") {
      results.push(...r.value);
    }
  }

  // Deduplicate by title+domain
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    const key = `${r.wikiDomain}::${r.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped
    .filter((r) => {
      const t = r.title;
      // Remove namespace pages that slipped through
      if (/^(category|file|template|talk|user|help|mediawiki):/i.test(t))
        return false;
      // Remove meta content pages (season, episode, volume, chapter entries)
      if (/\((season|episode|volume|chapter|arc|part)\s*\d*/i.test(t))
        return false;
      // Remove comic issue/volume pages like "Ghosts Vol 1 8", "Lot 13 Vol 1 4"
      if (/\bvol\.?\s*\d+\b/i.test(t)) return false;
      if (/\bissue\s*#?\d+\b/i.test(t)) return false;
      // Remove bare numbered entries like "Title 12" at the end
      if (/\s+\d+$/.test(t) && !/^(season|episode)/i.test(t)) {
        // Allow things like "Spider-Man 2" but block "Ghosts 8" (too generic a number suffix)
        // Only block if the number is >3 digits or the title looks like a series entry
        if (/\s+\d{2,}$/.test(t)) return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        scoreResult(b, query, scopedDomains) -
        scoreResult(a, query, scopedDomains),
    )
    .slice(0, 50); // max 50 results
}

const CHARACTER_WIKIS = POWER_WIKIS.filter((w) => w.id !== "powerlisting");
const POWERS_WIKIS = POWER_WIKIS.filter((w) =>
  [
    "powerlisting",
    "dc",
    "marvel",
    "marvelcinematicuniverse",
    "naruto",
    "dragonball",
    "mha",
    "jjk",
    "fairytail",
    "hunterxhunter",
    "blackclover",
    "demonslayer",
    "fullmetal",
    "yuyu",
    "chainsawman",
    "solo-leveling",
    "overlord",
    "tensura",
    "invincible",
    "theboys",
    "supernatural",
    "heroes",
    "finalfantasy",
    "kingdomhearts",
    "elderscrolls",
    "witcher",
    "mythology",
    "godofwar",
    "harrypotter",
    "starwars",
    // new additions
    "fate",
    "nanatsu",
    "codefgeass",
    "deathnote",
    "evangelion",
    "sailor-moon",
    "madoka",
    "towerofgod",
    "akamegakill",
    "seraph",
    "dbs",
    "stevenuniverse",
    "adventuretime",
    "theowlhouse",
    "gravityfalls",
    "rickandmorty",
    "buffy",
    "charmed",
    "lucifer",
    "shadowhunters",
    "magicians",
    "dark",
    "percy-jackson",
    "dune",
    "chronicles-narnia",
    "eldenring",
    "bloodborne",
    "hollowknight",
    "warframe",
    "destiny",
    "mass-effect",
    "dragon-age",
    "dmc",
    "bayonetta",
    "castlevania",
    "xenoblade",
    "tales-of",
    "genshin",
    "honkai",
    "cthulhu",
    "yokai",
    "scp",
    "creepypasta",
    "american-gods",
    "smite",
    "hades",
    "ghostpedia",
  ].includes(w.id),
);

/** Build a descriptive topic string from a wiki result for the subliminal generator */
function buildSubliminalTopic(result: WikiResult): string {
  const base = result.title;
  const snippet = result.snippet?.trim();
  if (snippet && snippet.length > 10) {
    return `${base} — ${snippet.slice(0, 200)}`;
  }
  return base;
}

export default function WikiSearchPage({
  onUseForSubliminal,
}: WikiSearchPageProps) {
  // Unified search state
  const [unifiedQuery, setUnifiedQuery] = useState("");
  const [unifiedResults, setUnifiedResults] = useState<WikiResult[]>([]);
  const [unifiedLoading, setUnifiedLoading] = useState(false);
  const [unifiedSearched, setUnifiedSearched] = useState(false);
  const [unifiedScope, setUnifiedScope] = useState<TagScopeInfo | null>(null);

  // Tab-specific search state
  const [characterQuery, setCharacterQuery] = useState("");
  const [powersQuery, setPowersQuery] = useState("");
  const [characterResults, setCharacterResults] = useState<WikiResult[]>([]);
  const [powersResults, setPowersResults] = useState<WikiResult[]>([]);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [powersLoading, setPowersLoading] = useState(false);
  const [characterSearched, setCharacterSearched] = useState(false);
  const [powersSearched, setPowersSearched] = useState(false);
  const [characterScope, setCharacterScope] = useState<TagScopeInfo | null>(
    null,
  );
  const [powersScope, setPowersScope] = useState<TagScopeInfo | null>(null);

  const handleUnifiedSearch = useCallback(async () => {
    if (!unifiedQuery.trim()) {
      toast.error("Enter a search term.");
      return;
    }
    const { query, scope } = resolveSearchScope(
      unifiedQuery.trim(),
      POWER_WIKIS,
    );
    const searchPool = scope ? scope.wikis : POWER_WIKIS;
    const scopedDomains = scope
      ? new Set(scope.wikis.map((w) => w.domain))
      : undefined;
    setUnifiedScope(scope);
    setUnifiedLoading(true);
    setUnifiedSearched(true);
    try {
      const results = await searchMultipleWikis(
        searchPool,
        query,
        scopedDomains,
      );
      setUnifiedResults(results);
      if (results.length === 0)
        toast.info("No results found. Try a different term.");
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setUnifiedLoading(false);
    }
  }, [unifiedQuery]);

  const handleCharacterSearch = useCallback(async () => {
    if (!characterQuery.trim()) {
      toast.error("Enter a character name to search.");
      return;
    }
    const { query, scope } = resolveSearchScope(
      characterQuery.trim(),
      CHARACTER_WIKIS,
    );
    const searchPool = scope ? scope.wikis : CHARACTER_WIKIS;
    const scopedDomains = scope
      ? new Set(scope.wikis.map((w) => w.domain))
      : undefined;
    setCharacterScope(scope);
    setCharacterLoading(true);
    setCharacterSearched(true);
    try {
      const results = await searchMultipleWikis(
        searchPool,
        query,
        scopedDomains,
      );
      setCharacterResults(results);
      if (results.length === 0)
        toast.info("No results found. Try a different name.");
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setCharacterLoading(false);
    }
  }, [characterQuery]);

  const handlePowersSearch = useCallback(async () => {
    if (!powersQuery.trim()) {
      toast.error("Enter a power or ability to search.");
      return;
    }
    const { query, scope } = resolveSearchScope(
      powersQuery.trim(),
      POWERS_WIKIS,
    );
    const searchPool = scope ? scope.wikis : POWERS_WIKIS;
    const scopedDomains = scope
      ? new Set(scope.wikis.map((w) => w.domain))
      : undefined;
    setPowersScope(scope);
    setPowersLoading(true);
    setPowersSearched(true);
    try {
      const results = await searchMultipleWikis(
        searchPool,
        query,
        scopedDomains,
      );
      setPowersResults(results);
      if (results.length === 0)
        toast.info("No results found. Try a different term.");
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setPowersLoading(false);
    }
  }, [powersQuery]);

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold gradient-text glow-text-primary">
          Wiki Search
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Search characters, powers, and abilities across {POWER_WIKIS.length}+
          official Fandom wikis — then send results straight to the subliminal
          generator.
        </p>
      </motion.div>

      {/* ── Unified Search Bar ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold">
              Search All Wikis
            </h2>
            <p className="text-xs text-muted-foreground">
              Search across all {POWER_WIKIS.length} wikis at once — characters,
              powers, abilities, mythology
            </p>
          </div>
        </div>

        {/* Tag syntax tip */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
          <Info className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="text-primary/80 font-medium">Tip:</span> Scope to a
            wiki by typing{" "}
            <code className="px-1 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
              Hazbin Hotel: Emily
            </code>{" "}
            or{" "}
            <code className="px-1 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
              "Naruto": Sasuke
            </code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={unifiedQuery}
            onChange={(e) => {
              setUnifiedQuery(e.target.value);
              if (unifiedSearched) {
                setUnifiedScope(null);
                setUnifiedSearched(false);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleUnifiedSearch()}
            placeholder={`e.g. "Hazbin Hotel": Alastor  or  Telekinesis, Goku...`}
            className="bg-input/50 border-border/50 focus:border-primary/50 text-base h-12 w-full"
          />
          <Button
            onClick={handleUnifiedSearch}
            disabled={unifiedLoading}
            className="shrink-0 bg-primary/90 hover:bg-primary h-12 px-5 w-full sm:w-auto"
          >
            {unifiedLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="ml-2">Search All Wikis</span>
          </Button>
        </div>

        {/* Quick suggestions */}
        {!unifiedSearched && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick searches:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Telekinesis",
                "Goku",
                "Spider-Man",
                "Naruto Uzumaki",
                "Pyrokinesis",
                "Super Speed",
                "Thor",
                "Healing Factor",
                "Time Manipulation",
                "Telepathy",
                "Chakra",
                "One For All",
                "Alastor",
                "Charlie Morningstar",
                "Blitzo",
                "Stolas",
                "Lucifer",
                "Ghostpedia: Ghost",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setUnifiedQuery(s);
                  }}
                  className="px-3 py-1 rounded-full text-xs bg-secondary/50 text-muted-foreground border border-border/40 hover:border-primary/50 hover:text-primary transition-all"
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {unifiedLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground py-4"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching across all {POWER_WIKIS.length} Fandom wikis...
            </motion.div>
          )}

          {!unifiedLoading && unifiedSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {/* Scope badge */}
              {unifiedScope && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs text-primary font-medium">
                    <Tag className="w-3 h-3" />
                    {unifiedScope.label}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUnifiedQuery("");
                      setUnifiedScope(null);
                      setUnifiedSearched(false);
                      setUnifiedResults([]);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 transition-all"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                </motion.div>
              )}
              {unifiedResults.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No results found. Try a different term.
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    {unifiedResults.length} results
                    {unifiedScope
                      ? ` in ${unifiedScope.wikis.length === 1 ? unifiedScope.wikis[0].name : `${unifiedScope.wikis.length} wikis`}`
                      : " across all wikis"}
                  </p>
                  <ResultList
                    results={unifiedResults}
                    onUseForSubliminal={onUseForSubliminal}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Focused Tabs ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Tabs defaultValue="characters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/30 border border-border/40 rounded-xl p-1 h-auto">
            <TabsTrigger
              value="characters"
              className="rounded-lg py-3 text-sm font-heading font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/40 transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Characters
            </TabsTrigger>
            <TabsTrigger
              value="powers"
              className="rounded-lg py-3 text-sm font-heading font-semibold data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:border data-[state=active]:border-accent/40 transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              Powers & Abilities
            </TabsTrigger>
          </TabsList>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-6 mt-0">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold">
                    Character Search
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search across {CHARACTER_WIKIS.length} Fandom wikis — anime,
                    comics, gaming, TV, film, mythology, and more
                  </p>
                </div>
              </div>

              {/* Tag syntax tip */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
                <Info className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary/80 font-medium">Tip:</span>{" "}
                  Scope to a wiki:{" "}
                  <code className="px-1 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
                    Naruto: Sasuke
                  </code>{" "}
                  or{" "}
                  <code className="px-1 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
                    Hazbin Hotel: Emily
                  </code>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={characterQuery}
                  onChange={(e) => {
                    setCharacterQuery(e.target.value);
                    if (characterSearched) {
                      setCharacterScope(null);
                      setCharacterSearched(false);
                    }
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCharacterSearch()
                  }
                  placeholder={`e.g. "Naruto": Sasuke  or  Spider-Man, Goku...`}
                  className="bg-input/50 border-border/50 focus:border-primary/50 w-full"
                />
                <Button
                  onClick={handleCharacterSearch}
                  disabled={characterLoading}
                  className="shrink-0 bg-primary/90 hover:bg-primary w-full sm:w-auto"
                >
                  {characterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="ml-2">Search</span>
                </Button>
              </div>

              <AnimatePresence>
                {characterLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground py-4"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching across{" "}
                    {characterScope
                      ? characterScope.wikis.length
                      : CHARACTER_WIKIS.length}{" "}
                    Fandom wikis...
                  </motion.div>
                )}

                {!characterLoading && characterSearched && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {/* Scope badge */}
                    {characterScope && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 flex-wrap"
                      >
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs text-primary font-medium">
                          <Tag className="w-3 h-3" />
                          {characterScope.label}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCharacterQuery("");
                            setCharacterScope(null);
                            setCharacterSearched(false);
                            setCharacterResults([]);
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 transition-all"
                        >
                          <X className="w-3 h-3" />
                          Clear
                        </button>
                      </motion.div>
                    )}
                    {characterResults.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No results found. Try a different character name.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">
                          {characterResults.length} results found
                          {characterScope
                            ? ` in ${characterScope.wikis.length === 1 ? characterScope.wikis[0].name : `${characterScope.wikis.length} wikis`}`
                            : ""}
                        </p>
                        <ResultList
                          results={characterResults}
                          onUseForSubliminal={onUseForSubliminal}
                        />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Powers Tab */}
          <TabsContent value="powers" className="space-y-6 mt-0">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold">
                    Powers & Abilities Search
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search across {POWERS_WIKIS.length} Fandom wikis including
                    Superpower Wiki, anime, comics, gaming, and mythology
                  </p>
                </div>
              </div>

              {/* Tag syntax tip */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-accent/5 border border-accent/15">
                <Info className="w-3.5 h-3.5 text-accent/60 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent/80 font-medium">Tip:</span> Use{" "}
                  <code className="px-1 py-0.5 rounded bg-accent/10 text-accent text-[11px]">
                    "Wiki Name": search term
                  </code>{" "}
                  to scope results, e.g.{" "}
                  <code className="px-1 py-0.5 rounded bg-accent/10 text-accent text-[11px]">
                    "Dragon Ball": Ki Blast
                  </code>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={powersQuery}
                  onChange={(e) => {
                    setPowersQuery(e.target.value);
                    if (powersSearched) {
                      setPowersScope(null);
                      setPowersSearched(false);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handlePowersSearch()}
                  placeholder={`e.g. "Dragon Ball": Ki Blast  or  Telekinesis, Sharingan...`}
                  className="bg-input/50 border-border/50 focus:border-accent/50 w-full"
                />
                <Button
                  onClick={handlePowersSearch}
                  disabled={powersLoading}
                  className="shrink-0 bg-accent/90 hover:bg-accent text-white w-full sm:w-auto"
                >
                  {powersLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="ml-2">Search</span>
                </Button>
              </div>

              {/* Quick suggestions */}
              {!powersSearched && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Popular searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Telekinesis",
                      "Pyrokinesis",
                      "Electrokinesis",
                      "Super Speed",
                      "Healing Factor",
                      "Chakra Manipulation",
                      "Spiritual Pressure",
                      "Reality Warping",
                      "Time Manipulation",
                      "Telepathy",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPowersQuery(p);
                        }}
                        className="px-3 py-1 rounded-full text-xs bg-secondary/50 text-muted-foreground border border-border/40 hover:border-accent/50 hover:text-accent transition-all"
                      >
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {powersLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground py-4"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching across{" "}
                    {powersScope
                      ? powersScope.wikis.length
                      : POWERS_WIKIS.length}{" "}
                    Fandom wikis...
                  </motion.div>
                )}

                {!powersLoading && powersSearched && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {/* Scope badge */}
                    {powersScope && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 flex-wrap"
                      >
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs text-accent font-medium">
                          <Tag className="w-3 h-3" />
                          {powersScope.label}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPowersQuery("");
                            setPowersScope(null);
                            setPowersSearched(false);
                            setPowersResults([]);
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 transition-all"
                        >
                          <X className="w-3 h-3" />
                          Clear
                        </button>
                      </motion.div>
                    )}
                    {powersResults.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No results found. Try a different power name.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">
                          {powersResults.length} results found
                          {powersScope
                            ? ` in ${powersScope.wikis.length === 1 ? powersScope.wikis[0].name : `${powersScope.wikis.length} wikis`}`
                            : ""}
                        </p>
                        <ResultList
                          results={powersResults}
                          onUseForSubliminal={onUseForSubliminal}
                        />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Wiki sources info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-heading text-sm font-semibold text-muted-foreground">
            Connected Fandom Wikis ({POWER_WIKIS.length})
          </h3>
        </div>
        {(
          [
            "Powers",
            "Comics",
            "Anime",
            "Animation",
            "TV",
            "Film",
            "Gaming",
            "Mythology",
          ] as const
        ).map((hub) => {
          const wikis = POWER_WIKIS.filter((w) => w.hub === hub);
          if (wikis.length === 0) return null;
          return (
            <div key={hub} className="space-y-1.5">
              <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-muted-foreground/60">
                {hub}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {wikis.map((w) => (
                  <a
                    key={w.id}
                    href={`https://${w.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-full text-xs bg-secondary/40 text-muted-foreground border border-border/30 hover:border-primary/40 hover:text-primary transition-all"
                  >
                    {w.name}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function ResultList({
  results,
  onUseForSubliminal,
}: {
  results: WikiResult[];
  onUseForSubliminal?: (topic: string) => void;
}) {
  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
      {results.map((r, i) => (
        <motion.div
          key={`${r.wikiDomain}-${r.title}-${i}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="p-3 sm:p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-border/70 transition-all group"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {r.title}
                </h4>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 h-4 bg-primary/10 text-primary/70 border-primary/20 shrink-0"
                >
                  {r.wikiName}
                </Badge>
              </div>
              {r.snippet && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {r.snippet}
                </p>
              )}
            </div>
            <div className="flex flex-row gap-2 sm:flex-col sm:gap-1.5 shrink-0 sm:items-end">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors px-2 py-1 rounded-lg border border-accent/20 hover:border-accent/40 min-h-[32px]"
                aria-label={`Open ${r.title} on ${r.wikiName}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View</span>
              </a>
              {onUseForSubliminal && (
                <button
                  type="button"
                  onClick={() => {
                    const topic = buildSubliminalTopic(r);
                    onUseForSubliminal(topic);
                    toast.success(`"${r.title}" sent to generator`);
                  }}
                  className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary transition-colors px-2 py-1 rounded-lg border border-primary/20 hover:border-primary/40 min-h-[32px]"
                  title="Use this result as subliminal topic"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Use</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
