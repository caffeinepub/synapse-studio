import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

/* ── Affirmations ─────────────────────────────────── */
export function useGenerateAffirmations() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      topic,
      boosterEnabled,
      fantasyEnabled,
      protectionEnabled,
      chakraName,
    }: {
      topic: string;
      boosterEnabled: boolean;
      fantasyEnabled: boolean;
      protectionEnabled: boolean;
      chakraName: string;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.generateAffirmations(
        topic,
        boosterEnabled,
        fantasyEnabled,
        protectionEnabled,
        chakraName,
      );
    },
  });
}

export function useGetFantasyMapping() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (abilityName: string) => {
      if (!actor) throw new Error("Backend not ready");
      const raw = await actor.getFantasyMapping(abilityName);
      return JSON.parse(raw) as {
        ability: string;
        metaphor: string;
        attributes: string[];
        description: string;
      };
    },
  });
}

export function useBuildProjectJSON() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      topic: string;
      affirmations: string[];
      boosterEnabled: boolean;
      fantasyEnabled: boolean;
      fantasyInput: string;
      protectionEnabled: boolean;
      chakraName: string;
      voiceType: string;
      voiceSpeed: number;
      voicePitch: number;
      repetitionCount: number;
      whisperOverlay: boolean;
      backgroundMusicType: string;
      subliminalFrequency: string;
      musicVolume: number;
      subliminalVolume: number;
      waveformOverlay: boolean;
      stereoMovement: boolean;
      themeStyle: string;
      colorPalette: string;
      resolution: string;
      durationSeconds: number;
      frameRate: number;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.buildProjectJSON(
        params.topic,
        params.affirmations,
        params.boosterEnabled,
        params.fantasyEnabled,
        params.fantasyInput,
        params.protectionEnabled,
        params.chakraName,
        params.voiceType,
        params.voiceSpeed,
        params.voicePitch,
        BigInt(params.repetitionCount),
        params.whisperOverlay,
        params.backgroundMusicType,
        params.subliminalFrequency,
        params.musicVolume,
        params.subliminalVolume,
        params.waveformOverlay,
        params.stereoMovement,
        params.themeStyle,
        params.colorPalette,
        params.resolution,
        BigInt(params.durationSeconds),
        BigInt(params.frameRate),
      );
    },
  });
}

export function useSaveProject() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      title,
      jsonOutput,
    }: { title: string; jsonOutput: string }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.saveProject(title, jsonOutput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useListProjects() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.getProject(id);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

/* ── Energy Library ───────────────────────────────── */
export function useGetAllChakras() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["chakras"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllChakras();
      return JSON.parse(raw) as ChakraEntry[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBeliefSystems() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["beliefSystems"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getBeliefSystems();
      return JSON.parse(raw) as BeliefSystem[];
    },
    enabled: !!actor && !isFetching,
  });
}

/* ── Kinesis Archive ──────────────────────────────── */
export function useGetAllKinesisEntries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["kinesisEntries"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllKinesisEntries();
      return JSON.parse(raw) as KinesisEntry[];
    },
    enabled: !!actor && !isFetching,
  });
}

/* ── Types ────────────────────────────────────────── */
export interface ChakraEntry {
  name: string;
  symbol: string;
  color: string;
  overview: string;
  psychologicalInterpretation: string;
  emotionalThemes: string[];
  balancedTraits: string[];
  affirmations: string[];
  location: string;
}

export interface BeliefSystem {
  name: string;
  summary: string;
  keyPrinciples: string[];
  category: string;
}

export interface KinesisEntry {
  name: string;
  suffix: string;
  fictionalOrigins: string;
  mediaReferences: string[];
  symbolicMeaning: string;
  psychologicalMetaphor: string;
  element: string;
}
